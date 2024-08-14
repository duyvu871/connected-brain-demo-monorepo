import React from 'react';
import { cn } from '@repo/utils';

interface BodyContentWrapperProps {
	children: React.ReactNode;
};

function BodyContentWrapper({ children }: BodyContentWrapperProps): JSX.Element {
	const borderDashedStyle = 'border-0 border-dashed border-gray-800 after:border-0 after:border-solid after:border-gray-800 before:border-0 before:border-solid before:border-gray-800';
	return (
		<div className="feature relative border-0 border-b-[1px] border-dashed border-gray-600">
			<div className=" relative z-2 w-full">
				{children}
			</div>
			<div
				className={
					cn(
						' absolute z-40 top-0 left-5 w-[1px] h-full bg-gray-700 pointer-events-none md:block lg:left-7.5 xl:left-10',
						borderDashedStyle,
						'after:content-normal after:absolute after:rounded-b-full after:w-6 after:h-3 after:border-[2px] after:border-t-0 after:translate-x-[-50%] after:border-gray-600',
						'before:content-normal before:absolute before:rounded-t-full before:w-6 before:h-3 before:border-[2px] before:border-b-0 before:translate-x-[-50%] before:border-gray-600 before:bottom-0',
					)}
			/>
			<div
				className={cn(
					'hidden absolute z-40 top-0 right-5 w-[1px] h-full bg-gray-700 pointer-events-none md:block lg:right-7.5 xl:right-10',
					borderDashedStyle,
					'after:content-normal after:absolute after:rounded-b-full after:w-6 after:h-3 after:border-[2px] after:border-t-0 after:translate-x-[-50%] after:border-gray-600',
					'before:content-normal before:absolute before:rounded-t-full before:w-6 before:h-3 before:border-[2px] before:border-b-0 before:translate-x-[-50%] before:border-gray-600 before:bottom-0',
				)} />
		</div>
	);
}

export default BodyContentWrapper;