'use client';

import { useState, useEffect, useRef } from 'react'
import { Button } from "@ui/shadcn-ui/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@ui/shadcn-ui/ui/card"
import { Textarea } from "@ui/shadcn-ui/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/shadcn-ui/ui/select"
import { Slider } from "@ui/shadcn-ui/ui/slider"
import { Switch } from "@ui/shadcn-ui/ui/switch"
import { Label } from "@ui/shadcn-ui/ui/label"
import { Play, Pause, Square, VolumeX, Volume2, Mic, Sun, Moon, Download } from "lucide-react"
import { Progress } from "@ui/shadcn-ui/ui/progress"
import {WaveFile} from 'wavefile';

interface ExternalVoice {
	name: string;
	apiUrl: string;
}
interface APIResponse {
	data: {array: string; sampling_rate: number};
	message: string | null;
	retry: boolean;
	success: boolean
}

export default function Starter() {
	const [text, setText] = useState("")
	const [isPaused, setIsPaused] = useState(false)
	const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null)
	const [voice, setVoice] = useState<SpeechSynthesisVoice | ExternalVoice | null>(null)
	const [voices, setVoices] = useState<(SpeechSynthesisVoice | ExternalVoice)[]>([])
	const [pitch, setPitch] = useState(1)
	const [rate, setRate] = useState(1)
	const [volume, setVolume] = useState(1)
	const [progress, setProgress] = useState(0)
	const [isDarkMode, setIsDarkMode] = useState(false)
	const [audioUrl, setAudioUrl] = useState<string | null>(null);

	const synth = useRef<SpeechSynthesis | null>(null)
	const audioContext = useRef<AudioContext | null>(null)
	const audioRef = useRef<HTMLAudioElement | null>(null)

	useEffect(() => {
		if (typeof window !== "undefined" && "speechSynthesis" in window) {
			synth.current = window.speechSynthesis
			audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)()
			const updateVoices = () => {
				// const systemVoices = synth.current!.getVoices()
				const externalVoice: ExternalVoice = {
					name: "Giọng miền bắc",
					apiUrl: "/api/v1/feature/t2s"
				}
				setVoices([externalVoice])
			}
			// synth.current.onvoiceschanged = updateVoices
			updateVoices()
		}
	}, [])

	useEffect(() => {
		if (utterance && voice && 'lang' in voice) {
			utterance.voice = voice
			utterance.pitch = pitch
			utterance.rate = rate
			utterance.volume = volume
		}
	}, [utterance, voice, pitch, rate, volume])

	const handlePlay = async () => {
		if (isPaused && utterance) {
			synth.current?.resume()
		} else if (voice && 'apiUrl' in voice) {
				if (audioUrl) {
					URL.revokeObjectURL(audioUrl);
					setAudioUrl(null);
				}
				try {
					const response = await fetch(voice.apiUrl, {
						method: 'POST',
						headers: {
							'accept': 'application/json',
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							text
						})
					});
					const data: APIResponse = await response.json();
					if (data.success) {
						const audioArray = data.data.array;
						const samplingRate = data.data.sampling_rate || 44100;
						const audioData = JSON.parse(audioArray);
						const wav = new WaveFile();
						wav.fromScratch(1, samplingRate, '16', audioData);
						const wavData = wav.toBuffer();

						const blob = new Blob([wavData], { type: 'audio/wav' });
						const url = URL.createObjectURL(blob);
						setAudioUrl(url);
						// Use FileReader to read the Blob as an ArrayBuffer
						const fileReader = new FileReader();
						fileReader.onload = (event) => {
							const arrayBuffer = event.target?.result as ArrayBuffer;

							// Decode the ArrayBuffer into an AudioBuffer
							audioContext.current!.decodeAudioData(arrayBuffer, (audioBuffer) => {
								const audioSource = audioContext.current!.createBufferSource();
								audioSource.buffer = audioBuffer;
								audioSource.connect(audioContext.current!.destination);
								audioSource.start();
							});

						};
						fileReader.readAsArrayBuffer(blob);
					}
				} catch (error) {
					console.error("Error calling external API:", error);
				}
			} else {
				const newUtterance = new SpeechSynthesisUtterance(text)
				if (voice && 'lang' in voice) {
					newUtterance.voice = voice
				}
				newUtterance.pitch = pitch
				newUtterance.rate = rate
				newUtterance.volume = volume
				newUtterance.onend = () => {
					setIsPaused(false)
					setProgress(0)
				}
				newUtterance.onboundary = (event) => {
					const progress = (event.charIndex / text.length) * 100
					setProgress(progress)
				}
				setUtterance(newUtterance)
				synth.current?.speak(newUtterance)
			}
		setIsPaused(false)
	}

	const handlePause = () => {
		if (audioRef.current) {
			audioRef.current.pause();
		} else {
			synth.current?.pause()
		}
		setIsPaused(true)
	}

	const handleStop = () => {
		if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current.currentTime = 0;
		} else {
			synth.current?.cancel()
		}
		setIsPaused(false)
		setProgress(0)
	}

	const handleDownload = () => {
		if (voice && 'apiUrl' in voice) {
			try {
				if (audioUrl) {
					const a = document.createElement('a');
					a.href = audioUrl;
					a.download = 'audio.wav';
					a.click();
					// URL.revokeObjectURL(audioUrl);
				}
			} catch (error) {
				console.error("Error downloading audio from external API:", error);
			}
		} else if (audioContext.current) {
			const audioBuffer = audioContext.current.createBuffer(1, 44100, 44100);
			const wavFile = new WaveFile();
			wavFile.fromScratch(1, 44100, '16', audioBuffer.getChannelData(0));
			const wavData = wavFile.toBuffer();
			const blob = new Blob([wavData], { type: 'audio/wav' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'audio.wav';
			a.click();
		}
	}

	// ... (keep the audioBufferToWav function from the previous version)

	return (
		<div className="min-h-screen">
			<div className="container mx-auto p-4 max-w-3xl">
				<Card className="bg-background text-foreground dark:border-zinc-800">
					<CardHeader className="flex flex-row items-center justify-between">
						<CardTitle className="text-2xl font-bold">Text to Speech App</CardTitle>
						{/*<div className="flex items-center space-x-2">*/}
						{/*	<Sun className="h-4 w-4" />*/}
						{/*	<Switch*/}
						{/*		aria-label="Toggle dark mode"*/}
						{/*		checked={isDarkMode}*/}
						{/*		onCheckedChange={setIsDarkMode}*/}
						{/*	/>*/}
						{/*	<Moon className="h-4 w-4" />*/}
						{/*</div>*/}
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="relative">
							<Textarea
								className="min-h-[150px] pr-12 dark:border-zinc-800"
								onChange={(e) => setText(e.target.value)}
								placeholder="Enter text to be spoken..."
								value={text}
							/>
							{/*<Mic className="absolute right-3 top-3 text-muted-foreground" />*/}
						</div>
						<div className="space-y-4">
							<div className="flex flex-wrap gap-4 items-center justify-between">
								<Select
									onValueChange={(value) => {
										const selectedVoice = voices.find(v => v.name === value);
										setVoice(selectedVoice || null);
									}}
								>
									<SelectTrigger className="w-[200px] dark:border-zinc-800">
										<SelectValue placeholder="Select a voice" />
									</SelectTrigger>
									<SelectContent className="dark:bg-zinc-900 dark:border-zinc-800 bg-zinc-100">
										{voices.map((v) => (
											<SelectItem className="text-zinc-700 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700" key={v.name} value={v.name}>
												{v.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<div className="flex items-center space-x-2">
									<VolumeX className="h-4 w-4" />
									<Slider
										className="w-[100px] [&_span:nth-child(2)_span]:bg-zinc-100 [&_span_span]:border-zinc-700 dark:[&_span:nth-child(1)]:bg-zinc-900 [&_span:nth-child(1)_span]:!bg-zinc-700"

										max={1}
										min={0}
										onValueChange={(value) => setVolume(value[0])}
										step={0.1}
										value={[volume]}
									/>
									<Volume2 className="h-4 w-4" />
								</div>
							</div>
							<div className="flex flex-wrap gap-6 justify-between">
								<div className="space-y-2 flex-1">
									<Label className="text-sm font-medium" htmlFor="pitch">Pitch: {pitch.toFixed(1)}</Label>
									<Slider
										className="w-full [&_span:nth-child(2)_span]:bg-zinc-100 [&_span_span]:border-zinc-700 dark:[&_span:nth-child(1)]:bg-zinc-900 [&_span:nth-child(1)_span]:!bg-zinc-700"
										id="pitch"
										max={2}
										min={0.5}
										onValueChange={(value) => setPitch(value[0])}
										step={0.1}
										value={[pitch]}
									/>
								</div>
								<div className="space-y-2 flex-1">
									<Label className="text-sm font-medium" htmlFor="rate">Rate: {rate.toFixed(1)}</Label>
									<Slider
										className="w-full  [&_span:nth-child(2)_span]:bg-zinc-100 [&_span_span]:border-zinc-700 dark:[&_span:nth-child(1)]:bg-zinc-900 [&_span:nth-child(1)_span]:!bg-zinc-700"
										id="rate"
										max={2}
										min={0.5}
										onValueChange={(value) => setRate(value[0])}
										step={0.1}
										value={[rate]}
									/>
								</div>
							</div>
						</div>
						<div className="space-y-4">
							<Progress className="w-full h-2 bg-zinc-700" value={progress} />
							<div className="flex justify-center flex-wrap gap-5">
								<Button className="text-zinc-700 dark:text-zinc-100 dark:bg-zinc-800 bg-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors" disabled={!text} onClick={handlePlay}>
									<Play className="mr-2 h-4 w-4" /> Play
								</Button>
								<Button className="text-zinc-700 dark:text-zinc-100 dark:bg-zinc-800 bg-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors" disabled={!utterance && !audioRef.current || isPaused} onClick={handlePause}>
									<Pause className="mr-2 h-4 w-4" /> Pause
								</Button>
								<Button className="text-zinc-700 dark:text-zinc-100 dark:bg-zinc-800 bg-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors" disabled={!utterance && !audioRef.current} onClick={handleStop}>
									<Square className="mr-2 h-4 w-4" /> Stop
								</Button>
								<Button className="text-zinc-700 dark:text-zinc-100 dark:bg-zinc-800 bg-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors" disabled={!text} onClick={handleDownload}>
									<Download className="mr-2 h-4 w-4" /> Download
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}