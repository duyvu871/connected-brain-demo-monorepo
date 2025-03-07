'use client';
import React, { lazy, Suspense } from 'react';
import { cn } from '@repo/utils';
import MessageList from './MessageList';
import InputWrapper from './InputWrapper';
import { ChatbotProvider } from './ChatbotContext';
import '@/styles/markdownParser.css';

interface ChatSectionProps {
    classNames?: {
        wrapper?: string;
    };
}

const ChatSection = ({ classNames }: ChatSectionProps) => {

    return (
        <div className={cn('pt-0 w-full h-full mx-auto flex flex-col justify-between items-center relative', classNames?.wrapper || '')}>
            <MessageList />
            <div className="w-full h-fit flex flex-col justify-center items-center relative max-w-3xl px-2">
                <div className="w-full py-4">
                    <InputWrapper />
                </div>
            </div>
        </div>
    );
};

function AppChatbot() {
    return (
        <ChatbotProvider>
            <div className="w-full h-full relative bg-zinc-50 dark:bg-zinc-950">
                <div className="w-full h-[calc(100vh_-_57px)] flex">
                    <div className="flex-grow w-0">
                        <div className="w-full h-full hidden:md:border border-zinc-800 md:rounded-xl">
                            <Suspense fallback={<div>Loading...</div>}>
                                <ChatSection />
                            </Suspense>
                        </div>
                    </div>
                </div>
            </div>
        </ChatbotProvider>
    );
}

export default AppChatbot;