"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Center, Flex, ScrollArea, Stack } from '@mantine/core';
import { transcript, transcriptListAudioPlayerInstance } from '@/containers/Apps/SpeechToText/states/transcript';
import useUID from '@/hooks/useUID';
import { time } from '@repo/utils';
import { Howl } from 'howler';
import { audioFile, audioInstance } from '@/containers/Apps/SpeechToText/states/jotai';
import { HiMiniPause, HiMiniPlay } from 'react-icons/hi2';
import { atom, useAtom } from 'jotai';
import {MdTranslate} from "react-icons/md";
import api from '@/libs/axios/v1/axios';
import { TranslatePopover } from '@/components/translate/translate-popover.tsx';
import { TranscriptListItem } from './transcript_list_item';

function TranscriptList() {
	const [genID] = useUID();
	const [transcript_data, setTranscriptData] = useAtom(transcript);
	const [currentFile] = useAtom(audioFile);
	// const [, setAudioInstance] = useAtom(audioInstance);
	const [, setTranscriptListAudioInstance] = useAtom(transcriptListAudioPlayerInstance)
	useEffect(() => {
		if (currentFile) {
			// @ts-ignore
			setTranscriptListAudioInstance(new Howl({
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
			}))
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