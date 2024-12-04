import { ConvertToWavJob } from '@/services/queue/utils';
import CloudSpeech, { TranscriptSentence } from '@/services/google-cloud/cloud_speech.service';
import FileStorageService from '@/services/CURD/file_storage.service';
import SpeechToTextService from '@/services/features/speech_to_text.service';
import { SentencesResponse } from 'assemblyai';
import mongoLoader from '@/loaders/mongo.loader';
import { getRedis, initRedis } from '@/configs/database/redis';

export default async function SpeechToText(data: ConvertToWavJob['job_data']) {
	try {
		const isDevelopment = process.env.NODE_ENV === 'development';
		await mongoLoader();
		await initRedis();
		const redis = getRedis().instanceRedis;
		const channel = `s2t:transcript:${data.id.toString()}`;

		const file_path = data.file_name;
		// const file_content = FileStorageService.read_file(file_path);
		// const convert_buffer = Buffer.from(file_content, 'base64');
		// const upload_to_google_cloud = isDevelopment ?
		// 	await CloudSpeech.uploadFileToGoogleCloudStorage({
		// 		bucketName: 'connected-brain-bucker',
		// 		fileName: 'audio.mp3',
		// 		specialPath: `storage/Assets/s2t/${data.id.toString()}`,
		// 		filePath: file_path //`/storage/Assets/s2t/${data.id.toString()}/audio.mp3`,
		// 	})
		// 	: undefined;
		// const upload_to_firebase = await CloudSpeech.uploadFileToFirebaseStorage({
		// 	file: convert_buffer,
		// 	filePath: file_path
		// });
		const audio_storage_url =
			isDevelopment ? `http://localhost:3001/storage/Assets/s2t/${data.id.toString()}/audio.mp3` : `https://api.connectedbrain.com.vn/storage/Assets/s2t/${data.id.toString()}/audio.mp3`;
		// const transcripts = await CloudSpeech.recognizeAudio(
		// 	audio_storage_url
		// );
		// // console.log('Transcript:', transcripts);
		// const transcripts_parse = await CloudSpeech.getTranscript(transcripts.transcriptId, 'sentences') as SentencesResponse;
		const parallelHandle = await Promise.all([
			CloudSpeech.getTranscriptConnectedBrainV2(file_path),
			FileStorageService.get_audio_duration(file_path)
		])
		const transcripts_parse = parallelHandle[0];
		const audio_duration = parallelHandle[1];

		if (!transcripts_parse) {
			throw new Error('Transcript not found');
		}

		const newAudit = await SpeechToTextService.update_audit(data.id, {
			cloudPath: audio_storage_url,
			// cloudPath: upload_to_firebase?.downloadURL ?? '',
			audio: {
				path: file_path,
				duration: audio_duration || 0,
			},
			transcript: transcripts_parse.sentences as TranscriptSentence[],
			status: 'done'
		});

		console.log(`redis publish to ${channel}`);
		console.log('redis', redis?.status);
		redis && await redis.publish(channel, JSON.stringify(newAudit));
		// console.log('global', global.__io);
		// global.__io.emit(`s2t:transcript:${data.id}`, transcripts_parse.sentences);
		return 'DONE';
	}
	catch (error: any) {
		console.error('speech to text task error', error);
		await SpeechToTextService.update_audit(data.id, {
			status: 'error'
		});
		return 'ERROR';
	}
}