import React from 'react';
import { Logo } from '@ui/Icons';
import { LuClipboardList } from 'react-icons/lu';
import { useChatbot } from '@/providers/ChatbotContext';
import { cn } from '@repo/utils';
import useUID from '@/hooks/useUID.ts';

const LaunchOption = [
	{
		title: 'Chủ đề đáng chú ý',
		icon: <LuClipboardList className="text-white w-6 h-6" />,
		prompt: 'Chủ đề đáng chú ý',
	},
	{
		title: 'Chủ đề đáng chú ý',
		icon: <LuClipboardList className="text-white w-6 h-6" />,
		prompt: 'Chủ đề đáng chú ý',
	},
	{
		title: 'Chủ đề đáng chú ý',
		icon: <LuClipboardList className="text-white w-6 h-6" />,
		prompt: 'Chủ đề đáng chú ý',
	},
	{
		title: 'Chủ đề đáng chú ý',
		icon: <LuClipboardList className="text-white w-6 h-6" />,
		prompt: 'Chủ đề đáng chú ý',
	},
];

function LaunchScreen() {
	const { setPromptText } = useChatbot();
	const handleSendMessage = (message: string) => {
		return () => setPromptText(message);
	};
	const [genID] = useUID();

	return (
		<div className="w-full h-full flex justify-center items-center">
			<div className="flex flex-col justify-center items-center gap-5">
				<div className="w-full flex justify-center items-center my-10">
					<Logo className="w-28 h-28 text-blue-400 fill-blue-400" />
				</div>
				<div className="flex justify-center items-center text-3xl my-5">
					<span>Xin chào👋! Tôi có thể giúp gì cho bạn?</span>
				</div>
				<div className="w-full flex justify-center items-center mx-auto">
					<div className="w-full grid grid-cols-[repeat(auto-fit,_minmax(150px,_1fr))] gap-6">
						{LaunchOption.map((option, index) => (
							<div
								className={cn(
									'flex flex-col justify-between items-center gap-2 max-w-xs h-24 border border-zinc-800 rounded-xl p-2 bg-zinc-900',
									'hover:bg-zinc-800 transition-all duration-300 cursor-pointer',
								)}
								key={"launch-option-" + genID()}
								onClick={handleSendMessage(option.prompt)}>
								<div className="text-white p-2 text-medium">
									<span>{option.title}</span>
								</div>
								<div className="h-fit w-full">{option.icon}</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

export default LaunchScreen;
