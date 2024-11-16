import React from 'react';
import { Center } from '@mantine/core';

import TranscriptActiveSentence
	from '@/containers/Apps/SpeechToText/components/Transcript/transcript_active_sentence.tsx';
import TranscriptSentencesList
	from '@/containers/Apps/SpeechToText/components/Transcript/transcript_sentences_list.tsx';
import { TranscriptTranslate } from '@/containers/Apps/SpeechToText/components/Transcript/transcript_translate.tsx';

function TranscriptList() {

	return (
		<Center className="flex-grow w-full overflow-hidden flex flex-col lg:flex-row">
			<Center className="flex-grow h-full lg:max-w-[50%]  w-full overflow-hidden flex flex-col">
				<TranscriptSentencesList />
				<TranscriptActiveSentence />
			</Center>
			<div className="lg:max-w-[50%] w-full h-fit lg:h-full flex flex-col flex-grow p-3">
				<TranscriptTranslate />
			</div>
		</Center>
	);
}

export default TranscriptList;