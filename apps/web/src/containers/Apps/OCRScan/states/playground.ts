import { atom } from 'jotai';
import type { Page as TesseractPage } from 'tesseract.js';
import type { UploadPDFResponse } from 'types/apps/ocr/api.type.ts';

type PaginationState = {
	currentPage: number;
	pageSize: number;
	totalCount: number;
	siblingCount: number;
};


export const documentId = atom<string | null>(null as string | null);

export const paginationState = atom<PaginationState>({
	currentPage: 1,
	pageSize: 1,
	totalCount: 1,
	siblingCount: 1,
});

export const currentTesseractPage = atom<TesseractPage | null>(null as TesseractPage | null);
export const pageStore = atom<TesseractPage[]>([]);
export const isPDFAtom = atom<boolean>(false);
export const pdfPageStore = atom<UploadPDFResponse|null>(null);
export const currentImageExtracted = atom<string | null>(null);