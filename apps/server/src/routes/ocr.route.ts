import { Router } from 'express';
import { validateBody, validateHeader, validateParams, validateQuery } from '@/middlewares/validate';
import { TranslateValidation } from '@/validations/translate.validation';
import { TranslateController } from '@/controllers/translate.controller';
import OCRValidation, { UploadBody } from '@/validations/ocr.validation';
import OCRController from '@/controllers/ocr.controller';
import upload from '@/configs/upload';
import UserValidation from '@/validations/user.validation';
import { authenticate } from '@/middlewares/auth';

export const ocrRouter: Router = Router();
console.log('ocr routing loaded: ', '/api/v1/feature/ocr');

ocrRouter.route('/upload-file').post(
	validateHeader(UserValidation.getUserHeaders),
	authenticate,
	validateQuery(OCRValidation.uploadQuery),
	upload({mimetype: /^(image\/|(application\/pdf))/i}, {fileSize:1024 * 1024 * 100}).single('file'),
	OCRController.uploadFile);
ocrRouter.route('/upload-url').post(validateHeader(OCRValidation.uploadHeaders), validateBody(OCRValidation.uploadBody), OCRController.uploadFileWithoutAuth);
ocrRouter.route('/capture').post(validateBody(OCRValidation.captureBody), TranslateController.detect);
ocrRouter.route('/upload-without-auth').post(
	validateQuery(OCRValidation.uploadQuery),
	upload({mimetype: /^(image\/|(application\/pdf))/i}, {fileSize:1024 * 1024 * 100}).single('file'),
	OCRController.uploadFileWithoutAuth);
ocrRouter.route('/get-extract/:id/:page').get(
	validateHeader(UserValidation.getUserHeaders),
	authenticate,
	validateQuery(OCRValidation.getExtractQuery),
	validateParams(OCRValidation.getExtractParams),
	OCRController.getExtract);
