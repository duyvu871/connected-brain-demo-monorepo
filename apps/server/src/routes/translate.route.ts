import { Router } from 'express';
import { validateBody } from '@/middlewares/validate';
import { TranslateValidation } from '@/validations/translate.validation';
import { TranslateController } from '@/controllers/translate.controller';

export const translateRouter: Router = Router();
console.log('translate routing loaded: ', '/api/v1/feature/translate');

translateRouter.route('/').post(validateBody(TranslateValidation.translateBody), TranslateController.translate);
translateRouter.route('/detect-language').post(validateBody(TranslateValidation.detectLanguageBody), TranslateController.detect);
