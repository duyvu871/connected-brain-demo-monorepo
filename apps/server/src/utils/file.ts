
export async function getContentType(buffer: Buffer): Promise<string> {
		const fileType = await import('file-type');

		const file = await fileType.fileTypeFromBuffer(buffer);
		if (file) {
			return file.mime;
		}
		return 'application/octet-stream';
	}