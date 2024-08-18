const api_route = {
	API: {
		feature: {
			OCR: {
				socket: '/socket/v1/feature/ocr',
			}
		}
	}
};
const socket_event = {
		OCR: {
			PROCESS_PDF: 'processPDF',
			UPLOAD: 'ocr:upload',
			EXTRACT: 'ocr:extract',
			PROGRESS: 'ocr:progress',
			STATUS: 'ocr:status',
			CANCEL: 'ocr:cancel',
			RESULT: 'ocr:result',
			INIT_API: 'ocr:init_api',
			RECOGNIZING_TEXT: 'ocr:recognizing_text',
			INITIALIZING_TESSERACT: 'ocr:initial_tesseract',
			LOADING_LANGUAGE_TRAINEDDATA: 'ocr:loading_language_traineddata',
			LOADING_LANGUAGE_TRAINEDDATA_CACHE: 'ocr:loading_language_traineddata_cache',
			LOADING_TESSERACT_CORE: 'ocr:loading_tesseract_core',
			DONE: 'ocr:done',
		},
};

export { api_route, socket_event };