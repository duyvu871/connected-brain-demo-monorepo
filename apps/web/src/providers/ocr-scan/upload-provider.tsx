'use client';
import React, { createContext, useState } from 'react';
import axios from '@/libs/axios/v1/axios.ts';
import useImageFromFile from '@/hooks/client/useImagePreview.ts';
import { currentTesseractPage } from '@/containers/Apps/OCRScan/states/starter';
import { useAtom } from 'jotai';

export interface UploadContextType {
	uploading: boolean;
	uploadedImage: string | null;
	uploadedImageUrl: string | null;
	setUploadedImageUrl: (image: string) => void;
	extractedText: string | null;
	uploadImage: (file: File, source: string, target: string) => void;
	resetUpload: () => void;
	// setUploading: (uploading: boolean) => void;
};

export const UploadContext = createContext<UploadContextType>({
	uploading: false,
	uploadedImage: null,
	uploadedImageUrl: null,
	setUploadedImageUrl: () => {},
	extractedText: null,
	uploadImage: () => {},
	resetUpload: () => {},
	// setUploading: () => {},
});

export const UploadProvider = ({ children }: {children: React.ReactNode}) => {
	const {resolveImageUrl} = useImageFromFile();
	// upload info
	const [uploading, setUploading] = useState(false);
	const [uploadedImage, setUploadedImage] = useState<string | null>(null);
	const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
	const [imageLoading, setImageLoading] = useState(false);
	const [uploadError, setUploadError] = useState<string | null>(null);
	// ocr result
	const [extractedText, setExtractedText] = useState<string | null>(null);
	const [ocrLoading, setOcrLoading] = useState(false);
	const [ocrError, setOcrError] = useState<string | null>(null);

	// ocr states
	const [, setCurrentPage] = useAtom(currentTesseractPage);
	const uploadImage = async (file: File, source: string, target: string) => {
		resetUpload();
		setUploading(true);
		setImageLoading(true);
		try {
			setUploadedImageUrl(await resolveImageUrl(file) as string);

			const response = await axios.v1.ocr.extractWithoutAuth(file, {
				params: { source, target }
			});

			if (response) {
				setCurrentPage(response);
				setExtractedText(response.text);
				setUploadedImage(file.name);
			} else {
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
			setUploadedImageUrl,
			extractedText,
			uploadImage,
			resetUpload
		}}>
			{children}
		</UploadContext.Provider>
	);
};