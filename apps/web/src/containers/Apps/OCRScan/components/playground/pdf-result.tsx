import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import  { getDocument } from 'pdfjs-dist';
import { pdfjs } from 'react-pdf';
import { Box } from '@mantine/core';
import { useAtom } from 'jotai/index';
import {
	starterAssetsPreUpload,
} from '@/containers/Apps/OCRScan/states/starter.ts';
import { currentImageExtracted, paginationState, pdfPageStore } from '@/containers/Apps/OCRScan/states/playground.ts';
import Pagination from '@/containers/Apps/OCRScan/components/playground/pagination.tsx';
import { useUpload } from '@/hooks/ocr/useUpload.ts';
import VisualTextSegment from '@/containers/Apps/OCRScan/components/visual-text-segment.tsx';

pdfjs.GlobalWorkerOptions.workerSrc = '/workers/pdf.worker.mjs'//'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.worker.mjs'//new URL('pdfjs-dist/legacy/build/pdf.worker.min.mjs', import.meta.url).toString()

const PdfViewer: React.FC = () => {
	const {getExtractFromPDFPage} = useUpload();
	const [file] = useAtom(starterAssetsPreUpload);
	const [state, setPaginationState] = useAtom(paginationState);
	const [pdfData, setPdfData] = useState<PDFDocumentProxy | null>(null);
	const [, setCurrentPage] = useState(1);
	const wrapperRef = useRef<HTMLDivElement>(null);
	const [imageExtracted,] = useAtom(currentImageExtracted);

	useEffect(() => {
		if (file) {
			const fileReader = new FileReader();
			fileReader.onload = async (e) => {
				const typedArray = new Uint8Array(e.target?.result as ArrayBuffer); // Ép kiểu
				try {
					const pdf = getDocument({ data: typedArray }).promise;
					const awaitedPdf = await pdf;

					setPdfData(awaitedPdf);
					setPaginationState({
						currentPage: 1,
						pageSize: 1,
						siblingCount: 1,
						totalCount: awaitedPdf.numPages,
					});
					// void renderPage(pdf, 1);
				} catch (error) {
					console.error('Lỗi khi tải PDF:', error);
				}
			};
			fileReader.readAsArrayBuffer(file);
		}
	}, [file, setPaginationState]);

	const renderPDF = useCallback((page: number) => {
		if (!file) return;
		void getExtractFromPDFPage(page - 1);
	}, [file]);
	
	const handlePageChange = useCallback((newPage: number) => {
		if (pdfData) {
			if (newPage >= 1 && newPage <= pdfData.numPages) {
				setCurrentPage(newPage);
				// void renderPage(pdfData, newPage);
				renderPDF(newPage);
			}
		}
	}, [pdfData, renderPDF]);

	useEffect(() => {
		handlePageChange(state.currentPage);
	}, [handlePageChange, state]);

	return (
		<div className="w-fit flex flex-col justify-center items-center gap-5">
			{pdfData ? <>
					<Box className="relative overflow-y-auto sm:h-[450px] sm:w-[300px] md:w-[350px]" ref={wrapperRef}>
						{/*<canvas className="absolute max-w-full box-border p-5" ref={canvasRef}/>*/}
						<VisualTextSegment image={imageExtracted || '/placeholder.svg'} imageType="url" />
					</Box>
				</> : null}
			<Pagination />
		</div>
	);
};

export default PdfViewer;