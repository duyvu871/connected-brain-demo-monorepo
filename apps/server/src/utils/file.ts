import fs from 'fs';

export async function getContentType(buffer: Buffer): Promise<string> {
		const fileType = await import('file-type');

		const file = await fileType.fileTypeFromBuffer(buffer);
		if (file) {
			return file.mime;
		}
		return 'application/octet-stream';
	}

export async function checkFileExist(filePath: string): Promise<boolean> {
		try {
			await fs.promises.access(filePath);
			return true;
		} catch (error) {
			return false;
		}
}
