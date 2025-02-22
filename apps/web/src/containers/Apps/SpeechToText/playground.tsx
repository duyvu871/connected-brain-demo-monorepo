'use client';
import React, { useEffect, useLayoutEffect } from 'react';
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
import { IOSocketAtom, transcript } from '@/containers/Apps/SpeechToText/states/transcript';
import TranscriptFeature from '@/containers/Apps/SpeechToText/components/Transcript/Transcript_feature';
import { io } from 'socket.io-client';
import { constants } from '@repo/utils';
import RotateLoader from '@ui/resource-ui/Loader/spinner.tsx';
import TranscriptPanel from '@/containers/Apps/SpeechToText/components/playground/transcript-panel.tsx';
import { PlayerProvider } from '@/providers/speech-to-text/player-provider.tsx';
import { RecordModal } from '@/containers/Apps/SpeechToText/components/Record/record-modal.tsx';

function AppS2T({id}: {id?: string}) {
	const {api_route} = constants;
	const [isSectionLoad, _] = useAtom(isSectionLoaded);
	const [currentSection, setCurrentSection] = useAtom(sectionId);
	const [transcript_data, setTranscriptData] = useAtom(transcript);
	const [getC, setCurrentFile] = useAtom(audioFile);
	const [, setIOSocket] = useAtom(IOSocketAtom);
	const { getTranscript, getTranscriptList } = useTranscript();

	useLayoutEffect(() => {
		if (!isSectionLoad && id) {
			console.log("id", id);
			setCurrentSection(id);
		}
	}, [id, isSectionLoad, setCurrentSection]);

	useEffect(() => {
		if (!id) return;
		const socketConnectEndpoint =
			`${process.env.NEXT_PUBLIC_API_BASE_URL}${api_route.API.feature.SPEECH_TO_TEXT.socket}`
		console.log("socket place:", socketConnectEndpoint);
		const socket = io(socketConnectEndpoint,
			{
				transports: ["websocket"], // use websocket only
				addTrailingSlash: false, // remove trailing slash
				timeout: 20000, // 20 seconds timeout
				reconnectionAttempts: 5, // retry 5 times
				reconnectionDelay: 3000, // delay 3 seconds
				path: "/socket/socket.io",
				query: {
					sessionId: id
				}
			});
		socket.on("connect", () => {
			socket.emit("get-s2t-status", { id });
			console.log("socket connected");
			socket.on("s2t:transcript", (data) => {
				// console.log(data);
				const transcriptData = JSON.parse(data);
				console.log("transcriptData", transcriptData);
				setTranscriptData(transcriptData);
				setCurrentFile({
					url: transcriptData.cloudPath,
					name: transcriptData.originName,
				});
			})
		});
		socket.on('disconnect', () => {
			console.log("socket dis onnected");
		});
		socket.on("connect_error", (error) => {
			console.error("Socket connection error:", error);
		});
		setIOSocket(socket);
		return () => {
			console.log("socket disconnect");
			if (socket) socket.disconnect();
		}
	}, [id]);

	useLayoutEffect(() => {
		if (currentSection) {
			(async () => {
				// await getTranscriptList();
				// get transcript data if transcript data not have data
				// if (!transcript_data) {
				// 	const transcriptData = await getTranscript(currentSection);
				// 	setTranscriptData(transcriptData);
				// 	setCurrentFile({
				// 		url: transcriptData.cloudPath,
				// 		name: transcriptData.originName,
				// 	});
				// }
				// // check if current section has local data
				// if (!transcript_data?.auditPath.includes(currentSection)) {
				// 	const transcriptData = await getTranscript(currentSection);
				// 	setTranscriptData(transcriptData);
				// 	setCurrentFile({
				// 		url: transcriptData.cloudPath,
				// 		name: transcriptData.originName,
				// 	});
				// }
			})();
		}
	}, [currentSection]);

	useEffect(() => {
		document.addEventListener("DOMContentLoaded", () => {
			document.addEventListener('hide.bs.modal', (event) => {
				if (document.activeElement) {
					// @ts-ignore
					document.activeElement.blur();
				}
			});
		});
	}, []);

	return (
		<PlayerProvider>
			<DynamicContentLoaded>
				<Center className="bg-zinc-950 h-[calc(100vh_-_59px)]">
					<Flex align="center" className="gap-0" direction="row" h="100%" justify="center" w="100%">
						{(isSectionLoad) ? !transcript_data?.transcript.length && (
							<Flex align="center" className="gap-8 flex-col">
								<RotateLoader
									classNames={{
										spinner: "scale-[2]",
										// wrapper: "w-20 h-20"
									}}
								/>
								<span className="text-zinc-100 (-dark:text-zinc-100 -text-zinc-700) text-2xl">
								Wait a few minutes for the server to handle this audio...
								</span>
							</Flex>
						) : null}
						<>

							{
								(isSectionLoad)
									? Boolean(transcript_data?.transcript.length) && (
									<Flex align="center" className="rounded-[2rem] gap-5 flex-grow-[7]" direction="column" h="100%"
												justify="center">
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
									</Flex>
								)
									: (<StarterScreen />)
							}

							{
								(isSectionLoad && Boolean(transcript_data?.transcript.length)) ?
									<TranscriptPanel className="!hidden lg:!flex" />
									: null
							}
						</>
					</Flex>
				</Center>
				<RecordModal />
			</DynamicContentLoaded>
		</PlayerProvider>
	);
}

export default AppS2T;