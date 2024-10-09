const api_route = {
	API: {
		feature: {
			TRANSLATE: {
				socket: '/socket/v1/feature/translate',
			},
			OCR: {
				socket: '/socket/v1/feature/ocr',
			},
			SPEECH_TO_TEXT: {
				socket: '/socket/v1/feature/s2t',
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
	SPEECH_TO_TEXT: {
		PROCESS_AUDIO: 'processAudio',
		UPLOAD: 'speech_to_text:upload',
		EXTRACT: 'speech_to_text:extract',
		PROGRESS: 'speech_to_text:progress',
		STATUS: 'speech_to_text:status',
		CANCEL: 'speech_to_text:cancel',
		RESULT: 'speech_to_text:result',
		DONE: 'speech_to_text:done',
	}
};

export { api_route, socket_event };