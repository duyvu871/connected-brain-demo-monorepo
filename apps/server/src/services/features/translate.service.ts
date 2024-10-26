import { Server } from 'socket.io';
import { TranslateService as Translate, ISOLangType } from '@translate/index';
import { TranslateValidation } from '@/validations/translate.validation';
import { ZodError } from 'zod';
import * as http from 'node:http';
import { constants } from '@repo/utils';

export class TranslateService {
	public static connection(io: Server) {

		const namespace = io.of(constants.api_route.API.feature.TRANSLATE.socket)
		namespace.on('connection', (socket) => {
			console.log('Translate socket connected');
			const translator = new Translate();
			socket.on('disconnect', () => {
				console.log('Translate socket disconnected');
			});

			socket.on('translate-transmit', async (data: {
				text: string;
				from: ISOLangType;
				to: ISOLangType;
			}) => {
				try {
					const parsedData = TranslateValidation.translateBody.parse(data);
					const { text, from, to } = parsedData;

					if (!text.trim().length) {
						socket.emit('translate-completion', { translation: '' });
						return;
					}

					const translateResponse = await translator.translate(text, { from, to });
					socket.emit('translate-completion', { completion: translateResponse.translation });
				} catch (e) {
					if (e instanceof ZodError) {
						// handling errors from zod
						const errors = e.issues.map((issue) => issue.message);
						socket.emit('translate:error', { error: errors.join(', ') });
					} else {
						// other errors
						console.error(e);
						socket.emit('translate:error', { error: 'Server Internal Error' });
					}
				}
			});
		});
	}
}