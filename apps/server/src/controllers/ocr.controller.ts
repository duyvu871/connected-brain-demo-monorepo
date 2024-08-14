import AsyncMiddleware from '@/helpers/waiter.helper';
import { Request, Response } from 'express';
import { response_header_template } from '@/helpers/response_header_template.helper';
import { HttpStatusCode } from '@/helpers/http_status_code';
import * as crypto from 'node:crypto';
import { CloudStorage } from '@cloud-storage/index';
import {OCR} from '@repo/ocr';
import isoLanguage, { getKeyByValue, type ISOLangType } from '@translate/utils/isoLanguage';
import { ObjectUtils } from '@repo/utils';

export default class OCRController {
	public static uploadFileWithoutAuth = AsyncMiddleware.asyncHandler(async (req: Request, res: Response) => {
		try {
			const file = req.file as Express.Multer.File;
			const file_data = file.buffer;
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
				target_lang,
				(progress) => {
					// const eventLabel = OCR.getLabelStatus(progress.status);
					// eventLabel && global.__io.emit(eventLabel, progress);
					global.__io.emit('ocr:extract-status', progress);
				}
			);
			if (!page) {
				throw new Error('Cannot extract text from image');
			}

			const extracted_text = page.text;
			const page_bbox = page.words.map((word) => ({
				bbox: word.bbox,
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
			const file_data = file.buffer;
			const file_extension = file.originalname.split('.').pop();
			const file_type = file.mimetype;
			const tmp_file_path = `storage/tmp/ocr`;
			const tmp_file_name = `${crypto.randomBytes(16).toString('hex')}.${file_extension}`;
			// const create_tmp_file = await FileStorageService.create_tmp_file(tmp_file_path, file_data, new Date(Date.now() + 1000 * 60 * 60 * 24));
			// await CloudStorage.setLifecycleRule('connected-brain-bucker', 24);
			const create_tmp_file = await CloudStorage.uploadFileToGCP(
				file_data,
				{
					bucketName: 'connected-brain-bucker',
					specialPath: tmp_file_path,
					mimeType: file_type,
					fileName: tmp_file_name,
				});

			if (!create_tmp_file) {
				throw new Error('Cannot create tmp file');
			}
			const page = await OCR.processImage(file_data, 'eng', );
			response_header_template(res).status(HttpStatusCode.Ok).send(page?.text);

		} catch (error: any) {
			response_header_template(res).status(error.statusCode||HttpStatusCode.InternalServerError).send({message: error.message});
		}
	});
}