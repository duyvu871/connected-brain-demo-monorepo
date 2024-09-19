import { ScrollArea, Stack } from '@mantine/core';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import useUID from '@/hooks/useUID.ts';
import { useAtom } from 'jotai/index';
import { transcript, type TranscriptSentence } from '@/containers/Apps/SpeechToText/states/transcript.ts';
import { audioCurrentTime, audioFile } from '@/containers/Apps/SpeechToText/states/jotai.ts';
import { cn, time } from '@repo/utils';
import { IoIosArrowDown } from 'react-icons/io';
import { motion } from 'framer-motion';

const { formatMillisecondsToMinutesSeconds } = time;

export default function TranscriptSentencesList() {
	const [currentTime, setCurrentTime] = useAtom<number>(audioCurrentTime);
	const [currentTranscript] = useAtom(transcript);
	const [activeSentence, setActiveSentence] = useState<number>(0);
	const [genUID] = useUID();
	const [isShowScrollTo, setIsShowScrollTo] = useState<boolean>(false);

	const currentActiveSentence = useRef<HTMLDivElement>(null);
	const scrollRef = useRef<HTMLDivElement>(null);

	const scrollToSentence = () => {
		if (currentActiveSentence.current) {
			// console.log(messageWrapperRef.current);
			const messageWrapper = currentActiveSentence.current;
			messageWrapper.scrollIntoView({ behavior: 'smooth' });
		}
	};

	const checkScroll = useCallback(() => {
		if (!scrollRef.current || !currentActiveSentence.current) return;
		const scrollHeight = scrollRef.current.getBoundingClientRect().height;
		const lastMessageY = currentActiveSentence.current?.getBoundingClientRect().y;
		// console.log(lastMessageY, scrollHeight);
		if (currentTranscript?.transcript.length === 0) return;
		if (lastMessageY && lastMessageY < scrollHeight) {
			setIsShowScrollTo(false);
		} else {
			setIsShowScrollTo(true);
		}
	}, [currentTranscript]);
	
	useEffect(() => {
		if (currentTranscript) {
			const currentSentence = currentTranscript?.transcript.findIndex((sentence) => {
				return currentTime >= sentence.start && currentTime <= sentence.end;
			});
			setActiveSentence(currentSentence || 0);
			checkScroll();
		}
	}, [currentTime, currentTranscript]);

	return (
		<>
			<ScrollArea className="h-80 flex-grow p-5 relative" ref={scrollRef} scrollHideDelay={500} scrollbarSize={6}
									type="scroll">
				<Stack align="start" className="gap-3 relative">
					{currentTranscript?.transcript.map((item, index) => (
						<div className="flex justify-start" key={`sentence-${genUID()}`}>
							<div>
								<p className="text-zinc-500 text-bold text-xs">{formatMillisecondsToMinutesSeconds(item.start)}</p>
							</div>
							<div>
								<p
									className={cn(
										'text-xs text-zinc-300 pl-2',
										{
											'bg-green-500 text-zinc-50': activeSentence === index,
										})}
									ref={activeSentence === index ? currentActiveSentence : undefined}>
									{item.text ?? 'Words'}
								</p>
							</div>
						</div>
					))}
				</Stack>
				<motion.div
					animate={{
						y: isShowScrollTo ? -10 : 60,
						opacity: isShowScrollTo ? 1 : 0,
					}}
					className="absolute bottom-0 cursor-pointer z-[100] w-full flex justify-center items-center"
					initial="rest"
					transition={{
						type: 'spring',
						damping: 10,
						stiffness: 100,
					}}
					variants={{
						rest: {
							y: -50,
						},
					}}>
					<div
						className="w-fit p-2 rounded-full bg-zinc-700/70 backdrop-blur border border-zinc-600"
						onClick={scrollToSentence}>
						<IoIosArrowDown />
					</div>
				</motion.div>
			</ScrollArea>
		</>
	)
}