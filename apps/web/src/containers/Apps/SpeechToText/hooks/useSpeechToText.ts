import { useCallback, useEffect, useRef, useState } from 'react';
import type { AxiosInstance, CancelTokenSource } from 'axios';
import axios from 'axios';
import axiosNextAuth from '@/libs/axios/v1/axiosWithAuth';
import type { IS2tDTO} from '@/containers/Apps/SpeechToText/states/transcript';
import { transcript, transcriptAudioList } from '@/containers/Apps/SpeechToText/states/transcript';
import { useAtom } from 'jotai';
import { APIs } from '@/global/contants/route';

interface UploadResponse {
	url: string;
}

export const useAudioUpload = ({ url }: { url: string }) => {
	const [isUploading, setIsUploading] = useState(false);
	const [progress, setProgress] = useState(0);
	const [error, setError] = useState<string | null>(null);
	const [_, setCurrentS2TData] = useAtom(transcript);
	// Sử dụng CancelTokenSource để hủy upload nếu cần
	const [cancelTokenSource, setCancelTokenSource] = useState<CancelTokenSource | null>(null);

	const uploadAudio = useCallback(async (audioFile: File | Blob) => {
		setIsUploading(true);
		setProgress(0);
		setError(null);

		try {
			const formData = new FormData();
			formData.append('file', audioFile);

			// Create CancelTokenSource
			const newCancelTokenSource = axios.CancelToken.source();
			setCancelTokenSource(newCancelTokenSource);

			const response = await axiosNextAuth.post<{
				audio_file: string;
				audit: IS2tDTO,
				id: string,
				file_name: string,
			}>(url, formData, {
				onUploadProgress: (progressEvent) => {
					const percentCompleted = Math.round(
						(progressEvent.loaded * 100) / (progressEvent?.total || 1),
					);
					setProgress(percentCompleted);
				},
				cancelToken: newCancelTokenSource.token, //  set CancelToken
			});
			const responseData = response.data;
			console.log('Upload successful:', response.data);
			setCurrentS2TData(responseData.audit);
			return responseData;
			// handle response

		} catch (err) {
			if (axios.isCancel(err)) {
				console.log('Upload canceled');
			} else {
				setError('Upload failed');
				console.error(err);
			}
		} finally {
			setIsUploading(false);
			setCancelTokenSource(null);
		}
	}, []);

	const cancelUpload = useCallback(() => {
		if (cancelTokenSource) {
			cancelTokenSource.cancel();
		}
	}, [cancelTokenSource]);

	return { isUploading, progress, error, uploadAudio, cancelUpload };
};

interface UseAudioStreamOptions {
	url: string;
	onStart?: () => void;
	onStop?: () => void;
	onError?: (error: any) => void;
}

export const useAudioStream = ({ url, onStart, onError, onStop }: UseAudioStreamOptions): {
	startStream: () => void;
	stopStream: () => void
} => {
	const [isRecording, setIsRecording] = useState(false);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const axiosInstanceRef = useRef<AxiosInstance>(axios.create());

	useEffect(() => {
		// stop stream when unmount
		return () => {
			stopStream();
		};
	}, []);

	const startStream = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

			const mediaRecorder = new MediaRecorder(stream);
			mediaRecorderRef.current = mediaRecorder;

			mediaRecorder.ondataavailable = (event) => {
				if (event.data.size > 0) {
					sendAudioChunk(event.data);
				}
			};

			mediaRecorder.onstop = () => {
				setIsRecording(false);
				onStop && onStop();
			};

			mediaRecorder.start(1000); // send audio chunk every 1s
			setIsRecording(true);
			onStart && onStart();
		} catch (error) {
			console.error('Lỗi khi stream audio:', error);
			onError && onError(error);
		}
	};

	const sendAudioChunk = async (chunk: Blob) => {
		try {
			const formData = new FormData();
			formData.append('audioChunk', chunk, 'audio.webm'); // Adjust content type if needed
			await axiosInstanceRef.current.post(url, formData);
		} catch (error) {
			console.error('Lỗi khi gửi audio chunk:', error);
			onError && onError(error);
		}
	};

	const stopStream = () => {
		if (mediaRecorderRef.current && isRecording) {
			mediaRecorderRef.current.stop();
		}
	};

	return { startStream, stopStream };
};

export const useTranscript = () => {
	const [transcriptList, setTranscriptList] = useAtom<IS2tDTO[]>(transcriptAudioList);
	const getTranscript = async (transcriptId: string) => {
		const url = `${APIs.speechToText.endpoint}${APIs.speechToText.getTranscript}?id=${transcriptId}`;
		const response = await axiosNextAuth.get<IS2tDTO>(url);
		return response.data;
	};
	const getTranscriptList = async () => {
		const url = `${APIs.speechToText.endpoint}${APIs.speechToText.getTranscriptList}`;
		const response = await axiosNextAuth.get<{ audit_list: IS2tDTO[] }>(url);
		if (response.data.audit_list) {
			setTranscriptList(response.data.audit_list);
		}
		return response.data.audit_list;
	};

	return { getTranscript, getTranscriptList };
};