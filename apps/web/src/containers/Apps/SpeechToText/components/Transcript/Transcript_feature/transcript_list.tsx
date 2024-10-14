import React, { useEffect, useRef, useState } from 'react';
import { Center, Flex, ScrollArea, Stack } from '@mantine/core';
import { transcript } from '@/containers/Apps/SpeechToText/states/transcript';
import useUID from '@/hooks/useUID';
import { time } from '@repo/utils';
import { Howl } from 'howler';
import { audioFile, audioInstance } from '@/containers/Apps/SpeechToText/states/jotai';
import { HiMiniPause, HiMiniPlay } from 'react-icons/hi2';
import { atom, useAtom } from 'jotai';
import {MdTranslate} from "react-icons/md";
import api from '@/libs/axios/v1/axios';
import { TranslatePopover } from '@/components/translate/translate-popover.tsx';

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
	const [instance] = useAtom(audioInstance);
	const [isPlaying, setIsPlaying] = useState<boolean>(false);
	const [audioActive, setAudioActive] = useAtom(audioItemActive);
	const [transcript, setTranscript] = useState<string>(props.words)
	const audioInstanceRef = useRef<Howl | null>(instance);

	const translateTranscript = async () => {
		// const response = await api.v1.translate()
	}

	const playSegment = () => {
		const instance = global as (typeof globalThis & {
			audioInstance?: Howl;
		});
		const audioInstance = instance?.audioInstance;
		if (!audioInstance) return;
		audioInstanceRef.current = audioInstance;

		if (audioActive !== props.audioId) {
			audioInstanceRef.current?.stop();
		}
		if (isPlaying) {

			setAudioActive(null);
			return;
		}
		if (!audioInstance) return;
		if (!props.audioId) return;

		setAudioActive(props.audioId);
		audioInstance.play(props.audioId);
		audioInstance.once('end', () => {
			setAudioActive(null);
		});
		
	};

	useEffect(() => {
		if (audioActive === props.audioId) {
			setIsPlaying(true);
		} else {
			audioInstanceRef.current?.stop();
			setIsPlaying(false);
		}
	}, [audioActive]);

	return (
		<Flex align="start" className="flex-grow h-fit w-full gap-1" direction="column" justify="center">
			<Flex align="center" className="w-full" justify="space-between">
				<Flex className="flex gap-2">
					<p className="text-green-400/85 text-bold text-sm">{props.speaker ?? 'Speaker'}</p>
					<TranslatePopover
						apiMarked={() => {}}
						onCompletion={() => {}}
						onError={() => {}}
						text={transcript}
					>
						<div
							className="w-5 h-5 flex justify-center items-center cursor-pointer bg-zinc-100 hover:bg-zinc-200 hover:dark:bg-zinc-800 dark:bg-zinc-900 rounded-md transition-colors">
							<MdTranslate className="dark:text-zinc-400 text-zinc-600" />
						</div>
					</TranslatePopover>
				</Flex>
				<p className="text-zinc-500 text-bold text-xs">{formatMillisecondsToMinutesSeconds(props.start)}</p>
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
				<button onClick={playSegment}>{isPlaying ? <HiMiniPause className="text-red-500" /> :
					<HiMiniPlay />}</button>
				<p className="text-xs text-zinc-300 pl-2">{transcript ?? 'Words'}</p>
			</Flex>
			{/*</Tooltip>*/}
		</Flex>
	);
};

function TranscriptList() {
	const [genID] = useUID();
	const [transcript_data, setTranscriptData] = useAtom(transcript);
	const [currentFile] = useAtom(audioFile);
	const [, setAudioInstance] = useAtom(audioInstance);
	useEffect(() => {
		if (currentFile) {
			// @ts-ignore
			window.audioInstance = new Howl({
				src: [currentFile.url],
				autoplay: false,
				html5: true, // use html5 audio
				sprite: {
					...transcript_data?.transcript.reduce((acc, item, index) => {
						return {
							...acc,
							[`audio-${currentFile.name}-${index}`]: [item.start, item.end - item.start],
						};
					}, {}),
				},
				onplay: () => {
					console.log('onplay');
				},
				onpause: () => {
					console.log('onpause');
				},
				onend: () => {
					console.log('onend');
				},
				onseek: () => {
				},
			});
		}
	}, [currentFile]);
	return (
		<Center className="flex-grow w-full overflow-hidden">
			<ScrollArea className="h-full w-full" scrollHideDelay={500} scrollbarSize={6} type="scroll">
				<Stack align="start" className="gap-5">
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