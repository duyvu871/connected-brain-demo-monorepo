import fs from 'fs';
import path from 'path';

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

export function findSiblingFolders(filePath: string) {
	const parentDir = path.dirname(filePath);
	const siblings = fs.readdirSync(parentDir);

	return siblings.filter((item) => {
		const itemPath = path.join(parentDir, item);
		return fs.statSync(itemPath).isDirectory();
	});
}