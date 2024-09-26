import React from 'react';
import ModalWrapper from '@/components/Chatbot/Modals/ModalWrapper';
import { SlCloudDownload } from 'react-icons/sl';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { useSearchParams } from 'next/navigation';
import { cn } from '@repo/utils';

interface DownloadModalProps {
	chatHistoryCollapsed: boolean;
}

// const DownloadModalTrigger: React.FC<{ chatHistoryCollapsed: boolean }> = () => {
const DownloadModalTrigger: React.FC<DownloadModalProps> = ({ chatHistoryCollapsed }) => {
	return (
		<div className="flex justify-center items-center">
			<div className="flex justify-center items-center p-2 dark:text-zinc-50 text-zinc-700 ">
				<SlCloudDownload className="text-2xl" />
			</div>
			<span
				className={cn(
					'dark:text-zinc-50 text-zinc-700 leading-5 transition-all ml-4',
					chatHistoryCollapsed ? 'w-0 invisible overflow-hidden' : 'ml-2 w-fit',
				)}>
				Download Chat History
			</span>
		</div>
	);
};

const DownloadModalContent: React.FC<any> = () => {
	const params = useSearchParams();

	const downloadChatHistory = () => {
		fetch('/api/v1/feature/chatbot/download-history', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				section_id: params.get('id'),
			}),
		})
			.then(response => response.blob())
			.then(blob => {
				// Tạo một liên kết tải xuống
				const url = window.URL.createObjectURL(blob);
				const link = document.createElement('a');
				link.href = url;
				link.setAttribute('download', 'content.txt');
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			})
			.catch(error => console.error('Lỗi tải xuống:', error));
	};

	return (
		<div className="flex flex-col justify-center items-center px-5 pb-5 bg-zinc-50 dark:bg-zinc-800">
			<div className="flex justify-center items-center gap-2">
				<div className="flex justify-center items-center h-full aspect-square">
					<SlCloudDownload className="text-zinc-700 dark:text-zinc-50 text-3xl" />
				</div>
				<div className="text-zinc-700 dark:text-zinc-50 text-lg font-semibold mt-2">Download Chat History</div>
			</div>
			<div>
				<div className="text-zinc-700 dark:text-zinc-50 text-sm mt-2">
					Download your chat history to view it later.
				</div>
				<div className="text-zinc-700 dark:text-zinc-50 text-sm mt-2">
					You can download the chat history in .txt format.
				</div>
			</div>
			<div className="w-full flex flex-col justify-center items-center gap-2 mt-2">
				<div
					className="rounded-xl py-2 w-full bg-zinc-200 dark:bg-zinc-600 flex justify-center items-center cursor-pointer"
					onClick={downloadChatHistory}>
					<IoDocumentTextOutline className="text-zinc-700 dark:text-zinc-50" size={26} />
					<span className="text-zinc-700 dark:text-zinc-50p-2">Download as .txt</span>
				</div>
			</div>
		</div>
	);
};

function DownloadModal({ chatHistoryCollapsed }: DownloadModalProps) {
	return (
		<ModalWrapper
			containCloseBtn
			content={<DownloadModalContent />}
			trigger={<DownloadModalTrigger chatHistoryCollapsed={chatHistoryCollapsed} />}
		/>
	);
}

export default DownloadModal;
