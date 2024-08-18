import fs from "fs/promises"
import { fromBuffer } from 'pdf2pic';
import { rimraf } from 'rimraf';

export async function pdfToImage(
	pdfBuffer: Buffer,
	pages: number[],
	action: {onProgress?: (page: number,  data: Buffer) => Promise<any>, onError?: (error: any) => void},
	storeSpace: string
) {
		try {
			console.log('storespace', storeSpace);
			rimraf.sync(storeSpace);
			await fs.mkdir(storeSpace);
			const baseOptions = {
				width: 2550,
				height: 3300,
				density: 330,
				savePath: storeSpace
			}
			const convert = fromBuffer(pdfBuffer, baseOptions);
			return convert.bulk(pages);

		} catch (error) {
			action.onError && action.onError(error);
		}
}