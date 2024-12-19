'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from "@ui/shadcn-ui/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@ui/shadcn-ui/ui/card"
import { Mic, Square, Sun, Moon, CheckIcon } from 'lucide-react'
import { TypeAnimation } from 'react-type-animation';
import { Loader , Select, Space } from '@mantine/core'
import { cn } from '@repo/utils';
import { IoMicSharp } from 'react-icons/io5'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@ui/shadcn-ui/ui/select';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@ui/shadcn-ui/ui/command.tsx';
import { Popover, PopoverContent, PopoverTrigger, Spacer } from '@nextui-org/react'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { DialogDescription, DialogTitle } from '@ui/shadcn-ui/ui/dialog.tsx';
import axios from '@/libs/axios/v1/axios.ts';
import "./audio_transcipt.css";

const CLOSE_SIGNAL = "CLOSE"

interface TranscriptionItem {
	start_time: number;
	end_time: number;
	text: string;
}

const Cursor = () => (
	<svg
		className="cursor"
		viewBox="8 4 8 16"
		xmlns="http://www.w3.org/2000/svg"
	>
		<rect fill="#fff" height="12" width="4" x="10" y="6" />
	</svg>
)


export default function AudioTranscription() {
	const [isRecording, setIsRecording] = useState<boolean>(false)
	const [transcription, setTranscription] = useState<TranscriptionItem[]>([])
	const [isDarkMode, setIsDarkMode] = useState<boolean>(false)
	const websocketRef = useRef<WebSocket | null>(null)
	const mediaStreamRef = useRef<MediaStream | null>(null)
	const audioContextRef = useRef<AudioContext | null>(null)
	const processorRef = useRef<ScriptProcessorNode | null>(null)
	const transcriptionRef = useRef<HTMLDivElement | null>(null)
	const viewWrapperRef = useRef<HTMLDivElement | null>(null)

	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const animationMicRef = useRef<HTMLDivElement | null>(null);
	const analyserRef = useRef<AnalyserNode | null>(null);

	const [cumulativeText , setCumulativeText] = useState<string>('')
	const [translatedText, setTranslatedText] = useState<string>('')
	const [sourceLang, setSourceLang] = useState<string>('vi')
	const [toLanguage, setToLanguage] = useState<string>('en')

	const addTranscription = (text: string) => {
		setCumulativeText(prev => prev + ". " + text)
	}

	const languages = [
		{ name: 'Vietnamese', code: 'vi' },
		{ name: 'English', code: 'en' },
		{ name: 'Japanese', code: 'ja' },
		{ name: 'Korean', code: 'ko' },
		{ name: 'Chinese', code: 'zh' },
		{ name: 'French', code: 'fr' },
		{ name: 'German', code: 'de' },
		{ name: 'Spanish', code: 'es' },
		{ name: 'Russian', code: 'ru' },
		{ name: 'Italian', code: 'it' },
		{ name: 'Portuguese', code: 'pt' },
		{ name: 'Dutch', code: 'nl' },
		{ name: 'Arabic', code: 'ar' },
		{ name: 'Turkish', code: 'tr' },
		{ name: 'Thai', code: 'th' },
		{ name: 'Indonesian', code: 'id' },
		{ name: 'Hindi', code: 'hi' },
		{ name: 'Malay', code: 'ms' },
		{ name: 'Bengali', code: 'bn' },
		{ name: 'Filipino', code: 'fil' },
		{ name: 'Urdu', code: 'ur' },
	] as const;
	const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
	const [isOpenSelectLanguage, setIsOpenSelectLanguage] = useState<boolean>(false);

	const [displayResponse, setDisplayResponse] = useState<string>("");
	const [completedTyping, setCompletedTyping] = useState<boolean>(false);

	const getCompletion = useCallback(async (text: string) => {
		if (!text.trim().length) {
			setTranslatedText("");
			return;
		}

		try {
			const fromLanguage = sourceLang;
			const toLanguage = selectedLanguage;
			console.log(fromLanguage, toLanguage);
			const response = await axios.v1.translate({
				text,
				from: fromLanguage.toString(),
				to: toLanguage.toString(),
			});
			if (response) {
				console.log(response);
				setTranslatedText(response);
			}
		} catch (error) {
			console.error(error);
		}
	}, [sourceLang, selectedLanguage]);

	const resetAnimationMic = () => {
		if (animationMicRef.current) {
			clearInterval(intervalRef.current as NodeJS.Timeout);
			animationMicRef.current.style.transform = 'scale(1)';
		}
	};

	const animateMic = () => {
			intervalRef.current = setInterval(() => {
				if (analyserRef.current && animationMicRef.current) {
					const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
					analyserRef.current.getByteTimeDomainData(dataArray);
					const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
					const scaleValue = 1 + (average - 126) / 5
					animationMicRef.current.style.transform = `scale(${Math.min(Math.max(scaleValue,0.8),1.3)})`; // Giới hạn scale trong khoảng 0.8 -> 1.3
				}
			}, 100);
	};

	const startRecording = async () => {
		try {
			setIsRecording(true)
			setTranscription([])

			// get user media stream
			mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true })
			audioContextRef.current = new AudioContext({ sampleRate: 16000 })

			// create source and processor nodes
			const source = audioContextRef.current.createMediaStreamSource(mediaStreamRef.current)
			processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1)
			// create analyser node
			analyserRef.current = audioContextRef.current.createAnalyser();
			analyserRef.current.fftSize = 2048;
			source.connect(analyserRef.current);
			// animated mic after create source and processor nodes

			websocketRef.current = new WebSocket("wss://14.224.188.206:8100/record")

			websocketRef.current.onopen = () => {
				if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
					websocketRef.current.send(JSON.stringify({
						target_language: selectedLanguage,
					}))
				}
				console.log("WebSocket connection opened.")
			}

			websocketRef.current.onmessage = (event) => {
				try {
					const message = JSON.parse(event.data) as TranscriptionItem;
					setTranscription(prev => [...prev, message])
					addTranscription(message.text)
				} catch (error) {
					console.error("Error parsing JSON:", error)
				}
			}

			websocketRef.current.onerror = (error) => {
				console.error("WebSocket error:", error)
			}

			websocketRef.current.onclose = () => {
				console.log("WebSocket connection closed.")
				stopRecording()
			}

			processorRef.current.onaudioprocess = (event) => {
				const float32Array = event.inputBuffer.getChannelData(0)
				if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
					websocketRef.current.send(float32Array.buffer)
				}
			}

			source.connect(processorRef.current)
			processorRef.current.connect(audioContextRef.current.destination)
			// animateMic()

		} catch (err) {
			console.error("Error accessing microphone:", err)
			stopRecording()
		}
	}

	const stopRecording = () => {
		setIsRecording(false)
		resetAnimationMic()
		if (mediaStreamRef.current) {
			mediaStreamRef.current.getTracks().forEach(track => track.stop())
			mediaStreamRef.current = null
		}

		if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
			websocketRef.current.send(CLOSE_SIGNAL)
			websocketRef.current = null
		}

		if (audioContextRef.current) {
			audioContextRef.current.close()
			audioContextRef.current = null
		}

		if (processorRef.current) {
			processorRef.current.disconnect()
			processorRef.current = null
		}
	}

	const toggleTheme = () => {
		setIsDarkMode(!isDarkMode)
		document.documentElement.classList.toggle('dark')
	}

	const handleRecordingToggle = () => {
		if (isRecording) {
			stopRecording();
		} else {
			startRecording();
		}
	};

	useEffect(() => {
		return () => {
			stopRecording()
		}
	}, [])

	useEffect(() => {
		if (transcriptionRef.current && viewWrapperRef.current) {
			console.log(transcriptionRef.current.offsetTop, viewWrapperRef.current.clientHeight);
			if (transcriptionRef.current.offsetTop > viewWrapperRef.current.clientHeight) {
				transcriptionRef.current.scrollIntoView({
					behavior: "smooth",
					block: "end",
					inline: "nearest",
				})
			}
		}
	}, [transcription])

	useEffect(() => {
		if (cumulativeText) {
			void getCompletion(cumulativeText);
		}
	}, [cumulativeText, getCompletion]);

	return (
		<div
			className="container w-full h-[calc(100vh_-_57px)] mx-auto flex flex-col justify-between items-center p-5 pb-0">
			{/*<div className="w-full flex-grow flex flex-col items-center gap-6" />*/}
			<div className="flex items-center gap-2">
				<Mic size={32} />
				<span className="text-xl text-zinc-700 dark:text-zinc-100">
					Real-time Transcript
				</span>
			</div>
			<Spacer y={5} />
			<Card className="w-full max-w-xl flex-grow h-fit mx-auto border-0 overflow-hidden rounded-none relative">
				<CardContent className="p-0 h-full flex flex-col relative">
					<div className="relative">
						<Button
							className="w-full justify-between dark:text-zinc-400 text-zinc-700 bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700"
							onClick={() => setIsOpenSelectLanguage(true)}
							role="combobox"
							variant="outline"
						>
							{languages.find(lang => lang.code === selectedLanguage)?.name || "Select language..."}
						</Button>
						<Popover isOpen={isOpenSelectLanguage} onOpenChange={(open) => setIsOpenSelectLanguage(open)}
										 placement="bottom-start">
							<PopoverTrigger>
								<div />
							</PopoverTrigger>
							<PopoverContent className="z-[600] rounded-lg overflow-hidden p-0">
								<Command className="bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700">
									<CommandInput
										className="h-9 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-400"
										placeholder="Search model..." />
									<CommandList className="border-zinc-300 dark:border-zinc-700">
										<CommandEmpty>No language found.</CommandEmpty>
										<CommandGroup>
											{languages.map((language, index) => (
												<CommandItem
													className={cn(
														"flex items-center p-2 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800",
														selectedLanguage === language.code && "bg-zinc-200 dark:bg-zinc-800 text-muted-foreground",
														index !== languages.length - 1 && "mb-0.5"
													)}
													key={`model-${language.code}`}
													onSelect={(currentValue) => {
														setSelectedLanguage(language.code);
														setIsOpenSelectLanguage(false)
													}}
													value={language.name}
												>
													{language.name}
													<CheckIcon
														className={cn(
															"ml-auto h-4 w-4",
															selectedLanguage === language.code ? "opacity-100" : "opacity-0"
														)}
													/>
												</CommandItem>
											))}
										</CommandGroup>
									</CommandList>
								</Command>
							</PopoverContent>
						</Popover>
					</div>
					<Spacer y={5} />

					<div className="flex flex-grow gap-5 flex-col sm:flex-row">
						<div className="flex-grow h-full">
							<div className="w-full px-1 bg-zinc-800">
								<span className="text-sm font-medium mb-2">
									{languages.find(lang => lang.code === 'vi')?.name || 'Select language...'}
								</span>
							</div>
							<div className="h-36 sm:h-96 sm:rounded-md bg-zinc-900 overflow-y-auto border-b border-zinc-700"
									 ref={viewWrapperRef}>
								<div className="p-4 h-fit mb-4 gap-0.5">
									<p className="break-words">
										{cumulativeText}
										<Cursor />
									</p>
								</div>
							</div>
						</div>
						<div className="flex-grow h-full">
							<div className="w-full px-1 bg-zinc-800">
								<span className="text-sm font-medium mb-2">
									{languages.find(lang => lang.code === selectedLanguage)?.name || 'Select language...'}
								</span>
							</div>
							<div className="h-36 sm:h-96 sm:rounded-md bg-zinc-900 overflow-y-auto border-b border-zinc-700">
								<div className="p-4 h-fit mb-4 gap-0.5">
									<p className="break-words">
										{translatedText}
									</p>
								</div>
							</div>
						</div>
					</div>
					{/*<p className="text-center my-4">Click "Start Recording" to begin transcribing your audio in real-time.</p>*/}
				</CardContent>
			</Card>
			<div className="flex flex-col justify-center items-center gap-10 my-5">
				<div className="relative flex flex-col justify-center items-center p-2 gap-4">
					<div className="absolute transform-x-[-50%] transform-y-[-50%]">
						<Loader
							className="transition-all"
							scale={2}
							size="lg"
							style={{
								'--mantine-scale': !isRecording ? '3' : '0',
							}}
							type="ring"
						/>
					</div>
					<div
						className={cn('relative w-fit flex justify-center items-center w-24 h-24', {})}
					>
						<div
							className={cn('absolute z-[800] rounded-full transition-all bg-zinc-600 w-16 h-16')}
							ref={animationMicRef}
						/>
						<div
							className={cn('record-mic relative z-[801] rounded-full bg-zinc-800 shadow-[inset_0_0_20px_1px] flex justify-center items-center cursor-pointer')}
							data-start-record={isRecording}
							onClick={handleRecordingToggle}
						>
							<IoMicSharp
								className={cn('text-white transition-all', {
									'text-red-500': isRecording,
								})}
								size={42}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

