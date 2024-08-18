// import speech from '@google-cloud/speech';
// import { useCallback, useEffect, useRef, useState } from 'react';
//
// const client = new speech.SpeechClient({
// 	keyFilename: './client_secret_97384735474-qi22mvd4sgpmhvp8lg5ecdl9381idu6g.apps.googleusercontent.com.json',
// });
//
// interface UseSpeechToTextOptions {
// 	languageCode?: string;
// 	sampleRateHertz?: number;
// 	encoding?: any;
// }
//
// const useSpeechToText = ({
// 													 languageCode = 'en-US',
// 													 sampleRateHertz = 16000,
// 													 encoding = 'LINEAR16',
// 												 }: UseSpeechToTextOptions = {}) => {
// 	const [transcript, setTranscript] = useState('');
// 	const [isRecording, setIsRecording] = useState(false);
// 	const [isTranscribing, setIsTranscribing] = useState(false);
// 	const [error, setError] = useState<Error | null>(null);
// 	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//
// 	const startRecording = useCallback(async () => {
// 		try {
// 			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
// 			const audioContext = new AudioContext({ sampleRate: sampleRateHertz });
// 			const source = audioContext.createMediaStreamSource(stream);
//
// 			const recognizeStream = client.streamingRecognize({
// 				config: {
// 					encoding,
// 					sampleRateHertz,
// 					languageCode,
// 				},
// 				interimResults: true,
// 			});
//
// 			const pump = async (reader: ReadableStreamDefaultReader<any>) => {
// 				const { done, value } = await reader.read();
// 				if (done) {
// 					recognizeStream.end();
// 					setIsTranscribing(false);
// 					return;
// 				}
// 				recognizeStream.write(value);
// 				pump(reader);
// 			};
//
// 			source.connect(audioContext.destination);
// 			mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
// 			mediaRecorderRef.current.ondataavailable = (event) => {
// 				const audioBlob = event.data;
// 				const reader = audioBlob.stream().getReader();
// 				pump(reader);
// 			};
//
// 			setIsRecording(true);
// 			setIsTranscribing(true);
// 			mediaRecorderRef.current.start();
// 		} catch (err) {
// 			setError(err as Error);
// 		}
// 	}, [encoding, languageCode, sampleRateHertz]);
//
// 	const stopRecording = useCallback(() => {
// 		if (isRecording) {
// 			const tracks = (mediaRecorderRef.current as any).stream.getTracks();
// 			tracks.forEach((track: any) => track.stop());
// 			(mediaRecorderRef.current as any).stop();
// 			setIsRecording(false);
// 		}
// 	}, [isRecording]);
//
// 	useEffect(() => {
// 		const updateTranscript = (data: any) => {
// 			const newTranscript =
// 				data.results[0]?.alternatives?.[0]?.transcript || '';
// 			setTranscript((prevTranscript) => prevTranscript + newTranscript);
// 		};
//
// 		const handleError = (err: Error) => {
// 			setError(err);
// 			setIsRecording(false);
// 			setIsTranscribing(false);
// 		};
//
// 		const recognizeStream = client
// 			.streamingRecognize({
// 				config: {
// 					encoding,
// 					sampleRateHertz,
// 					languageCode,
// 				},
// 				interimResults: true,
// 			})
// 			.on('error', handleError)
// 			.on('data', updateTranscript);
//
// 		return () => {
// 			recognizeStream.destroy();
// 		};
// 	}, [encoding, languageCode, sampleRateHertz]);
//
// 	return { transcript, isRecording, isTranscribing, error, startRecording, stopRecording };
// };
//
// export default useSpeechToText;