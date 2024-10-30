import React, { useEffect, useRef } from 'react';
import { useUpload } from '@/hooks/ocr/useUpload';
import { constants } from '@repo/utils';
import { io } from 'socket.io-client';
import { Box, Title } from '@mantine/core';
import { LiaAngleDownSolid } from 'react-icons/lia';
import { Card } from '@nextui-org/react';
import Copy from '@/components/CopyToClipboard.tsx';
import DownloadFileAsContent from '@/components/DownloadFileAsContent.tsx';
import { FiDownload } from 'react-icons/fi';
import Progress from '@/containers/Apps/OCRScan/components/starter/progress.tsx';
import { useAtom } from 'jotai/index';
import {
	progress as progressData,
	selectedOcrLang,
	selectedSourceLang,
} from '@/containers/Apps/OCRScan/states/starter.ts';
import {useDebounceCallback} from 'usehooks-ts';
import { isPDFAtom } from '@/containers/Apps/OCRScan/states/playground.ts';
import { useAuth } from '@/hooks/useAuth.ts';
import ViewExtracted from '@/containers/Apps/OCRScan/components/playground/view-extracted.tsx';

// const PDFViewer = dynamic(() => import('@/containers/Apps/OCRScan/components/playground/pdf-result.tsx'), { ssr: false });
function ExtractResultContent() {
	const {user} = useAuth();
	const {api_route: APIRoute} = constants;
	const {extractedText} = useUpload();
	const [, setProgress] = useAtom(progressData);
	const [isPDF] = useAtom(isPDFAtom);
	const [sourceLang, setSelectedSourceLang] = useAtom(selectedSourceLang);
	const [OCRLang, setSelectedOcrLang] = useAtom(selectedOcrLang);
	const debounceProgress = useDebounceCallback(setProgress, 100, {
		leading: true, // execute only the leading edge
		trailing: false, // execute only the leading edge
		maxWait: 1000 // wait for 1s
	});

	const extractResultRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL, {
			transports: ["websocket"], // use websocket only
			addTrailingSlash: false, // remove trailing slash
			path: APIRoute.API.feature.OCR.socket,
		});
		socket.on("connect", () => {
			console.log("socket connected");
			socket.on(`ocr:extract-status:${user?.id.toString() || ''}`, (data: {status: string; progress: number}) => {
				setProgress({
					progress: data.progress,
					label: data.status,
				});
			});
		});
		extractResultRef?.current?.scrollIntoView({ behavior: 'smooth' });

		return () => {
			console.log("socket disconnected");
			if (socket.connected) {
				socket.close();
			}
		}
	}, [user?.id]);

	return (
		<Box className="h-fit lg:h-full flex flex-col justify-center items-center xl:items-stretch xl:flex-row w-full rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
				 ref={extractResultRef}>
				<Box className="p-5 dark:bg-zinc-900 bg-zinc-300 w-full flex flex-col items-center">
					<Box className="w-72 sm:w-[350px] flex justify-center items-center my-4 mb-6">
						<Box className="flex justify-center items-center gap-2">
							<h2 className="text-xl text-zinc-700 dark:text-zinc-300 font-normal">Source image</h2>
							<span
								className="text-xl text-zinc-500 flex justify-center items-center capitalize">{sourceLang} <LiaAngleDownSolid /></span>
						</Box>
					</Box>
					<ViewExtracted />
				</Box>
				<Box className="w-full h-[1px] lg:h-full lg:w-[1px] bg-zinc-300/50 dark:bg-zinc-700/50"/>
				<Box className="p-5 bg-zinc-200 dark:bg-zinc-950 flex flex-col items-center w-full">
					<Box className="w-72 sm:w-[350px] flex justify-center items-center my-4 mb-6">
						<Box className="flex justify-center items-center gap-2">
							<h2 className="text-xl text-zinc-700 dark:text-zinc-300 font-normal">OCR result</h2>
							<span
								className="text-xl text-zinc-500 flex justify-center items-center capitalize">{OCRLang} <LiaAngleDownSolid /></span>
						</Box>
					</Box>
					<Box className="mb-3 w-full max-w-[350px] lg:max-w-[450px]">
						<Progress />
					</Box>
					<Card
						className="w-full max-w-[350px] lg:max-w-[450px] bg-zinc-100 dark:bg-zinc-900 p-3"
						classNames={{
							base: 'bg-zinc-100'
						}}
					>
						<Box className="flex flex-col gap-2 h-[200px] w-full sm:h-[370px] overflow-y-scroll">
							<Box className="flex-grow text-zinc-700 dark:text-zinc-200 p-1 text-sm">
								<pre>{extractedText}</pre>
							</Box>
						</Box>
					</Card>
					<Box className="w-full flex justify-center items-center pt-4 gap-4">
						<Copy
							childrenProps={{
								className: "w-fit rounded-lg  bg-zinc-500 text-zinc-100 hover:bg-zinc-600",
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
	);
}

export default ExtractResultContent;