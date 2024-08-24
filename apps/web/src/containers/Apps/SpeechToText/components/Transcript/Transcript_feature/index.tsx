import React, { lazy } from 'react';
import { useAtom } from 'jotai/index';
import { transcriptActiveFeature } from '@/containers/Apps/SpeechToText/states/transcript';

const FeatureComponents = {
	Transcript: lazy(() => import('./transcript_list')),
	Notes: lazy(() => import('./transcript_note')),
	Speaker: lazy(() => import('./transcript_speaker')),
};

function TranscriptFeature() {
	const [selected] = useAtom(transcriptActiveFeature);
	const SelectedComponent = FeatureComponents[selected];
	return (
		<React.Suspense fallback={<div />}>
			{selected && FeatureComponents[selected] ? <SelectedComponent /> : null}
		</React.Suspense>
	);
}

export default TranscriptFeature;