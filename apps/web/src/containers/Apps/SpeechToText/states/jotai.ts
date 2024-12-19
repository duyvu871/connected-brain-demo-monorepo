import { atom } from 'jotai';
import { transcript } from '@/containers/Apps/SpeechToText/states/transcript';

export type PlaybackSettings = {
	speed: number;
	volume: number;
	muted: boolean;
	loop: boolean;
	playbackRate: number;
};

export interface AudioFile {
	url: string;
	name: string;
};

export const visibleDrawerPanel = atom<boolean>(false);

export const isSectionLoaded = atom<boolean>((get) => Boolean(get(sectionId)));
export const sectionId = atom<string | null>(null as string | null);

export const audioDuration = atom<number>((get) => {
	const newTranscript = get(transcript);
	// if transcript update update duration
	if (newTranscript) {
		return newTranscript.audio.duration * 1000;
	} 
		// handle transcript is null (example: reset audioDuration)
		return 0;
	
});
export const audioCurrentTime = atom<number>(0);
export const audioCurrentTimeActiveSentence = atom<number>(0);
export const audioPlaying = atom<boolean>(false);
export const audioFile = atom<AudioFile>({
	url: '',
	name: '',
});

export const audioInstance = atom<Howl | null>(null as Howl | null);


export const playbackSettings = atom<PlaybackSettings>({
	speed: 1,
	volume: 1,
	muted: false,
	loop: false,
	playbackRate: 1,
});

export const PLAYER_DEFAULT_SETTINGS: PlaybackSettings = {
	speed: 1,
	volume: 1,
	muted: false,
	loop: false,
	playbackRate: 1,
};

export const PLAYER_SPEED_OPTIONS = {};

export const recordModalVisible = atom<boolean>(false);