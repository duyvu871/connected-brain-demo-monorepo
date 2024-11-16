"use client";
import React, { forwardRef } from 'react';
import TranscriptSearch from '@/containers/Apps/SpeechToText/components/Transcript/transcript_search.tsx';
import TranscriptFeatureTab from '@/containers/Apps/SpeechToText/components/Transcript/Transcript_feature_tab.tsx';
import TranscriptFeature from '@/containers/Apps/SpeechToText/components/Transcript/Transcript_feature';
import type { CenterProps} from '@mantine/core';
import { Center, Flex, } from '@mantine/core';
import { cn } from '@repo/utils';

const TranscriptPanel = forwardRef<HTMLDivElement, CenterProps>((props, ref) => {
	const { className, ...otherProps } = props;
	return (
		<Center
			className={cn("max-w-md w-full min-w-96 border-0 border-l border-zinc-800", className)}
			h="100%"
			ref={ref}
			w="1/2"
			{...otherProps}
		>
			<Flex align="center" className="flex-grow h-full bg-zinc-950 rounded-2xl p-5 gap-3" direction="column"
						justify="start">
				{/*<TranscriptSearch />*/}
				<TranscriptFeatureTab />
				<TranscriptFeature />
			</Flex>
		</Center>
	);
});
TranscriptPanel.displayName = 'TranscriptPanel';

export default TranscriptPanel;