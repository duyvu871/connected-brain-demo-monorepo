import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/useToast';
import type { IconType } from 'react-icons/lib';
import { IoIosCloudUpload } from 'react-icons/io';
import { cn, file as fileUtils } from '@repo/utils';
import { useAudioUpload } from '@/containers/Apps/SpeechToText/hooks/useSpeechToText';
import { APIs } from '@/global/contants/route.ts';
import { useAtom } from 'jotai';
import { sectionId } from '@/containers/Apps/SpeechToText/states/jotai';
import { useRouter } from 'next/navigation';
import { Box } from '@mantine/core';
import { CiFileOn } from 'react-icons/ci';
import { IoCloseSharp } from 'react-icons/io5';

interface UploadAudioProps {
	onUpload?: (file: File) => Promise<void>; // Function to handle upload
	allowedFileTypes?: string[];             // Allowed file extensions (e.g., ['mp3', 'wav'])
	uploadIcon?: IconType;                    // Custom icon component
	size?: 'xl' | 'lg' | 'md' | 'sm' | 'xs';												// Optional height
	classNames?: {
		label?: string;
		container?: string;
	};
}

const UploadAudio: React.FC<UploadAudioProps> = ({
																									 allowedFileTypes = ['audio/mp3', 'audio/wav', 'audio/mpeg'],
																									 uploadIcon: UploadIcon = IoIosCloudUpload,
																									 size = 'md',
																									 classNames = {
																										 label: '',
																										 container: '',
																									 },
																								 }) => {
	const router = useRouter();
	const { error, success, info } = useToast();
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [fileSize, setFileSize] = useState<string>('');
	const [_, setSectionId] = useAtom(sectionId);
	// const [transcript_data, set] = useAtom(transcript);
	const {
		uploadAudio,
		isUploading,
	} = useAudioUpload({ url: `${APIs.speechToText.endpoint}${APIs.speechToText.uploadAudio}` });
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const fileExtension = file.name.split('.').pop()?.toLowerCase();
			const isValidFileType = allowedFileTypes.includes(file.type);
			if (isValidFileType) {
				setSelectedFile(file);
			} else {
				error('Invalid file type. Please select an audio file.');
				e.target.value = ''; // Clear the input
			}
		} else {
			setSelectedFile(null);
		}
	};

	const handleUpload = async () => {
		if (selectedFile) {
			try {
				const uploadResponse = await uploadAudio(selectedFile);
				if (!uploadResponse) return;
				success('Audio uploaded successfully!');
				setSectionId(uploadResponse.id);
				if (uploadResponse.id) {
					router.push('/app/speech-to-text?section=' + uploadResponse.id);
				}
				setSelectedFile(null);
			} catch (uploadError) {
				error('Upload failed. Please try again.');
				console.error(uploadError);
			}
		}
	};
	
	useEffect(() => {
		if (selectedFile) {
			const calcFileSize = fileUtils.calculateFileSize(selectedFile.size);
			setFileSize(calcFileSize);
		}
	}, [selectedFile]);


	return (
		<div
			className={cn('flex flex-col items-center justify-center gap-5', {
				'w-96 h-[320px]': size === 'xl',
				'w-72 h-72': size === 'lg',
				'w-5 h-52': size === 'md',
				'w-40 h-40': size === 'sm',
				'w-32 h-32': size === 'xs',
			}, classNames.container)}
		>
			<div className="flex flex-col items-center justify-center w-full">
				<div className="py-2">
					{Boolean(selectedFile) && (
						<Box className={cn('flex items-center justify-between border border-zinc-700 rounded-lg p-2')}>
							<Box className="flex items-center gap-2">
								<CiFileOn className="text-zinc-700" size={30} />
								<Box className="">
									<p
										className="text-sm text-zinc-700 font-medium max-w-24 sm:max-w-52 md:max-w-72 whitespace-break-spaces line-clamp-2">
										{selectedFile?.name}
									</p>
									<p className="text-xs text-zinc-500">{fileSize}</p>
								</Box>
							</Box>
							<button className={cn('shrink-0 p-2 group-[close]')} onClick={() => setSelectedFile(null)} type="button">
								<IoCloseSharp className="text-zinc-800" size={24} />
							</button>
						</Box>
					)}
				</div>
				<div className="flex items-center justify-center w-full">
					<label className="flex flex-col items-center justify-center w-full h-full border-2 border-zinc-300 border-dashed rounded-lg cursor-pointer bg-zinc-50 dark:hover:bg-zinc-800 dark:bg-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:border-zinc-500 dark:hover:bg-zinc-600 transition-all"
								 htmlFor="dropzone-file">
						<div className="flex flex-col items-center justify-center pt-5 pb-6">
							<svg aria-hidden="true" className="w-8 h-8 mb-2 text-zinc-500 dark:text-zinc-400"
									 fill="none" viewBox="0 0 20 16" xmlns="http://www.w3.org/2000/svg">
								<path d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
											strokeWidth="2" />
							</svg>
							<p className="mb-2 text-sm text-zinc-500 dark:text-zinc-400"><span className="font-semibold">Click to upload</span> or
								drag and drop</p>
							<p className="text-xs text-zinc-500 dark:text-zinc-400">SVG, PNG, JPG or GIF</p>
						</div>
						<input accept={allowedFileTypes.join(', ')} className="hidden" id="dropzone-file" onChange={handleFileChange}
									 type="file" />
					</label>
				</div>
			</div>

			<button
				className="flex justify-center items-center gap-1 bg-zinc-200 text-zinc-900 rounded-md px-4 py-2"
				disabled={isUploading}
				onClick={handleUpload}
				type="button">
				{/*{isUploading ? <Spinner color={'white'} /> : ''}*/}
				Upload
			</button>
		</div>
	);
};

export default UploadAudio;