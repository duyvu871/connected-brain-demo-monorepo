import { atom, useAtom } from 'jotai/index';
import React, { useEffect, useState } from 'react';
import type { Howl } from 'howler';
import { Flex } from '@mantine/core';
import { TranslatePopover } from '@/components/translate/translate-popover.tsx';
import { MdTranslate } from 'react-icons/md';
import { HiMiniPause, HiMiniPlay } from 'react-icons/hi2';
import { time } from '@repo/utils';
import { transcriptListAudioPlayerInstance } from '@/containers/Apps/SpeechToText/states/transcript.ts';

interface TranscriptListItemProps {
	speaker: string;
	words: string;
	start: number;
	end: number;
	color?: string;
	audioId?: string;
}


const { formatMillisecondsToMinutesSeconds } = time;


const audioItemActive = atom<string | null>(null as string | null);

export const TranscriptListItem: React.FC<TranscriptListItemProps> = (props) => {
	// const [instance] = useAtom(audioInstance);
	const [isPlaying, setIsPlaying] = useState<boolean>(false);
	const [audioActive, setAudioActive] = useAtom(audioItemActive);
	const [audioInstance] = useAtom(transcriptListAudioPlayerInstance)
	const [transcript, setTranscript] = useState<string>(props.words)
	// const audioInstanceRef = useRef<Howl | null>(instance);

	const translateTranscript = async () => {
		// const response = await api.v1.translate()
	}

	const playSegment = () => {
		// const instance = global as (typeof globalThis & {
		// 	audioInstance?: Howl;
		// });
		if (!audioInstance) return;
		// audioInstanceRef.current = audioInstance;

		if (audioActive !== props.audioId) {
			audioInstance?.stop();
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
			audioInstance?.stop();
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