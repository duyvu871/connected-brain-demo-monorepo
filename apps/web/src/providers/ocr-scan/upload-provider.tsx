'use client';
import React, { createContext, useCallback, useEffect, useState } from 'react';
import axios from '@/libs/axios/v1/axios.ts';
import useImageFromFile from '@/hooks/client/useImagePreview.ts';
import { currentTesseractPage, starterAssetsPreUpload } from '@/containers/Apps/OCRScan/states/starter';
import { useAtom } from 'jotai';
import { currentImageExtracted, pageStore, pdfPageStore } from '@/containers/Apps/OCRScan/states/playground.ts';
import { useSession } from 'next-auth/react';
import { useAuth } from '@/hooks/useAuth.ts';
import type { UploadPDFResponse } from 'types/apps/ocr/api.type.ts';
import { useToast } from '@/hooks/useToast';
import { useAtomCallback } from 'jotai/utils';
// import path from 'node:path';

export interface UploadContextType {
	uploading: boolean;
	uploadedImage: string | null;
	uploadedImageUrl: string | null;
	uploadProgress: number;
	pdfUploadStore: UploadPDFResponse | null;
	setUploadedImageUrl: (image: string) => void;
	extractedText: string | null;
	uploadImage: (file: File, source: string, target: string) => Promise<void>;
	resetUpload: () => void;
	uploadImageAndStoreByIndex: (file: File, source: string, target: string, index: number) => Promise<void>;
	getExtractFromPDFPage: (page: number) => Promise<void>;
	uploadPDF: (file: File, source: string, target: string) => Promise<void>;
	// setUploading: (uploading: boolean) => void;
};

export const UploadContext = createContext<UploadContextType>({
	uploading: false,
	uploadedImage: null,
	uploadedImageUrl: null,
	uploadProgress: 0,
	pdfUploadStore: null,
	setUploadedImageUrl: () => {},
	extractedText: null,
	uploadImage: async () => {},
	resetUpload: () => {},
	uploadImageAndStoreByIndex: async () => {},
	getExtractFromPDFPage: async () => {},
	uploadPDF: async () => {},
	// setUploading: () => {},
});

export const UploadProvider = ({ children }: {children: React.ReactNode}) => {
	const {resolveImageUrl} = useImageFromFile();
	const {user} = useAuth();
	const clientId = user?.id.toString() ?? '';
	const {error: ToastError, success: ToastSuccess} = useToast();
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

	const [pdfUploadStore, setPdfUploadStore] = useAtom(pdfPageStore);
	const [, setImageExtracted] = useAtom(currentImageExtracted);

	// ocr states
	const [, setCurrentPage] = useAtom(currentTesseractPage);
	const [file, ] = useAtom(starterAssetsPreUpload);

	const handleUploadProgress = (progressEvent: any) => {
		if (progressEvent.lengthComputable && progressEvent.total) {
			setUploadProgress(Math.round(((progressEvent.loaded * 100)/(progressEvent.total))));
		}
	}

	const handleUploadSuccess = (response: any, type: 'image'|'pdf') => {
		if (type === 'image') {
			setCurrentPage(response);
			setExtractedText(response.text);
		} else {
			setPdfUploadStore(response);
		}
	}

	const uploadImage = async (file: File, source: string, target: string) => {
		resetUpload();
		setUploading(true);
		setImageLoading(true);
		try {
			setUploadedImageUrl(await resolveImageUrl(file) as string);
			setUploadStatus('uploading');
			const response = await axios.v1.ocr.extractWithoutAuth(file, {
				params: { source, target, clientId },
				onUploadProgress: handleUploadProgress
			});

			if (response) {
				setUploadStatus('done');
				handleUploadSuccess(response, 'image');
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

	const uploadPDF = async (file: File, source: string, target: string) => {
		resetUpload();
		setUploading(true);
		setImageLoading(true);
		try {
			// setUploadedImageUrl(await resolveImageUrl(file) as string);
			setUploadStatus('uploading');
			const response = await axios.v1.ocr.upload('PDF', file, {
				params: { source, target, clientId },
				onUploadProgress: handleUploadProgress
			});
			console.log(response)
			setPdfUploadStore(response as UploadPDFResponse);
			if (response) {
				setUploadStatus('done');
				// handleUploadSuccess(response as UploadPDFResponse, 'pdf');
				ToastSuccess('PDF uploaded successfully');
				setUploadedImage(file.name);
			} else {
				setUploadStatus('error');
				setUploadError("An error occurred while uploading the PDF");
			}
		} catch (error) {
			setUploadError('An error occurred while uploading the PDF');
		}
		setUploading(false);
		setImageLoading(false);
	}

	const getExtractFromPDFPage = useAtomCallback(async (get, set, page: number) => {
		try {
			const pdfUploadStore = get(pdfPageStore);
			console.log('getExtractFromPDFPage', page, pdfUploadStore);
			if (!pdfUploadStore) return;
			setImageExtracted(
				[
					process.env.NEXT_PUBLIC_API_BASE_URL,
					pdfUploadStore.path,
					`output-${(page + 1).toString().padStart(3, '0')}.png`
				].join('/')
			);

			const response = await axios.v1.ocr.getExtractFromPDFPage(
				clientId,
				pdfUploadStore.id,
				page + 1,
			);
			if (response) {
				setCurrentPage(response);
				setExtractedText(response.text);
			} else {
				setOcrError('An error occurred while extracting text from the PDF');
			}
		} catch (error) {
			setOcrError('An error occurred while extracting text from the PDF');
		}
	})

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

	useEffect(() => {
		if (pdfUploadStore) {
			void getExtractFromPDFPage(0);
		}
	}, [pdfUploadStore]);

	useEffect(() => {
		(async () => {
			if (file) setUploadedImageUrl(await resolveImageUrl(file) as string);
		})()
	}, [file]);

	return (
		<UploadContext.Provider value={{
			uploading,
			uploadedImage,
			uploadedImageUrl,
			pdfUploadStore,
			uploadProgress,
			setUploadedImageUrl,
			uploadImageAndStoreByIndex,
			extractedText,
			uploadImage,
			resetUpload,
			getExtractFromPDFPage,
			uploadPDF
		}}>
			{children}
		</UploadContext.Provider>
	);
};