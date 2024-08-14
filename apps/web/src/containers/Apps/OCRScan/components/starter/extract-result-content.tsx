import React, { useEffect, useRef } from 'react';
import { useUpload } from '@/hooks/ocr/useUpload';
import { constants } from '@repo/utils';
import { io } from 'socket.io-client';
import { Box, Title } from '@mantine/core';
import { LiaAngleDownSolid } from 'react-icons/lia';
import Image from 'next/image';
import { Card } from '@nextui-org/react';
import Copy from '@/components/CopyToClipboard.tsx';
import DownloadFileAsContent from '@/components/DownloadFileAsContent.tsx';
import { FiDownload } from 'react-icons/fi';
import Progress from '@/containers/Apps/OCRScan/components/starter/progress.tsx';
import { useAtom } from 'jotai/index';
import { progress as progressData } from '@/containers/Apps/OCRScan/states/starter.ts';
import {useDebounceCallback} from 'usehooks-ts';
import { TbScanEye } from 'react-icons/tb';
import VisualTextSegment from '@/containers/Apps/OCRScan/components/visual-text-segment.tsx';

function ExtractResultContent() {
	const {api_route: APIRoute} = constants;
	const {uploadedImageUrl, extractedText} = useUpload();
	const [, setProgress] = useAtom(progressData);
	const debounceProgress = useDebounceCallback(setProgress, 100, {
		leading: true, // execute only the leading edge
		trailing: false, // execute only the leading edge
		maxWait: 1000 // wait for 1s
	});

	const extractResultRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		extractResultRef?.current?.scrollIntoView({ behavior: 'smooth' });
		const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL, {
			transports: ["websocket"], // use websocket only
			addTrailingSlash: false, // remove trailing slash
			path: APIRoute.API.feature.OCR.socket,
		});
		socket.on("connect", () => {
			console.log("socket connected");
		});
		socket.on("ocr:extract-status", (data: {status: string; progress: number}) => {
			// console.log("ocr:extract-status", data);
			setProgress({
				progress: data.progress,
				label: data.status,
			});
		})

		return () => {
			console.log("socket disconnected");
			if (socket.connected) {
				socket.close();
			}
		}
	}, []);

	return (
		<Box className="flex flex-col justify-center items-center gap-5">
			<Box>
				<Title className="inline-flex justify-center items-center gap-2.5 font-thin">Result <TbScanEye/></Title>
			</Box>
			<Box className="flex flex-col justify-center lg:flex-row w-full" ref={extractResultRef}>
			<Box className="p-5 bg-zinc-300">
				<Box className="w-72 sm:w-[350px] flex justify-center items-center my-4 mb-6">
					<Box className="flex justify-center items-center gap-2">
						<h2 className="text-xl text-zinc-900 font-normal">Source image</h2>
						<span
							className="text-xl text-zinc-500 flex justify-center items-center">Eng <LiaAngleDownSolid /></span>
					</Box>
				</Box>
				{/*<Spacer y={3} />*/}
				<Box className="relative overflow-auto w-72 h-80 sm:w-[350px] sm:h-[450px]">
					<VisualTextSegment image={uploadedImageUrl ?? "/placeholder.svg"} imageType="url" />
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
				<Box className="mb-3">
					<Progress />
				</Box>
				<Card
					className="bg-zinc-100 p-3"
					classNames={{
						base: 'bg-zinc-100'
					}}
				>
					<Box className="flex flex-col gap-2 w-72 h-fit sm:w-[350px] sm:h-[370px] overflow-y-scroll">
						<Box className="flex-grow text-zinc-900 p-1 text-sm">
							<pre>{extractedText}</pre>
						</Box>
					</Box>
				</Card>
				<Box className="w-full flex justify-center items-center pt-4 gap-4">
					<Copy
						childrenProps={{
							className: "w-fit rounded-lg",
							type: "button",
						}}
						text={extractedText ?? "no text extracted"}
					>
						Copy to clipboard
					</Copy>
					<DownloadFileAsContent
						content={extractedText ?? "no text extracted"}
						ext="txt"
						fileName="extracted-text"
					>
						<FiDownload />
					</DownloadFileAsContent>
				</Box>
			</Box>
		</Box>
		</Box>
	);
}

export default ExtractResultContent;