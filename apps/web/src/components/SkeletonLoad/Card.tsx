import React from 'react';
import { cn } from '@repo/utils';

interface CardProps {
	classNames?: {
		wrapper?: string;
	};
}

function Card({ classNames }: CardProps) {
	return (
		<div
			className={cn(
				'border border-gray-800 shadow rounded-xl p-4 max-w-lg w-full mx-auto',
				classNames?.wrapper || '',
			)}>
			<div className="animate-pulse flex space-x-4">
				<div className="rounded-full bg-zinc-700 h-10 w-10" />
				<div className="flex-1 space-y-6 py-1">
					<div className="h-2 bg-zinc-700 rounded" />
					<div className="space-y-3">
						<div className="grid grid-cols-3 gap-4">
							<div className="h-2 bg-zinc-700 rounded col-span-2" />
							<div className="h-2 bg-zinc-700 rounded col-span-1" />
						</div>
						<div className="h-2 bg-zinc-700 rounded" />
					</div>
				</div>
			</div>
		</div>
	);
}

export default Card;
