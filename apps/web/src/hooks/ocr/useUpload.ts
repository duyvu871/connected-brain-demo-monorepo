import { useContext } from 'react';
import { UploadContext } from '@/providers/ocr-scan/upload-provider';

export const useUpload = () => {
	const context = useContext(UploadContext);
	if (!context) {
		throw new Error('useUpload must be used within a UploadContext');
	}
	return context;
};