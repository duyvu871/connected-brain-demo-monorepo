import GoogleTranslator from './google-translator';

const engines = {
	google: GoogleTranslator,
}

export type EngineType = typeof GoogleTranslator;

export default engines;