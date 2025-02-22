import { getDownloadURL, getMetadata, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '@/configs/firebase';
import { Storage } from '@google-cloud/storage';
import { AssemblyAI, ParagraphsResponse, SentencesResponse, Transcript } from 'assemblyai';
import path from 'path';
import fsPromise from 'fs/promises';
import process from 'node:process';
import { FileTypeResult } from 'file-type';

interface UploadFileProps {
	file: File|Uint8Array|Blob|Buffer;
	filePath: string; // The path in Firebase Storage (e.g., 'images/profile-pics/user123.jpg')
	onProgress?: (progress: number) => void; // Optional progress callback
}

interface UploadFileToGoogleCloudStorageProps {
	bucketName: string;
	specialPath: string;
	filePath: string; // The path in Firebase Storage (e.g., 'images/profile-pics/user123.jpg')
	fileName: string; // The name of the file (e.g., 'user123.jpg')
}

type GetTranscriptType = 'sentences' | 'subtitles' | 'paragraphs' | 'full';

interface TranscriptResponses {
	sentences: SentencesResponse;
	subtitles: string;
	paragraphs: ParagraphsResponse;
	full: Transcript;
}

export type TranscriptResponseOrigin = {
	success: boolean;
	message: string|null;
	retry: boolean;
	data: {
		transcript: string;
		language: string;
		timestamps: {
			id: number;
			seek: number;
			start: number;
			end: number;
			text: string;
		}[];
	};
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

export type Sentences = TranscriptSentence[];



export default class CloudSpeech {
	private static client: any;
	public static getInstance(): AssemblyAI {
		if (!CloudSpeech.client) {
			// this.client = new speech.SpeechClient({
			// 	keyFilename: './src/services/google-cloud/connected-brain-be2917cfac7e.json',
			// });
			this.client = new AssemblyAI({
				apiKey: "0bdf7fbca1fb45c785c95840da99147f"
			})
		}
		return this.client;
	}

public static async getTemporaryToken(): Promise<string> {
		const client = this.getInstance();
		// 1 hour
		return await client.realtime.createTemporaryToken({ expires_in: 3600 });
}

	public static async recognizeAudio(audio: Uint8Array|string|Buffer): Promise<{transcriptId: string, text: string}> {
		console.log(audio);
		const client = this.getInstance();
		// const [operation] = await client.longRunningRecognize({
		// 	config: {
		// 		encoding: 'LINEAR16',
		// 		sampleRateHertz: 16000,
		// 		languageCode: 'en-US',
		// 		audioChannelCount: 1,
		// 		metadata: {
		// 			interactionType: 'DISCUSSION',
		// 			microphoneDistance: 'NEARFIELD',
		// 			originalMediaType: 'AUDIO',
		// 			recordingDeviceType: 'SMARTPHONE',
		// 			recordingDeviceName: 'Pixel 3a',
		// 			originalMimeType: 'audio/wav',
		// 		}
		// 	},
		// 	audio: {
		// 		// content: audio,
		// 		uri: audio.toString(),
		// 	},
		// });
		// console.log(operation.metadata);
		// const [response] = await operation.promise();
		// if (!response.results) return '';
		// const transcription = response.results
		// 	.map(result => result?.alternatives ? result.alternatives[0].transcript ?? null : '')
		// 	.join('\n');
		// console.log(`Transcription: ${transcription}`);
		// return transcription;

		const audioUrl = audio.toString();

		const config = {
			audio_url: audioUrl
		}
		const transcript = await client.transcripts.transcribe(config)
		// console.log(transcript.words);
		// await FileStorageService.create_directory('storage/Assets/s2t/1');
		// await FileStorageService.write_file('storage/Assets/s2t/1/transcript.json', Buffer.from(JSON.stringify(transcript.words)));
		// console.log(transcript.text)

		return {
			transcriptId: transcript.id,
			text: transcript?.text || '',
		};
	}

	public static async getTranscript(transcriptId: string, type?: GetTranscriptType): Promise<SentencesResponse | ParagraphsResponse | Transcript | string | null> {
		const client = this.getInstance();
		if (!transcriptId) return null;
		const transcriptService = client.transcripts;
		// switch to the appropriate transcription service
		switch (type) {
			case 'sentences':
				return await transcriptService.sentences(transcriptId);
			case 'subtitles':
				return await transcriptService.subtitles(transcriptId);
			case 'paragraphs':
				return await transcriptService.paragraphs(transcriptId);
			case 'full':
				return await transcriptService.get(transcriptId);
			case undefined:
				return await transcriptService.get(transcriptId);
			default:
				return null;
		}
	}

	public static async uploadFileToFirebaseStorage({file, filePath, onProgress = (progress) => {}, }: UploadFileProps)
		: Promise<
			{downloadURL: string; storageLocation: string}
			| null
		> {
		try {
			const storageRef = ref(storage, filePath);

			// Create an upload task
			const uploadTask = uploadBytesResumable(storageRef, file);

			// Optional: Track upload progress
			if (onProgress) {
				uploadTask.on('state_changed', (snapshot) => {
					const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					onProgress(progress);
				});
			}

			// Wait for the upload to complete
			await uploadTask;
			console.log('File uploaded successfully!');

			// Get the download URL for the uploaded file
			const downloadURL = await getDownloadURL(storageRef);
			const metadata = (await getMetadata(storageRef));
			const bucket = metadata.bucket;
			const fullPath = metadata.fullPath;
			const storageLocation = `gs://${bucket}/${fullPath}`;
			return {
				downloadURL,
				storageLocation,
			};

		} catch (error) {
			console.error('Error uploading file:', error);
			return null;
		}
	};

	public static async uploadFileToGoogleCloudStorage (
		{bucketName, specialPath, filePath, fileName }: UploadFileToGoogleCloudStorageProps)
		: Promise<
			{downloadURL: string; storageLocation: string}
			| null
		> {
		try {
			const storage = new Storage({
				keyFilename: './services-config/connected-brain-fea966427fac.json',
			});
			const bucket = storage.bucket(bucketName);
			const destination = fileName ? `${specialPath}/${fileName}` : fileName;
			// Create an upload task
			const uploadTask = await bucket.upload(filePath, {
				destination,
				// Support for very large files
				gzip: true,
				metadata: {
					cacheControl: 'public, max-age=31536000',
					acl: [{ entity: 'allUsers', role: 'READER' }],
				},
			}).then((uploadTask) => {
				console.log('File uploaded successfully!');
				return uploadTask;
			});

			// Wait for the upload to complete
			const [fileUploadResponse] = uploadTask;
			const [metadata] = await fileUploadResponse.getMetadata();

			// Get the download URL for the uploaded file
			const downloadURL = metadata.mediaLink || '';
			const storageLocation = `gs://${bucket.name}/${destination}`;
			return {
				downloadURL,
				storageLocation,
			};

		} catch (error) {
			console.error('Error uploading file:', error);
			return null;
		}
	}

	public static async getTranscriptConnectedBrainV2(
		filePath: string,
	): Promise<{sentences: TranscriptSentence[]} | null> {
		const S2T_API_ENDPOINT = 'http://127.0.0.1:8502/api/v1/s2t/version2'
		const fileName = path.basename(filePath);
		console.log('file-name', fileName);
		return new Promise(async (res, rej) => {
			try {
				const fileType = (await import('file-type')).fileTypeFromBuffer;
				const file = await fsPromise.readFile(filePath);
				const contentType =  <FileTypeResult>await fileType(file);
				const fileBlob = new Blob([file], { type: contentType.mime });
				console.log(fileName);
				const formData = new FormData();

				formData.append('file', fileBlob, fileName);
				const api = process.env.NODE_ENV === 'development' ? "http://14.224.188.206:8502/api/v1/s2t/version2" : S2T_API_ENDPOINT;

				const response = await fetch(api, {
					method: "POST",
					body: formData,
				})
				const responseChunking = (await response.json()) as {
					success: boolean;
					message: string;
					data: {
						transcript: TranscriptSentence[]
					}
				};
				if (!responseChunking.success) {
					console.log(
						`s2t error with status: ${response.status}, response: ${JSON.stringify(responseChunking)}`,
					);
				}
				const transcript = responseChunking.data.transcript;
				
				const transformTimeToMilliSecond = (second: number): number => {
					return parseInt((second*1000).toFixed(0))
				}

				res({
					sentences: transcript.map((sentence) => ({
						...sentence,
						start: transformTimeToMilliSecond(sentence.start),
						end: transformTimeToMilliSecond(sentence.end),
						words: sentence.words.map(word => ({
							...word,
							start: transformTimeToMilliSecond(word.start),
							end: transformTimeToMilliSecond(word.end),
						}))
					}))
				});
			} catch (e) {
				rej(e);
			}
		})
	}

	public static async getTranscriptConnectedBrainV1(
		filePath: string,
	): Promise<{sentences: TranscriptSentence[]} | null> {
		const S2T_API_ENDPOINT = 'http://127.0.0.1:8502/api/v1/s2t'
		const fileName = path.basename(filePath);
		console.log('file-name', fileName);
		return new Promise(async (res, rej) => {
			try {
				const fileType = (await import('file-type')).fileTypeFromBuffer;
				const file = await fsPromise.readFile(filePath);
				const contentType = <FileTypeResult>await fileType(file);
				const fileBlob = new Blob([file], { type: contentType.mime });
				console.log(fileName);
				const formData = new FormData();
				formData.append('file', fileBlob, fileName);
				const api = process.env.NODE_ENV === 'development' ? "http://14.224.188.206:8502/api/v1/s2t" : S2T_API_ENDPOINT;

				const response = await fetch(api, {
					method: "POST",
					body: formData,
				})
				const responseChunking = (await response.json()) as TranscriptResponseOrigin;
				if (!responseChunking.success) {
					console.log(
						`s2t error with status: ${response.status}, response: ${JSON.stringify(responseChunking)}`,
					);
				}
				const transcript = responseChunking.data.transcript;
				const timestamp = responseChunking.data.timestamps;
				const transformTimeToMilliSecond = (second: number): number => {
					return parseInt((second*1000).toFixed(0))
				}

				const resolveTranscript = {
					sentences: timestamp.map((sentence) => {
						const start = transformTimeToMilliSecond(sentence.start);
						const end = transformTimeToMilliSecond(sentence.end);
						const duration = end - start;
						const eachCharacterDuration = duration / sentence.text.length;
						let previousWordEnd = start;

						const words = sentence.text.split(' ').map((word, index) => {
							const startWordTime = previousWordEnd + eachCharacterDuration;
							const endWordTime = startWordTime + (word.length * eachCharacterDuration);
							previousWordEnd = endWordTime;
							return {
								start: startWordTime,
								end: endWordTime,
								text: word,
								confidence: 1,
								speaker: 'speaker',
							}
						})

						return ({
							...sentence,
							start: start,
							end: end,
							words: words,
							speaker: 'speaker',
						})
					})
				}

				console.log('transcript', JSON.stringify(resolveTranscript));

				res(resolveTranscript);
			} catch (e) {
				rej(e);
			}
		})
	}
}
