'use client';
import React, { useLayoutEffect } from 'react';
import { Center, Flex } from '@mantine/core';
import TranscriptResultProgress from '@/containers/Apps/SpeechToText/components/Analytics/Progress';
import Duration from '@/containers/Apps/SpeechToText/components/Transcript/Transcript_spec/Duration';
import DynamicContentLoaded from '@/containers/Apps/SpeechToText/components/DynamicContentLoaded';
import { useAtom } from 'jotai';
import { audioFile, isSectionLoaded, sectionId } from '@/containers/Apps/SpeechToText/states/jotai';
import StarterScreen from '@/containers/Apps/SpeechToText/starter-screen';
import TranscriptSearch from '@/containers/Apps/SpeechToText/components/Transcript/transcript_search';
import TranscriptFeatureTab from '@/containers/Apps/SpeechToText/components/Transcript/Transcript_feature_tab';
import TranscriptWrapper from '@/containers/Apps/SpeechToText/components/Transcript/transcript_wrapper';
import { useTranscript } from '@/containers/Apps/SpeechToText/hooks/useSpeechToText';
import { transcript } from '@/containers/Apps/SpeechToText/states/transcript';
import TranscriptFeature from '@/containers/Apps/SpeechToText/components/Transcript/Transcript_feature';


function AppS2T() {
	const [isSectionLoad, _] = useAtom(isSectionLoaded);
	const [currentSection] = useAtom(sectionId);
	const [transcript_data, setTranscriptData] = useAtom(transcript);
	const [getC, setCurrentFile] = useAtom(audioFile);
	const { getTranscript, getTranscriptList } = useTranscript();

	useLayoutEffect(() => {
		if (currentSection) {
			(async () => {
				await getTranscriptList();
				// get transcript data if transcript data not have data
				if (!transcript_data) {
					const transcriptData = await getTranscript(currentSection);
					setTranscriptData(transcriptData);
					setCurrentFile({
						url: transcriptData.cloudPath,
						name: transcriptData.originName,
					});
					return;
				}
				// check if current section has local data
				if (!transcript_data.auditPath.includes(currentSection)) {
					const transcriptData = await getTranscript(currentSection);
					setTranscriptData(transcriptData);
					setCurrentFile({
						url: transcriptData.cloudPath,
						name: transcriptData.originName,
					});
					
				}
			})();
		}
	}, [currentSection]);
	return (
		<DynamicContentLoaded>
			<Center className="bg-zinc-950 h-[calc(100vh_-_59px)]">
				<Flex align="center" className="gap-0" direction="row" h="100%" justify="center" w="100%">
					<Flex align="center" className="rounded-[2rem] gap-5 flex-grow-[7]" direction="column" h="100%"
								justify="center">
						{
							isSectionLoad
								? (
									<Flex align="center"
												className="flex-grow w-full h-full gap-5"
												direction="column"
												justify="center"
									>
										<Flex align="center" className="gap-5 flex-grow w-full h-full"
													direction="row"
													justify="center">
											<Flex className="w-full h-full bg-zinc-950 rounded-xl ">
												<TranscriptWrapper />
											</Flex>
										</Flex>
									</Flex>
								)
								: (<StarterScreen />)
						}
					</Flex>
					{
						isSectionLoad ? <Center className="max-w-md min-w-96 flex-grow-[3] border-0 border-l border-zinc-800" h="100%" w="1/2">
							<Flex align="center" className="flex-grow h-full bg-zinc-950 rounded-2xl p-5 gap-3" direction="column"
										justify="start">
								<TranscriptSearch />
								<TranscriptFeatureTab />
								<TranscriptFeature />
							</Flex>
						</Center> : null
					}
				</Flex>
			</Center>

		</DynamicContentLoaded>
	);
}

export default AppS2T;