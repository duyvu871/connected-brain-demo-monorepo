import React, { useEffect, useRef, useState } from 'react';
import { IoMicSharp } from 'react-icons/io5';
import { Loader } from '@mantine/core';
import { useAtom } from 'jotai/index';
import { sectionId } from '@/containers/Apps/SpeechToText/states/jotai';
import { useAudioUpload } from '@/containers/Apps/SpeechToText/hooks/useSpeechToText';
import { constants, cn } from '@repo/utils';
import { Button } from '@nextui-org/react';
import { useToast } from '@/hooks/useToast';
import { useRouter } from 'next/navigation';
import { APIs } from '@/global/contants/route.ts';

interface VoiceRecordModalProps {
	setTextContent?: (text: string) => void;
	size?: {
		wrapper?: 'xl' | 'lg' | 'md' | 'sm';
		icon?: 'xl' | 'lg' | 'md' | 'sm';
	};
}

function VoiceRecord({ setTextContent, size = { wrapper: 'sm', icon: 'sm' } }: VoiceRecordModalProps) {
	const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
	const [audioBase64, setAudioBase64] = useState<string | null>(null);
	const [isRecording, setIsRecording] = useState<boolean>(false);
	const [blobUrl, setBlobUrl] = useState<string | null>(null);

	const router = useRouter();
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const audioContextRef = useRef<AudioContext | null>(null);
	const animationMicRef = useRef<HTMLDivElement | null>(null);
	const analyserRef = useRef<AnalyserNode | null>(null);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const { error, success, info } = useToast();
	const [_, setSectionId] = useAtom(sectionId);
	// const [transcript_data, set] = useAtom(transcript);
	const {
		uploadAudio,
		isUploading,
	} = useAudioUpload({ url: `${APIs.speechToText.endpoint}${APIs.speechToText.uploadAudio}` });

	useEffect(() => {
		return () => {
			// stopRecording();
			if (audioContextRef.current) {
				audioContextRef.current.close();
			}
		};
	}, []);

	const handleUpload = async () => {
		if (audioBlob) {
			try {
				const uploadResponse = await uploadAudio(audioBlob);
				if (!uploadResponse) {
					error('Upload failed. Please try again.');
					return;
				}
				success('Audio uploaded successfully!');
				setSectionId(uploadResponse.id);
				if (uploadResponse.id) {
					router.push('/app/speech-to-text/' + uploadResponse.id);
				}
				setAudioBlob(null);
			} catch (uploadError) {
				error('Upload failed. Please try again.');
				console.error(uploadError);
			}
		}
	};

	const resetAnimationMic = () => {
		if (animationMicRef.current) {
			clearInterval(intervalRef.current as NodeJS.Timeout);
			animationMicRef.current.style.transform = 'scale(1)';
		}
	};

	const animateMic = () => {
		intervalRef.current = setInterval(() => {
			if (analyserRef.current && animationMicRef.current) {
				const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
				analyserRef.current.getByteTimeDomainData(dataArray);
				const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
				animationMicRef.current.style.transform = `scale(${1 + (average - 126) / 5})`;
			}
		}, 100);
	};

	const startRecording = async () => {
		try {
			setAudioBlob(null);
			setAudioBase64(null);
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			audioContextRef.current = new AudioContext();
			const source = audioContextRef.current.createMediaStreamSource(stream);
			analyserRef.current = audioContextRef.current.createAnalyser();
			analyserRef.current.fftSize = 2048;
			source.connect(analyserRef.current);

			mediaRecorderRef.current = new MediaRecorder(stream);
			const audioChunks: Blob[] = [];
			mediaRecorderRef.current.ondataavailable = (event) => {
				audioChunks.push(event.data);
			};

			mediaRecorderRef.current.onstop = () => {
				const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
				setAudioBlob(audioBlob);
				convertBlobToBase64(audioBlob);
			};

			mediaRecorderRef.current.start();
			setIsRecording(true);
			animateMic();
		} catch (err) {
			console.error('Error accessing microphone:', err);
		}
	};

	const stopRecording = () => {
		resetAnimationMic();
		if (audioBlob) {
			createBlobUrl(audioBlob);
		}
		if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
			mediaRecorderRef.current.stop();
			setIsRecording(false);
		}
	};

	const convertBlobToBase64 = (blob: Blob) => {
		const reader = new FileReader();
		reader.readAsDataURL(blob);
		reader.onloadend = () => {
			const base64data = reader.result;
			setAudioBase64(base64data as string);
		};
	};

	const createBlobUrl = (blob: Blob) => {
		console.log(blob);
		const url = URL.createObjectURL(blob);
		setBlobUrl(url);
	};

	const handleRecordingToggle = () => {
		if (isRecording) {
			stopRecording();
		} else {
			startRecording();
		}
	};

	return (
		<div className="flex flex-col justify-center items-center ga-10">
			<div className="relative flex flex-col justify-center items-center p-2 gap-4">
				<div className="absolute transform-x-[-50%] transform-y-[-50%]">
					<Loader
						className="transition-all"
						scale={5}
						size="xl"
						style={{
							'--mantine-scale': !isRecording ? '4' : '0',
						}}
						type="ring"
					/>
				</div>
				<div
					className={cn('relative w-fit flex justify-center items-center', {
						'w-32 h-32': size?.wrapper === 'xl',
						'w-24 h-24': size?.wrapper === 'lg',
						'w-16 h-16': size?.wrapper === 'md',
						'w-12 h-12': size?.wrapper === 'sm',
					})}
				>
					<div
						className={cn('absolute z-[800] rounded-full transition-all bg-zinc-600', {
							// 'w-24 h-24': size?.icon === 'xl',
							// 'w-20 h-20': size?.icon === 'lg',
							// 'w-16 h-16': size?.icon === 'md',
							// 'w-12 h-12': size?.icon === 'sm',
							'w-20 h-20': size?.icon === 'xl',
							'w-16 h-16': size?.icon === 'lg',
							'w-12 h-12': size?.icon === 'md',
							'w-10 h-10': size?.icon === 'sm',
						})}
						ref={animationMicRef}
					 />
					<div
						className={cn('record-mic relative z-[801] rounded-full bg-zinc-800 shadow-[inset_0_0_20px_1px] flex justify-center items-center cursor-pointer',
							{
								'w-20 h-20': size?.icon === 'xl',
								'w-16 h-16': size?.icon === 'lg',
								'w-12 h-12': size?.icon === 'md',
								'w-10 h-10': size?.icon === 'sm',
							},
						)}
						data-start-record={isRecording}
						onClick={handleRecordingToggle}
					>
						<IoMicSharp
							className={cn('text-white transition-all', {
								'text-red-500': isRecording,
							})}
							size={
								size?.icon === 'xl' ? 48 :
									size?.icon === 'lg' ? 36 :
										size?.icon === 'md' ? 24 : 18
							}
						/>
					</div>
				</div>
			</div>
			<div>
				<Button
					className={cn({
						'hidden': Boolean(audioBlob) && isRecording,
					})}
					onClick={() => handleUpload()}
				>
					Upload
				</Button>
			</div>
		</div>
	);
}

export default VoiceRecord;