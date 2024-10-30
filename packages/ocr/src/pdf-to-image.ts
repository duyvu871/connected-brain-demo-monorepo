import { exec } from 'child_process';
import process from 'node:process';

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
	console.log(options);
	let command = process.env.NODE_ENV === 'production' ? 'convert -alpha off -limit memory 2G' : `magick convert -alpha off -limit memory 2G`;
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


export const pdfToImageGhostScript = (options: ConvertOptions): Promise<void> => {
	const { inputPath, outputPath, density, pages, format, quality } = options;
	console.log(options);

	// Determine the appropriate Ghostscript executable based on the environment
	const gsCommand = process.env.NODE_ENV === 'production'
		? 'gs' // Linux
		: 'gswin64c'; // Assuming 64-bit Windows for dev

	let command = `${gsCommand} -dBATCH -dNOPAUSE -sDEVICE=`;

	// Set output format and quality
	if (format === 'jpg' || format === 'jpeg') {
		command += 'jpeg';
	} else {
		command += 'pngalpha'; // Default to PNG with transparency
	}

	if (quality) {
		command += ` -dJPEGQ=${quality}`; // Quality for JPEG
	}

	// Set resolution
	if (density) {
		command += ` -r${density}`;
	}

	// Specify page range
	if (pages && pages.length > 0) {
		command += ` -dFirstPage=${Math.min(...pages)} -dLastPage=${Math.max(...pages)}`;
	}

	// Set output file pattern
	command += ` -o "${outputPath}-%03d.${format || 'png'}" "${inputPath}"`;

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