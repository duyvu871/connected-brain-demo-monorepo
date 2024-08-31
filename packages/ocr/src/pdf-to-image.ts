import { exec } from 'child_process';

interface ConvertOptions {
	inputPath: string;
	outputPath: string;
	density?: number;
	quality?: number;
	pages?: number[];
	format?: string;
}

export const pdfToImage = (options: ConvertOptions): Promise<void> => {
	const { inputPath, outputPath, density, pages, format, quality } = options;

	let command = `magick convert -alpha off -limit memory 2G`;
	if (quality) command += ` -quality ${quality}`;
	if (density) command += ` -density ${density}`;
	if (pages) {
		command += ` ${inputPath}[`;
		pages.forEach((page, index) => {
			command += `${page}`;
			if (index < pages.length - 1) command += ',';
		});
		command += ']';
	} else command += ` ${inputPath}`;
	if (format) command += ` ${outputPath}-%03d.${format}`;
	else command += ` ${outputPath}-%03d.png`; // default to png
	return new Promise((resolve, reject) => {
		console.log('command', command);
		exec(command, (error, stdout, stderr) => {
			if (error) {
				reject(error);
				return;
			}
			resolve();
		});
	});
};