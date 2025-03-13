'use client';
import React, { useEffect, useId, useRef } from 'react';
import { useChatbot } from './ChatbotContext';
import { cn } from '@repo/utils';
import Markdown from '@/components/Markdown';
import Tooltip from '@/components/Tooltip';
import { AiOutlineDislike, AiOutlineLike } from 'react-icons/ai';
import { FiEdit } from 'react-icons/fi';
import Copy from '@/components/CopyToClipboard';
import { markdownToTxt } from 'markdown-to-txt';
import { MessageHistoryType, ReferenceLinkType } from '@/types/apps/chatbot/api.type';
import DocViewer from '@/components/Chatbot/ChatSection/doc-viewer';

interface MessageProps {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    referenceLink?: MessageHistoryType['reference_link'];
    isStreaming?: boolean;
}

const TypingIndicator = () => (
    <div className="flex space-x-2 p-2">
        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
);

const Message = ({ role, content, referenceLink, isStreaming }: MessageProps) => {
    const isAssistant = role === 'assistant';

    const docs = referenceLink ? referenceLink.map(({link, name, type}) => {
		return { uri: link, fileType: type, fileName: name };
	}) : [];

    return (
        <div className={cn(
            'flex w-full mb-4 my-10',
            isAssistant ? 'justify-start' : 'justify-end'
        )}>
            <div className={cn(
                'max-w-[80%] rounded-lg p-4',
                isAssistant
                    ? 'hidden:bg-zinc-200 hidden:dark:bg-zinc-800 text-black dark:text-white'
                    : 'bg-zinc-600 text-white'
            )}>
                {content ? (
                    <Markdown>{content || ""}</Markdown>
                ) : isStreaming ? (
                    <TypingIndicator />
                ) : null}

                <div className="flex flex-col gap-2 mt-4 w-full">
                    {(isAssistant && docs.length) ? <div className="text-sm font-semibold dark:text-zinc-100 text-zinc-600">Reference Links</div> : null}
                    <div className="w-full overflow-auto overflow-y-hidden">
                        <div className="flex gap-4 w-fit">
                            {(isAssistant && docs.length) ?
                                docs.map((doc, index) => <DocViewer doc={doc} key={`doc-${useId()}`} />) : null}
                        </div>
                    </div>
                </div>
                <div className="w-full flex justify-start items-center gap-2 mt-5">
                    {isAssistant ? <>
                        <Tooltip title="Like this response">
                            <div
                                className="p-2 rounded-full bg-zinc-200 dark:bg-zinc-800 cursor-pointer transition-all text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-white">
                                <AiOutlineLike />
                            </div>
                        </Tooltip>
                        <Tooltip title="Unlike this response">
                            <div
                                className="p-2 rounded-full bg-zinc-200 dark:bg-zinc-800 cursor-pointer transition-all text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-white">
                                <AiOutlineDislike />
                            </div>
                        </Tooltip>
                        <Tooltip title="Unlike this response">
                            <div
                                className="p-2 rounded-full bg-zinc-200 dark:bg-zinc-800 cursor-pointer transition-all text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-white">
                                <FiEdit />
                            </div>
                        </Tooltip>
                        <Tooltip title="Copy">
                            <Copy
                                childrenProps={{
                                    className:
                                        'p-2 aspect-square rounded-full bg-zinc-200 dark:bg-zinc-800 cursor-pointer transition-all text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-white',
                                }}
                                text={markdownToTxt(content ?? '')}
                            />
                        </Tooltip>
                    </> : null}
                </div>
            </div>
        </div>
    );
};

const MessageList = () => {
    const { messages } = useChatbot();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Scroll to bottom when messages change
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // if (messages.length === 0) {
    //     return null;
    // }

    return (
        <div className="flex-1 w-full flex justify-center overflow-y-auto p-4">
            <div className="container max-w-[800px]">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-4">
                        <h2 className="text-3xl font-semibold mb-2">Welcome to the Chatbot</h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md">
                            Start a conversation by typing a message below. The chatbot will respond with streaming text.
                        </p>
                    </div>
                ) : (
                    messages.map((message) => (
                        <Message
                            content={message.content}
                            referenceLink={message.referenceLink}
                            id={message.id}
                            isStreaming={message.isStreaming}
                            key={message.id}
                            role={message.role}
                        />
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};

export default MessageList;