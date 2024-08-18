import { Box } from '@mantine/core';
import Image from 'next/image';
import { Button } from '@nextui-org/react';
import { LiaAngleDownSolid } from 'react-icons/lia';
import { useWindowScroll } from '@mantine/hooks';

export default function ExploreIllustration(): JSX.Element {
	const [, scrollTo] = useWindowScroll();

	return (
		<Box className="flex flex-col justify-center items-center w-full my-20">
			<Box className="w-full flex justify-center items-center gap-2 mb-20">
				<h2 className="text-2xl text-zinc-100 font-normal">Turn images into editable text in seconds</h2>
			</Box>
			<Box className="flex flex-col sm:flex-row max-w-4xl">
				<Box className="p-5 bg-zinc-300">
					<Box className="w-72 sm:w-[350px] flex justify-center items-center my-4 mb-6">
						<Box className="flex justify-center items-center gap-2">
							<h2 className="text-xl text-zinc-900 font-normal">Source image</h2>
							<span
								className="text-xl text-zinc-500 flex justify-center items-center">Eng <LiaAngleDownSolid /></span>
						</Box>
					</Box>
					{/*<Spacer y={3} />*/}
					<Box className="relative overflow-hidden w-72 h-80 sm:w-[350px] sm:h-[450px]">
						<Image alt="illustration" height={700} src="/ocr/illustration.png" width={500} />
					</Box>
				</Box>
				<Box className="p-5 bg-zinc-100">
					<Box className="w-72 sm:w-[350px] flex justify-center items-center my-4 mb-6">
						<Box className="flex justify-center items-center gap-2">
							<h2 className="text-xl text-zinc-900 font-normal">OCR result</h2>
							<span
								className="text-xl text-zinc-500 flex justify-center items-center">Eng <LiaAngleDownSolid /></span>
						</Box>
					</Box>
					<Box className="flex flex-col gap-2 w-72 h-fit sm:w-[350px] sm:h-[450px]">
						<Box className="flex-grow">
							<Box className="w-full h-full text-zinc-900">
								<p>BOOKING 012 345 67890</p>
								<p>NEW FASHION</p>
								<p>12 FEB</p>
								<p>NEW TREND</p>
								<p>invalu
									PAUL SMITH COLLECTION</p>
								<p>FASHION SHOW</p>
								<p>servalo
									em</p>
								<p>demato
									2016</p>
								<p>nvato</p>
								<p>GATE OPEN</p>
								<p>10PM/FREE DRINK</p>
								<p>WWW.YOURFASHION.COM
									TICKET $7</p>
							</Box>
						</Box>
						<Box className="w-full p-5 flex justify-center items-center">
							<Button>
								Copy to clipboard
							</Button>
						</Box>
					</Box>
				</Box>
			</Box>
			<Box className="w-full flex justify-center items-center gap-2 my-20">
				<Button
					onClick={() => scrollTo({ y: 0 })}
					radius="full"
					size="lg"
					variant="bordered"
				>
					Try for free
				</Button>
			</Box>
		</Box>
	);
}