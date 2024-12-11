import {
	Request,
	Response
} from 'express';
import {
	response_header_template
} from '@/helpers/response_header_template.helper';
import {
	HttpStatusCode
} from '@/helpers/http_status_code';
import SpeechToTextService from '@/services/features/speech_to_text.service';
import BackgroundTaskService from '@/services/backgroud_task.service';
import AsyncMiddleware from '@/helpers/waiter.helper';
import {
	WorkerJob
} from '@/services/queue/utils';
import path from 'path';
import S2TValidation from '@/validations/s2t.validation';
import {
	z
} from 'zod';
import {
	deFlattenObject,
	flattenObject
} from '@/utils/base';
import CloudSpeech from '@/services/google-cloud/cloud_speech.service';
import {v4 as uuidv4} from 'uuid';
import { NetworkSFTP } from '@repo/network-sftp';
import { sftpHostCbrain } from '@/configs/sftp/host/cbrain';
// import { getRedis, initRedis } from '@/configs/database/redis';
import { getKey, setKey } from '@/repo/redis';

export default class SpeechToTextController {
	// @ts-ignore
	public static upload_file_without_auth = AsyncMiddleware.asyncHandler(async (req: Request, res: Response) => {
		const file = req.file as Express.Multer.File;
		if (!file) {
			return res.status(400).send('Please upload a file');
		}
		const file_data = file.buffer;
		const file_type = file.mimetype;
		const file_ext = file.originalname.split('.').pop();
		let file_name = uuidv4();
		NetworkSFTP.setConfig('upload-without-auth', sftpHostCbrain);
		let remotePath = path.posix.join('/media/cbrain/9cdf9fac-bba1-4725-848d-cc089e577048/new_folder/CBrain/Study_and_Research/Test/S2T/S2T_API/audios', `${file_name}.${file_ext||'mp3'}`);
		try {
			// const exists = await NetworkSFTP.accessFile('upload-without-auth', remotePath);
			// if (exists) {
			// 	file_name = uuidv4();
			// 	remotePath = path.posix.join('/media/cbrain/storage', `${file_name}.${file_ext||'mp3'}`);
			// 	await NetworkSFTP.deleteFile('upload-without-auth', remotePath);
			// 	// return res.status(400).send('File already exists');
			// }
			console.log('remotePath', remotePath);

			const writeFile = await NetworkSFTP.writeFile('upload-without-auth', remotePath, file_data);
			console.log(writeFile);
			if (!writeFile) {
				return res.status(500).send('Có lỗi sảy ra khi tải file lên, vui lòng liên hệ với quản trị viên để được hỗ trợ');
			}
			const storeProcessInfo = await setKey(`upload-without-auth:${file_name}`, JSON.stringify({
				file_name: file_name,
				file_ext: file_ext,
				file_type: file_type,
				remote_path: remotePath
			}), 60*60*24);
			console.log('storeProcessInfo', storeProcessInfo);
			response_header_template(res).status(HttpStatusCode.Ok).send({
				id: file_name,
			});
		} catch (error: any) {
			console.error('Error serving file:', error);
			response_header_template(res).status(error.statusCode || HttpStatusCode.InternalServerError).send({
				message: "Có lỗi sảy ra khi tải file lên, vui lòng liên hệ với quản trị viên để được hỗ trợ"
			});
		}
	})
	// @ts-ignore
	public static handle_remote_s2t = AsyncMiddleware.asyncHandler(async (req: Request, res: Response) => {
		const { id: filename } = req.body;
		if (!filename) {
			return res.status(400).send('id is required');
		}
		try {
			const file_data = await getKey<string>(`upload-without-auth:${filename}`);
			if (!file_data) {
				return res.status(404).send('Process not found, please upload again');
			}
			console.log('file_data', file_data);
			const parsed_file_data = JSON.parse(file_data);
			if (parsed_file_data.transcript) {
				return res.status(200).send({
					...parsed_file_data.transcript
				});
			}
			const myHeaders = new Headers();
			myHeaders.append("Content-Type", "application/json");

			const raw = JSON.stringify({
				"audio_path": parsed_file_data.remote_path//"/media/cbrain/9cdf9fac-bba1-4725-848d-cc089e577048/new_folder/CBrain/Study_and_Research/Test/5b6cc220-bd79-4097-9238-459d4726db46.mp3"
			});

			const response = await fetch("http://localhost:8088/transcribe", {
				method: "POST",
				headers: myHeaders,
				body: raw,
				// redirect: "follow"
			});

			if (!response.ok) {
				return res.status(response.status).send('Có lỗi sảy ra khi thực hiện speech-to-text, vui lòng liên hệ với quản trị viên để được hỗ trợ');
			}

			const data = await response.json();
			const storeProcessInfo = await setKey(`upload-without-auth:${parsed_file_data.file_name}`, JSON.stringify({
				...parsed_file_data,
				transcript: data
			}), 60*60*24);
			response_header_template(res).status(HttpStatusCode.Ok).send({
				...data
			});

		} catch (error: any) {
			console.error('Error s2t:', error);
			response_header_template(res).status(error.statusCode || HttpStatusCode.InternalServerError).send({
				message: "Có lỗi sảy ra khi thực hiện speech-to-text, vui lòng liên hệ với quản trị viên để được hỗ trợ"
			});
		}
	});

	public static upload_file = AsyncMiddleware.asyncHandler(async (req: Request, res: Response) => {
		try {
			const file = req.file as Express.Multer.File;
			const file_data = file.buffer;
			const file_name = file.originalname;
			const file_ext = file_name.split('.').pop();
			// @ts-ignore
			const user = req.user as string;
			const db_repo = await SpeechToTextService.create_database_repo(file_name, user);
			const audit = await SpeechToTextService.create_audit(db_repo._id ?? 'error_audit_created');
			const audio_file = await SpeechToTextService.create_audio_stream(req, audit);
			const absolute_path = path.join(process.cwd(), audit.audio.path);
			file_ext !== 'wav' && await BackgroundTaskService.add_task<WorkerJob> (
				'background_task',
				'convert_to_wav', {
					type: 'convert_to_wav',
					job_data: {
						file_name: absolute_path,
						id: String(db_repo._id)
					}
				});
			const get_transcript = await BackgroundTaskService.add_task(
				'background_task',
				'speech_to_text', {
					type: 'speech_to_text',
					job_data: {
						file_name: absolute_path,
						id: String(db_repo._id)
					}
				});
			response_header_template(res).status(HttpStatusCode.Ok).send({
				id: db_repo._id,
				file_name,
				audit,
				audio_file
			});
		} catch (error: any) {
			response_header_template(res).status(error.statusCode || HttpStatusCode.InternalServerError).send({
				message: error.message
			});
		}
	});

	public static get_transcript = AsyncMiddleware.asyncHandler(async (req: Request, res: Response) => {
		try {
			const transcript_id = req.query.id?.toString() as string;
			const audit = await SpeechToTextService.get_audit(transcript_id);
			const json_audit = audit.toJSON();
			response_header_template(res).status(HttpStatusCode.Ok).send({
				...json_audit
			});
		} catch (error: any) {
			response_header_template(res).status(error.statusCode || HttpStatusCode.InternalServerError).send({
				message: error.message
			});
		}
	});

	public static update_transcript = AsyncMiddleware.asyncHandler(async (req: Request, res: Response) => {
		try {
			const transcript = req.body as z.infer < typeof S2TValidation.updateTranscriptBody > ;
			const transcript_id = transcript.id;
			const parsed_transcript = S2TValidation.transcript.parse(deFlattenObject(transcript.data).transcript);
			const current_audit = await SpeechToTextService.get_audit(transcript_id);
			const json_audit = current_audit.toJSON();
			const flatten_audit_transcript = flattenObject({
				transcript: json_audit.transcript
			});
			const new_audit_transcript = deFlattenObject({
				...flatten_audit_transcript,
				...transcript.data
			});
			const update_audit = await SpeechToTextService.update_audit(transcript_id, {
				...new_audit_transcript
			});
			response_header_template(res).status(HttpStatusCode.Ok).send({
				message: 'transcript updated'
			});
		} catch (error: any) {
			res.status(error.statusCode || HttpStatusCode.InternalServerError).send({
				message: error.message
			});
		}
	});

	public static list_transcript = AsyncMiddleware.asyncHandler(async (req: Request, res: Response) => {
		try {
			// @ts-ignore
			const user = req.user as string;
			const audit_list = await SpeechToTextService.list_transcript(user);
			response_header_template(res).status(HttpStatusCode.Ok).send({
				audit_list
			});
		} catch (error: any) {
			response_header_template(res).status(error.statusCode || HttpStatusCode.InternalServerError).send({
				message: error.message
			});
		}
	})

	public static background_task_test = AsyncMiddleware.asyncHandler(async (req: Request, res: Response) => {
		const magicNumber = parseInt(req.body.magicNumber.toString() as string);
		await BackgroundTaskService.add_task < WorkerJob > (
			'background_task',
			'example_task', {
				type: 'example_task',
				job_data: {
					magicNumber
				}
			});
		response_header_template(res).status(HttpStatusCode.Ok).send({
			message: 'background task added'
		});
	});

	public static get_token = AsyncMiddleware.asyncHandler(async (req: Request, res: Response) => {
		response_header_template(res).status(HttpStatusCode.Ok).send({
			token: CloudSpeech.getTemporaryToken()
		});
	});
}