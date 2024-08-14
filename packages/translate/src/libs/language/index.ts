import names, {LanguageNameType} from '../../utils/languageNames';
import iso, {ISOLangType} from '../../utils/isoLanguage';
const isoKeys = Object.values(iso).sort();

export default (name: string): LanguageNameType | ISOLangType => {
    // Validate the name string
    if (typeof name !== "string") {
        throw new Error(`The "language" must be a string, received ${typeof name}`);
    }
    // Possible overflow errors
    if (name.length > 100) {
        throw new Error(`The "language" is too long at ${name.length} characters`);
    }
    // Let's work with lowercase for everything
    const lowerCase = name.toLowerCase();
    // Pass it through several possible maps to try to find the right one
    const langCode = names[lowerCase as LanguageNameType] || iso[lowerCase as ISOLangType] || lowerCase;
    // Make sure we have the correct name or throw
    if (!isoKeys.includes(langCode)) {
        throw new Error(`The language "${langCode}" is not part of the ISO 639-1`);
    }
    return langCode as LanguageNameType | ISOLangType;
};