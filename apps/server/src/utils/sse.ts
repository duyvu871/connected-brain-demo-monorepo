import { Response } from 'express';

export function sendSSEEvent(res: Response, eventName: string, data: any) {
	res.write(`event: ${eventName}\n`);
	res.write(`data: ${JSON.stringify(data)}\n\n`); // Send data as JSON
}