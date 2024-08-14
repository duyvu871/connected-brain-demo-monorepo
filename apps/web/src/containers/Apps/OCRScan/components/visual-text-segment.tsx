import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Box } from '@mantine/core';
import Image from 'next/image';
import { file } from '@repo/utils';
import { useAtom } from 'jotai/index';
import { currentTesseractPage } from '@/containers/Apps/OCRScan/states/starter.ts';

interface VisualTextSegmentProps {
	image: string | Buffer | ArrayBuffer | DataView;
	imageType: "url" | "buffer" | "arraybuffer" | "dataview";
};

function VisualTextSegment({image, imageType}: VisualTextSegmentProps) {
	const [currentPage] = useAtom(currentTesseractPage);
	const textureWrapRef = useRef<HTMLCanvasElement>(null);
	const imageSourceRef = useRef<HTMLImageElement>(null);

	const blobURL = useMemo(() => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		return (file.convertToBlobURL(image, imageType));
	}, [image, imageType]);

	const placementTexture = useCallback(() => {
		if (!currentPage) return;
		const textureCanvas = textureWrapRef?.current?.getContext('2d');
		const imageSource = imageSourceRef?.current;
		if (!textureCanvas || !imageSource) return;
		textureCanvas.canvas.width = imageSource.width;
		textureCanvas.canvas.height = imageSource.height;
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
		console.log(currentPage);
		placementTexture();
		return () => {
			URL.revokeObjectURL(blobURL);
		}
	}, [blobURL, placementTexture]);

	return (
		<Box className="flex-1 relative overflow-hidden">
			{/*<canvas className="absolute max-w-full box-border border p-5 border-solid" ref={textureWrapRef}/>*/}
			<Image alt="image source" className="max-w-full box-border border p-5 border-solid" height={700} ref={imageSourceRef} src={blobURL} width={500}/>
		</Box>
	);
}

export default VisualTextSegment;