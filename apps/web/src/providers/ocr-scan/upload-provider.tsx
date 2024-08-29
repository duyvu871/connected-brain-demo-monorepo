'use client';
import React, { createContext, useState } from 'react';
import axios from '@/libs/axios/v1/axios.ts';
import useImageFromFile from '@/hooks/client/useImagePreview.ts';
import { currentTesseractPage } from '@/containers/Apps/OCRScan/states/starter';
import { useAtom } from 'jotai';
import { pageStore } from '@/containers/Apps/OCRScan/states/playground.ts';
import { useSession } from 'next-auth/react';
import { useAuth } from '@/hooks/useAuth.ts';

export interface UploadContextType {
	uploading: boolean;
	uploadedImage: string | null;
	uploadedImageUrl: string | null;
	uploadProgress: number;
	setUploadedImageUrl: (image: string) => void;
	extractedText: string | null;
	uploadImage: (file: File, source: string, target: string) => Promise<void>;
	resetUpload: () => void;
	uploadImageAndStoreByIndex: (file: File, source: string, target: string, index: number) => Promise<void>;
	// setUploading: (uploading: boolean) => void;
};

export const UploadContext = createContext<UploadContextType>({
	uploading: false,
	uploadedImage: null,
	uploadedImageUrl: null,
	uploadProgress: 0,
	setUploadedImageUrl: () => {},
	extractedText: null,
	uploadImage: async () => {},
	resetUpload: () => {},
	uploadImageAndStoreByIndex: async () => {},
	// setUploading: () => {},
});

export const UploadProvider = ({ children }: {children: React.ReactNode}) => {
	const {resolveImageUrl} = useImageFromFile();
	const {user} = useAuth();
	const clientId = user?.id.toString() ?? '';
	// upload info
	const [uploading, setUploading] = useState(false);
	const [uploadedImage, setUploadedImage] = useState<string | null>(null);
	const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
	const [imageLoading, setImageLoading] = useState(false);
	const [uploadError, setUploadError] = useState<string | null>(null);
	const [uploadProgress, setUploadProgress] = useState<number>(0);
	const [uploadStatus, setUploadStatus] = useState<"uploading"|"done"|"error"|null>(null);
	// ocr result
	const [extractedText, setExtractedText] = useState<string | null>(null);
	const [ocrLoading, setOcrLoading] = useState(false);
	const [ocrError, setOcrError] = useState<string | null>(null);
	const [tesseractPageStore, setTesseractPageStore] = useAtom(pageStore);
	// ocr states
	const [, setCurrentPage] = useAtom(currentTesseractPage);
	const uploadImage = async (file: File, source: string, target: string) => {
		resetUpload();
		setUploading(true);
		setImageLoading(true);
		try {
			setUploadedImageUrl(await resolveImageUrl(file) as string);
			setUploadStatus('uploading');
			const response = await axios.v1.ocr.extractWithoutAuth(file, {
				params: { source, target, clientId },
				onUploadProgress: (progressEvent) => {
					if (progressEvent.lengthComputable && progressEvent.total) {
						setUploadProgress(Math.round(((progressEvent.loaded * 100)/(progressEvent.total))));
					}
				}
			});

			if (response) {
				setUploadStatus('done');
				setCurrentPage(response);
				setExtractedText(response.text);
				setUploadedImage(file.name);
			} else {
				setUploadStatus('error');
				setUploadError("An error occurred while uploading the image");
			}
		} catch (error) {
			setUploadError('An error occurred while uploading the image');
		}
		setUploading(false);
		setImageLoading(false);
	}
	const uploadImageAndStoreByIndex = async (file: File, source: string, target: string, index: number) => {
		if (index < 0) return;
		if (tesseractPageStore[index]) {
			setCurrentPage(tesseractPageStore[index]);
			return;
		}
		resetUpload();
		setUploading(true);
		setImageLoading(true);
		try {
			setUploadedImageUrl(await resolveImageUrl(file) as string);
			setUploadStatus('uploading');
			const response = await axios.v1.ocr.extractWithoutAuth(file, {
				params: { source, target, clientId },
				onUploadProgress: (progressEvent) => {
					if (progressEvent.lengthComputable && progressEvent.total) {
						setUploadProgress(Math.round(((progressEvent.loaded * 100)/(progressEvent.total))));
					}
				}
			});

			if (response) {
				setUploadStatus('done');
				setCurrentPage(response);
				console.log(index);
				setTesseractPageStore((prev) => {
					const newStore = [...prev];
					newStore[index] = response;
					return newStore;
				});
				setExtractedText(response.text);
				setUploadedImage(file.name);
			} else {
				setUploadStatus('error');
				setUploadError("An error occurred while uploading the image");
			}
		} catch (error) {
			setUploadError('An error occurred while uploading the image');
		}
		setUploading(false);
		setImageLoading(false);
	}
	const extractText = async () => {
		setOcrError(null);
		setOcrLoading(true);
		try {
			const response = await fetch('/api/ocr', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					image: uploadedImage,
				}),
			});
			const data = await response.json();
			if (response.ok) {
				setExtractedText(data.text);
			} else {
				setOcrError(data.message);
			}
		} catch (error) {
			setOcrError('An error occurred while extracting text from the image');
		}
		setOcrLoading(false);
	}

	const resetUpload = () => {
		setUploadStatus(null);
		setUploadProgress(0);
		setUploading(false);
		setUploadedImage(null);
		setUploadedImageUrl(null);
		setExtractedText(null);
		setUploadError(null);
		setOcrError(null);
	}

	return (
		<UploadContext.Provider value={{
			uploading,
			uploadedImage,
			uploadedImageUrl,
			uploadProgress,
			setUploadedImageUrl,
			uploadImageAndStoreByIndex,
			extractedText,
			uploadImage,
			resetUpload
		}}>
			{children}
		</UploadContext.Provider>
	);
};