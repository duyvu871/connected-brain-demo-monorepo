import React, { memo, useCallback, useEffect, useRef } from 'react';
import { Center, Flex } from '@mantine/core';
import { Tooltip } from '@nextui-org/react';
import { cn } from '@repo/utils';
import { LuPencilLine } from 'react-icons/lu';
import { HiMiniArrowUturnLeft, HiMiniArrowUturnRight, HiMiniPause, HiMiniPlay } from 'react-icons/hi2';
import { PiShareFill } from 'react-icons/pi';
import { useAtom } from 'jotai';
import type {
	AudioFile} from '@/containers/Apps/SpeechToText/states/jotai';
import {
	audioCurrentTime,
	audioDuration,
	audioFile,
	audioPlaying,
} from '@/containers/Apps/SpeechToText/states/jotai';
import {
	activeTranscriptSentence,
	audioPlayerInstance,
	enableTranscriptEdit,
	transcript,
} from '@/containers/Apps/SpeechToText/states/transcript';
import { useHotkeys } from '@mantine/hooks';
import { useInterval } from '@/hooks/client/useInterval';
import { Howl } from 'howler';

function TranscriptPlayer() {
	const [currentTime, setCurrentTime] = useAtom<number>(audioCurrentTime);
	const [duration, _] = useAtom<number>(audioDuration);
	const [enableEdit, setEnableEdit] = useAtom<boolean>(enableTranscriptEdit);
	const [isPlaying, setIsPlaying] = useAtom<boolean>(audioPlaying);
	const [currentFile] = useAtom<AudioFile>(audioFile);
	const [audioInstance, setAudioPlayerInstance] = useAtom<Howl | null>(audioPlayerInstance);
	const [activeSentence, setActiveTranscriptSentence] = useAtom(activeTranscriptSentence);
	const [transcriptList] = useAtom(transcript);
	const audioRef = useRef<HTMLAudioElement>(null);
	const soundRef = useRef<Howl | null>(null);
	const transcriptItemRef = useRef<Record<string, HTMLDivElement>>({});

	const { start: startInterval, stop: stopInterval } = useInterval(
		() => setCurrentTime((s) => s + 200),
		200,
	);

	useEffect(() => {
		if (currentFile) {
			const audioSegments = transcriptList?.transcript.map((sentence) => {
				const start = sentence.start;
				const end = sentence.end;
				const text = sentence.text;
				return {
					start,
					end,
					text,
				};
			});

			soundRef.current = new Howl({
				src: [currentFile.url],
				autoplay: false,
				html5: true, // use html5 audio
				onload: () => {

				},
				onplay: () => {
					console.log('onplay');
					setIsPlaying(true);
					startInterval();
				},
				onpause: () => {
					console.log('onpause');
					setIsPlaying(false);
					stopInterval();
				},
				onend: () => {
					console.log('onend');
					setIsPlaying(false);
					stopInterval();
					setCurrentTime(0);
				},
				onseek: (soundId) => {
					// // console.log('onseek', soundId);
					// const currentSeek = soundRef.current?.seek() as number * 1000;
					// console.log('currentSeek', currentSeek);
					// // setCurrentTime(currentSeek);
					// const findActiveSentence = transcriptList?.transcript.findIndex((sentence) => {
					// 	return currentSeek >= sentence.start && currentSeek <= sentence.end;
					// });
					// // console.log('findActiveSentence: ', findActiveSentence);
					// if (findActiveSentence !== -1 && `audio-${currentFile.name}-${findActiveSentence}` !== activeSentence) {
					// 	// setActiveTranscriptSentence(`audio-${currentFile.name}-${findActiveSentence}`);
					// }
				},
			});
			setAudioPlayerInstance(soundRef.current);
		}

		return () => {
			soundRef.current?.unload(); // clear sound data
		};
	}, [currentFile]);

	const togglePause = () => {
		// console.log(soundRef.current);
		if (soundRef.current) {
			if (isPlaying) {
				soundRef.current.pause();
			} else {
				soundRef.current.play();
			}
			setIsPlaying(!isPlaying);
		}
	};

	const toggleEdit = () => setEnableEdit(!enableEdit);
	// const togglePlayer = () => setIsPaused(!isPaused);
	const backward = () => {
		const newTime = Math.max(currentTime - 5000, 0);
		setCurrentTime(newTime);
		soundRef.current?.seek(newTime / 1000);
	};
	const forward = () => {
		const newTime = Math.min(currentTime + 5000, duration);
		setCurrentTime(newTime);
		soundRef.current?.seek(newTime / 1000);
	};
	const handleSeek = (value: number) => {
		if (soundRef.current) {
			soundRef.current.seek(value / 1000);
		}
	};
	const share = () => {
	};

	useHotkeys([
		['ArrowLeft', () => backward()],
		['ArrowRight', () => forward()],
		['Space', () => togglePause()],
	]);

	useEffect(function init() {

	}, []);

	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.currentTime = currentTime / 1000;
		}
	}, [currentTime, duration, enableEdit, setIsPlaying, currentFile]);

	useEffect(() => {
		if (currentTime >= duration) {
			stopInterval();
			setIsPlaying(false);
			setCurrentTime(0);
		} else if (isPlaying) {
				handleSeek(currentTime);
			}
	}, [
		currentTime,
		isPlaying,
		setCurrentTime,
		startInterval,
		stopInterval,
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