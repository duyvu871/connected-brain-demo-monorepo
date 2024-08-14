export const escapeCode = (str: string) => {
	const escapeMap: Record<string, string> = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;',
		"\\": '%5C',
		"\\a": '%07',
		"\\b": '%08',
		"\\t": '%09',
		"\\n": '%0A',
		"\\v": '%0B',
		"\\f": '%0C',
		"\\r": '%0D',
		"\\e": '%1B',
	};

	return str.replace(/[&<>"'\\]/g, (m) => escapeMap[m]);
}