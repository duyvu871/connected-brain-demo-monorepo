import { atom } from 'jotai'

export interface Track {
	id: string
	url: string
	speakerName: string
	duration: string
	confidence: number
}

export const tracksAtom = atom<Track[]>([])
export const currentTrackAtom = atom<Track | null>(null)
export const isPlayingAtom = atom(false)
export const audioElementAtom = atom<HTMLAudioElement | null>(null)
export const currentTimeAtom = atom(0)
export const durationAtom = atom(0)

