import { useChatbot } from '@/providers/ChatbotContext';
import React from 'react';
import InputMessage from '@/components/Chatbot/ChatSection/InputMessage';
import ContentMedia from '@/components/Chatbot/ChatSection/ContentMedia';

export default function InputWrapper() {
	const { sendMessage } = useChatbot();

	return (
		<div
			className="w-full h-14 h-fit rounded-[30px] border border-zinc-800 bg-zinc-800 relative z-[110] mb-2">
			<ContentMedia />
			<InputMessage
				action={{
					sendMessage,
				}}
			/>
		</div>
	);
}
