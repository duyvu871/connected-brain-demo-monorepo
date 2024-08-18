import { cn } from '@repo/utils';
import React from 'react';
import MessageListRender from '@/components/Chatbot/ChatSection/MessageListRender';
import InputWrapper from '@/components/Chatbot/ChatSection/InputWrapper';

interface ChatSectionProps {
	classNames?: {
		wrapper?: string;
	};
};

export default function ChatSection({ classNames }: ChatSectionProps) {
	return (
		<div
			className={cn('shadow md:rounded-2xl p-2 md:p-4 pt-0 pr-0  w-full h-full mx-auto flex flex-col justify-between items-center relative', classNames?.wrapper || '')}>
			<MessageListRender />
			<div className="w-full h-fit flex flex-col justify-center items-center relative max-w-3xl pr-4">
				{/*<div className="w-full h-14 bg-gradient-to-t from-[background-hero] absolute top-[-100%]" />*/}
				<InputWrapper />
				<div className="absolute" />
			</div>
		</div>
	);
}