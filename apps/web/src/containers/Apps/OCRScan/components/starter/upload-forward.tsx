"use client";

import React, { forwardRef } from 'react';
import { useAtom } from 'jotai/index';
import {
	selectedOcrLang,
	selectedSourceLang,
	starterAssetsPreUpload,
	starterModalOpen,
} from '@/containers/Apps/OCRScan/states/starter.ts';
import { IoArrowForward } from 'react-icons/io5';
import type { ButtonProps } from '@nextui-org/react';
import { Button } from '@nextui-org/react';
import { useUpload } from '@/hooks/ocr/useUpload.ts';
import { useToast } from '@/hooks/useToast.ts';

const UploadForward = forwardRef<HTMLButtonElement, ButtonProps & {
	children?: React.ReactNode
	uploadAction?: (file: File, source: string, target: string) => Promise<void>
}>((props, ref) => {
	const {children, uploadAction, ...otherProps} = props;

	const {error} = useToast();
	const {uploadImage} = useUpload();
	const [sourceLang] = useAtom(selectedSourceLang);
	const [OCRLang] = useAtom(selectedOcrLang);
	const [file, setFile] = useAtom(starterAssetsPreUpload);
	const [, setOpenModal] = useAtom(starterModalOpen);

	const handleUpload = () => {
		if (file) {
			setOpenModal(true);
			if (uploadAction) {
				void uploadAction(file, Array.from(sourceLang)[0] as string, Array.from(OCRLang)[0] as string);
				return;
			} 
				void uploadImage(file, Array.from(sourceLang)[0] as string, Array.from(OCRLang)[0] as string);
				return;
		}
		error('Please upload an image of PDF file');
	};

	return (
		<Button
			className="w-10 h-10 px-0 min-w-fit bg-transparent hover:bg-zinc-800 text-zinc-400 dark:text-zinc-900 hover:text-zinc-100 transition-all"
			onClick={handleUpload}
			ref={ref}
			{...otherProps}
		>
			{children || <IoArrowForward className="w-6 h-6" />}
		</Button>
	);
});
UploadForward.displayName = 'UploadForward';

export default UploadForward;