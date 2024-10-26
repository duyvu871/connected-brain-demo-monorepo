function convertTranscript(data: any): Result {
	const transcript: Result = [];
	let currentSentence: TranscriptSentence = {
		start: 0,
		end: 0,
		speaker: 'unknown', // You might need to adjust this based on your data
		text: '',
		words: [],
	};

	data.data.timestamps.forEach((timestamp: any, index: number) => {
		const words: TranscriptWord[] = timestamp.tokens.map((token: any, wordIndex: number) => ({
			start: timestamp.start + (wordIndex === 0 ? 0 : data.data.timestamps[index - 1].end),
			end: timestamp.end,
			text: '', // You'll need to map tokens to words
			confidence: timestamp.avg_logprob, // Assuming this represents confidence
			speaker: currentSentence.speaker,
		}));

		currentSentence.end = timestamp.end;
		currentSentence.text = timestamp.text;
		currentSentence.words = words;

		transcript.push(currentSentence);

		// Reset for the next sentence
		currentSentence = {
			start: timestamp.end,
			end: 0,
			speaker: 'unknown', // Adjust as needed
			text: '',
			words: [],
		};
	});

	return transcript;
}