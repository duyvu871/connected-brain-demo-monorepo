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
import { pdfToImage } from '@ocr/pdf-to-image';
import OcrModel from '@/models/ocr/ocr.model';
import { ObjectId } from 'mongoose';

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

			const id = crypto.randomBytes(16).toString('hex');
			const tmp_file_path = `storage/Assets/ocr/${id}`;
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

			if (file_type === 'application/pdf') {
				const pdf = await PDFParser(file_data);
				console.log('pdf length', pdf.numpages);
				const numPages = pdf.numpages;
				if (numPages > 1000) {
					throw new Error('The number of pages is too large');
				}
				await pdfToImage({
					inputPath: path.resolve(tmp_file_path, tmp_file_name),
					outputPath: path.resolve(tmp_file_path, 'output'),
					density: 200,
					quality: 80,
					format: 'png',
				});
				const response = {
					id,
					path: tmp_file_path,
					numPages,
					pageImages: Array.from({length: numPages}, (_, i) => ({
						page: i + 1,
						image: `output-${i.toString().padStart(3, '0')}.png`
					})),
				}
				await OcrModel.create({
					// @ts-ignore
					user: req.user?._id as ObjectId,
					originName: file.originalname,
					pages: response.pageImages,
					numPages: response.numPages,
					status: 'done',
				});
				response_header_template(res).status(HttpStatusCode.Ok).send(response);
			} else {
				const page = await OCR.processImage(
					file_data,
					source_lang,
					(progress) => {
						global.__io.emit(`ocr:extract-status:${clientId}`, progress);
					});
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

	public static getExtract = AsyncMiddleware.asyncHandler(async (req: Request, res: Response) => {
		try {
			const clientId = req.query.clientId as string;
			const id = req.params.id;
			const page_index = req.params.page;

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

			const relative_path = `storage/Assets/ocr/${id}/output-${page_index.toString().padStart(3, '0')}.png`;
			const absolute_path = path.join(process.cwd(), relative_path);
			const page = await OCR.processImage(
				absolute_path,
				source_lang,
				(progress) => {
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
	})

}