import React from 'react';
import { cn } from '@repo/utils';

interface ChatSectionProps {
	classNames?: {
		wrapper?: string;
	};
}

export const LeftChat = ({
	classnames,
}: {
	classnames?: {
		wrapper?: string;
		chatList?: string;
	};
}) => {
	return (
		<div className={cn('flex justify-start gap-2 w-full', classnames?.wrapper || '')}>
			<div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-800" />
			<div className={cn('flex flex-col gap-1 w-full', classnames?.chatList || '')}>
				<div className="h-20 max-w-xl w-full bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
				<div className="h-10 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
			</div>
		</div>
	);
};

function ChatSection({ classNames }: ChatSectionProps) {
	return (
		<div
			className={cn(
				'animate-pulse shadow rounded-xl p-4 max-w-3xl w-full h-full mx-auto flex flex-col justify-between items-center',
				classNames?.wrapper || '',
			)}>
			<div className="animate-pulse flex flex-col gap-5 overflow-hidden w-full">
				<LeftChat />
				<LeftChat
					classnames={{
						wrapper: 'flex-row-reverse',
						chatList: 'items-end',
					}}
				/>
			</div>
			<div className="w-full h-16 flex justify-center items-center">
				<div className="w-full h-12 max-w-xl rounded-full bg-zinc-200 dark:bg-zinc-800" />
			</div>
		</div>
	);
}

export default ChatSection;
