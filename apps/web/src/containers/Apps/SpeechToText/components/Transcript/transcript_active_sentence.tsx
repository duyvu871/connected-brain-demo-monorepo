import type { TranscriptWord, TranscriptSentence } from '@/containers/Apps/SpeechToText/states/transcript.ts';
import { transcript } from '@/containers/Apps/SpeechToText/states/transcript.ts';
import { useAtom } from 'jotai/index';
import { audioCurrentTime } from '@/containers/Apps/SpeechToText/states/jotai.ts';
import { useEffect, useState } from 'react';
import { Box } from '@mantine/core';
import useUID from '@/hooks/useUID.ts';

export default function TranscriptActiveSentence() {
	const [currentTime, setCurrentTime] = useAtom(audioCurrentTime);
	const [currentTranscript] = useAtom(transcript);
	const [activeSentence, setActiveSentence] = useState<TranscriptSentence | null>(null);
	const [activeWord, setActiveWord] = useState<number>(0);
	const [genUID] = useUID();
	
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
	return (
		<Box className="p-5 sm:p-8 relative h-fit bg-zinc-900 w-full" >
			<Box className="w-[inherit] overflow-hidden">
				{/*<div className="w-full">*/}
				{/*	a*/}
				{/*</div>*/}
				<div className="text-zinc-100 break-words">
					{activeSentence?.words.map((word, index) => {
						return (
							index === activeWord ?
								<span className="bg-green-500 text-zinc-50"  key={`word-${genUID()}`}>
									{word.text + " "}
								</span> : word.text + " "
						);
					})}
				</div>
			</Box>
		</Box>
	);
}