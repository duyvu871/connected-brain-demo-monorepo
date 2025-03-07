'use client';
import React, { createContext, useCallback, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import type { UserInterface } from 'types/user.type';
import useUID from '@/hooks/useUID';
import { useToast } from '@/hooks/useToast';
import { MessageHistoryType } from '@/types/apps/chatbot/api.type';
import { TEXT_CUT_TOKEN } from '@/helpers/streamTextProcessor';
import { log } from 'console';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    contentMedia?: string[];
    referenceLink?: MessageHistoryType['reference_link'];
    isStreaming?: boolean;
}

interface ChatbotContextType {
    messages: Message[];
    mediaFiles: File[];
    contentMedia: string[];
    setContentMedia: React.Dispatch<React.SetStateAction<string[]>>;
    setMediaFiles: React.Dispatch<React.SetStateAction<File[]>>;
    isLoading: boolean;
    isSending: boolean;
    sendMessage: (text: string, mediaContent: string[]) => Promise<void>;
    uploadPDFContext: (files: File[]) => Promise<void>;
    clearMessages: () => void;
}

const defaultContext: ChatbotContextType = {
    messages: [],
    mediaFiles: [],
    contentMedia: [],
    setContentMedia: () => { },
    setMediaFiles: () => { },
    isLoading: false,
    isSending: false,
    sendMessage: async () => { },
    uploadPDFContext: async () => { },
    clearMessages: () => { },
};

const ChatbotContext = createContext<ChatbotContextType>(defaultContext);

function ChatbotProvider({ children }: { children: React.ReactNode }) {
    const { error: errorShowToast } = useToast();
    const router = useRouter();
    const { user: userSession } = useAuth();
    const [user, setUser] = useState<UserInterface | null>(userSession);
    const [generateUID] = useUID();

    const [messages, setMessages] = useState<Message[]>([]);
    const [contentMedia, setContentMedia] = useState<string[]>([]);
    const [mediaFiles, setMediaFiles] = useState<File[]>([]);
    
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle'); // ['idle', 'loading', 'success', 'error']

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSending, setIsSending] = useState<boolean>(false);

    const clearMessages = useCallback(() => {
        setMessages([]);
    }, []);

    const sendMessage = useCallback(async (text: string, mediaContent: string[] = []) => {
        if (!text.trim()) return;

        // Add user message
        const userMessageId = `user-${generateUID()}`;
        setMessages(prev => [...prev, {
            id: userMessageId,
            role: 'user',
            content: text,
            contentMedia: mediaContent,
        }]);

        // Add placeholder for assistant message with streaming flag
        const assistantMessageId = `assistant-${generateUID()}`;
        setMessages(prev => [...prev, {
            id: assistantMessageId,
            role: 'assistant',
            content: '',
            isStreaming: true,
        }]);

        setIsSending(true);

        try {
            // Create a new AbortController instance for this request
            const controller = new AbortController();
            const signal = controller.signal;

            const response = await fetch('/api/v1/feature/chatbot/stream', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: text,
                    messageMedia: mediaContent,
                    user_id: user?.id,
                }),
                signal,
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            if (!response.body) {
                throw new Error('ReadableStream not supported');
            }

            // Get a reader from the response body
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedContent = '';
            let endOfChat = false;
            let refString: string = "";
            // Read the stream
            // eslint-disable-next-line no-constant-condition
            while (true) {
                // eslint-disable-next-line no-await-in-loop
                const { done, value } = await reader.read();
                if (done) break;

                // Decode the chunk and append to accumulated content
                const chunk = decoder.decode(value, { stream: true });
                
                console.log('chunk', chunk);
                const cutTextIndex = chunk.indexOf(TEXT_CUT_TOKEN);
                if (cutTextIndex !== -1 || endOfChat) {
                    endOfChat = true;
                    if (chunk.indexOf(TEXT_CUT_TOKEN) !== -1) {
                        const remainContent = chunk.slice(0, chunk.indexOf(TEXT_CUT_TOKEN));
                        if (remainContent) {
                            accumulatedContent += remainContent;
                            // Update the message with the accumulated content
                            setMessages(prev => prev.map(msg =>
                                msg.id === assistantMessageId
                                    ? {...msg, content: accumulatedContent }
                                    : msg
                            ));
                        }
                        const remainRef = chunk.slice(cutTextIndex + TEXT_CUT_TOKEN.length);
                        refString += remainRef;
                    }
                } else {
                    accumulatedContent += chunk;
                
                    // Update the message with the accumulated content
                    setMessages(prev => prev.map(msg =>
                        msg.id === assistantMessageId
                            ? { ...msg, content: accumulatedContent }
                            : msg
                    ));
                }               
            }

            console.log('refs', refString.split('/media/cbrain/').filter(Boolean).map((item) => `https://api.connectedbrain.com.vn/assets/cbrain/${item}`));
            

            // Mark streaming as complete
            setMessages(prev => prev.map(msg =>
                msg.id === assistantMessageId
                    ? { ...msg, isStreaming: false }
                    : msg
            ));

        } catch (error) {
            console.error('Error streaming response:', error);
            errorShowToast('Failed to get response');

            // Update the message to show error
            setMessages(prev => prev.map(msg =>
                msg.id === assistantMessageId
                    ? { ...msg, content: 'Error: Failed to get response', isStreaming: false }
                    : msg
            ));
        } finally {
            setIsSending(false);
            setContentMedia([]);
        }
    }, [errorShowToast, generateUID, user?.id]);

    const uploadPDFContext = useCallback(async (files: File[]) => {
        if (!files.length) return;
        const formData = new FormData();
        files.forEach((file, index) => {
            formData.append(`files`, file);
        });
        setIsLoading(true);
        try {
            const response = await fetch('/api/v1/feature/chatbot/upload', {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const data = await response.json();
            if (data.status === 'success') {
                setContentMedia(prev => [...prev, data.data]);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <ChatbotContext.Provider
            value={{
                messages,
                mediaFiles,
                contentMedia,
                setContentMedia,
                setMediaFiles,
                isLoading,
                isSending,
                sendMessage,
                uploadPDFContext,
                clearMessages,
            }}
        >
            {children}
        </ChatbotContext.Provider>
    );
}

const useChatbot = () => {
    const context = useContext(ChatbotContext);
    if (!context) {
        throw new Error('useChatbot must be used within a ChatbotProvider');
    }
    return context;
};

export { ChatbotProvider, useChatbot };