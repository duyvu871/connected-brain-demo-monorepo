"use client"

import { useEffect, useRef, useState, useCallback } from 'react'
import { useAtomValue } from 'jotai'
import { audioElementAtom, isPlayingAtom } from './states/audio'

export function AudioVisualizer() {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const audioElement = useAtomValue(audioElementAtom)
	const isPlaying = useAtomValue(isPlayingAtom)

	const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
	const [analyser, setAnalyser] = useState<AnalyserNode | null>(null)
	const [source, setSource] = useState<MediaElementAudioSourceNode | null>(null)

	const setupAudioContext = useCallback(() => {
		if (!audioElement || audioContext) return

		const newAudioContext = new AudioContext()
		const newAnalyser = newAudioContext.createAnalyser()

		let newSource = source
		if (!newSource) {
			newSource = newAudioContext.createMediaElementSource(audioElement)
			setSource(newSource)
		}

		newSource.connect(newAnalyser)
		newAnalyser.connect(newAudioContext.destination)

		newAnalyser.fftSize = 256 * 2

		setAudioContext(newAudioContext)
		setAnalyser(newAnalyser)
	}, [audioElement, audioContext, source])

	useEffect(() => {
		setupAudioContext()

		return () => {
			if (source) {
				source.disconnect()
			}
			if (analyser) {
				analyser.disconnect()
			}
			if (audioContext) {
				audioContext.close()
			}
		}
	}, [setupAudioContext, source, analyser, audioContext])

	useEffect(() => {
		if (!analyser || !canvasRef.current) return

		const bufferLength = analyser.frequencyBinCount
		const dataArray = new Uint8Array(bufferLength)

		const canvas = canvasRef.current
		const ctx = canvas.getContext('2d')!

		const draw = () => {
			if (!isPlaying) {
				ctx.fillStyle = '#1a1b1e'
				ctx.fillRect(0, 0, canvas.width, canvas.height)
				requestAnimationFrame(draw)
				return
			}

			requestAnimationFrame(draw)

			const width = canvas.width
			const height = canvas.height

			analyser.getByteFrequencyData(dataArray)

			ctx.fillStyle = 'rgb(39 39 42)'
			ctx.fillRect(0, 0, width, height)

			const barWidth = (width / bufferLength) * 2.5
			let barHeight
			let x = 0

			for (let i = 0; i < bufferLength; i++) {
				barHeight = dataArray[i] / 2

				const gradient = ctx.createLinearGradient(0, 0, 0, height)
				gradient.addColorStop(0, '#005b10')
				gradient.addColorStop(1, '#59ea74')

				ctx.fillStyle = gradient
				ctx.fillRect(x, height - barHeight, barWidth, barHeight)

				x += barWidth + 1
			}
		}

		draw()
	}, [analyser, isPlaying])

	return (
		<canvas
			className="w-full rounded-lg !bg-zinc-900 !border-zinc-800"
			height={80}
			ref={canvasRef}
			width={800}
		/>
	)
}