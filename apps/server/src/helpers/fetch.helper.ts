import https from 'https';

export async function getBufferFromUrl(url: string): Promise<Buffer> {
	return new Promise((resolve, reject) => {
		https.get(url, (response) => {
			if (response.statusCode !== 200) {
				reject(new Error(`error when download file: [code:${response.statusCode}] - ${url}`));
				return;
			}

			const data: any[] = [];

			response.on('data', (chunk) => {
				data.push(chunk);
			});

			response.on('end', () => {
				resolve(Buffer.concat(data));
			});
		}).on('error', (err) => {
			reject(err);
		});
	});
}

export async function getBase64FromUrl(url: string): Promise<string> {
	const buffer = await getBufferFromUrl(url);
	return buffer.toString('base64');
}