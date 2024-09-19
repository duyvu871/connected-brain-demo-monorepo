import { File } from '@google-cloud/storage';
import Tesseract, { createScheduler, createWorker, OEM, RecognizeResult } from 'tesseract.js';
import { fromBuffer } from 'pdf2pic';
import { CloudStorage } from '@repo/cloud-storage';
import { TranslateService } from '@repo/translate';
import * as crypto from 'node:crypto';
import { randomRange } from '@repo/utils/true-random';
import { constants } from './utils.ts';
import { socket_event } from '@repo/utils/constants';
import Jimp from 'jimp';

export class OCR {
	private static instances: Record<string, Tesseract.Scheduler> = {};
	public static translateService: any;
	// init translate service
	public static initTranslateService() {
		this.translateService = new TranslateService();
	}
	// check instance and get translate service
	public static getTranslateService() {
		if (!this.translateService) {
			this.initTranslateService();
		}
		return this.translateService;
	}
	// create random for instance id
	public static createRandomInstanceId() {
		return crypto.randomBytes(16).toString('hex');
	}
	// get instance from instances store
	public static getInstances(id: string) {
		if (this.instances[id]) {
			return this.instances[id];
		}
		return this.instances[crypto.randomBytes(16).toString('hex')] = createScheduler();
	}
	// create new instance to scheduler store
	public static createInstance(id: string) {
		return this.instances[id] = createScheduler();
	}
	// get random instance from instances store
	public static getRandomInstance() {
		if (!this.instances || !Object.keys(this.instances).length) {
			this.createInstance(this.createRandomInstanceId());
		}
		const instanceList = Object.keys(this.instances);
		return this.instances[instanceList[randomRange(0, instanceList.length)]];
	}
	// get label status
	public static getLabelStatus(status: string) {
		const labelMap = {
			"initializing api": socket_event.OCR.INIT_API,
			"recognizing text": socket_event.OCR.RECOGNIZING_TEXT,
			"initializing tesseract": socket_event.OCR.INITIALIZING_TESSERACT,
			"loading language traineddata": socket_event.OCR.LOADING_LANGUAGE_TRAINEDDATA,
			"loading language traineddata (from cache)": socket_event.OCR.LOADING_LANGUAGE_TRAINEDDATA_CACHE,
			"loading tesseract core": socket_event.OCR.LOADING_TESSERACT_CORE,
			"done": socket_event.OCR.DONE,
		};
		return labelMap[status as keyof typeof labelMap];
	}
	// create worker with lang and options
	public static async loadLangData(lang: string, options: Partial<Tesseract.WorkerOptions>) {
		return await createWorker(lang, OEM.TESSERACT_LSTM_COMBINED, options);
	}
	// add worker to scheduler
	public static addToScheduler(worker: Tesseract.Worker, scheduler?: Tesseract.Scheduler) {
		const instance = scheduler || this.getRandomInstance();
		instance.addWorker(worker);
		return instance;
	}

	public static async convertPDFToImage(imageURL: string) {

	}

	public static async convertPDFToText() {}

	public static async processSinglePdfPageFromStorage(
		bucketName: string,
		pdfFileName: string,
		pageNumber: number,
		sourceLang: string = 'eng',
		targetLang: string = 'vie'
	): Promise<RecognizeResult['data'] | null> {
		try {
			const bucket = CloudStorage.storage.bucket(bucketName);
			const pdfFile: File = bucket.file(pdfFileName);

			// download PDF file from storage
			const [buffer] = await pdfFile.download();

			// convert PDF buffer to image buffer
			const imageBuffer = await fromBuffer(buffer, {
				density: 300, // output pixels per inch
				saveFilename: 'page', // save the image as 'page_1.jpg' and 'page_2.jpg'
				savePath: undefined, // no need to save the image to disk
				format: 'jpg',
			})(pageNumber, {
				responseType: 'buffer',
			});

			if (!imageBuffer?.buffer) {
				return null;
			}
			// do OCR on the image buffer
			const {
				data
			}: RecognizeResult = await Tesseract.recognize(imageBuffer.buffer, sourceLang, {
				gzip: true, // compress the image buffer
			});

			return data;
		} catch (err: any) {
			console.error('Error:', err);
			throw err;
		}
	}

	public static async processImageFromStorage(
		bucketName: string,
		imageFileName: string,
		sourceLang: string = 'eng',
		targetLang: string = 'vie'
	): Promise<RecognizeResult['data'] | null> {
		try {
			const storage = CloudStorage.getInstanceOfGCS();
			// console.log('storage', storage);
			const bucket = storage.bucket(bucketName);
			const imageFile: File = bucket.file(imageFileName);

			// download image file from storage
			const [buffer] = await imageFile.download();
			// do OCR on the image buffer
			const {
				data
			}: RecognizeResult = await Tesseract.recognize(buffer, sourceLang, {
				gzip: true, // compress the image buffer
			});

			return data;
		} catch (err: any) {
			console.error('ERROR OCR package:', err);
			throw err;
		}
	}

	public static async processzincScaleImage(
		imageBuffer: Buffer,
	): Promise<Buffer> {
		try {
			const image = await Jimp.read(imageBuffer);
			image.greyscale();
			return await image.getBufferAsync(Jimp.MIME_PNG);
		} catch (err: any) {
			console.error('ERROR OCR package:', err);
			throw err;
		}
	}

	public static async processImage(
		imageLike: Buffer | string,
		sourceLang: string = 'eng',
		onProgress?: (loggerMessage: Tesseract.LoggerMessage) => void
	): Promise<RecognizeResult['data'] | null> {
		try {
			// console.log('sourceLang', sourceLang);
			// console.log('targetLang', targetLang);
			// imageBuffer = await this.processzincScaleImage(imageBuffer);
			const worker = await this.loadLangData(sourceLang, {
				gzip: false, // compress the image buffer
				langPath: constants.langPath,
				logger: (m) => {
					onProgress && onProgress(m);
				},
			});
			this.addToScheduler(worker);
			const {
				data
			}: RecognizeResult = await worker.recognize(imageLike);

			return data;
		} catch (err: any) {
			console.error('ERROR OCR package:', err);
			throw err;
		}
	}
}