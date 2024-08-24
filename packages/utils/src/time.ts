import moment from 'moment';

export function formatMillisecondsToMinutesSeconds(milliseconds: number): string {
	const duration = moment.duration(milliseconds);

	const minutes = duration.minutes();
	const seconds = duration.seconds();

	return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function convertSecondsToMilliseconds(seconds: number): number {
	return seconds * 1000;
}

export function formatSecondsToMinutesSeconds(seconds: number): string {
	const duration = moment.duration(seconds, 'seconds');

	const minutes = duration.minutes();
	const remainingSeconds = duration.seconds();

	return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}