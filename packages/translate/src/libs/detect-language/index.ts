import dbLang from './data/lang.json';
import {Prototype as Parser} from './parser';
import Languages from './ISO639';

const {getCode2, getCode3} = Languages;

class LanguageDetect {
	langDb = {};
	threshold = 300;
	useUnicodeNarrowing = true;
	unicodeMap = {};
	languageType = null;

	constructor(languageType?: any) {

		/**
		 * The trigram data for comparison
		 *
		 * Will be loaded on start from $this->_db_filename
		 *
		 * May be set to a PEAR_Error object if there is an error during its
		 * initialization
		 *
		 * @var      array
		 * @access   private
		 */
		this.langDb = {};

		/**
		 * The size of the trigram data arrays
		 *
		 * @var     int
		 * @access  private
		 */
		this.threshold = 300;

		this.useUnicodeNarrowing = true;

		/**
		 * Constructor
		 *
		 * Load the language database.
		 *
		 */
		this.langDb = dbLang['trigram'];
		this.unicodeMap = dbLang['trigram-unicodemap'];

		this.languageType = languageType || null;
	}

	getLanguageCount() {
		return this.getLanguages().length;
	}
	setLanguageType(type: any) {
		return this.languageType = type;
	}
	/**
	 * Returns the list of detectable languages
	 *
	 * @access public
	 * @return object the names of the languages known to this object
	 */
	getLanguages() {
		return Object.keys(this.langDb);
	}
	/**
	 * Calculates a linear rank-order distance statistic between two sets of
	 * ranked trigrams
	 *
	 * Sums the differences in rank for each trigram. If the trigram does not
	 * appear in both, consider it a difference of $this->_threshold.
	 *
	 * This distance measure was proposed by Cavnar & Trenkle (1994). Despite
	 * its simplicity it has been shown to be highly accurate for language
	 * identification tasks.
	 *
	 * @access  private
	 * @param   arr1  the reference set of trigram ranks
	 * @param   arr2  the target set of trigram ranks
	 * @return  int   the sum of the differences between the ranks of
	 *                the two trigram sets
	 */
	distance(arr1 = [], arr2 = []) {
		let me = this
			, sumdist = 0
			, keys = Object.keys(arr2)
			, i;

		for (i = keys.length; i--;) {
			// @ts-ignore
			sumdist += arr1[keys[i]] ? Math.abs(arr2[keys[i]] - arr1[keys[i]]) : me.threshold;
		}

		return sumdist;
	}
	/**
	 * Normalizes the score returned by _distance()
	 *
	 * Different if perl compatible or not
	 *
	 * @access  private
	 * @param   score       the score from _distance()
	 * @param   baseCount   the number of trigrams being considered
	 * @return  number      the normalized score
	 *
	 * @see     distance()
	 */
	normalizeScore(score: number, baseCount: number) {
		return 1 - (score / (baseCount || this.threshold) / this.threshold);
	}
	/**
	 * Detects the closeness of a sample of text to the known languages
	 *
	 * Calculates the statistical difference between the text and
	 * the trigrams for each language, normalizes the score then
	 * returns results for all languages in sorted order
	 *
	 * If perl compatible, the score is 300-0, 0 being most similar.
	 * Otherwise, it's 0-1 with 1 being most similar.
	 *
	 * The $sample text should be at least a few sentences in length;
	 * should be ascii-7 or utf8 encoded, if another and the mbstring extension
	 * is present it will try to detect and convert. However, experience has
	 * shown that mb_detect_encoding() *does not work very well* with at least
	 * some types of encoding.
	 *
	 * @access  public
	 * @param   sample  a sample of text to compare.
	 * @param   limit  if specified, return an array of the most likely
	 *                  $limit languages and their scores.
	 * @return  Array   sorted array of language scores, blank array if no
	 *                  useable text was found, or PEAR_Error if error
	 *                  with the object setup
	 *
	 * @see     distance()
	 */
	detect(sample: string | undefined, limit: number | undefined) {
		const me = this
			, scores = [];
		// @ts-ignore
		limit = +limit || 0;

		if (sample === '' || String(sample).length < 3) return [];

		const sampleObj = new Parser(sample);
		sampleObj.setPadStart(true);
		sampleObj.analyze();

		const trigramFreqs = sampleObj.getTrigramRanks()
			// @ts-ignore
			, trigramCount = Object.keys(trigramFreqs).length;

		if (trigramCount === 0) return [];

		let keys = [], i, lang;

		if (this.useUnicodeNarrowing) {
			const blocks = sampleObj.getUnicodeBlocks()
				, languages = Object.keys(blocks)
				, keysLength = languages.length;

			for (i = keysLength; i--;) {
				// @ts-ignore
				if (this.unicodeMap[languages[i]]) {
					// @ts-ignore
					for (lang in this.unicodeMap[languages[i]]) {
						if (!~keys.indexOf(lang)) keys.push(lang);
					}
				}
			}
		} else {
			keys = me.getLanguages();
		}

		for (i = keys.length; i--;) {
			// @ts-ignore
			const score = me.normalizeScore(me.distance(me.langDb[keys[i]], trigramFreqs), trigramCount);
			if (score) scores.push([keys[i], score]);
		}

		// Sort the array
		scores.sort(function(a, b) {
			// @ts-ignore
			return b[1] - a[1];
		});
		const scoresLength = scores.length;

		if (!scoresLength) return [];


		switch (me.languageType) {
			// @ts-ignore
			case 'iso2':
				for (i = scoresLength; i--;) {
					// @ts-ignore
					scores[i][0] = getCode2(scores[i][0]);
				}
				break;
			// @ts-ignore
			case 'iso3':
				for (i = scoresLength; i--;) {
					// @ts-ignore
					scores[i][0] = getCode3(scores[i][0]);
				}
				break;
		}

		// limit the number of returned scores
		return limit > 0 ? scores.slice(0, limit) : scores;
	}
}

export class Prototype extends LanguageDetect{
	constructor(languageType: any) {
		super(languageType);
	}
	/**
	 * Returns the number of languages that this object can detect
	 *
	 * @access public
	 * @return int the number of languages
	 */
};

export default LanguageDetect;