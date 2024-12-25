"use client"

import { useSetAtom } from 'jotai'
import { Paper, Text, Group, ActionIcon } from '@mantine/core'
import { Play, User } from 'lucide-react'
import { currentTrackAtom, isPlayingAtom } from './states/audio'
import type { Track } from './states/audio'

interface AudioTrackProps {
	track: Track
}

export function AudioTrack({ track }: AudioTrackProps) {
	const setCurrentTrack = useSetAtom(currentTrackAtom)
	const setIsPlaying = useSetAtom(isPlayingAtom)

	const handlePlay = () => {
		setCurrentTrack(track)
		setIsPlaying(true)
	}

	return (
		<Paper className="!bg-zinc-900 !border-zinc-800" p="md" radius="md" withBorder>
			<Group justify="space-between">
				<Group>
					<ActionIcon
						color="green"
						onClick={handlePlay}
						size="lg"
						variant="light"
					>
						<Play size={20} />
					</ActionIcon>
					<div>
						<Group gap="xs">
							<User size={16} />
							<Text fw={500} size="sm">{track.speakerName}</Text>
						</Group>
						<Text c="dimmed" size="xs">
							Duration: {track.duration} | Confidence: {(track.confidence * 100).toFixed(1)}%
						</Text>
					</div>
				</Group>
			</Group>
		</Paper>
	)
}

