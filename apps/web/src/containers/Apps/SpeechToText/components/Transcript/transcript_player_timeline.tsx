import React from 'react';
import { time } from '@repo/utils';
import { useAtom } from 'jotai';
import { audioCurrentTime, audioDuration, audioFile } from '@/containers/Apps/SpeechToText/states/jotai';
import {Slider, Button} from '@nextui-org/react';
import { Box } from '@mantine/core';
import { usePlayer } from '@/providers/speech-to-text/player-provider.tsx';

const { formatMillisecondsToMinutesSeconds } = time;

function TranscriptPlayerTimeline() {
	const {handleSeek} = usePlayer();
	const [value, setValue] = useAtom(audioCurrentTime);
	const [maxValue, setMaxValue] = useAtom(audioDuration);
	const [file, setCurrentFile] = useAtom(audioFile);

	const convertToPercentage = (value: number, maxValue: number) => {
		return ((value / maxValue) * 100).toFixed(2);
	}

	const seek = (value: number | number[]) => {
		let registedValue!: number;
		if (Array.isArray(value)) {
			registedValue = value[0];
		} else {
			registedValue = value;
		}
		console.log('registedValue', registedValue, value);
		setValue(registedValue);
		handleSeek(registedValue);
	}

	return (
		<Box className="flex flex-col justify-center items-center w-full gap-1">
			<Box className="w-full flex justify-between items-center max-w-md">
				<span className="max-w-[150px] break-words line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">
					{file.name}
				</span>
				<span
					className="w-fit text-sm text-zinc-500 dark:text-zinc-400"
				>
					{formatMillisecondsToMinutesSeconds(Number(value))}
					<span className="px-1">
						/
					</span>
					{formatMillisecondsToMinutesSeconds(maxValue)}
				</span>
			</Box>
			<Box className="w-full flex justify-center items-center">
				<Slider
					aria-label="Volume"
					className="max-w-md"
					classNames={{
						thumb: 'bg-zinc-50',
						track: 'bg-zinc-900 border-l border-r',
						filler: "bg-zinc-50"
					}}
					color="foreground"
					defaultValue={0}
					hideThumb
					maxValue={maxValue}
					minValue={0}
					onChange={seek}
					renderValue={(children, ...props) => (
						<output {...props}>
							{/*<Button*/}
							{/*	className="text-white w-fit"*/}
							{/*	isIconOnly*/}
							{/*	// radius="full"*/}
							{/*	variant="light"*/}
							{/*>*/}
							{/*	{formatMillisecondsToMinutesSeconds(Number(value))}*/}
							{/*	<span className="px-1">*/}
							{/*		/*/}
							{/*	</span>*/}
							{/*	{formatMillisecondsToMinutesSeconds(maxValue)}*/}
							{/*</Button>*/}
							1:00:00
						</output>
					)}
					size="sm"
					value={value}
				/>
			</Box>
		</Box>
	);
}

export default TranscriptPlayerTimeline;