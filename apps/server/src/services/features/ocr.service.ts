import { Server } from 'socket.io';
import type {Page} from 'tesseract.js'
import { api_route, socket_event } from '@repo/utils/constants';

type OCRData = Page

type OCRProgress = {
	progress: number;
}

type ExtractStatus = {
	status: string;
	progress: number;
}

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
	}
	public static sendProgress(progress: number) {

	}
}