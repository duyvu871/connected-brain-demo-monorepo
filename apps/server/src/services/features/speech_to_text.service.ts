import { ObjectId, Types } from 'mongoose';
import FileStorageService from '@/services/CURD/file_storage.service';
import AppConfig from '@/configs/app.config';
import S2t, { IS2t, IS2tDTO } from '@/models/speech_to_text.model';
import ApiError from '@/helpers/ApiError';
import { HttpStatusCode } from '@/helpers/http_status_code';
import { MakeRequired } from '@/types/helper';
import { Request } from 'express';
import { Server, Socket } from 'socket.io';
import { constants } from '@repo/utils';
import path from 'path';
import * as http from 'node:http';
import { getRedis, initNewRedis, initRedis } from '@/configs/database/redis';
import Redis from 'ioredis';

const {api_route} = constants;

const clientConnect = new Map<string, Socket>();

initRedis();
// const RedisInstance = getRedis().instanceRedis;

export default class SpeechToTextService {
	public static connection(io: Server) {
		console.log('S2T socket connected', api_route.API.feature.SPEECH_TO_TEXT.socket);
		const namespace = io.of(api_route.API.feature.SPEECH_TO_TEXT.socket);
		namespace.on('connection', async (socket) => {

			const sessionId = socket.handshake.query.sessionId instanceof Array
				? socket.handshake.query.sessionId[0]
				: socket.handshake.query.sessionId;

			if (!sessionId) {
				socket.emit('error', 'session id not found');
				socket.disconnect(true);
				return;
			}

			console.log(`user ${sessionId} connected to speech to text`);

			if (clientConnect.has(sessionId)) {
				socket.emit('error', 'session id already connected');
				// socket.disconnect(true);
				clientConnect.get(sessionId)?.disconnect(true);
				clientConnect.delete(sessionId);
				// return;
			}
			const RedisInstance = initNewRedis();
			clientConnect.set(sessionId, socket);

			socket.on('disconnect', () => {
				console.log('user disconnected');
				clientConnect.delete(sessionId);

				if (RedisInstance) {
					RedisInstance.unsubscribe();
					RedisInstance.quit();
					console.log('redis unsubscribe');
				}
			});

			socket.on('error', (error) => {
				console.error('Error occurred:', error);
				// @ts-ignore
				if (error.critical) {
					clientConnect.delete(sessionId);
					socket.disconnect(true);
				} else {
					socket.emit('error', error.message);
				}
			});

			socket.on("get-s2t-status", async (data: {id: string}) => {
				// console.log("get-s2t-status", data);
					try {
						const auditData = await this.get_audit(data.id);
						console.log('status:', auditData.status);
						if (auditData.status === 'done') {
							clientConnect.get(sessionId)?.emit("s2t:transcript", JSON.stringify(auditData));
						} else if (auditData.status === 'processing') {
							const channel = `s2t:transcript:${data.id.toString()}`;
							console.log("channel receive: ", channel);
							if (RedisInstance) {
								await RedisInstance.subscribe(channel);
								console.log('redis subscribe to channel:', channel);
								if (!RedisInstance.listenerCount('message')) {
									RedisInstance.on('message', (channelMessage: string, message:string) => {
										console.log("channel: ", channelMessage);
										if (channelMessage === channel) {
											if (clientConnect.has(sessionId)) {
												clientConnect.get(sessionId)?.emit("s2t:transcript", message);
											}
										}
									})
								} else {
									// await RedisInstance.unsubscribe(channel);
								}
							}
						}
					} catch (e: any) {
						console.log(e);
						socket.emit("error", e.message);
						socket.disconnect(true);
					}
			})
		});
	}
	// create database repo to store audio record
	public static async create_database_repo(originName: string, user: string|ObjectId): Promise<NonNullable<IS2t>> {
		const newRepo = await S2t.create({
			user,
			originName
		});
		if (!newRepo || !newRepo._id) {
			throw new ApiError(HttpStatusCode.InternalServerError, "fail create storage place");
		}
		return newRepo;
	}
	// create audit and place to storage
	public static async create_audit(id: string|ObjectId) {
		//create directory

		const directoryPath = path.join(process.cwd(), `/storage/Assets/s2t/${id.toString()}`)
		const relativePath =  `/storage/Assets/s2t/${id.toString()}`
		const createStorageDirectory = await FileStorageService.create_directory(directoryPath);
		//create audit file
		const auditContent = {
			"cloudPath": "",
			"path": relativePath,
			"auditPath": `${relativePath}/audit.json`,
			"audio": {
				"path": `${relativePath}/audio.mp3`,
				"duration": 0
			},
			"transcript": []
		};
		try {
			const createAuditFile = await FileStorageService.write_file(
				directoryPath+'/audit.json',
				Buffer.from(JSON.stringify(auditContent))
			);
		} catch (error: any) {
			console.error('create audit error', error);
		}

		return auditContent;
	}
	// create audio storage
	public static async create_audio_file(
		content: Buffer,
		audit: MakeRequired<Partial<Awaited<ReturnType<typeof SpeechToTextService.create_audit>>>, 'audio'>
	) {
		const createFileContent = FileStorageService.write_file(global.__rootdir + audit.audio.path, content);
		return audit.audio.path;
	}

	public static create_audio_stream = (
		req: Request,
		audit:MakeRequired<Partial<Awaited<ReturnType<typeof SpeechToTextService.create_audit>>>, 'audio'>
	) => {
		return new Promise((resolve, reject) => {
			try {
				const writeStream = FileStorageService.create_write_stream(
					path.join(process.cwd(), audit.audio.path)
				);

				const file = req.file as Express.Multer.File;
				const buffer = file.buffer;
				writeStream.write(buffer);
				// event stream
				writeStream.on("open", () => {
					console.log('Start stream .... !!!!');
					req.pipe(writeStream);
				});
				writeStream.on("drain", () => {
					const written = parseInt(writeStream.bytesWritten.toString());
					const total = parseInt(req.headers['content-length'] || '0');
					const pWritten = ((written / total) * 100).toFixed(2);
					console.log(`Processing  ...  ${pWritten}% done`);
				});
				writeStream.on("close", () => {
					console.log('Processing  ...  100%');
					resolve(audit.audio.path);
				});
				writeStream.on("error", (err) => {
					console.error('stream write', err);
					reject(err);
				});
			} catch (e) {
				console.error('create audio stream error', e);
				reject(e);
			}
		});
	}

	// get audit
	public static async get_audit(id: string|ObjectId) {
		const audit = await S2t.findById(id);
		if (!audit) {
			throw new ApiError(HttpStatusCode.NotFound, "audit not found");
		}
		return audit;
	}
	// update audit
	public static async update_audit(id: string|ObjectId, audit: Partial<IS2tDTO>): Promise<IS2tDTO| null> {
		const auditPath = `${process.cwd()}/storage/Assets/s2t/${id.toString()}/audit.json`;
		const rewriteAudit = FileStorageService.read_file(auditPath);
		if (!rewriteAudit) {
			console.log(new ApiError(HttpStatusCode.InternalServerError, "fail read audit"));
			return null;
		}
		const auditJson = JSON.parse(rewriteAudit);
		const newAudit = {...auditJson, ...audit};
		const writeNewAudit = await FileStorageService.write_file(auditPath, Buffer.from(JSON.stringify(newAudit)));
		const updateAuditRepo = await S2t.findByIdAndUpdate(
			new Types.ObjectId(id.toString()), newAudit, {new: true}
		).exec();
		if (!updateAuditRepo) {
			console.log(new ApiError(HttpStatusCode.InternalServerError, "fail update audit"));
			return null;
		}
		// console.log('update audit:', updateAuditRepo);
		return newAudit;
	}
	// get transcript by id
	public static async get_transcript(id: string|ObjectId) {
		const audit = await SpeechToTextService.get_audit(id);
		const auditContent = FileStorageService.read_file(process.cwd() + audit.auditPath);

		return auditContent;
	}
	// list transcript
	public static async list_transcript(userId:string|ObjectId) {
		return await S2t.find({ user: userId }).exec();
	}
	// update transcript
	public static async update_transcript(id: string|ObjectId, transcript: string) {
		try {
			const audit = await SpeechToTextService.get_audit(id);
			const auditContent = FileStorageService.read_file(process.cwd() + audit.auditPath);
			const auditJson = JSON.parse(auditContent);
			auditJson.transcript.push(transcript);
		} catch (error: any) {
			console.error('update transcript error', error);
		}
	}
}