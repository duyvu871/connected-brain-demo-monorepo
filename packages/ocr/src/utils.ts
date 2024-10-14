import * as path from 'node:path';
import { cwd } from 'node:process';

export interface Point {
	x: number;
	y: number;
}

export interface Box {
	topLeft: Point;
	bottomRight: Point;
}

export interface Bbox {
	x0: number;
	y0: number;
	x1: number;
	y1: number;
}

export interface Word {
	text: string;
	confidence: number;
	bbox: Bbox;
}

export interface Choice {
	text: string;
	confidence: number;
}

export interface InputData {
	results: { box: number[][], text: string }[][];
}

export interface OutputData {
	words: Word[];
	choices: Choice[];
	text: string;
}

export function transformData(inputData: InputData): OutputData {
	const words: Word[] = [];
	const choices: Choice[] = [];
	let text = '';

	inputData.results.forEach(page => {
		page.forEach(item => {
			const box: Box = {
				topLeft: { x: item.box[0][0], y: item.box[0][1] },
				bottomRight: { x: item.box[1][0], y: item.box[1][1] },
			};

			const bbox: Bbox = {
				x0: box.topLeft.x,
				y0: box.topLeft.y,
				x1: box.bottomRight.x,
				y1: box.bottomRight.y,
			};

			const word: Word = {
				text: item.text,
				confidence: 1,
				bbox: bbox,
			};

			words.push(word);
			text += item.text + ' \n';
		});
	});

	return {
		words,
		choices,
		text: text.trim(),
	};
}

export const constants = {
	langPath: path.join(cwd(), '../../packages/ocr/lang-data'),
};