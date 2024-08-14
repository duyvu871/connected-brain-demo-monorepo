import { atom } from 'jotai';

export const documentId = atom<string | null>(null as string | null);
