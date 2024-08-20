import { atom } from 'jotai';
import type {RealtimeService} from 'assemblyai';

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

export type MessageListItem = {
	audioSrc: string;
	text: string;
	transcript: TranscriptSentence[];
	status: 'processing' | 'done' | 'error';
	type: 'uploaded' | 'recorded';
}

export const enableTranscriptEdit = atom<boolean>(false);
export const transcriptSearch = atom<string>('');
export const transcript = atom<MessageListItem | null>(null);
export const messageListAtom = atom<MessageListItem[]>([]);
export const isRecordingAtom = atom<boolean>(false);
export const mediaStreamAtom = atom<MediaStream | null>(null);
export const audioBlobAtom = atom<Blob | null>(null);
export const realTime = atom<RealtimeService | null>(null);
export const microphone = atom<{
	requestPermission: () => Promise<void>;
	startRecording: (onAudioCallback: (audioData: Uint8Array) => void) => Promise<void>;
	stopRecording: () => void;
} | null>(null);