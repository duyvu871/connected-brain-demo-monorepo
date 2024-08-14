import * as path from 'node:path';
import { cwd } from 'node:process';

export const constants = {
	langPath: path.join(cwd(), '../../packages/ocr/lang-data'),
};