import React from 'react';
import { Container } from '@mantine/core';
import TranscriptToolbar from '@/containers/Apps/SpeechToText/components/Transcript/transcript_toolbar';
import TranscriptEditor from '@/containers/Apps/SpeechToText/components/Transcript/transcript_editor';

function TranscriptWrapper() {
	return (
		<Container className="flex-grow h-[inherit] max-h-full w-full flex flex-col justify-center items-center p-3">
			<TranscriptEditor />
			<TranscriptToolbar />
		</Container>
	);
}

export default TranscriptWrapper;