import AsyncMiddleware from '@/helpers/waiter.helper';
import { Request, Response } from 'express';
import { response_header_template } from '@/helpers/response_header_template.helper';
import { HttpStatusCode } from '@/helpers/http_status_code';
import * as crypto from 'node:crypto';
import { OCR } from '@repo/ocr';
import isoLanguage, { getKeyByValue, type ISOLangType } from '@translate/utils/isoLanguage';
import fsPromise from 'fs/promises';
import fs from 'fs';
import path from 'path';
import PDFParser from 'pdf-parse';
import { pdfToImage, pdfToImageGhostScript } from '@ocr/pdf-to-image';
import OcrModel, { OCRRepoInterface } from '@/models/ocr/ocr.model';
// import { NetworkSFTP } from '@repo/network-sftp';
// import { sftpHostCbrain } from '@/configs/sftp/host/cbrain';
import { InputData, OutputData, transformData } from '@ocr/utils';
import * as process from 'node:process';
// import FormData from 'form-data';
import axios from 'axios';
import { retryWrapper } from '@/helpers/retry';
import { checkFileExist } from '@/utils/file';
import { timeout } from '@/helpers/delay_action';
import { ObjectId, Types } from 'mongoose';

// NetworkSFTP.setConfig('ocr:upload', sftpHostCbrain);

const OCR_API_URL = 'http://127.0.0.1:8502/api/v1/ocr';

const extractTextFromImage = async (filePath: string, targetLang: string, contentType: string): Promise<OutputData> => {
	const fileName = path.basename(filePath);
	console.log('file-name', fileName);
	return new Promise(async (res, rej) => {
		try {
			const file = await fsPromise.readFile(filePath);
			const fileBlob = new Blob([file], { type: contentType });
			console.log(fileName, targetLang);
			const formData = new FormData();
			formData.append('file', fileBlob, fileName);
			formData.append('language', targetLang);
			const api = process.env.NODE_ENV === 'development' ? "http://14.224.188.206:8502/api/v1/ocr" : OCR_API_URL;

			const response = await fetch(api, {
				method: "POST",
				body: formData,
			})
			const data = (await response.json()).data;
			const transformedData = transformData(data as InputData);
			res(transformedData);
		} catch (e) {
			rej(e);
		}
	})
};

const getNormalizedLanguage = (lang: string) => {
	return isoLanguage[lang as ISOLangType] || lang || 'en';
};

export default class OCRController {
	// @ts-ignore
	public static uploadFileWithoutAuth =
		AsyncMiddleware.asyncHandler(async (req: Request, res: Response) => {
			try {
				const clientId = req.query.clientId as string;
				const file = req.file as Express.Multer.File;
				const { buffer: fileData, originalname, mimetype: fileType } = file;
				const fileExtension = originalname.split('.').pop();

				let sourceLang = getNormalizedLanguage(req.query.source as string);
				let targetLang = getNormalizedLanguage(req.query.target as string);

				if (sourceLang === targetLang) {
					sourceLang = `${sourceLang}+${targetLang}`;
				}

				if (fileType === 'application/pdf') {
					response_header_template(res)
						.status(HttpStatusCode.MethodNotAllowed)
						.send({ message: 'Cannot extract text from PDF' });
				}

				const directoryPath = path.resolve(process.cwd(), `storage/Assets/ocr/${clientId}`);
				await fsPromise.mkdir(directoryPath, { recursive: true }).then(() => {
					console.log('create dir');
				});
				const filePath = path.resolve(directoryPath, `source.${fileExtension}`);
				await fsPromise.writeFile(filePath, fileData).then(() => {
					console.log('write file');
				});
				try {
					const page = await extractTextFromImage(filePath, targetLang, fileType);
					console.log(targetLang);
					console.log(page);
					global.__io.emit(`ocr:extract-status:${clientId}`, {
						jobId: 0,
						progress: 100,
						status: 'Extracted done',
						userJobId: 0,
						workerId: 0,
					});

					response_header_template(res).status(HttpStatusCode.Ok).send({
						text: page.text,
						words: page.words.map((word) => ({ bbox: word.bbox, baseline: 0 })),
					});
				} catch (e) {
					console.log("Upload error", e);
					response_header_template(res)
						.status(HttpStatusCode.InternalServerError)
						.send({ message: 'Cannot extract text from image' });
				}
			} catch (error: any) {
				console.log(error);
				response_header_template(res)
					.status(error.statusCode || HttpStatusCode.InternalServerError)
					.send({ message: error.message });
			}
	});

	public static uploadURL =
		AsyncMiddleware.asyncHandler(async (req: Request, res: Response) => {});

	// @ts-ignore
	public static uploadFile =
		AsyncMiddleware.asyncHandler(async (req: Request, res: Response) => {
			try {
				const file = req.file as Express.Multer.File;
				const clientId = req.query.clientId as string;
				const {
					buffer: fileData,
					originalname,
					mimetype: fileType
				} = file;
				const fileExtension = originalname.split('.').pop();

				const createdDataStore = <NonNullable<OCRRepoInterface>>await retryWrapper(
					async () => await OcrModel.create({
						// @ts-ignore
						user: req.user?._id as ObjectId,
						originName: originalname,
						pages: [],
						numPages: 0,
						status: 'processing',
					}),
					"create-ocr-datastore",
					{
						MAX_RETRY: 3,
						RETRY_WAIT: 20,
						retryIndex: 0,
					});

				const idStringify = String(createdDataStore._id);
				const tmpFilePath = path.posix.join(
					process.cwd(), "storage/Assets/ocr", idStringify, `source.${fileExtension}`
				);
				let sourceLang = getNormalizedLanguage(req.query.source as string);
				let targetLang = getNormalizedLanguage(req.query.target as string);

				if (sourceLang === targetLang) {
					sourceLang = `${sourceLang}+${targetLang}`;
				}

				const directoryPath = path.posix.join(process.cwd(), `storage/Assets/ocr/${idStringify}`);
				await fsPromise.mkdir(directoryPath, { recursive: true }).then(() => {
					console.log('create dir:', directoryPath);
				});
				const filePath = path.posix.join(directoryPath, `source.${fileExtension}`);
				await fsPromise.writeFile(filePath, fileData).then(() => {
					console.log('write file:', filePath);
				});
				await timeout(500);

				if (fileType === 'application/pdf') {
					const pdf = await PDFParser(fileData);
					const numPages = pdf.numpages;
					const pageImages = Array.from({ length: numPages }, (_, i) => ({
						result: null,
						page: i + 1,
						image: `output-${i.toString().padStart(3, '0')}.png`,
					}));

					if (numPages > 1000) {
						throw new Error('The number of pages is too large');
					}
					// Update data store
					createdDataStore.numPages = numPages;
					createdDataStore.pages = pageImages;
					createdDataStore.save().then(() => {
						console.log('save data store');
					});
					// Convert PDF to image with GhostScript
					console.log("Start converting PDF to image");
					await pdfToImageGhostScript({
						inputPath: tmpFilePath,
						outputPath: path.posix.join(directoryPath, 'output'),
						density: 100,
						quality: 80,
						format: 'png',
					});

					const response = {
						id: idStringify,
						path: path.join("storage/Assets/ocr", idStringify),
						numPages,
						pageImages
					};

					response_header_template(res).status(HttpStatusCode.Ok).send(response);
				} else {
					const page = await extractTextFromImage(tmpFilePath, targetLang, fileType);
					console.log(targetLang);
					console.log(page);

					if (!page) {
						throw new Error('Cannot extract text from image');
					}

					global.__io.emit(`ocr:extract-status:${clientId}`, {
						jobId: 0,
						progress: 100,
						status: 'Extracted done',
						userJobId: 0,
						workerId: 0,
					});

					response_header_template(res).status(HttpStatusCode.Ok).send({
						text: page.text,
						words: page.words.map((word) => ({ bbox: word.bbox, baseline: 0 })),
					});
				}
			} catch (error: any) {
				console.log(error);
				response_header_template(res)
					.status(error.statusCode || HttpStatusCode.InternalServerError)
					.send({ message: error.message });
			}
	});

	public static getExtract =
		AsyncMiddleware.asyncHandler(async (req: Request, res: Response) => {
			try {
				const clientId = req.query.clientId as string;
				const { id, page: pageIndex } = req.params;
				const pageStoreIndexing = parseInt(pageIndex) + 1;
				let sourceLang = getNormalizedLanguage(req.query.source as string);
				let targetLang = getNormalizedLanguage(req.query.target as string);

				if (sourceLang === targetLang) {
					sourceLang = `${sourceLang}+${targetLang}`;
				}

				const ocrStore = await OcrModel.findOne({ _id: new Types.ObjectId(id) });
				if (!ocrStore) {
					throw new Error('Id not found');
				}

				const pageResult = ocrStore.pages[parseInt(pageIndex)].result;
				if (pageResult) {
					response_header_template(res).status(HttpStatusCode.Ok).send({
						text: pageResult.text,
						words: pageResult.words.map((word) => ({ bbox: word.bbox, baseline: 0 })),
					});
				}

				const imagePath = path.join(
					process.cwd(),
					'storage',
					'Assets',
					'ocr',
					id,
					`output-${pageIndex.toString().padStart(3, '0')}.png`
				);

				const page = await extractTextFromImage(imagePath, targetLang, 'image/png');
				console.log(targetLang);
				console.log(page);

				try {
					ocrStore.pages[parseInt(pageIndex)].result = page;
					await ocrStore.save();
				} catch (updateError: any) {
					console.error(updateError);
				}

				if (!page) {
					throw new Error('Cannot extract text from image');
				}

				global.__io.emit(`ocr:extract-status:${clientId}`, {
					jobId: 0,
					progress: 100,
					status: 'Extracted done',
					userJobId: 0,
					workerId: 0,
				});
				if (!page) {
					throw new Error('Cannot extract text from image');
				}

				response_header_template(res).status(HttpStatusCode.Ok).send({
					text: page.text,
					words: page.words.map((word) => ({ bbox: word.bbox, baseline: 0})),
				});
			} catch (error: any) {
				response_header_template(res)
					.status(error.statusCode || HttpStatusCode.InternalServerError)
					.send({ message: error.message });
			}
	});
}