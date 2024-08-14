

export function detectMimeType(base64 = ''): string | undefined {
	let mimeType: string | undefined;
	const popularSignatures = {
		JVBERi0: 'application/pdf',
		R0lGODdh: 'image/gif',
		R0lGODlh: 'image/gif',
		iVBORw0KGgo: 'image/png',
		'/9j/': 'image/jpeg',
		Qk02U: 'image/bmp',
	};
	Object.entries(popularSignatures).some(([signature, type]) => {
		const signatureWasFound = base64.startsWith(signature);
		if (signatureWasFound) mimeType = type;
		return signatureWasFound;
	});

	return mimeType;
}

// export async function fileTypeFromBuffer(buffer: Buffer): Promise<{ ext: string; mime: string } | undefined> {
// 	const fileType = await import('file-type');
// 	console.log('fileType', fileType);
// 	return await fileType.default.fileTypeFromBuffer(buffer);
// }
//
// export async function fileTypeFromBase64(base64: string): Promise<{ ext: string; mime: string } | undefined> {
// 	const buffer = Buffer.from(base64, 'base64');
// 	return await fileTypeFromBuffer(buffer);
// }