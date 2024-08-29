import AsyncMiddleware from '@/helpers/waiter.helper';
import { Request, Response } from 'express';
import { response_header_template } from '@/helpers/response_header_template.helper';
import { HttpStatusCode } from '@/helpers/http_status_code';
import * as crypto from 'node:crypto';
import {OCR} from '@repo/ocr';
import isoLanguage, { getKeyByValue, type ISOLangType } from '@translate/utils/isoLanguage';
import fsSync from "fs"
import fs from 'fs/promises';
// @ts-ignore
import pdf2img from 'pdf2img';
import path from 'path';
import PDFParser from 'pdf-parse';

export default class OCRController {
	public static uploadFileWithoutAuth = AsyncMiddleware.asyncHandler(async (req: Request, res: Response) => {
		try {
			const clientId = req.query.clientId as string;
			const file = req.file as Express.Multer.File;
			const file_data = file.buffer;
			// console.log(`ocr:extract-status:${clientId}`);

			let source_lang = req.query.source as string;
			let target_lang = req.query.target as string;
			if (
				!isoLanguage[source_lang as ISOLangType] ||
				!isoLanguage[target_lang as ISOLangType]
			) {
				source_lang = getKeyByValue(source_lang) ?? 'eng';
				target_lang = getKeyByValue(target_lang) ?? 'eng';
			}
			if (source_lang === target_lang) {
				source_lang = `${source_lang}+${target_lang}`;
			}
			// process image with OCR
			const page = await OCR.processImage(
				file_data,
				source_lang,
				(progress) => {
					// const eventLabel = OCR.getLabelStatus(progress.status);
					// eventLabel && global.__io.emit(eventLabel, progress);
					global.__io.emit(`ocr:extract-status:${clientId}`, progress);
				}
			);
			if (!page) {
				throw new Error('Cannot extract text from image');
			}

			const extracted_text = page.text;
			const page_bbox = page.words.map((word) => ({
				bbox: word.bbox,
				baseline: word.baseline,
			}));
			response_header_template(res).status(HttpStatusCode.Ok).send({
				text: extracted_text,
				words: page_bbox,
			});
		} catch (error: any) {
			response_header_template(res).status(error.statusCode||HttpStatusCode.InternalServerError).send({message: error.message});
		}
	});

	public static uploadURL = AsyncMiddleware.asyncHandler(async (req: Request, res: Response) => {});

	public static uploadFile = AsyncMiddleware.asyncHandler(async (req: Request, res: Response) => {
		try {
			const file = req.file as Express.Multer.File;
			const clientId = req.query.clientId as string;
			const file_data = file.buffer;
			const file_extension = file.originalname.split('.').pop();
			const file_type = file.mimetype;
			const tmp_file_path = `storage/tmp/ocr/${crypto.randomBytes(16).toString('hex')}`;
			const tmp_file_name = `source.${file_extension}`;

			let source_lang = req.query.source as string;
			let target_lang = req.query.target as string;

			if (
				!isoLanguage[source_lang as ISOLangType] ||
				!isoLanguage[target_lang as ISOLangType]
			) {
				source_lang = getKeyByValue(source_lang) ?? 'eng';
				target_lang = getKeyByValue(target_lang) ?? 'eng';
			}
			if (source_lang === target_lang) {
				source_lang = `${source_lang}+${target_lang}`;
			}

			await fs.mkdir(tmp_file_path, {recursive: true});

			fsSync.writeFile(path.resolve(tmp_file_path, tmp_file_name), file_data, 'utf-8', (e) => {
				console.log(e);
			});
			// await CloudStorage.setLifecycleRule('connected-brain-bucker', 24);
			// const create_tmp_file = await CloudStorage.uploadFileToGCP(
			// 	file_data,
			// 	{
			// 		bucketName: 'connected-brain-bucker',
			// 		specialPath: tmp_file_path,
			// 		mimeType: file_type,
			// 		fileName: tmp_file_name,
			// 	});


			if (file_type === 'application/pdf') {
				// convert to images
				const pdf = await PDFParser(file_data);
				console.log('pdf length', pdf.numpages);
				const numPages = pdf.numpages;
				const selectedPage = new Array(numPages).fill(null).map((_, i) => i + 1);
				console.log('page select', selectedPage);
				pdf2img.setOptions({
					type: 'png',                                // png or jpg, default jpg
					size: 1024,                                 // default 1024
					density: 600,                               // default 600
					outputdir: tmp_file_path, // output folder, default null (if null given, then it will create folder name same as file name)
					outputname: 'image',                         // output file name, dafault null (if null given, then it will create image name same as input name)
					page: null                                  // convert selected page, default null (if null given, then it will convert all pages)
				});

				pdf2img.convert(path.resolve(tmp_file_path, tmp_file_name), function(err: any, info: any) {
					if (err) console.log(err)
					else console.log(info);
				});
			} else {
				const page = await OCR.processImage(
					file_data,
					source_lang,
					(progress) => {
						// const eventLabel = OCR.getLabelStatus(progress.status);
						// eventLabel && global.__io.emit(eventLabel, progress);
						global.__io.emit(`ocr:extract-status:${clientId}`, progress);
					}
				);
				if (!page) {
					throw new Error('Cannot extract text from image');
				}

				const extracted_text = page.text;
				const page_bbox = page.words.map((word) => ({
					bbox: word.bbox,
					baseline: word.baseline,
				}));
				response_header_template(res).status(HttpStatusCode.Ok).send({
					text: extracted_text,
					words: page_bbox,
				});
			}
		} catch (error: any) {
			response_header_template(res).status(error.statusCode||HttpStatusCode.InternalServerError).send({message: error.message});
		}
	});
}