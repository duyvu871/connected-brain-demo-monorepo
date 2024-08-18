import { atomWithStorage } from 'jotai/utils';

export const theme = atomWithStorage<'dark'|'light'>('theme', 'dark');