"use client"

import { Group, Stack, Text, rem, Code } from '@mantine/core';
import type { FileWithPath } from '@mantine/dropzone';
import { Dropzone } from '@mantine/dropzone'
import { Upload, FileAudio, X } from 'lucide-react'
import '@mantine/dropzone/styles.css';

interface FileUploadProps {
	onDrop: (files: FileWithPath[]) => void
}

export function FileUpload({ onDrop }: FileUploadProps) {
	return (
		<Stack gap="0px">
			<Dropzone
				accept={['audio/*']}
				className="!bg-zinc-900 !border-zinc-800"
				maxFiles={1}
				maxSize={300 * 1024 ** 2}
				onDrop={onDrop}
				p="xs"
				radius="md"
			>
				<Group justify="center" style={{ pointerEvents: 'none' }} wrap="nowrap">
					<Dropzone.Accept>
						<FileAudio />
					</Dropzone.Accept>
					<Dropzone.Reject>
						<X
							stroke="1.5"
							style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
						/>
					</Dropzone.Reject>
					<Dropzone.Idle>
						<div className="p-4">
							<FileAudio
								className="!text-zinc-300 w-10 h-10 sm:w-24 sm:h-24"
							/>
						</div>
					</Dropzone.Idle>
					<div>
						<Text className="!text-sm sm:!text-xl">
							Drag audio files here or click to select files
						</Text>
					</div>
				</Group>
			</Dropzone>
			<Code c="dimmend" className="px-1 !text-[10px] sm:!text-xs dark:bg-zinc-900 bg-zinc-200" mt={5}>
				Attach your audio file to separate voices. Maximum file size is 300MB
			</Code>
		</Stack>
	)
}

