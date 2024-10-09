import { Server } from 'socket.io';
import OCRService from '@/services/features/ocr.service';
import SpeechToTextService from '@/services/features/speech_to_text.service';
import { TranslateService } from '@/services/features/translate.service';

export function LoadSocket({io}: {io: Server}) {
	OCRService.connection(io);
	SpeechToTextService.connection(io);
	TranslateService.connection(io);
}