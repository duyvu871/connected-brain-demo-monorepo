import React from 'react';
import { Flex } from '@mantine/core';
import TranscriptPlayer from '@/containers/Apps/SpeechToText/components/Transcript/transcript_player';
import TranscriptPlayerTimeline from '@/containers/Apps/SpeechToText/components/Transcript/transcript_player_timeline';

function TranscriptToolbar() {
	return (
		<Flex align="center" className="flex-col-reverse pb-2 lg:flex-row lg:pb-0 h-fit w-full max-w-3xl rounded-[1rem] bg-gray-600/50 pl-10 pr-5 select-none"
					justify="space-between">
			<TranscriptPlayer />
			<TranscriptPlayerTimeline />
		</Flex>
	);
}

export default TranscriptToolbar;