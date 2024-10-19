export interface SpeechToTextResponse {
	success: boolean;
	message: any;
	data: SpeechToTextResult;
	retry: boolean;
}

export interface SpeechToTextResult {
	transcript: string
	language: string
	timestamps: Timestamp[]
}

export interface Timestamp {
	start_time: number
	end_time: number
	text: string
}
