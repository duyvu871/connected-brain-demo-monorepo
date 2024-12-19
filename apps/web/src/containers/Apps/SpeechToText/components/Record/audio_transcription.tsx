'use client'

import React, { useState, useRef, useEffect } from 'react'
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


const CLOSE_SIGNAL = "CLOSE"

interface TranscriptionItem {
	start_time: number;
	end_time: number;
	text: string;
}

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

	const addTranscription = (text: string) => {
		setCumulativeText(prev => prev + " " + text)
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
	]
	const [selectedLanguage, setSelectedLanguage] = useState<string>('vi');
	const [isOpenSelectLanguage, setIsOpenSelectLanguage] = useState<boolean>(false);

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


	return (
		<Card className="w-full max-w-xl h-fit mx-auto border-0 overflow-hidden rounded-none relative">
			<div className="relative">
				{/*<Select*/}
				{/*	data={languages.map(lang => ({value: lang.code, label:lang.name}))}*/}
				{/*	onChange={(code) => code && setSelectedLanguage(code)}*/}
				{/*	role="combobox"*/}
				{/*	styles={{*/}
				{/*		dropdown: {*/}
				{/*			position: 'absolute',*/}
				{/*			zIndex: 1000,*/}
				{/*		}*/}
				{/*	}}*/}
				{/*	value={selectedLanguage}*/}
				{/*/>*/}
				<Button
					className="w-full justify-between dark:text-zinc-400 text-zinc-700 bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700"
					onClick={() => setIsOpenSelectLanguage(true)}
					role="combobox"
					variant="outline"
				>
					{languages.find(lang => lang.code === selectedLanguage)?.name || "Select language..."}
				</Button>
				<Popover isOpen={isOpenSelectLanguage} onOpenChange={(open) => setIsOpenSelectLanguage(open)} placement="bottom-start">
					<PopoverTrigger >
						<div />
					</PopoverTrigger>
					<PopoverContent className="z-[600] rounded-lg overflow-hidden p-0">
						{/*<DialogOverlay className="z-[240]" />*/}
						{/*<DialogPrimitive.Content*/}
						{/*	className={cn(*/}
						{/*		"fixed left-[50%] top-[50%] z-[250] grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",*/}
						{/*		"p-5 md:w-[320px] md:p-0 bg-opacity-0 border-0"*/}
						{/*	)}*/}
						{/*	*/}
						{/*>*/}
						{/*	<VisuallyHidden.Root asChild>*/}
						{/*		<DialogTitle>Choose a model</DialogTitle>*/}
						{/*	</VisuallyHidden.Root>*/}
						{/*	<VisuallyHidden.Root asChild>*/}
						{/*		<DialogDescription>Choose a model</DialogDescription>*/}
						{/*	</VisuallyHidden.Root>*/}
						<Command className="bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700">
							<CommandInput className="h-9 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-400" placeholder="Search model..." />
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
						{/*<DialogPrimitive.Close className="absolute right-7 top-7 sm:right-2 sm:top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">*/}
						{/*	<Cross2Icon className="h-4 w-4" />*/}
						{/*	<span className="sr-only">Close</span>*/}
						{/*</DialogPrimitive.Close>*/}
						{/*</DialogPrimitive.Content>*/}
					</PopoverContent>
				</Popover>
			</div>
			<Spacer y={5} />
			<CardContent className="p-0 relative">
				<div className="h-96 sm:rounded-md bg-zinc-900 overflow-y-auto border-b border-zinc-700" ref={viewWrapperRef}>
					{/*<h2 className="text-xl font-semibold mb-2">Transcription</h2>*/}
					<div className="p-4 h-fit mb-4 gap-0.5">
						<p className="break-words">
							{cumulativeText}
						</p>

						{/*{transcription.map((item, transcriptIndex) => (*/}
						{/*	<>*/}
						{/*		/!*{transcriptIndex === transcription.length - 1 ? (*!/*/}
						{/*		/!*	<TypeAnimation*!/*/}
						{/*		/!*		omitDeletionAnimation*!/*/}
						{/*		/!*		ref={transcriptionRef}*!/*/}
						{/*		/!*		repeat={1}*!/*/}
						{/*		/!*		sequence={[*!/*/}
						{/*		/!*			item.text,*!/*/}
						{/*		/!*			3000,*!/*/}
						{/*		/!*		]}*!/*/}
						{/*		/!*		// sequence={[cumulativeText, 3000]}*!/*/}
						{/*		/!*		speed={{ type: 'keyStrokeDelayInMs', value: 30 }}*!/*/}
						{/*		/!*		splitter={(str) => str.split(/(?= )/)} // 'Lorem ipsum dolor' -> ['Lorem', ' ipsum', ' dolor']*!/*/}
						{/*		/!*		style={{ fontSize: '1em', display: 'block', minHeight: '30px' }}*!/*/}
						{/*		/!*		wrapper="span"*!/*/}
						{/*		/!*	/>*!/*/}
						{/*		/!*) : (*!/*/}
						{/*		/!*	item.text.split(' ').map((word, index) => (*!/*/}
						{/*		/!*		<span key={`${word}-${transcriptIndex}-${index}`}>{word}</span>*!/*/}
						{/*		/!*	))*!/*/}
						{/*		/!*)}*!/*/}
						{/*		<span>{item.text}</span>*/}
						{/*	</>*/}
						{/*))}*/}
					</div>
				</div>
				{/*<p className="text-center my-4">Click "Start Recording" to begin transcribing your audio in real-time.</p>*/}
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
								className={cn('record-mic relative z-[801] rounded-full bg-zinc-800 shadow-[inset_0_0_20px_1px] flex justify-center items-center cursor-pointer',)}
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
			</CardContent>
		</Card>
)
}

