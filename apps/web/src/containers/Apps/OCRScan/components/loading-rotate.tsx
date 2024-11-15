import React from 'react';
import { loadingAtom } from '@/containers/Apps/OCRScan/states/playground';
import { useAtom } from 'jotai';
import RotateLoader from '@ui/resource-ui/Loader/spinner.tsx';
import { useUpload } from '@/hooks/ocr/useUpload.ts';

function LoadingRotate(): JSX.Element {
	const {uploading} = useUpload()
	return (
		uploading ? (
			<div className="absolute z-[60] top-0 w-full h-full flex items-center justify-center bg-zinc-900 bg-opacity-20">
				<RotateLoader />
			</div>
		) : <></>
	);
}

export default LoadingRotate;