import React, { useEffect } from 'react';
import { Center, Flex, ScrollArea, Stack } from '@mantine/core';
import { activeTranscriptSentence, transcript } from '@/containers/Apps/SpeechToText/states/transcript';
import useUID from '@/hooks/useUID';
import { time } from '@repo/utils';
import { audioCurrentTime, audioFile } from '@/containers/Apps/SpeechToText/states/jotai';
import { atom, useAtom } from 'jotai';
import { useScrollIntoView } from '@mantine/hooks';

const { formatMillisecondsToMinutesSeconds } = time;

interface TranscriptListItemProps {
	speaker: string;
	words: string;
	start: number;
	end: number;
	color?: string;
	audioId?: string;
}

const audioItemActive = atom<string | null>(null as string | null);

const TranscriptListItem: React.FC<TranscriptListItemProps> = (props) => {
	const { scrollIntoView, targetRef } = useScrollIntoView<
		HTMLDivElement,
		HTMLDivElement
	>();
	const [activeSentence] = useAtom(activeTranscriptSentence);

	useEffect(() => {
		if (activeSentence === props.audioId) {
			console.log(activeSentence,
			);
			scrollIntoView();
		}
	}, [activeSentence]);

	return (
		<Flex
			align="start"
			className="flex-grow h-fit w-full gap-1"
			direction="column"
			justify="center"
			ref={targetRef}
		>
			<Flex align="center" className="w-full gap-2" justify="flex-start">
				<p className="text-green-400/85 text-bold text-medium">{props.speaker ?? 'Speaker'}</p>
				<p className="text-gray-500 text-bold text-sm">{formatMillisecondsToMinutesSeconds(props.start)}</p>
			</Flex>
			{/*<Tooltip*/}
			{/*	className={'dark'}*/}
			{/*	content={*/}
			{/*		<Flex className="px-[2px]">*/}
			{/*			<Box>*/}
			{/*				/!*<Button size={'sm'}>*!/*/}
			{/*				/!*	<HiMiniPlay />*!/*/}
			{/*				/!*</Button>*!/*/}
			{/*			</Box>*/}
			{/*		</Flex>*/}
			{/*	}*/}
			{/*>*/}
			<Flex align="start" justify="start">
				{/*<button onClick={playSegment}>{isPlaying ? <HiMiniPause className={'text-red-500'} /> :*/}
				{/*	<HiMiniPlay />}</button>*/}
				<p className="text-sm text-gray-300 pl-2">{props.words ?? 'Words'}</p>
			</Flex>
			{/*</Tooltip>*/}
		</Flex>
	);
};

function TranscriptList() {
	const [genID] = useUID();
	const [transcript_data, setTranscriptData] = useAtom(transcript);
	const [currentFile] = useAtom(audioFile);
	const [audioActive, setAudioActive] = useAtom(audioItemActive);
	const [currentTime, setCurrentTime] = useAtom<number>(audioCurrentTime);
	return (
		<Center className="flex-grow w-full overflow-hidden">
			<ScrollArea className="h-80" scrollHideDelay={500} scrollbarSize={6} type="scroll">
				<Stack align="start" className="gap-3">
					{transcript_data?.transcript.map((item, index) => (
						<TranscriptListItem
							audioId={`audio-${currentFile.name}-${index}`}
							end={item.end}
							key={genID()}
							speaker={item.speaker}
							start={item.start}
							words={item.text}
						/>
					))}
				</Stack>
			</ScrollArea>

		</Center>
	);
}

export default TranscriptList;