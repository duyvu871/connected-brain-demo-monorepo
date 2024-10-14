import AsyncMiddleware from '@/helpers/waiter.helper';
import { Request, Response } from 'express';
import { response_header_template } from '@/helpers/response_header_template.helper';
import { HttpStatusCode } from '@/helpers/http_status_code';
import * as crypto from 'node:crypto';
import { OCR } from '@repo/ocr';
import isoLanguage, { getKeyByValue, type ISOLangType } from '@translate/utils/isoLanguage';
import fs from 'fs/promises';
import path from 'path';
import PDFParser from 'pdf-parse';
import { pdfToImage } from '@ocr/pdf-to-image';
import OcrModel from '@/models/ocr/ocr.model';
import { ObjectId } from 'mongoose';
import { NetworkSFTP } from '@repo/network-sftp';
import { sftpHostCbrain } from '@/configs/sftp/host/cbrain';
import { InputData, transformData } from '@ocr/utils';

NetworkSFTP.setConfig('ocr:upload', sftpHostCbrain);

const TMP_FILE_PATH = '/media/cbrain/9cdf9fac-bba1-4725-848d-cc089e577048/new_folder/CBrain/Study_and_Research/Test/OCR/OCR_API/storage';
const OCR_API_URL = 'http://127.0.0.1:5207/ocr';

const extractTextFromImage = async (filePath: string, targetLang: string) => {
	const myHeaders = new Headers();
	myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

	const urlencoded = new URLSearchParams();
	urlencoded.append('path', filePath);
	urlencoded.append('language', targetLang);

	const response = await fetch(OCR_API_URL, {
		method: 'POST',
		headers: myHeaders,
		body: urlencoded,
		redirect: 'follow',
	});

	const responseBody = await response.json() as InputData;
	if (!responseBody?.results) throw new Error('Cannot extract text from image');

	const page = transformData(responseBody);
	if (!page) {
		throw new Error('Cannot extract text from image');
	}

	return page;
};

const getNormalizedLanguage = (lang: string) => {
	return isoLanguage[lang as ISOLangType] ? lang : getKeyByValue(lang) ?? 'eng';
};

export default class OCRController {
	// @ts-ignore
	public static uploadFileWithoutAuth = AsyncMiddleware.asyncHandler(async (req: Request, res: Response) => {
		try {
			const clientId = req.query.clientId as string;
			const file = req.file as Express.Multer.File;
			const { buffer: fileData, originalname, mimetype: fileType } = file;
			const fileExtension = originalname.split('.').pop();

			let sourceLang = getNormalizedLanguage(req.query.source as string);
			let targetLang = (req.query.target as string);

			if (sourceLang === targetLang) {
				sourceLang = `${sourceLang}+${targetLang}`;
			}

			const id = crypto.randomBytes(16).toString('hex');
			const tmpFilePath = path.posix.resolve(TMP_FILE_PATH, id, `source.${fileExtension}`);

			await NetworkSFTP.createDirectory('ocr:upload', path.posix.resolve(TMP_FILE_PATH, id));
			const isUploaded = await NetworkSFTP.writeFile('ocr:upload', tmpFilePath, fileData);
			if (!isUploaded) {
				throw new Error('Cannot upload file');
			}

			try {
				const page = await extractTextFromImage(tmpFilePath, targetLang);

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
				response_header_template(res).status(HttpStatusCode.InternalServerError).send({ message: 'Cannot extract text from image' });
			}
		} catch (error: any) {
			response_header_template(res).status(error.statusCode || HttpStatusCode.InternalServerError).send({ message: error.message });
		}
	});

	public static uploadURL = AsyncMiddleware.asyncHandler(async (req: Request, res: Response) => {});

	// @ts-ignore
	public static uploadFile = AsyncMiddleware.asyncHandler(async (req: Request, res: Response) => {
		try {
			const file = req.file as Express.Multer.File;
			const clientId = req.query.clientId as string;
			const { buffer: fileData, originalname, mimetype: fileType } = file;
			const fileExtension = originalname.split('.').pop();

			const id = crypto.randomBytes(16).toString('hex');
			const tmpFilePath = path.posix.resolve(TMP_FILE_PATH, id, `source.${fileExtension}`);

			let sourceLang = getNormalizedLanguage(req.query.source as string);
			let targetLang = getNormalizedLanguage(req.query.target as string);

			if (sourceLang === targetLang) {
				sourceLang = `${sourceLang}+${targetLang}`;
			}

			await NetworkSFTP.writeFile('ocr:upload', tmpFilePath, fileData);

			if (fileType === 'application/pdf') {
				const pdf = await PDFParser(fileData);
				const numPages = pdf.numpages;

				if (numPages > 1000) {
					throw new Error('The number of pages is too large');
				}

				await pdfToImage({
					inputPath: tmpFilePath,
					outputPath: path.resolve(TMP_FILE_PATH, id, 'output'),
					density: 200,
					quality: 80,
					format: 'png',
				});

				const pageImages = Array.from({ length: numPages }, (_, i) => ({
					page: i + 1,
					image: `output-${i.toString().padStart(3, '0')}.png`,
				}));

				const response = { id, path: tmpFilePath, numPages, pageImages };

				await OcrModel.create({
					// @ts-ignore
					user: req.user?._id as ObjectId,
					originName: originalname,
					pages: pageImages,
					numPages,
					status: 'done',
				});

				response_header_template(res).status(HttpStatusCode.Ok).send(response);
			} else {
				const page = await OCR.processImage(fileData, sourceLang, (progress) => {
					global.__io.emit(`ocr:extract-status:${clientId}`, progress);
				});

				if (!page) {
					throw new Error('Cannot extract text from image');
				}

				response_header_template(res).status(HttpStatusCode.Ok).send({
					text: page.text,
					words: page.words.map((word) => ({ bbox: word.bbox, baseline: word.baseline })),
				});
			}
		} catch (error: any) {
			response_header_template(res).status(error.statusCode || HttpStatusCode.InternalServerError).send({ message: error.message });
		}
	});

	public static getExtract = AsyncMiddleware.asyncHandler(async (req: Request, res: Response) => {
		try {
			const clientId = req.query.clientId as string;
			const { id, page: pageIndex } = req.params;

			let sourceLang = getNormalizedLanguage(req.query.source as string);
			let targetLang = getNormalizedLanguage(req.query.target as string);

			if (sourceLang === targetLang) {
				sourceLang = `${sourceLang}+${targetLang}`;
			}

			// const imagePath = path.join(process.cwd(), 'storage', 'Assets', 'ocr', id, `output-${pageIndex.toString().padStart(3, '0')}.png`);
			//
			// const page = await OCR.processImage(imagePath, sourceLang, (progress) => {
			// 	global.__io.emit(`ocr:extract-status:${clientId}`, progress);
			// });
			// const id = crypto.randomBytes(16).toString('hex');
			const tmpFilePath = path.posix.resolve(TMP_FILE_PATH, id, `source.${fileExtension}`);

			await NetworkSFTP.createDirectory('ocr:upload', path.posix.resolve(TMP_FILE_PATH, id));
			const isUploaded = await NetworkSFTP.writeFile('ocr:upload', tmpFilePath, fileData);
			if (!isUploaded) {
				throw new Error('Cannot upload file');
			}
			const page = await extractTextFromImage(tmpFilePath, targetLang);

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
				words: page.words.map((word) => ({ bbox: word.bbox, baseline: word.baseline })),
			});
		} catch (error: any) {
			response_header_template(res).status(error.statusCode || HttpStatusCode.InternalServerError).send({ message: error.message });
		}
	});
}