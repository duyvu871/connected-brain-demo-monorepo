import { ObjectId, Types } from 'mongoose';
import FileStorageService from '@/services/CURD/file_storage.service';
import AppConfig from '@/configs/app.config';
import S2t, { IS2t, IS2tDTO } from '@/models/speech_to_text.model';
import ApiError from '@/helpers/ApiError';
import { HttpStatusCode } from '@/helpers/http_status_code';
import { MakeRequired } from '@/types/helper';
import { Request } from 'express';
import { Server } from 'socket.io';
import { api_route } from '@repo/utils/constants';
import path from 'path';

export default class SpeechToTextService {
	public static connection(io: Server) {
		console.log('S2T socket connected', api_route.API.feature.SPEECH_TO_TEXT.socket);
		io.of(api_route.API.feature.SPEECH_TO_TEXT.socket).on('connection', (socket) => {
			console.log('user connected to speech to text');
			socket.on('disconnect', () => {
				console.log('user disconnected');
			});
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
		const createAuditFile = await FileStorageService.write_file(
			directoryPath+'/audit.json',
			Buffer.from(JSON.stringify(auditContent))
		);

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
	public static async update_audit(id: string|ObjectId, audit: Partial<IS2tDTO>) {
		const auditPath = `${process.cwd()}/storage/Assets/s2t/${id.toString()}/audit.json`;
		const rewriteAudit = FileStorageService.read_file(auditPath);
		const auditJson = JSON.parse(rewriteAudit);
		const newAudit = {...auditJson, ...audit};
		const writeNewAudit = await FileStorageService.write_file(auditPath, Buffer.from(JSON.stringify(newAudit)));
		const updateAuditRepo = await S2t.findByIdAndUpdate(
			new Types.ObjectId(id.toString()), newAudit, {new: true}
		).exec();
		if (!updateAuditRepo) {
			throw new ApiError(HttpStatusCode.InternalServerError, "fail update audit");
		}
		// console.log('update audit:', updateAuditRepo);
		return;
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
		const audit = await SpeechToTextService.get_audit(id);
		const auditContent = FileStorageService.read_file(process.cwd() + audit.auditPath);
		const auditJson = JSON.parse(auditContent);
		auditJson.transcript.push(transcript);
	}
}