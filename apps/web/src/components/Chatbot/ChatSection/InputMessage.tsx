import { useChatbot } from '@/providers/ChatbotContext';
import React, { useState } from 'react';
import { cn } from '@repo/utils';
import AutoResizeQuill from '@/components/Chatbot/Textarea';
import Tooltip from '@/components/Tooltip';
import UploadModal from '@/components/Chatbot/Modals/UploadModal';
import { MdOutlineFileUpload } from 'react-icons/md';
import { BsFillSendFill } from 'react-icons/bs';
import { IoMicSharp } from 'react-icons/io5';
import VoiceRecordModal from '@/components/Chatbot/Modals/VoiceRecordModal';
import store from '@/redux/store';

export default function InputMessage(
	{
		action,
	}: {
		action?: {
			sendMessage: (text: string, mediaContent: string[]) => Promise<void>;
		};
	}) {
	const { contentMedia, setContentMedia } = useChatbot();
	const [promptText, setPromptText] = useState<string>('');
	const [isTooLong, setIsTooLong] = useState<boolean>(false);
	const [isSendMessage, setIsSendMessage] = useState<boolean>(false);

	const updateInputValue = (value: string) => {
		store.dispatch({ type: 'UPDATE_INPUT', payload: value });
	};

	return (
		<div className={cn('flex flex-col md:flex-row justify-between items-center md:items-end p-2 md:pb-4 gap-2', isTooLong ? 'flex-col' : '')}>
			<AutoResizeQuill
				className={cn(
					'w-full bg-zinc-50 outline-none max-h-52 resize-none text-white rounded-lg p-2 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800',
					isTooLong ? 'h-fit p-2' : 'h-14',
				)}
				event={{
					onEnter: () => {
						if (promptText === '') return;
						void (action?.sendMessage(promptText, contentMedia));
						setContentMedia([]);
					},
				}}
				isClear={isSendMessage}
				isDisabled={false}
				onContentChange={setPromptText}
				placeholder="Type a message"
				setIsTooLong={setIsTooLong}
				value={promptText}
			/>
			<div
				className={cn('w-full md:w-fit flex flex-row justify-end items-center gap-2')}>
				<Tooltip title="Voice Record">
					<VoiceRecordModal>
						<div className="p-2 aspect-square flex justify-center items-center rounded-full cursor-pointer">
							<IoMicSharp className="dark:text-zinc-50 text-zinc-600" size={24} />
						</div>
					</VoiceRecordModal>
				</Tooltip>
				{/*<Tooltip title="Upload">*/}
				{/*	<UploadModal>*/}
				{/*		<div*/}
				{/*			className="p-2 aspect-square flex justify-center items-center rounded-full cursor-pointer">*/}
				{/*			<MdOutlineFileUpload className="text-white" size={26} />*/}
				{/*		</div>*/}
				{/*	</UploadModal>*/}
				{/*</Tooltip>*/}
				<Tooltip title="Generate prompt">
					<div className="p-3 py-1.5 rounded-md bg-zinc-300 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover-zinc-700 transition-colors cursor-pointer flex justify-center items-center gap-3"
							 onClick={async () => {
									if (promptText === '') {
										return;
									}
									setContentMedia([]);
									// setIsSendMessage(true);
									setPromptText('');
									updateInputValue('');
									await (action?.sendMessage(promptText, contentMedia));
									// setIsSendMessage(false);
								}}
					>
						<span className="dark:text-zinc-50 text-zinc-700">Send</span>
						<BsFillSendFill className="dark:text-zinc-50 text-zinc-700" />
					</div>
				</Tooltip>
			</div>
		</div>
	);
}