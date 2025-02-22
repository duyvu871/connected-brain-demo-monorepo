import { atom } from 'jotai';
import type { Socket } from 'socket.io-client';

export interface IS2tDTO {
	user: string;
	cloudPath: string;
	originName: string;
	path: string;
	auditPath: string;
	audio: {
		path: string;
		duration: number;
	};
	transcript: TranscriptSentence[];
	status: 'processing' | 'done' | 'error';
}

export interface TranscriptSentence {
	start: number;
	end: number;
	speaker: string;
	text: string;
	words: TranscriptWord[];
}

export interface TranscriptWord {
	start: number;
	end: number;
	text: string;
	confidence: number;
	speaker: string;
}

export enum TranscriptActiveFeature {
	Transcript = 'Transcript',
	Speaker = 'Speaker',
	Notes = 'Notes',
};

export const enableTranscriptEdit = atom<boolean>(false);
export const transcriptSearch = atom<string>('');
export const transcriptLoading = atom<boolean>(false);
export const transcript = atom<IS2tDTO | null>(null as IS2tDTO | null);
export const transcriptActiveFeature = atom<keyof typeof TranscriptActiveFeature>('Transcript');
export const transcriptAudioList = atom<IS2tDTO[]>([]);
export const audioPlayerInstance = atom<Howl | null>(null as Howl | null);
export const transcriptListAudioPlayerInstance = atom<Howl|null>(null);
export const activeTranscriptSentence = atom<string | null>(null as string | null);
export const currentTranscriptSentence = atom<TranscriptSentence | null>(null as TranscriptSentence | null);
export const IOSocketAtom = atom<Socket | null>(null as Socket|null)