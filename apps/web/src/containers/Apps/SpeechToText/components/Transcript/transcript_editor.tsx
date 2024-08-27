import React from 'react';
import { Center } from '@mantine/core';

import TranscriptActiveSentence
	from '@/containers/Apps/SpeechToText/components/Transcript/transcript_active_sentence.tsx';
import TranscriptSentencesList
	from '@/containers/Apps/SpeechToText/components/Transcript/transcript_sentences_list.tsx';

function TranscriptList() {

	return (
		<Center className="flex-grow w-full overflow-hidden flex flex-col">
			<TranscriptSentencesList />
			<TranscriptActiveSentence />
		</Center>
	);
}

export default TranscriptList;