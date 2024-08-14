import { Server } from 'socket.io';

declare global {
	var __basedir: string;
	var __rootdir: string;
	var __io: Server;
}

export {};