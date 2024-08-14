import { Server } from 'socket.io';
import OCRService from '@/services/features/ocr.service';

export function LoadSocket({io}: {io: Server}) {
	OCRService.connection(io);
}