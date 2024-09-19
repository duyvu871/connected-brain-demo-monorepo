import type {HTMLAttributes} from 'react';
import React from 'react';
import { cn } from '@repo/utils';

interface DonutShapeProps extends HTMLAttributes<HTMLPreElement> {
	classNames?: {
		wrapper?: string;
		pre?: string;
	};
};

function DonutShape({ classNames, ...props }: DonutShapeProps): JSX.Element {
	return (
		<div className={cn('', classNames?.wrapper || '')}>
			<pre
				className={cn('donut-shaped w-[400px] h-[400px] text-md text-zinc-600 flex justify-center items-center', classNames?.pre || '')} {...props}  />
		</div>
	);
}

export default DonutShape;