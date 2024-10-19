'use client'

import React, { useEffect, useState } from 'react';
import { Button } from "@ui/shadcn-ui/ui/button"
import { Input } from "@ui/shadcn-ui/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@ui/shadcn-ui/ui/card"
import { Loader2, Moon, Sun } from "lucide-react"
import { useToast } from '@/hooks/useToast';
import { useTheme } from 'next-themes';

interface Timestamp {
	start_time: number
	end_time: number
	text: string
}

interface TranscriptionResult {
	transcript: string
	language: string
	timestamps: Timestamp[]
}

export default function SpeechToTextApp() {
	const [file, setFile] = useState<File | null>(null)
	const [loading, setLoading] = useState(false)
	const [result, setResult] = useState<TranscriptionResult | null>(null)
	const [error, setError] = useState<string | null>(null)
	const { theme, setTheme } = useTheme()

	const {error: showError} = useToast()

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event?.target?.files?.[0]) {
			setFile(event.target.files[0])
		}
	}

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		if (!file) {
			setError('Please select a file to upload')
			return
		}

		setLoading(true)
		setError(null)
		setResult(null)

		const formData = new FormData()
		formData.append('file', file)
		formData.append('url', 'string')

		try {
			const response = await fetch('http://14.224.188.206:8502/api/v1/s2t', {
				method: 'POST',
				body: formData,
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.detail?.[0]?.msg || 'An error occurred')
			}

			if (data.success && data.data) {
				setResult(data.data)
			} else {
				throw new Error('Invalid response format')
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (error) {
			showError(error)
		}
	}, [error, showError]);

	const toggleTheme = () => {
		setTheme(theme === 'dark' ? 'light' : 'dark')
	}

	return (
		<div className="container mx-auto p-4">
			<Card className="dark:bg-gray-800">
				<CardHeader className="flex flex-row items-center justify-between">
					<CardTitle className="text-zinc-700 dark:text-white">Speech to Text Converter</CardTitle>
					{/*<Button*/}
					{/*	aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}*/}
					{/*	onClick={toggleTheme}*/}
					{/*	size="icon"*/}
					{/*	variant="outline"*/}
					{/*>*/}
					{/*	{theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}*/}
					{/*</Button>*/}
				</CardHeader>
				<CardContent>
					<form className="space-y-4" onSubmit={handleSubmit}>
						<Input
							accept="audio/*"
							className="dark:bg-gray-700 text-zinc-700 dark:text-white"
							onChange={handleFileChange}
							type="file"
						/>
						<Button className="bg-zinc-600 hover:bg-zinc-700 dark:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors" disabled={loading} type="submit">
							{loading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Converting...
								</>
							) : (
								'Convert to Text'
							)}
						</Button>
					</form>

					{result ? <div className="mt-8 space-y-4">
							<h3 className="text-lg font-semibold text-zinc-700 dark:text-white">Transcription Result</h3>
							<p className="text-zinc-700 dark:text-gray-300"><strong>Language:</strong> {result.language}</p>
							<div>
								<strong className="text-zinc-700 dark:text-white">Full Transcript:</strong>
								<p className="mt-2 p-4 bg-muted rounded-md dark:bg-gray-700 text-zinc-700 dark:text-gray-300">{result.transcript}</p>
							</div>
							<div>
								<strong className="text-zinc-700 dark:text-white">Timestamps:</strong>
								<ul className="mt-2 space-y-2">
									{result.timestamps.map((timestamp, index) => (
										<li className="p-2 bg-muted rounded-md dark:bg-gray-700" key={index}>
											<p className="text-zinc-700 dark:text-gray-300"><strong>Time:</strong> {timestamp.start_time}s - {timestamp.end_time}s</p>
											<p className="text-zinc-700 dark:text-gray-300"><strong>Text:</strong> {timestamp.text}</p>
										</li>
									))}
								</ul>
							</div>
						</div> : null}
				</CardContent>
			</Card>
		</div>
	)
}