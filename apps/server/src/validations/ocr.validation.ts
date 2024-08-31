import { z } from 'zod';
import { TranslateValidation } from '@/validations/translate.validation';

export type UploadBody = z.infer<typeof OCRValidation.uploadBody>;

export default class OCRValidation {
	public static uploadBody = z.object({
		file: z.string().optional(),
		url: z.string().optional(),
	}).partial()
		.superRefine((data, ctx) => {
		const fileExists = !!data.file;
		const urlExists = !!data.url;
		if (fileExists && urlExists) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Only one of file or url should be provided',
				path: ['file', 'url'],
			});
		} else if (!fileExists && !urlExists) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Either file or url should be provided',
				path: ['file', 'url'],
			});
		}
	}).sourceType();

	public static uploadHeaders =  z.object({
		authorization: z
			.string({
				required_error: 'Authorization header is required',
				invalid_type_error: 'Invalid authorization header',
			})
			.startsWith('Bearer ', 'Authorization header must start with "Bearer "'),
	});

	public static captureBody = z.object({
		image: z.string().refine((value) => /^data:([A-Za-x-+/]+);base64,/.test(value), {
			message: 'Invalid image data',
		}),
	});

	public static captureHeaders = z.object({
		authorization: z
			.string({
				required_error: 'Authorization header is required',
				invalid_type_error: 'Invalid authorization header',
			})
			.startsWith('Bearer ', 'Authorization header must start with "Bearer "'),
	});
	public static uploadQuery = z.object({
		clientId: z.string().optional(),
		source: TranslateValidation.translateIsoCode("target"),
		target: TranslateValidation.translateIsoCode("target"),
	});
	public static getExtractQuery = z.object({
		clientId: z.string(),
	});
	public static getExtractParams = z.object({
		id: z.string(),
		page: z.string(),
	});
}