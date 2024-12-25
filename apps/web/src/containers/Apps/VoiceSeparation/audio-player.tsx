"use client"

import { useEffect, useRef } from 'react'
import { useAtom } from 'jotai'
import { Paper, Group, ActionIcon, Text, Slider, Stack } from '@mantine/core'
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react'
import { currentTrackAtom, isPlayingAtom, audioElementAtom, currentTimeAtom, durationAtom } from './states/audio'
import { AudioVisualizer } from '@/containers/Apps/VoiceSeparation/audio-visualizer.tsx';
import { time } from '@repo/utils';

export function AudioPlayer() {
	const [currentTrack, setCurrentTrack] = useAtom(currentTrackAtom)
	const [isPlaying, setIsPlaying] = useAtom(isPlayingAtom)
	const [audioElement, setAudioElement] = useAtom(audioElementAtom)
	const [currentTime, setCurrentTime] = useAtom(currentTimeAtom)
	const [duration, setDuration] = useAtom(durationAtom)

	const audioRef = useRef<HTMLAudioElement>(null)

	useEffect(() => {
		if (audioRef.current) {
			setAudioElement(audioRef.current)
		}
	}, [setAudioElement])

	useEffect(() => {
		if (audioElement && currentTrack) {
			audioElement.src = currentTrack.url
			console.log('currentTrack', currentTrack.url);
			audioElement.load()
		}

		return () => {
			if (audioElement) {
				audioElement.pause()
				// setAudioElement(null)
			}
		}
	}, [audioElement, currentTrack])

	const togglePlayPause = () => {
		if (audioElement) {
			if (isPlaying) {
				audioElement.pause()
			} else {
				audioElement.play()
			}
			setIsPlaying(!isPlaying)
		}
	}

	const handleVolumeChange = (value: number) => {
		if (audioElement) {
			audioElement.volume = value / 100
		}
	}

	const handleSeek = (value: number) => {
		if (audioElement) {
			audioElement.currentTime = value
			setCurrentTime(value)
		}
	}

	const formatTime = (time: number) => {
		const minutes = Math.floor(time / 60)
		const seconds = Math.floor(time % 60)
		return `${minutes}:${seconds.toString().padStart(2, '0')}`
	}

	const forward = () => {
		if (audioElement) {
			const currentTime = audioElement.currentTime;
			if (currentTime + 5 > duration) {
				handleSeek(duration);
				return;
			}
			handleSeek(currentTime + 5);
		}
	}

	const backward = () => {
		if (audioElement) {
			const currentTime = audioElement.currentTime;
			if (currentTime - 5 < 0) {
				handleSeek(0);
				return;
			}
			handleSeek(currentTime - 5);
		}
	}

	if (!currentTrack) return null

	return (
		<Paper className="!bg-zinc-900 !border-zinc-800" p="md" radius="md" withBorder>
			<Stack gap="xs">
				<Group justify="space-between">
					<Text fw={500}>{currentTrack.speakerName}</Text>
					<Text c="dimmed" size="sm">
						{time.formatMillisecondsToMinutesSeconds(currentTime*1000)}/{currentTrack.duration} | Confidence: {(currentTrack.confidence * 100).toFixed(1)}%
					</Text>
				</Group>
				<AudioVisualizer />
				<Slider
					color="green"
					label={formatTime}
					max={duration}
					onChange={handleSeek}
					size="sm"
					value={currentTime}
				/>
				<Group justify="space-between">
					<Group>
						<ActionIcon color="green" onClick={backward} size="lg" variant="light">
							<SkipBack size={20} />
						</ActionIcon>
						<ActionIcon
							color={isPlaying ? 'green' : 'gray'}
							onClick={togglePlayPause}
							size="xl"
							variant="filled"
						>
							{isPlaying ? <Pause size={24} /> : <Play size={24} />}
						</ActionIcon>
						<ActionIcon color="green"  onClick={forward} size="lg" variant="light">
							<SkipForward size={20} />
						</ActionIcon>
					</Group>
					<Group gap="xs">
						<Volume2 size={20} />
						<Slider
							color="green"
							defaultValue={100}
							label={(value) => `${value}%`}
							max={100}
							min={0}
							onChange={handleVolumeChange}
							size="sm"
							step={1}
							w={100}
						/>
					</Group>
				</Group>
			</Stack>
			<audio
				crossOrigin="anonymous"
				onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
				onPause={() => setIsPlaying(false)}
				onPlay={() => setIsPlaying(true)}
				onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
				ref={audioRef}
			/>
		</Paper>
	)
}

