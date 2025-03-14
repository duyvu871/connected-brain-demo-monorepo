import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fsPromises from 'fs/promises';
import { FileTypeResult } from 'file-type';
import axios, { AxiosError } from 'axios';

type RegisterVoiceIdentificationResponse = {
    message: string;
    point_id: string;
    server_error?: string;
}

type ProcessVoiceIdentificationResponse = {
    "message": string,
    "matched_filename"?: string
    "score"?: number,
    "server_error"?: string,
}

export class VoiceIdentificationService {
    private static VOICE_IDENTIFICATION_API_ENDPOINT: string = process.env.NODE_ENV === "development"
    ? "https://api.connectedbrain.com.vn/api/v1/voice-identification"
    : "http://127.0.0.1:/api/v1/voice-identification";

    public static async processVoice<Response extends Record<string, any>>(resource: string, endpoint: string) {
        try {
            const fileType = (await import('file-type')).fileTypeFromBuffer;
            const file =  await fsPromises.readFile(resource);
            const contentType = <FileTypeResult>(await fileType(file));
            const fileBlob = new Blob([file], { type: contentType.mime });
            const formData = new FormData();
            const fileName = path.basename(resource);
            formData.append('file', fileBlob, fileName);
            const response = await axios.post<Response>(
                endpoint, 
                formData, 
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            console.log('Process voice sample response:', response.data);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                console.log('Process voice sample error [cause: api_connected_brain]:', error.response?.data);
            } else {
                console.log('Process voice sample error:', error);
            }
            return null;
        }
    }

    public static async registerVoiceIdentification(filePath: string) {
        try {
            const response = await this.processVoice<RegisterVoiceIdentificationResponse>(
                filePath,
                `${this.VOICE_IDENTIFICATION_API_ENDPOINT}/register`
            );

            if (!response) return null;

            return response;
        } catch (error) {
            return null;
        }
    }

    public static async processVoiceIdentification(filePath: string) {
        try {
            const response = await this.processVoice<ProcessVoiceIdentificationResponse>(
                filePath,
                `${this.VOICE_IDENTIFICATION_API_ENDPOINT}/process`
            );
            if (!response) return null;
            return response;
        } catch (error) {
            return null;
        }
    }

}