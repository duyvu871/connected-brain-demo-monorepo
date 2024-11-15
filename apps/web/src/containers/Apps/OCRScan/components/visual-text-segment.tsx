import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Box } from '@mantine/core';
import Image from 'next/image';
import { file } from '@repo/utils';
import { useAtom } from 'jotai/index';
import { currentTesseractPage } from '@/containers/Apps/OCRScan/states/starter.ts';
import LoadingRotate from '@/containers/Apps/OCRScan/components/loading-rotate.tsx';

interface VisualTextSegmentProps {
	image: string | Buffer | ArrayBuffer | DataView;
	imageType: "url" | "buffer" | "arraybuffer" | "dataview";
};

function VisualTextSegment({image, imageType}: VisualTextSegmentProps) {
	const [currentPage] = useAtom(currentTesseractPage);
	const textureWrapRef = useRef<HTMLCanvasElement>(null);
	const imageSourceRef = useRef<HTMLImageElement>(null);

	const blobURL = useMemo(() => {
		return (file.convertToBlobURL(image, imageType));
	}, [image, imageType]);

	const clearTexture = useCallback(() => {
		const textureCanvas = textureWrapRef?.current?.getContext('2d');
		if (!textureCanvas) return;
		if (!textureWrapRef.current) return;
		console.log(textureWrapRef.current.width, textureWrapRef.current.height);
		textureCanvas.clearRect(0, 0, textureWrapRef.current.width, textureWrapRef.current.height);
	}, []);

	const placementTexture = useCallback(() => {
		if (!currentPage) return;
		const textureCanvas = textureWrapRef?.current?.getContext('2d');
		const imageSource = imageSourceRef?.current;
		if (!textureCanvas || !imageSource) return;
		if (!currentPage.words) return;
		if (!textureWrapRef.current) return;
		textureWrapRef.current.width = imageSource.naturalWidth;
		textureWrapRef.current.height = imageSource.naturalHeight;
		currentPage.words.forEach((w) => {
			const b = w.bbox;
			// @ts-expect-error may this property has been added
			textureCanvas.strokeWidth = 2;
			textureCanvas.lineWidth = 2;
			textureCanvas.strokeStyle = 'red';
			textureCanvas.strokeRect(b.x0, b.y0, b.x1-b.x0, b.y1-b.y0);
			textureCanvas.beginPath();
			textureCanvas.moveTo(w.baseline.x0, w.baseline.y0);
			textureCanvas.lineTo(w.baseline.x1, w.baseline.y1);
			textureCanvas.strokeStyle = 'green';
			textureCanvas.stroke();
		})
	}, [currentPage]);

	useEffect(() => {
		placementTexture();
		return () => {
			URL.revokeObjectURL(blobURL);
		}
	}, [blobURL, clearTexture, currentPage, placementTexture]);

	useEffect(() => {
		clearTexture();
	}, [blobURL]);

	return (
		<Box className="flex-1 relative overflow-hidden">
			<canvas className="absolute max-w-full box-border" ref={textureWrapRef}/>
			<Image
				alt="image source"
				className="max-w-full box-border rounded-lg"
				height={1100}
				loading='lazy'
				onLoad={() => {
					clearTexture();
				}}
				ref={imageSourceRef}
				src={blobURL}
				// unoptimized
				width={850}
			/>
			<LoadingRotate />
		</Box>
	);
}

export default VisualTextSegment;