import React, { useState } from 'react';
import { Center, Flex, Title } from '@mantine/core';
import VoiceRecord from '@/containers/Apps/SpeechToText/components/Record/stream_record';
import UploadAudio from '@/containers/Apps/SpeechToText/components/Record/upload';
import { Tab, Tabs } from '@nextui-org/react';
import WaveformVisualizer from '@/containers/Apps/SpeechToText/components/Record/audio_transcription.tsx';
import { RecordModalTrigger } from '@/containers/Apps/SpeechToText/components/Record/record-modal.tsx';

function StarterScreen() {
	const [activeTab, setActiveTab] = useState<'Upload' | 'Record'>('Upload');

	return (
		<Flex className="gap-5 p-5" direction="column" h="100%" w="100%">
			<Flex align="center" className="gap-5" direction="column" justify="center">
				<Title className="text-3xl text-zinc-100" fw="bold" order={1}>Start {activeTab}</Title>
				<Title className="text-zinc-400" fw="normal" order={3}>
					Click the button below to begin recording your audio.
				</Title>
			</Flex>
			<Flex align="center" direction="column" justify="center">
				<Center className="p-5 w-full h-60">
					<UploadAudio
						classNames={{
							container: 'h-fit',
							label: 'border border-zinc-700 rounded-full p-1',
						}}
						size="lg"
					/>
				</Center>
				{/*<Tabs*/}
				{/*	aria-label="Dynamic tabs"*/}
				{/*	classNames={{*/}
				{/*		tabList: 'bg-zinc-900',*/}
				{/*		cursor: 'dark:bg-zinc-700',*/}
				{/*	}}*/}
				{/*	onSelectionChange={setActiveTab as any}*/}
				{/*	selectedKey={activeTab}*/}
				{/*	size="lg"*/}
				{/*>*/}
				{/*	<Tab key="Record" title="Recording">*/}
				{/*		<Center className="p-5 w-full h-fit">*/}
				{/*			/!*<VoiceRecord size={{*!/*/}
				{/*			/!*	wrapper: 'xl',*!/*/}
				{/*			/!*	icon: 'xl',*!/*/}
				{/*			/!*}} />*!/*/}
				{/*			<RecordModalTrigger />*/}
				{/*		</Center>*/}
				{/*	</Tab>*/}
				{/*	<Tab key="Upload" title="Upload">*/}
				{/*		<Center className="p-5 w-full h-60">*/}
				{/*			<UploadAudio*/}
				{/*				classNames={{*/}
				{/*					container: 'h-fit',*/}
				{/*					label: 'border border-zinc-700 rounded-full p-1',*/}
				{/*				}}*/}
				{/*				size="lg"*/}
				{/*			/>*/}
				{/*		</Center>*/}
				{/*	</Tab>*/}
				{/*</Tabs>*/}
			</Flex>
		</Flex>
	);
}

export default StarterScreen;