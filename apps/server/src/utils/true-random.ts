import { randomBytes } from 'crypto';

export function randomRange(min: number, max: number): number {
	return randomBytes(4).readUInt32LE(0) % (max - min) + min;
}