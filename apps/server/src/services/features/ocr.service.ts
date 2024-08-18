import { Server } from 'socket.io';
import Tesseract, {Page} from 'tesseract.js'
import { api_route, socket_event } from '@repo/utils/constants';
import workerpool from 'workerpool';
import PDFParser from 'pdf-parse';
import path from 'path';
import fs from 'fs/promises';

type OCRData = Page

type OCRProgress = {
	progress: number;
}

type ExtractStatus = {
	status: string;
	progress: number;
}

interface PageResult {
	pageIndex: number;
	page:	Page;
}

interface WorkerData {
	pdfPath: string;
	lang: string;
	pagesToProcess: number[];
}

interface PageFormatted {
	text: string;
	words: {
		bbox: Tesseract.Bbox;
		baseline: Tesseract.Baseline;
	}[]
}

const numWorkers = 4;
const pool = workerpool.pool(path.join(__dirname + '../../../../apps/workers/dist/process/worker_ocr.js'), {maxWorkers: numWorkers});

export default class OCRService {
	public static connection(io: Server) {
		console.log('OCR socket connected', api_route.API.feature.OCR.socket);
		const namespace = io.of(api_route.API.feature.OCR.socket)
			.on('connect', (socket) => {
				console.log('OCR socket connected');
				socket.on('disconnect', () => {
					console.log('OCR socket disconnected');
				});
			});
		namespace.on("ocr:extract-status", (data: ExtractStatus) => {
			console.log('ocr:extract-status', data);
			global.__io.emit('ocr:extract-status', data);
		});
		namespace.on(socket_event.OCR.RESULT, (data: OCRData) => {
			console.log(socket_event.OCR.RESULT, data);
			global.__io.emit(socket_event.OCR.RESULT, data);
		});
		namespace.on(socket_event.OCR.CANCEL, (data: OCRData) => {
			console.log(socket_event.OCR.RESULT, data);
		});
		namespace.on(socket_event.OCR.STATUS, (data: OCRData) => {});
		namespace.on(socket_event.OCR.PROGRESS, (data: OCRProgress) => {
			console.log(socket_event.OCR.PROGRESS, data);
			global.__io.emit(socket_event.OCR.PROGRESS, data);
		});
		namespace.on(socket_event.OCR.INIT_API, (data: OCRData) => {
			console.log(socket_event.OCR.UPLOAD, data);
		});
		namespace.on(socket_event.OCR.RECOGNIZING_TEXT, (data: OCRData) => {
			console.log(socket_event.OCR.UPLOAD, data);
		});
		namespace.on(socket_event.OCR.PROCESS_PDF, async (pdfData: Buffer) => {

		});
	}
	public static sendProgress(progress: number) {

	}

	public static async ProcessPDF(pdfPath: string, lang: string, emitter: {sendData: (data: any) => void, sendError: (error: any) => void}) {
		console.log(path.join(__dirname, '../../../../apps/workers/dist/process/worker_ocr.js'));
		try {
			const bufferFromPath = await fs.readFile(pdfPath)
			const pdf = await PDFParser(bufferFromPath);
			console.log('pdf', pdf.numpages);
			const numPages = pdf.numpages;
			const chunkSize = Math.ceil(numPages / numWorkers);
			console.log('chunkSize', chunkSize);

			const pageChunks = new Array(numWorkers)
				.fill(null)
				.map((_, i) =>
				{
					// console.log("page chunk", Math.min(chunkSize, (numPages - i * chunkSize) < 0 ? 0 : numPages - i * chunkSize));
					return new Array(Math.min(chunkSize, (numPages - i * chunkSize) < 0 ? 0 : numPages - i * chunkSize))
						.fill(null)
						.map((_, j) => i * chunkSize + j)
				}
				);
			console.log('pageChunks', pageChunks);
			const promises = pageChunks.map((chunk, chunkIndex) =>
				pool
					.exec('processChunk', [
						{ pdfPath, pagesToProcess: chunk, lang },
					] as [WorkerData])
					.then((pageResults: PageResult[]) => ({ chunkIndex, pageResults }))
			);

			Promise.all(promises)
				.then((results) => {
					results.sort((a, b) => a.chunkIndex - b.chunkIndex);
					const allPages: PageFormatted[] =
						results.flatMap((r) =>
							r.pageResults.map((pr) => pr.page)
								.map((page, pageIndex) => ({
									text: page.text,
									words: page.words.map((word) => ({
										bbox: word.bbox,
										baseline: word.baseline,
									})),
								}))
						);
					// global.__io.emit('pdfProcessed', allPages);
					fs.writeFile('./output.json', JSON.stringify(allPages, null, 2));
					// console.log('allPages', allPages);
					emitter.sendData(allPages);
				})
				.catch((error) => {
					console.error('Lỗi xử lý:', error);
					// global.__io.emit('pdfError', error.message);
					emitter.sendError(error);
				});
		} catch (error: any) {
			console.error('Lỗi xử lý:', error);
			// global.__io.emit('pdfError', error.message);
			emitter.sendError(error);
		}
	}
}