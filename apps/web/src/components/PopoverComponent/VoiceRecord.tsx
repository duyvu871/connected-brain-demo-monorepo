import { cn } from '@repo/utils';
import React, { useEffect, useRef, useState } from 'react';
import { IoMicSharp } from 'react-icons/io5';
import AudioPlayer from '@/components/Chatbot/ChatSection/AudioPlayer';

interface VoiceRecordModalProps {
	setTextContent?: (text: string) => void;
}

function VoiceRecord({ setTextContent }: VoiceRecordModalProps) {
	const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
	const [audioBase64, setAudioBase64] = useState<string | null>(null);
	const [isRecording, setIsRecording] = useState(false);
	const [blobUrl, setBlobUrl] = useState<string | null>(null);

	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const audioContextRef = useRef<AudioContext | null>(null);
	const animationMicRef = useRef<HTMLDivElement | null>(null);
	const analyserRef = useRef<AnalyserNode | null>(null);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		return () => {
			// stopRecording();
			if (audioContextRef.current) {
				void audioContextRef.current.close();
			}
		};
	}, []);

	const SpeechToText = async (audioBlob: Blob) => {
		try {
			const formData = new FormData();
			formData.append('file', audioBlob);
			const response = await fetch('https://ai.connectedbrain.com.vn/api/v1/nlp/audio', {
				method: 'POST',
				// headers: {
				// 	'content-type': 'multipart/form-data',
				// },
				body: formData,
			});
			const data = await response.json();
			console.log(data);
			if (setTextContent) {
				setTextContent(data.text);
			}
		} catch (error) {
			console.error('Error during speech to text:', error);
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
			// mediaRecorderRef.current.stream.
			mediaRecorderRef.current.ondataavailable = (event) => {
				// console.log(event.data);
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
			void startRecording();
		}
	};

	return (
		<div className="flex flex-col justify-center items-center p-2 gap-4">
			<div className="flex justify-center items-center p-2 gap-2">
				{
					audioBase64 ? <>
						<AudioPlayer src={audioBase64} />
						<button
							className="p-2 bg-zinc-900 text-white rounded-md hover:bg-zinc-900/70 transition-all"
							onClick={() => SpeechToText(audioBlob as Blob)}
						>Transcribe
						</button>
					</> : null
				}

			</div>
			<div
				className="relative w-fit h-20 flex justify-center items-center"
			>
				<div
					className="absolute z-[800] w-12 h-12 rounded-full transition-all bg-zinc-600"
					ref={animationMicRef}
				 />
				<div
					className="record-mic relative z-[801] w-10 h-10 rounded-full bg-zinc-800 flex justify-center items-center cursor-pointer"
					data-start-record={isRecording}
					onClick={handleRecordingToggle}
				>
					<IoMicSharp
						className={cn('text-white transition-all', {
							'text-red-500': isRecording,
						})}
						size={24}
					/>
				</div>
			</div>
		</div>
	);
}

export default VoiceRecord;