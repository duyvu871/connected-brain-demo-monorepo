import Cache, {CacheType} from "./libs/cache";
import {ISOLangType} from "./utils/isoLanguage";
import {LanguageNameType} from "./utils/languageNames";
import languages from "./libs/language";
import engines, {EngineType} from "./libs/translator";
import LanguageDetect from './libs/detect-language';

export { LanguageDetect as DetectLanguage }

export type { ISOLangType, LanguageNameType };

export type TranslateResponse = {
    translation: string;
    from: ISOLangType | LanguageNameType;
    to: ISOLangType | LanguageNameType;
    text?: string;
}

export type TranslateOptions = {
    ip?: string;
    cache_id?: string;
    text?: string;
    from?: ISOLangType | LanguageNameType | 'auto';
    to?: ISOLangType | LanguageNameType;
    cache?: typeof Cache | undefined;
    key?: string | undefined;
    languages?: (name: string) => void;
    keys?: Record<string, string> | undefined;
    engine?: EngineType;
}

export class TranslateService {
    private cache: typeof Cache;
    private key: string = '';
    private keys: TranslateOptions['keys'];
    private languages: ((name: string) => TranslateOptions['from' | 'to']) = languages;
    private from: ISOLangType | LanguageNameType | 'auto' = 'auto';
    private to: ISOLangType | LanguageNameType = 'eng';
    private options: TranslateOptions;

    constructor(options: TranslateOptions = {}) {
        const defaultOptions: TranslateOptions = {
            from: "auto",
            to: "eng",
            cache: undefined,
            key: undefined,
            languages: languages,
            keys: {},
            ip: undefined,
            engine: engines["google"],
        };

        for (const key in defaultOptions) {
            // @ts-ignore
            this[key] = typeof options[key] === 'undefined' ? defaultOptions[key] : options[key];
        }

        this.options = options;
        this.cache = this!.cache || Cache;
    }

    public async translate(text: string, options?: TranslateOptions | string): Promise<TranslateResponse> {
        let newOptions: (TranslateOptions) | string = options || {};
        if (typeof newOptions === 'string')
            // convert string to object
            newOptions = {to: options as ISOLangType | LanguageNameType};
        const invalidKeys = Object.keys(newOptions).find(key =>
            key !== 'from' && key !== 'to'
        ); // Check for invalid keys
        if (invalidKeys) {
            throw new Error(`Invalid option: ${invalidKeys}`);
        }
        // Set the options
        newOptions.text = text;
        // Check for auto detections
        if (newOptions.from === 'auto' || !newOptions.from) {
            const languageDetect = new LanguageDetect();
            const detectedResult = languageDetect.detect(text, 2)[0][0] as ISOLangType | LanguageNameType;
            newOptions.from = this.languages(detectedResult);
        } else {
            newOptions.from = this.languages(newOptions.from || this.from);
        }
        newOptions.to = this.languages(newOptions.to || this.to) as Exclude<TranslateOptions['from' | 'to'], 'auto'>;
        newOptions.cache = newOptions.cache || this.cache;
        newOptions.ip = newOptions.ip || this.options.ip || '0.0.0.0';
        newOptions.engine = newOptions.engine || this.options.engine || engines['google'];
        newOptions.cache_id = `${newOptions.ip}:${newOptions.from}:${newOptions.to}:${newOptions.engine}${newOptions.text}`;
        newOptions.keys = this.keys || {};
        // Check for keys
        for (const key in this.keys) {
            newOptions.keys[key] = newOptions.keys[key] || this.keys[key];
        }
        // Check for key
        newOptions.key = newOptions.key || this.key || newOptions.keys['google'];


        // define the translation engine
        const engine = newOptions.engine;
        const cache = newOptions.cache;
        const cache_id = newOptions.cache_id;
        const cached = cache.get(cache_id);
        // Check for cached data
        if (cached) {
            const cachedData = cached as string;
            return {
                translation: cachedData,
                from: newOptions.from as ISOLangType | LanguageNameType,
                to: newOptions.to as ISOLangType | LanguageNameType,
                text: newOptions.text,
            };
        }
        if (newOptions.from === newOptions.to) {
            const response = newOptions.text;
            return {
                translation: response,
                from: newOptions.from as ISOLangType | LanguageNameType,
                to: newOptions.to as ISOLangType | LanguageNameType,
                text: newOptions.text,
            }
        }
        const fetchWithOptions = engine.fetch({
            text: newOptions.text,
            from: newOptions.from as ISOLangType | LanguageNameType,
            to: newOptions.to as ISOLangType | LanguageNameType,
        });
        const translatedData = await fetch(fetchWithOptions[0])
          .then(engine.parse)
          .then((response: string) => {
            cache.set(cache_id, response, 1000 * 60); // Cache for 1 minute
            return response;
          });
        return {
            translation: translatedData,
            from: newOptions.from as ISOLangType | LanguageNameType,
            to: newOptions.to as ISOLangType | LanguageNameType,
            text: newOptions.text,
        };
    }
}

