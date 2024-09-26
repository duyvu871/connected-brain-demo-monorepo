import { useChatbot } from '@/providers/ChatbotContext';
import React from 'react';
import InputMessage from '@/components/Chatbot/ChatSection/InputMessage';
import ContentMedia from '@/components/Chatbot/ChatSection/ContentMedia';

export default function InputWrapper() {
	const { sendMessage } = useChatbot();

	return (
		<div
			className="w-full h-14 h-fit rounded-lg hidden:border border-zinc-800 hidden:bg-zinc-800 relative z-[110]">
			<ContentMedia />
			<InputMessage
				action={{
					sendMessage,
				}}
			/>
		</div>
	);
}
