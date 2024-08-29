import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import  { getDocument } from 'pdfjs-dist';
import { pdfjs } from 'react-pdf';
import { Box } from '@mantine/core';
import { useAtom } from 'jotai/index';
import {
	currentTesseractPage,
	selectedOcrLang,
	selectedSourceLang,
	starterAssetsPreUpload,
} from '@/containers/Apps/OCRScan/states/starter.ts';
import { paginationState } from '@/containers/Apps/OCRScan/states/playground.ts';
import Pagination from '@/containers/Apps/OCRScan/components/playground/pagination.tsx';
import { useUpload } from '@/hooks/ocr/useUpload.ts';
import { getPDFDocument } from '@/lib/pdf/get-pdf-document.ts';
import createPDFPage from '@/lib/pdf/create-pdf-page.ts';
import renderPDFToCanvas from '@/lib/pdf/render-pdf-to-canvas.ts';

pdfjs.GlobalWorkerOptions.workerSrc = '/workers/pdf.worker.mjs'//'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.worker.mjs'//new URL('pdfjs-dist/legacy/build/pdf.worker.min.mjs', import.meta.url).toString()

const PdfViewer: React.FC = () => {
	const {uploadImageAndStoreByIndex} = useUpload();
	const [file] = useAtom(starterAssetsPreUpload);
	const [state, setPaginationState] = useAtom(paginationState);
	const [sourceLang] = useAtom(selectedSourceLang);
	const [OCRLang] = useAtom(selectedOcrLang);
	const [currentPageExtracted] = useAtom(currentTesseractPage);

	const [pdfData, setPdfData] = useState<PDFDocumentProxy | null>(null);
	const [, setCurrentPage] = useState(1);
	const [blobURL, setBlobURL] = useState<string | null>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const imageSourceRef = useRef<HTMLImageElement>(null);
	const renderTaskRef = useRef<any>(null);
	const wrapperRef = useRef<HTMLDivElement>(null);
	const contextRef = useRef<CanvasRenderingContext2D | null>(null);

	useEffect(() => {
		if (currentPageExtracted) {
			const context = contextRef.current;
			if (!context) return;
			renderBbox(context, currentPageExtracted.words);
		}
	}, [currentPageExtracted]);

	useEffect(() => {
		if (file) {
			// console.log(file)
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
		const fileReader = new FileReader();
		fileReader.onload = async (e) => {
			const typedArray = new Uint8Array(e.target?.result as ArrayBuffer);
			const pdfDocument = await getPDFDocument(typedArray);
			const pdfPage = await createPDFPage(pdfDocument as PDFDocumentProxy, page);
			const viewport = pdfPage.getViewport({ scale: 1.0 });
			// Create the canvas
			const canvas = document.createElement("canvas");
			canvas.width =  viewport.width || viewport.viewBox[2];
			canvas.height =  viewport.height || viewport.viewBox[3];
			canvas.className = 'absolute max-w-full box-border p-5';
			contextRef.current = canvas.getContext('2d');
			if (wrapperRef.current) {
				const wrapperWidth = wrapperRef.current.clientWidth;
				wrapperRef.current.style.height = `${wrapperWidth * (viewport.height/viewport.width)}px`;
			}
			// Render the pdf to canvas
			const pdfCanvas = await renderPDFToCanvas(pdfPage, canvas);
			// then add the canvas with pdf to the div element
			wrapperRef.current?.replaceChildren(pdfCanvas);
			const currentPageFile = await canvasToFile(canvas, `page-${page}.png`);
			await uploadImageAndStoreByIndex(
				currentPageFile,
				Array.from(sourceLang)[0] as string,
				Array.from(OCRLang)[0] as string,
				state.currentPage - 1)
		}
		fileReader.readAsArrayBuffer(file);
	}, [file])

	const renderPage = async (pdf: PDFDocumentProxy, pageNumber: number) => {
		let pdfProxy = pdf;
		if (!pdfProxy) return;
		// await pdfProxy.destroy();
		const page = await pdfProxy.getPage(pageNumber);
		const canvas = canvasRef.current;
		if (!canvas) return;
		if (!contextRef.current) {
			contextRef.current = canvas.getContext('2d');
		}
		const context = contextRef.current//canvas.getContext('2d');
		if (!context) return;
		const scale = 3.0;
		const rotation = 0;
		const dontFlip = true;
		const viewport = page.getViewport({
			scale,
		});

		canvas.height = viewport.height || viewport.viewBox[3];
		canvas.width = viewport.width || viewport.viewBox[2];
		if (wrapperRef.current) {
			const wrapperWidth = wrapperRef.current.clientWidth;
			wrapperRef.current.style.height = `${wrapperWidth * (viewport.height/viewport.width)}px`;
		}
		const pageRenderTask = page.render({
			canvasContext: context,
			viewport
		});
		await pageRenderTask.promise;
		const currentPageFile = await canvasToFile(canvas, `page-${pageNumber}.png`);
		await uploadImageAndStoreByIndex(
			currentPageFile,
			Array.from(sourceLang)[0] as string,
			Array.from(OCRLang)[0] as string,
			state.currentPage - 1);
		pageRenderTask.cancel();
	};

	const renderBbox = (canvas: CanvasRenderingContext2D, words: Tesseract.Word[]) => {
		words.forEach((w) => {
			const b = w.bbox;
			// @ts-expect-error may this property has been added
			canvas.strokeWidth = 1;
			canvas.lineWidth = 1;
			canvas.strokeStyle = 'red';
			canvas.strokeRect(b.x0, b.y0, b.x1-b.x0, b.y1-b.y0);
			canvas.beginPath();
			canvas.moveTo(w.baseline.x0, w.baseline.y0);
			canvas.lineTo(w.baseline.x1, w.baseline.y1);
			canvas.strokeStyle = 'green';
			canvas.stroke();
		})
	}

	const canvasToFile = (canvas: HTMLCanvasElement, fileName: string): Promise<File> => {
		return new Promise((resolve, reject) => {
			canvas.toBlob((blob) => {
				if (blob) {
					const file = new File([blob], fileName, { type: blob.type });
					resolve(file);
				} else {
					reject(new Error("Canvas conversion to Blob failed"));
				}
			});
		});
	}
	
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
	}, [handlePageChange, state.currentPage]);

	return (
		<div className="w-fit flex flex-col justify-center items-center">
			{pdfData ? <>
					<Box className="relative overflow-y-auto h-[500px] sm:w-[300px] md:w-[350px]" ref={wrapperRef}>
						<canvas className="absolute max-w-full box-border p-5" ref={canvasRef}/>
					</Box>
				</> : null}
			<Pagination />
		</div>
	);
};

export default PdfViewer;