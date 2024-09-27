import { Job, Worker } from 'bullmq';
import Redis from 'ioredis';
// import env from '@/configs/env';
import {handleHeavyTask} from '@/tasks/example_task';
import { ConvertToWavJob, SpeechToTextJob, WorkerJob } from '@/services/queue/utils';
import * as process from 'node:process';
import dotenv from 'dotenv';
import { ConvertToWavTask } from '@/tasks/convert_to_wav';
import SpeechToText from '@/tasks/speech_to_text';
import { loadEnv } from '@/configs/env';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';

const DOTENV = dotenv.config({
	path: path.resolve(__dirname, isProduction ? '../.env' : '../.env.example') //process.cwd() + '/.env',
});

loadEnv(DOTENV.parsed);

export async function workerProcessor(taskName: string ,data: Promise<any>, job: Job){
		await job.updateProgress(0);
		const dataResolved = await data;
		await job.updateProgress(100);
		return data ?? 'DONE';
}

export async function workerHandler(job: Job<WorkerJob>){
	switch (job.data.type) {
		case 'example_task':
			return await workerProcessor('example_task', handleHeavyTask(job.data.job_data), job);
		case 'convert_to_wav':
			const wavData = job.data as ConvertToWavJob;
			return await workerProcessor('convert_to_wav', ConvertToWavTask(wavData.job_data), job);
		case 'speech_to_text':
			const s2tData = job.data as SpeechToTextJob;
			return await workerProcessor('speech_to_text', SpeechToText(s2tData.job_data), job);
		default:
			return Promise.resolve('DONE');
	}
}

const redisInstance = new Redis({
	host: process.env.REDIS_HOST,
	port: parseInt(process.env.REDIS_PORT as string),
	maxRetriesPerRequest: null,
	connectTimeout: 3600000, // 1 hour
	// ...(isProduction ? {
	// 	password: process.env.REDIS_PASSWORD,
	// 	username: process.env.REDIS_USERNAME
	// } : {}),
});

if (!redisInstance) {
	throw new Error('Redis instance is not created');
}

const workerQueue = new Worker('background_task', workerHandler, {
	connection: redisInstance,
	autorun: true,
});

workerQueue.on('completed', (job: Job, result) => {
	console.debug(`Completed job with id ${job.id}: ${job.name}`, result);
});
workerQueue.on('active', (job: Job<unknown>) => {
	console.debug(`Completed job with id ${job.id}: ${job.name} `);
});
workerQueue.on('error', (failedReason: Error) => {
	console.error(`Job encountered an error`, failedReason);
});

console.log('Worker is running');