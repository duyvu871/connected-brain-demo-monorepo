import { Router } from "express";
import { validateBody, validateHeader } from '@/middlewares/validate';
import UserValidation from '@/validations/user.validation';
import { authenticate } from '@/middlewares/auth';
import upload from '@/configs/upload';
import { VoiceSeparationController } from '@/controllers/voice_separation.controller';
import { VoiceIdentifyController } from "@/controllers/voice_identify.controller";
import { VoiceIdentificationValidation } from "@/validations/voice_identification.validation";

export const voiceIdentificationRoute: Router = Router();

voiceIdentificationRoute.route('/register').post(
	// validateHeader(UserValidation.getUserHeaders),
	// authenticate,
	upload({mimetype: /^audio\//}, {fileSize: 1024 * 1024 * 100}).single('file'),
    validateBody(VoiceIdentificationValidation.registerBody),
	VoiceIdentifyController.register
)

voiceIdentificationRoute.route('/identify').post(
	// validateHeader(UserValidation.getUserHeaders),
	// authenticate,
	upload({mimetype: /^audio\//}, {fileSize: 1024 * 1024 * 100}).single('file'),
	VoiceIdentifyController.identify
)