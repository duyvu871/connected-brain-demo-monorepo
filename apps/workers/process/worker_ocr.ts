import * as workerpool from 'workerpool';
import type { Page } from 'tesseract.js';
import { pdfToImage } from '@repo/ocr/pdf-to-image';

import { OCR } from '@repo/ocr/dist';

interface PageResult {
	pageIndex: number;
	page:	Page;
}

interface WorkerData {
	pdfBuffer: Buffer;
	lang: string;
	pagesToProcess: number[];
}

const processChunk = async (
	pdfBuffer: Buffer,
	sourceLang: string,
	pagesToProcess: number[],
	onProgress?: (page: string|number, progress: number) => void
): Promise<PageResult[]> => {
	console.log('Processing chunk:', pagesToProcess);
	const processResult = await pdfToImage(pdfBuffer, pagesToProcess, {
		onProgress: async (pageNum: number, data: Buffer) => {
			return await OCR.processImage(data, sourceLang, (loggerMessage) => {
				onProgress && onProgress(pageNum, loggerMessage.progress);
			});
		},
		onError: (error: any) => {
			console.error('Error processing PDF to image:', error);
		}
	});

	return processResult.map((page: Page, index) => ({
		pageIndex: pagesToProcess[index],
		page
	}));
};

// parentPort.on('message', async (data: WorkerData) => {
// 	const { pdfData, pagesToProcess, lang } = data;
// 	const result = await processChunk(pdfData, lang, pagesToProcess);
// 	parentPort.postMessage(result);
// });
workerpool.worker({
	processChunk
})