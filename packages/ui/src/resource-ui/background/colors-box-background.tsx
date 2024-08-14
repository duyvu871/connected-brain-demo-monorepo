import React, {useEffect, useState} from 'react';
import { cn } from '@repo/utils';

interface ColorsBoxBackgroundProps {
	children: React.ReactNode;
};

function ColorsBoxDisplay({ numberOfBoxes = 10 }: { numberOfBoxes?: number }): JSX.Element {
	const [renderBoxes, setRenderBoxes] = useState<{ isHighlighted: boolean; isHovered: boolean }[]>([]);
	// const [currentIndex, setCurrentIndex] = useState<number>(0);

	// const setHighlightState = (index: number, isHighlight: boolean) => {
	// 	setRenderBoxes((prev) => {
	// 		const newBoxes = [...prev];
	// 		newBoxes[index].isHighlighted = isHighlight;
	// 		return newBoxes;
	// 	});
	// };
	// const setHoverState = (index: number, isHovered: boolean): void => {
	// 	setRenderBoxes((prev) => {
	// 		const newBoxes = [...prev];
	// 		newBoxes[index].isHovered = isHovered;
	// 		return newBoxes;
	// 	});
	// };
	// const setHighlightCorner = (): void => {
	// 	const sqrt = Math.sqrt(numberOfBoxes);
	// 	setHighlightState(0, true);
	// 	setHighlightState(1, true);
	// 	setHighlightState(sqrt, true);
	// 	setHighlightState(sqrt - 1, true);
	// 	setHighlightState(numberOfBoxes - 1, true);
	// 	setHighlightState(numberOfBoxes - 2, true);
	// 	setHighlightState(numberOfBoxes - sqrt, true);
	// 	setHighlightState(numberOfBoxes - sqrt - 1, true);
	// };

	useEffect(() => {
		setRenderBoxes(Array.from({ length: numberOfBoxes }).map(() => ({ isHighlighted: false, isHovered: false })));
	}, [numberOfBoxes]);

	return (
		<div
			className="bg-gradient-rainbow absolute z-10 aspect-square  w-full h-screen grid grid-cols-[repeat(20,1fr)] grid-rows-[repeat(20,1fr)] saturate-200 overflow-hidden left-0 top-0">
			{renderBoxes.map((box, index) => (
				<div
					className={cn(
						' z-[2] brightness-110 transition-[2s] duration-[ease] relative m-[1px] bg-[#0a0a0a] hover:bg-blue-400 hover:duration-[0s]',
						box.isHighlighted ? 'bg-[#626467]' : '',
						// box.isHovered ? 'bg-blue-400' : '',
					)}
					key={`color-box-${index}`}
				/>
			))}
		</div>
	);
}

function ColorsBoxBackground({ children }: ColorsBoxBackgroundProps): JSX.Element {
	return (
		<div className="relative w-full h-fit flex justify-center items-center">
			<ColorsBoxDisplay numberOfBoxes={400} />
			<div className="w-full h-full z-[20]">
				{children}
			</div>
		</div>
	);
}

export default ColorsBoxBackground;