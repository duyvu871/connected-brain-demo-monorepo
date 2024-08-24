import React from 'react';
import { Button, Slider } from '@nextui-org/react';
import { time } from '@repo/utils';
import { useAtom } from 'jotai';
import { audioCurrentTime, audioDuration } from '@/containers/Apps/SpeechToText/states/jotai';

const { formatMillisecondsToMinutesSeconds } = time;

function TranscriptPlayerTimeline() {
	const [value, setValue] = useAtom<number | number[]>(audioCurrentTime);
	const [maxValue, setMaxValue] = useAtom<number>(audioDuration);
	return (
		<Slider
			aria-label="Volume"
			className="max-w-md"
			classNames={{
				thumb: 'bg-white',
				track: 'bg-gray-300',
			}}
			color="success"
			endContent={
				<Button
					isIconOnly
					radius="full"
					variant="light"
				>
					{formatMillisecondsToMinutesSeconds(maxValue)}
				</Button>
			}
			maxValue={maxValue}
			minValue={0}
			onChange={setValue}
			size="sm"
			startContent={
				<Button
					isIconOnly
					radius="full"
					variant="light"
				>
					{formatMillisecondsToMinutesSeconds(Number(value))}
				</Button>
			}
			value={value}
		/>
	);
}

export default TranscriptPlayerTimeline;