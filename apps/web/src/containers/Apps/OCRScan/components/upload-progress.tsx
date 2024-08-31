
import { useUpload } from '@/hooks/ocr/useUpload.ts';
import { Progress } from '@nextui-org/react';

export default function UploadProgress() {
	const {uploadProgress, uploading} = useUpload();
	return (
		uploading && <Progress
			aria-label="Uploading"
			className="max-w-md"
			color="default"
			isIndeterminate={uploadProgress === 0 || uploadProgress === 100}
			size="sm"
			value={uploadProgress}
		/>
	)
}