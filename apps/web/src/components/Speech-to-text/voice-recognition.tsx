import React, { useEffect, useRef, useState } from 'react';
import { isRecordingAtom, microphone, realTime, transcript } from '@/states/speech-to-text/playground.ts';
import { useAtom } from 'jotai/index';
import * as assemblyai from 'assemblyai';
import { useToast } from '@/hooks/useToast.ts';
import axiosNextAuth from '@/libs/axios/v1/axiosWithAuth.ts';

function VoiceRecognition() {
	const {error: ShowError} = useToast()

	const [isRecording, setIsRecording] = useAtom(isRecordingAtom);
	const [rt, setRT] = useAtom(realTime);
	const [currentTranscript, setCurrentTranscript] = useAtom(transcript)
	const [microphoneStore, setMicrophoneStore] = useAtom(microphone);
	// const [stream, setStream] = useState<MediaStream | null>(null);
	const audioContextRef = useRef<AudioContext | null>(null);
	const audioBufferQueueRef = useRef(new Int16Array(0));
	const streamRef = useRef<MediaStream | null>(null);
	const audioWorkletNodeRef = useRef<AudioWorkletNode | null>(null);
	const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
	const messageRef = useRef<HTMLParagraphElement>(null);

	useEffect(() => {
		if (messageRef.current) {
			messageRef.current.scrollTop = messageRef.current.scrollHeight;
		}
	}, [transcript])

	useEffect(() => {
		const createMicrophone = () => {
			return {
				async requestPermission() {
					streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
				},
				async startRecording(onAudioCallback: (audioData: Uint8Array) => void) {
					if (!streamRef.current) streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
					audioContextRef.current = new AudioContext({
						sampleRate: 16_000,
						latencyHint: 'balanced'
					});
					sourceRef.current = audioContextRef.current.createMediaStreamSource(streamRef.current);
					const audioContext = audioContextRef.current;
					
					await audioContext.audioWorklet.addModule('audio-processor.worker.js');
					audioWorkletNodeRef.current = new AudioWorkletNode(audioContext, 'audio-processor');
					
					const source = sourceRef.current;
					const audioWorkletNode = audioWorkletNodeRef.current;
					const audioBufferQueue = audioBufferQueueRef.current;
					
					source.connect(audioWorkletNode);
					audioWorkletNode.connect(audioContext.destination);
					audioWorkletNode.port.onmessage = (event) => {
						const currentBuffer = new Int16Array(event.data.audio_data);
						audioBufferQueueRef.current = mergeBuffers(
							audioBufferQueue,
							currentBuffer
						);

						const bufferDuration =
							(audioBufferQueue.length / audioContext.sampleRate) * 1000;

						// wait until we have 100ms of audio data
						if (bufferDuration >= 100) {
							const totalSamples = Math.floor(audioContext.sampleRate * 0.1);

							const finalBuffer = new Uint8Array(
								audioBufferQueue.subarray(0, totalSamples).buffer
							);

							audioBufferQueueRef.current = audioBufferQueue.subarray(totalSamples)
							if (onAudioCallback) onAudioCallback(finalBuffer);
						}
					}
				},
				stopRecording() {
					streamRef.current?.getTracks().forEach((track) => track.stop());
					void audioContextRef.current?.close();
					audioBufferQueueRef.current = new Int16Array(0);
				}
			}
		};

		setMicrophoneStore(createMicrophone())

		return () => {
			microphoneStore?.stopRecording();
		};
	}, []);

	// Merge two buffers
	function mergeBuffers(buf1: Int16Array, buf2: Int16Array): Int16Array {
		const result = new Int16Array(buf1.length + buf2.length);
		result.set(buf1);
		result.set(buf2, buf1.length);
		return result;
	}

	const handleToggleRecording = async () => {
		try {
			if (isRecording) {
				await rt?.close(false);
				setRT(null);
				microphoneStore?.stopRecording();
			} else {
				await microphoneStore?.requestPermission();

				const response = await axiosNextAuth.get<{token: string; error?: string}>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/feature/s2t/token`);
				const data = response.data;

				if (response.status !== 200) {
					ShowError(data.error ?? "Error getting token");
					return;
				}

				const rt = new assemblyai.RealtimeService({ token: data.token });
				setRT(rt);

				const texts: Record<string, string> = {};
				rt.on('transcript', (message) => {
					texts[message.audio_start] = message.text;
					const sortedKeys = Object.keys(texts).sort((a, b) => Number(a) - Number(b));
					const newTranscript = sortedKeys.map((key) => texts[key]).join(' ');
					setCurrentTranscript({
						audioSrc: '',
						text: newTranscript,
						type: 'recorded',
						transcript: [],
						status: 'processing',
					});
				});

				rt.on('error', async (error) => {
					console.error(error);
					await rt.close();
				});

				rt.on('close', () => {
					setRT(null);
				});

				await rt.connect();

				await microphoneStore?.startRecording((audioData) => {
					rt.sendAudio(audioData);
				});
			}

			setIsRecording(!isRecording);
		} catch (error) {
			console.error("Lỗi trong quá trình ghi âm:", error);
			ShowError("Lỗi trong quá trình ghi âm");
		}
	};

	return (
		<div>
			<h1>
				{isRecording ? 'Click Stop to end recording!' : 'Click Start to begin recording!'}
			</h1>
			<button onClick={handleToggleRecording}>
				{isRecording ? 'Stop' : 'Record'}
			</button>
			<p ref={messageRef} style={{ display: transcript ? 'block' : 'none' }}>
				{currentTranscript?.text ?? ''}
			</p>
		</div>
	);
}

export default VoiceRecognition;