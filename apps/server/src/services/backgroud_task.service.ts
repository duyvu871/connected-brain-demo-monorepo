import { Job, Queue, QueueEvents } from 'bullmq';
import env from '@/configs/env';
import { ConnectionOptions } from 'bullmq/dist/esm/interfaces/redis-options';

type queue_name = 'background_task' | 'audio_handle_queue' | 'example_task';

export default class BackgroundTaskService {
	public static DEFAULT_REMOVE_CONFIG = {
		removeOnComplete: {
			age: 60, // 60 seconds
		},
		removeOnFail: {
			age: 60 * 15, // 15 minutes
		},
	};

	public static redisConnection: ConnectionOptions = {
		host: env.REDIS_HOST,
		port: parseInt(env.REDIS_PORT),
		...(process.env.REDIS_PASSWORD ? { password: process.env.REDIS_PASSWORD } : {}),
		...(process.env.REDIS_USERNAME ? { username: process.env.REDIS_USERNAME } : {}),
		// ...(process.env.NODE_ENV === 'production' ? {
		// 	password: env.REDIS_PASSWORD,
		// 	username: env.REDIS_USERNAME,
		// } : {}),
		retryStrategy: (times) => {
			// Retry after 2 seconds
			return Math.min(times * 100, 2000);
		},
	}

	private static queue: Queue;
	private static queue_event: QueueEvents;

	public static get_queue(queue_name: queue_name = 'background_task'): Queue {
		if (!this.queue) {
			this.queue = new Queue(queue_name, {
				connection: {
					host: env.REDIS_HOST,
					port: parseInt(env.REDIS_PORT),
					...(process.env.REDIS_PASSWORD ? { password: process.env.REDIS_PASSWORD } : {}),
					...(process.env.REDIS_USERNAME ? { username: process.env.REDIS_USERNAME } : {}),
					// ...(process.env.NODE_ENV === 'production' ? {
					// 	password: env.REDIS_PASSWORD,
					// 	username: env.REDIS_USERNAME,
					// } : {}),
					retryStrategy: (times) => {
						// Retry after 2 seconds
						return Math.min(times * 100, 2000);
					},
				}
			});
		}

		return this.queue;
	}

	public static get_queue_event(queue_name: queue_name = 'background_task'): QueueEvents {
		if (!this.queue_event) {
			this.queue_event = new QueueEvents(queue_name, {
				connection: this.redisConnection
			});
		}

		return this.queue_event;
	}

	public static add_task<T>(queue_name: queue_name,task_name: string, data: T): Promise<Job<T>> {
		return this.get_queue(queue_name).add(task_name, data, this.DEFAULT_REMOVE_CONFIG);
	}
	public static listen(queue_name: queue_name, task_name: string, callback: (job: Job) => void): void {
		return
	}
}
