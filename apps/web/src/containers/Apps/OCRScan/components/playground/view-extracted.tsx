import React from 'react';
import { Box } from '@mantine/core';
import VisualTextSegment from '@/containers/Apps/OCRScan/components/visual-text-segment.tsx';
import { useAtom } from 'jotai/index';
import { isPDFAtom } from '@/containers/Apps/OCRScan/states/playground.ts';
import { useUpload } from '@/hooks/ocr/useUpload';
import dynamic from 'next/dynamic';

const PDFViewer = dynamic(() => import('@/containers/Apps/OCRScan/components/playground/pdf-result.tsx'), { ssr: false });

function ViewExtracted() {
	const [isPDF] = useAtom(isPDFAtom);

	const {uploadedImageUrl} = useUpload();
	return (
		<>
			{isPDF
				? <PDFViewer />
				: <Box className="relative overflow-auto w-72 h-80 sm:w-[350px] sm:h-[450px]">
					<VisualTextSegment image={uploadedImageUrl || "/placeholder.svg"} imageType="url" />
				</Box>
			}
		</>
	);
}

export default ViewExtracted;