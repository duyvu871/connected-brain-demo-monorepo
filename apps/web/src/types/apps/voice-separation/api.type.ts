export type VoiceSeparationApiSeparateResponse = {
	id: string;
	tracks: {
		url: string
		name: string
		size: number
		duration: number
	}[]
}