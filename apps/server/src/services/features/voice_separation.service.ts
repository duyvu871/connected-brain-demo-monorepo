import * as path from 'path';
import * as fsPromises from 'fs/promises';
import { FileTypeResult } from 'file-type';
import fs from 'fs';
import axios, { AxiosError } from 'axios';
import AdmZip from 'adm-zip';
import {v4 as uuidv4} from 'uuid';
import * as zlib from 'node:zlib';

export class VoiceSeparationService {
	public static async processVoiceSeparation(filePath: string, targetDir?: string): Promise<{
		name: string;
		path: string;
		size: number;
		compressedSize: number;
		isDirectory: boolean;
	}[]> {
		const VOICE_SEPARATION_API_ENDPOINT = process.env.NODE_ENV === "development"
			? "http://14.224.188.206:8502/api/v1/separate"
			: 'http://127.0.0.1:8502/api/v1/separate';
		const fileName = path.basename(filePath);
		console.log('Processing voice separation for file:', fileName);
		return new Promise(async (res, rej) => {
			try {
				const fileType = (await import('file-type')).fileTypeFromBuffer;
				const file = await fsPromises.readFile(filePath);
				const contentType = <FileTypeResult>(await fileType(file));
				const fileBlob = new Blob([file], { type: contentType.mime });

				const formData = new FormData();
				formData.append('file', fileBlob, fileName);

				let dir = targetDir || path.dirname(filePath);
				const zipFilePath = `${dir}/file.zip`;
				const fileStream = fs.createWriteStream(zipFilePath);

				const response: boolean = await axios.post(
					VOICE_SEPARATION_API_ENDPOINT,
					formData,
					{
						headers: {
							'Content-Type': 'multipart/form-data',
						},
						responseType: 'stream',
					}
				).then(response => {
					try {
						if (response.status !== 200) {
							throw new Error(`Failed to process voice separation: ${response.statusText}`);
						}
						return new Promise((resolve, reject) => {
							if (!response.data) return;
							response.data.pipe(fileStream);
							let error: any;
							fileStream.on('error', (err) => {
								error = err;
								fileStream.close();
								console.log('Error processing voice separation write zip:', err.message);
								resolve(false);
							});
							fileStream.on('close', () => {
								if (!error) {
									resolve(true);
								}
							});
							fileStream.on('finish', () => {
								resolve(true);
							});
						});
					} catch (error: any) {
						console.error('Error processing voice separation:', error.message);
						return false;
					}
				});

				if (!response) {
					throw new Error('Failed to process voice separation');
				}

				// extract zip file
				const zip = new AdmZip(zipFilePath);

				zip.extractAllTo(dir, true);

				const zipEntries = zip.getEntries();

				return res(zipEntries.map(entry => ({
					name: entry.entryName,
					path: path.join(dir, entry.entryName),
					size: entry.header.size,
					compressedSize: entry.header.compressedSize, // can be 0
					isDirectory: entry.isDirectory,
				})));
			} catch (error: any) {
				if (error instanceof AxiosError) {
					console.error('Error processing voice separation:', error.response?.data);
				} else {
					console.error('Error processing voice separation:', error.message);
				}
				rej(error);
			}
		})
	}

	public static async createVoiceSeparationInfo(): Promise<{
		id: string;
		storagePath: string;
	}> {
		// create voice separation info
		const storagePath = path.join(process.cwd(), 'storage', 'Assets', 'voice-separation');
		try {
			const createStoragePalace = await fsPromises.mkdir(storagePath, { recursive: true });
			if (createStoragePalace) {
				console.log('Created voice separation storage palace:', storagePath);
			}
			const uniqueId = uuidv4();
			const dataStorePath = path.join(storagePath, uniqueId);
			const createDataStore = await fsPromises.mkdir(dataStorePath, { recursive: true });
			if (createDataStore) {
				console.log('Created voice separation data store:', dataStorePath);
			}
			return {
				id: uniqueId,
				storagePath: dataStorePath
			};
		} catch (error: any) {
			console.error('Error creating voice separation info:', error.message);
			throw new Error('Failed to create voice separation info');
		}
	}
}