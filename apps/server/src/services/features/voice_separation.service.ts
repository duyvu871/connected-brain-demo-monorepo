import * as path from 'path';
import * as fsPromises from 'fs/promises';
import { FileTypeResult } from 'file-type';

export class VoiceSeparationService {
	public static async processVoiceSeparation(filePath: string): Promise<string> {
		const VOICE_SEPARATION_API_ENDPOINT = 'http://127.0.0.1:8502/api/v1/separate';
		const fileName = path.basename(filePath);
		console.log('Processing voice separation for file:', fileName);
		return new Promise(async (res, rej) => {
			try {
				const fileType = (await import('file-type')).fileTypeFromBuffer;
				const file = await fsPromises.readFile(filePath);
				const contentType = <FileTypeResult>(await fileType(file));
				const fileBlob = new Blob([file], { type: contentType.mime });

			} catch (error: any) {
				console.error('Error processing voice separation:', error.message);
				rej(error);
			}
		})
	}
}