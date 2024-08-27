import React from 'react';
import { Box } from '@mantine/core';
import { Tab, Tabs } from '@nextui-org/react';
import { useAtom } from 'jotai';
import { TranscriptActiveFeature, transcriptActiveFeature } from '@/containers/Apps/SpeechToText/states/transcript';

function TranscriptFeatureTab() {
	const [selected, setSelected] = useAtom(transcriptActiveFeature);
	return (
		<Box className="w-full">
			<div className="flex w-full flex-col">
				<Tabs
					aria-label="Options"
					className="w-full"
					classNames={{
						tabList: 'w-full bg-zinc-950 rounded-lg border border-zinc-800',
						cursor: 'dark:bg-zinc-900 rounded-lg',
					}}
					onSelectionChange={setSelected as any}
					selectedKey={selected}
					size="lg"
				>
					{Object.keys(TranscriptActiveFeature).map((key) => (
						<Tab key={key}
								 title={TranscriptActiveFeature[key as keyof typeof TranscriptActiveFeature]}
								 value={TranscriptActiveFeature[key as keyof typeof TranscriptActiveFeature]}>
							{/*{key}*/}
						</Tab>
					))}
				</Tabs>
			</div>
		</Box>
	);
}

export default TranscriptFeatureTab;