import AsyncMiddleware from '@/helpers/waiter.helper';
import { response_header_template } from '@/helpers/response_header_template.helper';
import { HttpStatusCode } from '@/helpers/http_status_code';
import { VoiceSeparationService } from '@/services/features/voice_separation.service';
import fsPromise from 'fs/promises';
import FileStorageService from '@/services/CURD/file_storage.service';
import path from 'path';
import { sendSSEEvent } from '@/utils/sse';

export class VoiceSeparationController {
	public static upload = AsyncMiddleware.asyncHandler(async (req, res) => {
		try {
			const file = req.file as Express.Multer.File;
			const file_data = file.buffer;
			const file_type = file.mimetype;
			const file_ext = file.originalname.split('.').pop();
			// sendSSEEvent(res, "processing", "Received file, processing...");

			// sendSSEEvent(res, "processing", "Creating storage place...");
			const {storagePath, id} = await VoiceSeparationService.createVoiceSeparationInfo();
			const save_file_path = path.join(storagePath, `source.${file_ext}`);
			await fsPromise.writeFile(save_file_path, file_data);
			// sendSSEEvent(res, "processing", "Created storage place successfully");

			if (file_type !== 'audio/wav') {
				// sendSSEEvent(res, "processing", "Converting file to wav...");
				const convert_to_wav = await FileStorageService.convert_to_wav(save_file_path);
				console.log('convert_to_wav', convert_to_wav);
				if (!convert_to_wav) {
					throw new Error('Failed to convert file to wav');
				}
				// sendSSEEvent(res, "processing", "Converted file to wav successfully");
			}
			const convertedFilePath = path.join(storagePath, 'source.wav');

			// sendSSEEvent(res, "processing", "Processing voice separation...");
			const processResult = await VoiceSeparationService.processVoiceSeparation(convertedFilePath, storagePath);
			// sendSSEEvent(res, "processing", "Processed voice separation successfully");
			console.log('processResult', processResult);
			const responseFormatted = [];

			// sendSSEEvent(res, "processing", "Getting audio duration...");
			for (const entry of processResult) {
				const duration = await FileStorageService.get_audio_duration(entry.path);

				responseFormatted.push({
					url: `${process.env.BASE_URL as string}/storage/Assets/voice-separation/${id}/${entry.name}`,
					name: entry.name,
					size: entry.size,
					duration: duration || null,
				})
			}
			// sendSSEEvent(res, "processing", "Got audio duration successfully");
			const response = {
				id: id,
				tracks: responseFormatted,
			}
			response_header_template(res).status(HttpStatusCode.Ok).send(response);
		} catch (error: any) {
			console.log('Error processing voice separation:', error);
			response_header_template(res).status(error.statusCode || HttpStatusCode.InternalServerError).send({
				message: error.message
			});
		}
	});
}