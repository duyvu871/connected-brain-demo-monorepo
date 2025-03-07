import { Router } from 'express';
import { validateBody, validateHeader, validateParams, validateQuery } from '@/middlewares/validate';
import LLMValidation from '@/validations/llm.validation';
import LLMController from '@/controllers/llm.controller';
import upload from '@/configs/upload';
import UserValidation from '@/validations/user.validation';
import { authenticate } from '@/middlewares/auth';

export const llmRouter: Router = Router();
console.log('llm routing loaded: ', '/api/v1/feature/llm');

llmRouter.route('/upload-file').post(
	upload({mimetype: /^(application\/pdf)/i}, {fileSize:1024 * 1024 * 100}).array('file'),
	validateHeader(UserValidation.getUserHeaders),
	authenticate,
	// validateQuery(LLMValidation.uploadQuery),
	LLMController.uploadFile);

llmRouter.route('/upload-without-auth').post(
	validateQuery(LLMValidation.uploadQuery),
	upload({mimetype: /^(application\/pdf)/i}, {fileSize:1024 * 1024 * 100}).single('file'),
	LLMController.uploadFileWithoutAuth);

llmRouter.route('/upload-url').post(
	validateHeader(LLMValidation.uploadHeaders), 
	validateBody(LLMValidation.uploadBody), 
	LLMController.uploadURL);