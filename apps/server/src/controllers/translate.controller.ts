import {TranslateService, ISOLangType, DetectLanguage} from '@translate/index';
import AsyncMiddleware from '@/helpers/waiter.helper';
import type { Request, Response } from 'express';
import { HttpStatusCode } from '@/helpers/http_status_code';

export class TranslateController {
	// for express middleware
	// @ts-ignore
	public static translate = AsyncMiddleware.asyncHandler(async (req, res, next) => {
			try {
				const {text, from, to} = req.body as {text: string, from: ISOLangType, to: ISOLangType};
				const translator = new TranslateService();
				const translateResponse = await translator.translate(text, {from, to});

				return res.status(HttpStatusCode.Ok).json({
					translation: translateResponse.translation,
					// from,
					// to,
				});
			} catch (error: any) {
				return res.status(HttpStatusCode.InternalServerError).json({error: error.message});
			}

	});
	// @ts-ignore
	public static detect = AsyncMiddleware.asyncHandler(async (req: Request, res: Response) => {
		try {
			const {text} = req.body as {text: string};
			const translator = new DetectLanguage();
			const detected = translator.detect(text, 2);
			return res.status(HttpStatusCode.Ok).json({detected, text});
		} catch (error: any) {
			return res.status(HttpStatusCode.InternalServerError).json({error: error.message});
		}
	});
}