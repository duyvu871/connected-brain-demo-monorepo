import {
	Content,
	GenerationConfig,
	GenerativeModel,
	GoogleGenerativeAI,
	HarmBlockThreshold,
	HarmCategory,
	Part,
	SafetySetting,
} from '@google/generative-ai';
import { initAI } from '../init/gemini';

export type MimeTypes =
	'image/png'
	| 'image/png-sequence'
	| 'image/webp'
	| 'image/webp-sequence'
	| 'image/gif'
	| 'image/gif-sequence'
	| 'image/svg+xml'
	| 'image/svg+xml-sequence'
	| 'image/bmp'
	| 'image/bmp-sequence'
	| 'image/tiff'
	| 'image/tiff-sequence'
	| 'image/x-icon'
	| 'image/x-icon-sequence'
	| 'image/vnd.microsoft.icon'
	| 'image/vnd.microsoft.icon-sequence'
	| 'image/vnd.wap.wbmp'
	| 'image/vnd.wap.wbmp-sequence'
	| 'image/heic'
	| 'image/heif'
	| 'image/heif-sequence'
	| 'image/heic-sequence'
	| 'image/hej2'
	| 'image/hej2-sequence'
	| 'image/avif'
	| 'image/avif-sequence'
	| 'image/jxl'
	| 'image/jxl-sequence'
	| 'image/jpm'
	| 'image/jpm-sequence'
	| 'image/jpx'
	| 'image/jpx-sequence'
	| 'image/jpg'
	| 'image/jpg-sequence'
	| 'image/jpeg'
	| 'image/jpeg-sequence';


export class GeminiChatService {
	private genAI: GoogleGenerativeAI;
	private model: GenerativeModel;
	private readonly generationConfig: GenerationConfig;
	private readonly safetySettings: SafetySetting[];

	constructor(apiKey: string) {
		this.genAI = new GoogleGenerativeAI(apiKey);
		this.model = this.genAI.getGenerativeModel({
			model: 'gemini-1.5-flash-latest',
		});
		this.generationConfig = {
			temperature: 1,
			topP: 0.95,
			topK: 64,
			maxOutputTokens: 8192,
			responseMimeType: 'text/plain',
		};
		this.safetySettings = [
			{
				category: HarmCategory.HARM_CATEGORY_HARASSMENT,
				threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
			},
			{
				category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
				threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
			},
			{
				category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
				threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
			},
			{
				category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
				threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
			},
		];
	}

	public async startChat(isUsePrompt: boolean) {
		const defaultPrompt = [{
			role: 'model',
			part: [{
				text: ""
			}]
		}] as unknown as Content;
		let initMessage: Content | undefined;
		if (isUsePrompt) initMessage = initAI().initPrompt as unknown as Content;
		const chatSessionGenerated = await this.model.generateContent(
			initMessage ? initMessage.parts : defaultPrompt.parts
		);
		const response = chatSessionGenerated.response;
		return response.text();
	}

	public async sendMessage(
		message: {
			textContent: string;
			mediaContent: string[]; // url for media content
		},
		history: Content[],
		passInitPrompt?: boolean,
	): Promise<string> {
		const initMessage = initAI().initPrompt as unknown as Content[];
		const messageContent: string | (string | Part)[] = [
			{
				text: message.textContent,
			},
		];

		if (message.mediaContent.length > 0) {
			const contentFetch = message.mediaContent.map((item) => this.fetchToBase64WithMimeType(item));
			const content = await Promise.all(contentFetch);
			const filteredContent = content.filter((item) => item?.contentType && item?.base64Data) as NonNullable<{
				base64Data: string;
				contentType: MimeTypes
			}[]>;
			const mediaContent = filteredContent.map((item) =>
				this.fileToGenerativePath(item.base64Data, item.contentType));
			messageContent.push(...mediaContent);
		}
		// console.log(messageContent);
		const chatSession = this.model.startChat({
			generationConfig: this.generationConfig,
			safetySettings: this.safetySettings,
			history: passInitPrompt ? [...initMessage, ...history] : history,
		});

		const result = await chatSession.sendMessage(messageContent);
		return result.response.text();
	}

	/**
	 * Generate a message from a prompt
	 * @param content base64 encoded asset
	 * @param mimeType mime type of the asset
	 * @returns
	 */
	public fileToGenerativePath(content: string, mimeType: MimeTypes): {
		inlineData: {
			data: string;
			mimeType: MimeTypes;
		};
	} {
		return {
			inlineData: {
				data: content,
				mimeType,
			},
		};
	}

	public async fetchToBase64WithMimeType(url: string) {
		try {
			// validate url
			const urlObj = new URL(url);
			if (!urlObj.protocol.startsWith('http')) {
				return {
					contentType: null,
					base64Data: null,
				};
			}

			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const contentType = response.headers.get('Content-Type');
			const blob = await response.blob();
			const buffer = await blob.arrayBuffer();
			const base64String = Buffer.from(buffer).toString('base64');

			return {
				contentType,
				base64Data: base64String,
			};
		} catch (error) {
			console.error('Error fetching or converting to base64:', error);
			return null;
		}
	}
}
