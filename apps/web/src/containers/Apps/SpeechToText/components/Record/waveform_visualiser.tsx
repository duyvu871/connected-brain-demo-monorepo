'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@ui/shadcn-ui/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@ui/shadcn-ui/ui/card"
import { Mic, Square, Sun, Moon } from 'lucide-react'
import { TypeAnimation } from 'react-type-animation';

const CLOSE_SIGNAL = "CLOSE"

interface TranscriptionItem {
	start_time: number;
	end_time: number;
	text: string;
}

export default function AudioTranscription() {
	const [isRecording, setIsRecording] = useState(false)
	const [transcription, setTranscription] = useState<TranscriptionItem[]>([])
	const [isDarkMode, setIsDarkMode] = useState(false)
	const websocketRef = useRef<WebSocket | null>(null)
	const mediaStreamRef = useRef<MediaStream | null>(null)
	const audioContextRef = useRef<AudioContext | null>(null)
	const processorRef = useRef<ScriptProcessorNode | null>(null)
	const transcriptionRef = useRef<HTMLDivElement | null>(null)
	const viewWrapperRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		return () => {
			stopRecording()
		}
	}, [])

	useEffect(() => {
		if (transcriptionRef.current && viewWrapperRef.current) {
			if (transcriptionRef.current.scrollHeight > viewWrapperRef.current.clientHeight) {
				transcriptionRef.current.scrollIntoView({
					behavior: "smooth",
					block: "end",
					inline: "nearest",
				})
			}
		}
	}, [transcription])

	const startRecording = async () => {
		try {
			setIsRecording(true)
			setTranscription([])

			mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true })
			audioContextRef.current = new AudioContext({ sampleRate: 16000 })
			const source = audioContextRef.current.createMediaStreamSource(mediaStreamRef.current)
			processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1)

			websocketRef.current = new WebSocket("wss://14.224.188.206:8100/record")

			websocketRef.current.onopen = () => {
				console.log("WebSocket connection opened.")
			}

			websocketRef.current.onmessage = (event) => {
				try {
					const message = JSON.parse(event.data) as TranscriptionItem;
					setTranscription(prev => [...prev, message])
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

		} catch (err) {
			console.error("Error accessing microphone:", err)
			stopRecording()
		}
	}

	const stopRecording = () => {
		setIsRecording(false)

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

	return (
		<Card className="w-full max-w-2xl h-fit mx-auto border-zinc-600 overflow-hidden">
			<CardContent className="p-0 ">
				<div className="h-64 bg-zinc-900 overflow-y-auto border-b border-zinc-700" ref={viewWrapperRef}>
					<div className="p-4 h-fit mb-4">
						<h2 className="text-xl font-semibold mb-2">Transcription</h2>
						{transcription.map((item, index) => (
							<div className="mb-2 " key={`word-${index}`}>
								<span className="font-semibold">{item.start_time.toFixed(2)}s - {item.end_time.toFixed()}s: </span>
								{index === transcription.length - 1 ? (
									<TypeAnimation
										omitDeletionAnimation
										ref={transcriptionRef}
										repeat={1}
										sequence={[
											item.text,
											3000,
										]}
										speed={{ type: 'keyStrokeDelayInMs', value: 30 }}
										splitter={(str) => str.split(/(?= )/)} // 'Lorem ipsum dolor' -> ['Lorem', ' ipsum', ' dolor']
										style={{ fontSize: '1em', display: 'block', minHeight: '200px' }}
										wrapper="span"
									/>
								) : (
									<span>{item.text}</span>
								)}
							</div>
						))}
					</div>
				</div>
				<p className="text-center my-4">Click "Start Recording" to begin transcribing your audio in real-time.</p>
				<div className="flex justify-center space-x-4 mb-6">
					<Button
						className="bg-green-500 hover:bg-green-600 text-white"
						disabled={isRecording}
						onClick={startRecording}
					>
						<Mic className="mr-2 h-4 w-4" /> Start Recording
					</Button>
					<Button
						className="bg-red-500 hover:bg-red-600 text-white"
						disabled={!isRecording}
						onClick={stopRecording}
					>
						<Square className="mr-2 h-4 w-4" /> Stop Recording
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}

