import UploadForward from '@/containers/Apps/OCRScan/components/starter/upload-forward.tsx';
import React from 'react';
import { useAtom } from 'jotai/index';
import { isPDFAtom } from '@/containers/Apps/OCRScan/states/playground.ts';
import api from '@/libs/axios/v1/axios.ts';
import { starterAssetsPreUpload } from '@/containers/Apps/OCRScan/states/starter.ts';
import { useAuth } from '@/hooks/useAuth.ts';
import { IoIosReturnLeft } from 'react-icons/io';
import { useUpload } from '@/hooks/ocr/useUpload';

export default function UploadButton() {
	const [isPdf] = useAtom(isPDFAtom);
	const {uploadImage, uploadPDF} = useUpload();

	const uploadAction = async (file: File, source: string, target: string) => {
		if (isPdf) {
			await uploadPDF(file, source, target);
			return;
		}
		await uploadImage(file, source, target);
	}
	return (
		<UploadForward
			className="w-full bg-zinc-800 text-zinc-100"
			uploadAction={uploadAction}
		>
			Process <IoIosReturnLeft size={24} />
		</UploadForward>
	)
}