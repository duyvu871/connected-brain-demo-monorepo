"use client"

import { useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import { Container, Title, Stack, Paper, Text, Loader, Group, Box, Button, Space } from '@mantine/core';
import type { FileWithPath } from '@mantine/dropzone'
import { FileUpload } from './file-upload'
import { AudioTrack } from './audio-track'
import { AudioPlayer } from './audio-player'
import { AudioVisualizer } from './audio-visualizer'
import { tracksAtom, currentTrackAtom } from './states/audio'
import { FileVolume, X } from 'lucide-react'
import { cn, file as fileUtils, time } from '@repo/utils';
import type { FileExtIcon } from '@/lib/fileExtIcon.ts';
import { fileExtIcon } from '@/lib/fileExtIcon.ts';
import { CiFileOn } from 'react-icons/ci';
import { IoCloseSharp } from 'react-icons/io5';
import { Separator } from '@react-pdf-viewer/core';
import { Spacer } from '@nextui-org/react';
import api from '@/libs/axios/v1/axios.ts';
import { useToast } from '@/hooks/useToast.ts';

export function VoiceSeparator() {
	const [isProcessing, setIsProcessing] = useState(false)
	const [tracks, setTracks] = useAtom(tracksAtom)
	const [currentTrack] = useAtom(currentTrackAtom)
	const [file, setFile] = useState<File | null>(null);
	const [fileSize, setFileSize] = useState<string>('');
	const Icon = fileExtIcon[file?.name.split('.').pop() as FileExtIcon || 'default'] || CiFileOn;

	const {error: showError} = useToast();

	const handleDrop = (files: FileWithPath[]) => {
		setFile(files[0])
	}

	const handleRemove = () => {
		setFile(null);
		setFileSize('');
		setTracks([]);
	}

	const handleUpload = async () => {
		// Simulated API call - replace with your actual API endpoint
		if (!file) return;
		try {
			setIsProcessing(true)
			// Mock response - replace with actual API call
			// await new Promise(resolve => setTimeout(resolve, 2000))
			const separateResult = await api.v1.voiceSeparation.upload(file);

			if (!separateResult) {
				showError('Failed to process audio file');
				return;
			}

			setTracks(separateResult.tracks.map((track, index) => ({
				id: `${index}`,
				speakerName: `Speaker ${index + 1}`,
				url: track.url,
				duration: time.formatMillisecondsToMinutesSeconds((track.duration || 0) * 1000),
				confidence: 1,
			})))
		} catch (error) {
			console.error('Error processing audio:', error)
		} finally {
			setIsProcessing(false)
		}
	}

	useEffect(() => {
		if (file) {
			const calcFileSize = fileUtils.calculateFileSize(file.size);
			setFileSize(calcFileSize);
		}
	}, [file]);

	return (
		<Container py="xl" size="sm">
			<Stack gap="xl">
				<Title order={1}>Voice Separator</Title>

				{/*{tracks.length === 0 ? <FileUpload onDrop={handleDrop} /> : null}*/}
				<div>
					{!file ? <FileUpload onDrop={handleDrop} /> : null}

					{file ? (
							<>
								<Box className={cn('flex items-center justify-between border border-zinc-300 dark:border-zinc-700 rounded-lg p-2')}>
									<Box className="flex items-center gap-2">
										<div className="p-2">
											<Icon className="dark:text-zinc-200 text-zinc-700" size={30} />
										</div>
										<Box className={cn("")}>
											<p
												className="text-sm dark:text-zinc-200 text-zinc-700 font-medium  whitespace-break-spaces">
												{file?.name}
											</p>
											<p className="text-xs dark:text-zinc-300 text-zinc-500">{fileSize}</p>
										</Box>
									</Box>
									<button className={cn('shrink-0 p-2 group-[close]')} onClick={handleRemove} type="button">
										<IoCloseSharp className="dark:text-zinc-200 text-zinc-800" size={24} />
									</button>
								</Box>
								<Spacer y={5} />
								<Button
									color={isProcessing ? 'gray' : 'green'}
									disabled={isProcessing}
									onClick={handleUpload}
									radius="md"
									variant="light"
									w="100%"
								>
									Separate Voices
								</Button>
							</>
						)
						: null}
				</div>

				{isProcessing ? <>
					<Paper className="!bg-zinc-900 !border-zinc-800" px="xl" py="sm" radius="md" withBorder>
						<Group align="center" gap="sm" wrap="nowrap">
							<div>
								<Loader color="green" size="xl" />
							</div>
							<Text className="!text-xs sm:!text-md">Processing your audio file...</Text>
						</Group>
					</Paper>
				</> : null}

				{tracks.length > 0 && (
					<Stack gap="md">
						{/*<Title order={2}>Separated Tracks</Title>*/}
						{currentTrack ? <Stack gap="xs">
								<AudioPlayer />

							</Stack> : null}
						<Group grow>
							{tracks.map((track) => (
								<AudioTrack key={track.id} track={track} />
							))}
						</Group>
					</Stack>
				)}
			</Stack>
		</Container>
	)
}

