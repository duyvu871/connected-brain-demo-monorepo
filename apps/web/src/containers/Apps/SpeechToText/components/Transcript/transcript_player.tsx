import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Center, Flex } from '@mantine/core';
import { Tooltip } from '@nextui-org/react';
import { cn } from '@repo/utils';
import { LuPencilLine } from 'react-icons/lu';
import { HiMiniArrowUturnLeft, HiMiniArrowUturnRight, HiMiniPause, HiMiniPlay } from 'react-icons/hi2';
import { PiShareFill } from 'react-icons/pi';
import { useAtom } from 'jotai';
import { usePlayer } from "@/containers/Apps/SpeechToText/hooks/usePlayer";

import {
	audioPlaying,
} from '@/containers/Apps/SpeechToText/states/jotai';
import {
	enableTranscriptEdit,
} from '@/containers/Apps/SpeechToText/states/transcript';
import { useHotkeys } from '@mantine/hooks';


function TranscriptPlayer() {
	const [enableEdit] = useAtom(enableTranscriptEdit);
	const [isPlaying] = useAtom(audioPlaying);

	const {
		togglePause,
		toggleEdit,
		backward,
		forward,
	} = usePlayer();

	useHotkeys([
		['ArrowLeft', () => backward()],
		['ArrowRight', () => forward()],
		['Space', () => togglePause()],
	]);

	return (
		<Flex align="center" className="gap-5" justify="center">
			<Tooltip className="dark" classNames={{ content: 'text-md' }} content="Edit">
				<Center
					className={cn(
						'w-8 h-8 rounded-full hover:bg-zinc-400/70 transition-all cursor-pointer',
						{
							'': enableEdit,
						},
					)}
					onClick={toggleEdit}
				>
					<LuPencilLine className="text-green-400" size={20} />
				</Center>
			</Tooltip>

			<Tooltip className="dark" classNames={{ content: 'text-md' }} content="Backward">
				<Center
					className={cn(
						'border-solid border-[2px] border-zinc-600/70 w-8 h-8 rounded-full bg-zinc-400/40 hover:bg-zinc-400/70 transition-all cursor-pointer')}
					onClick={backward}
				>
					<HiMiniArrowUturnLeft className="text-green-400" size={20} />
				</Center>
			</Tooltip>

			<Tooltip className="dark" classNames={{ content: 'text-md' }} content="Pause/Play">
				<Center
					className={cn(
						'border-solid border-[2px] border-zinc-600/70 w-9 h-9 rounded-full bg-zinc-400/40 hover:bg-zinc-400/70 transition-all cursor-pointer',
						{
							'bg-zinc-400/70': isPlaying,
						},
					)}
					onClick={togglePause}
				>
					{isPlaying ? <HiMiniPause className="text-green-400" size={24} /> :
						<HiMiniPlay className="text-green-400" size={24} />}
				</Center>
			</Tooltip>

			<Tooltip className="dark" classNames={{ content: 'text-md' }} content="Forward">
				<Center
					className={cn(
						'border-solid border-[2px] border-zinc-600/70 w-8 h-8 rounded-full bg-zinc-400/40 hover:bg-zinc-400/70 transition-all cursor-pointer')}
					onClick={forward}
				>
					<HiMiniArrowUturnRight className="text-green-400" size={20} />
				</Center>
			</Tooltip>

			<Tooltip className="dark" classNames={{ content: 'text-md' }} content="Share">
				<Center
					className={cn(
						'w-8 h-8 rounded-full hover: transition-all cursor-pointer')}
				>
					<PiShareFill className="text-green-400" size={20} />
				</Center>
			</Tooltip>
		</Flex>
	);
}

export default memo(TranscriptPlayer);