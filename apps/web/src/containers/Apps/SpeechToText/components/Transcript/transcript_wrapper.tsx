import React from 'react';
import { Box } from '@mantine/core';
import TranscriptToolbar from '@/containers/Apps/SpeechToText/components/Transcript/transcript_toolbar';
import TranscriptEditor from '@/containers/Apps/SpeechToText/components/Transcript/transcript_editor';
import { Spacer } from '@nextui-org/react';

function TranscriptWrapper() {
	return (
		<Box className="flex-grow h-[inherit] max-h-full w-full flex flex-col justify-center items-center">
			<TranscriptEditor />
			<Spacer className="border-t border-zinc-700 w-full" y={0} />
			<TranscriptToolbar />
		</Box>
	);
}

export default TranscriptWrapper;