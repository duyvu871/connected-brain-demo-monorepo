import { atom } from 'jotai';
import type { Selection} from '@nextui-org/react'
import type {Page as TesseractPage} from 'tesseract.js'

type ProgressData = {
	label: string;
	progress: number;
}

const initialSourceLang: Selection = new Set(['en']);
const initialOcrLang: Selection = new Set(['en']);

export const selectedSourceLang = atom<Selection>(initialSourceLang);
export const selectedOcrLang = atom<Selection>(initialOcrLang);

export const starterAssetsPreUpload = atom<File|null>(null as File | null);
export const starterModalOpen = atom<boolean>(false);

export const progress = atom<ProgressData>({label: '', progress: 0});
export const currentTesseractPage = atom<TesseractPage | null>(null as TesseractPage | null);