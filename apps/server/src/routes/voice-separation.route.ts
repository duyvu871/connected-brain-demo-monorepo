import { Router } from "express";
import { validateHeader } from '@/middlewares/validate';
import UserValidation from '@/validations/user.validation';
import { authenticate } from '@/middlewares/auth';
import upload from '@/configs/upload';

export const voiceSeparationRoute: Router = Router();

voiceSeparationRoute.route('/separate').post(
	validateHeader(UserValidation.getUserHeaders),
	authenticate,
	upload({mimetype: /^audio\//}, {fileSize:1024 * 1024 * 100}).single('file')
)