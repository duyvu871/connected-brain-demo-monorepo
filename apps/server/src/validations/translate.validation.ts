import { z, ZodEnum } from 'zod';
import ISOLanguages, {ISOLangType} from "@translate/utils/isoLanguage";
import { LanguageNameType } from '@translate/utils/languageNames';

export const translateISOCode = [...Object.keys(ISOLanguages), ...Object.values(ISOLanguages)] as (ISOLangType | LanguageNameType)[];

export class TranslateValidation {
	public static translateIsoCode = (valueName: string) => {
		return z.enum([translateISOCode[0], ...translateISOCode.slice(1)], {
			// required_error: `${valueName} is required`,
			invalid_type_error: `${valueName} is not a valid ISO code`,
		})
	};
	public static translateBody = z.object({
		text: z.string().min(1, "text field is not empty"),
		from: this.translateIsoCode("from").optional(),
		to: this.translateIsoCode("to").optional().default('eng'),
	});
	public static detectLanguageBody = z.object({
		text: z.string().min(1, "text field is not empty"),
	});
}