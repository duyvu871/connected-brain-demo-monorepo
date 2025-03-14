import { HttpStatusCode } from "@/helpers/http_status_code";
import { response_header_template } from "@/helpers/response_header_template.helper";
import AsyncMiddleware from "@/helpers/waiter.helper";
import FileStorageService from "@/services/CURD/file_storage.service";
import { sendSSEEvent } from "@/utils/sse";
import path from "path";
import fsPromise from "fs/promises";
import { VoiceIdentificationService } from "@/services/features/voice_identification.service";
import voiceIdentificationSchema from "@/models/voice_identificaiton.model";

export class VoiceIdentifyController {
    public static register = AsyncMiddleware.asyncHandler(async (req, res) => {
        try {
            const file = req.file as Express.Multer.File;
            const userName = req.body.userName;
            const fileData = file.buffer;
            const fileType = file.mimetype;
            const fileExt = file.originalname.split('.').pop();
            // sendSSEEvent(res, "processing", "Received file, processing...");
            // sendSSEEvent(res, "processing", "Creating storage place...");

            const voiceIdentificationStoragePlace =  await FileStorageService.processServiceStoragePlace("voice-identification");
            const saveFilePath = path.join(voiceIdentificationStoragePlace.storagePath, `source.${fileExt}`);
			await fsPromise.writeFile(saveFilePath, fileData);
            const processFileToWavPath = await FileStorageService.process_file_to_wav(file, saveFilePath, voiceIdentificationStoragePlace.storagePath);
            const newVoiceRecord = await voiceIdentificationSchema.create({
                name: userName,
                path: processFileToWavPath,
                status: 'pending',
                voice_id: voiceIdentificationStoragePlace.id
            });
            const uploadToExternalService = await VoiceIdentificationService.registerVoiceIdentification(processFileToWavPath);
            // sendSSEEvent(res, "processing", "Created storage place successfully");
            if (!uploadToExternalService) {
                throw new Error('Có lỗi xảy ra khi đăng ký giọng nói');
            }
            response_header_template(res).status(HttpStatusCode.Ok).send({
                message: 'Đăng ký giọng nói thành công',
                data: {
                    voice_id: newVoiceRecord.id,
                    user_name: userName
                }
            });
        } catch (error: any) {
            console.log('Error processing voice separation:', error);
			response_header_template(res).status(error.statusCode || HttpStatusCode.InternalServerError).send({
				message: error.message
			});
        }
    });

    public static identify = AsyncMiddleware.asyncHandler(async (req, res) => {
        try {
            const file = req.file as Express.Multer.File;
            const fileData = file.buffer;
            const fileType = file.mimetype;
            const fileExt = file.originalname.split('.').pop();
            
            const voiceIdentificationStoragePlace =  await FileStorageService.processServiceStoragePlace("voice-identification-temp");
            const saveFilePath = path.join(voiceIdentificationStoragePlace.storagePath, `source.${fileExt}`);
            await fsPromise.writeFile(saveFilePath, fileData);
            const processFileToWavPath = await FileStorageService.process_file_to_wav(file, saveFilePath, voiceIdentificationStoragePlace.storagePath);
            const processVoiceIdentification = await VoiceIdentificationService.processVoiceIdentification(processFileToWavPath);
            if (!processVoiceIdentification) {
                throw new Error('Có lỗi xảy ra khi xác thực giọng nói');
            }
            if (!processVoiceIdentification?.["matched_filename"]) {
                throw new Error('Không tìm thấy giọng nói phù hợp');
            }
            const matchFilePath = processVoiceIdentification.matched_filename;
            const extractId = path.dirname(matchFilePath).split('/').pop();
            if (!extractId) {
                throw new Error('Có lỗi xảy ra khi xác thực giọng nói');
            }
            const voiceRecord = await voiceIdentificationSchema.findOne({
                voice_id: extractId
            });
            
            if (!voiceRecord) {
                throw new Error('Không tìm thấy giọng nói phù hợp do giọng nói chưa được đăng ký');
            }

            response_header_template(res).status(HttpStatusCode.Ok).send({
                message: 'Xác thực giọng nói thành công',
                data: {
                    voice_id: voiceRecord.id,
                    user_name: voiceRecord.name,
                    score: processVoiceIdentification.score
                }
            });

        } catch (error: any) {
            console.log('Error processing voice separation:', error);
			response_header_template(res).status(error.statusCode || HttpStatusCode.InternalServerError).send({
				message: error.message
			});
        }
    });

}