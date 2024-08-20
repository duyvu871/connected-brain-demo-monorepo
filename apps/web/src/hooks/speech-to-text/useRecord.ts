import { useEffect, useState, useRef } from 'react';
import { useAtom } from 'jotai/index';
import { isRecordingAtom } from '@/states/speech-to-text/playground.ts';

export const useMicrophone = () => {
	const [isRecording, setIsRecording] = useAtom(isRecordingAtom);
	const [stream, setStream] = useState<MediaStream | null>(null);
	const audioContextRef = useRef<AudioContext | null>(null);
	const audioBufferQueueRef = useRef(new Int16Array(0));

	useEffect(() => {
		return () => {
			stopRecording();
		};
	}, []);

	const requestPermission = async () => {
		try {
			const newStream = await navigator.mediaDevices.getUserMedia({ audio: true });
			setStream(newStream);
		} catch (error) {
			console.error('Lỗi khi yêu cầu quyền truy cập microphone:', error);
		}
	};

	const startRecording = async (onAudioCallback: (audioData: Uint8Array) => void) => {
		if (isRecording || !stream) return;

		try {
			const audioCtx = new (window.AudioContext || window.webkitAudioContext)({
				sampleRate: 16_000,
				latencyHint: 'balanced',
			});
			audioContextRef.current = audioCtx;

			const source = audioCtx.createMediaStreamSource(stream);
			await audioCtx.audioWorklet.addModule(new URL('./audio-processor.worker.ts', import.meta.url));
			const audioWorkletNode = new AudioWorkletNode(audioCtx, 'audio-processor');

			source.connect(audioWorkletNode).connect(audioCtx.destination);

			audioWorkletNode.port.onmessage = (event) => {
				if (!audioContextRef.current) return;

				const currentBuffer = new Int16Array(event.data.audio_data);
				audioBufferQueueRef.current = mergeBuffers(audioBufferQueueRef.current, currentBuffer);

				const bufferDuration =
					(audioBufferQueueRef.current.length / audioContextRef.current.sampleRate) * 1000;

				if (bufferDuration >= 100) {
					const totalSamples = Math.floor(audioContextRef.current.sampleRate * 0.1);

					const finalBuffer = new Uint8Array(
						audioBufferQueueRef.current.subarray(0, totalSamples).buffer,
					);

					audioBufferQueueRef.current = audioBufferQueueRef.current.subarray(totalSamples);
					onAudioCallback(finalBuffer);
				}
			};

			setIsRecording(true);
		} catch (error) {
			console.error('Lỗi khi bắt đầu ghi âm:', error);
		}
	};

	const stopRecording = () => {
		if (!isRecording) return;

		try {
			stream?.getTracks().forEach((track) => track.stop());
			void audioContextRef.current?.close();

			audioContextRef.current = null;
			audioBufferQueueRef.current = new Int16Array(0);
			setIsRecording(false);
		} catch (error) {
			console.error('Lỗi khi dừng ghi âm:', error);
		}
	};

	return {
		isRecording,
		requestPermission,
		startRecording,
		stopRecording,
	};
};