import type { TranscriptWord, TranscriptSentence } from '@/containers/Apps/SpeechToText/states/transcript.ts';
import { transcript } from '@/containers/Apps/SpeechToText/states/transcript.ts';
import { useAtom } from 'jotai/index';
import { audioCurrentTime } from '@/containers/Apps/SpeechToText/states/jotai.ts';
import { useEffect, useRef, useState } from 'react';
import { Box } from '@mantine/core';
import useUID from '@/hooks/useUID.ts';

export default function TranscriptActiveSentence() {
	const [currentTime, setCurrentTime] = useAtom(audioCurrentTime);
	const [currentTranscript] = useAtom(transcript);
	const [activeSentence, setActiveSentence] = useState<TranscriptSentence | null>(null);
	const [activeWord, setActiveWord] = useState<number>(0);
	const [genUID] = useUID();
	const activeWordRef = useRef<HTMLDivElement>(null);
	const viewRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		// console.log(currentTime, activeWord, currentTranscript);
		if (currentTranscript) {
			const currentSentence = currentTranscript?.transcript.find((sentence) => {
				return currentTime >= sentence.start && currentTime <= sentence.end;
			});
			setActiveSentence(currentSentence || null);
			const currentWord = currentSentence?.words.findIndex((word) => {
				return currentTime >= word.start && currentTime <= word.end;
			});
			if (currentWord !== activeWord && currentWord !== -1) {
				setActiveWord(currentWord || 0);
			}
		}
	}, [activeWord, currentTime, currentTranscript]);

	useEffect(() => {
		if (activeWordRef.current) {
			const word = activeWordRef.current;
			const wordY = word.getBoundingClientRect().y;
			const wordHeight = word.getBoundingClientRect().height;
			const wordParent = viewRef.current;
			const parentY = wordParent?.getBoundingClientRect().y || 0;
			const parentHeight = wordParent?.getBoundingClientRect().height || 0;
			if (wordY < parentY || wordY + wordHeight > parentY + parentHeight) {
				word.scrollIntoView({ behavior: 'smooth' });
			}
		}
	}, [activeWord, activeWordRef, viewRef]);

	return (
		<Box className="p-5 sm:p-8 relative h-fit bg-zinc-900 w-full" >
			<Box className="w-[inherit] max-h-[90px] overflow-hidden overflow-y-auto" ref={viewRef}>
				{/*<div className="w-full">*/}
				{/*	a*/}
				{/*</div>*/}
				<div className="text-zinc-100 break-words">
					{activeSentence?.words.map((word, index) => {
						return (
							index === activeWord ?
								<span className="bg-green-500 text-zinc-50" key={`word-${genUID()}`} ref={activeWordRef}>
									{word.text + " "}
								</span> : word.text + " "
						);
					})}
				</div>
			</Box>
		</Box>
	);
}