import { ChatbotService } from '@/services/Chatbot/chatbot.service';
import type { NextRequest } from 'next/server';
import type { SendMessageRequest } from '@/types/apps/chatbot/api.type';
import { ObjectId } from 'mongodb';
import { dataTemplate } from '@/helpers/returned_response_template';
import { getServerAuthSession } from '@/lib/nextauthOptions';
import { validateModel } from '@/lib/llms/models-definition.ts';
import type { modelsEnum} from '@/lib/llms/models-definition.ts';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
	try {
		const session = await getServerAuthSession();
		const user = session?.user;
		if (!user) return dataTemplate({
			error: 'Unauthorized',
		}, 400);
		const user_id = user.id;
		const { message, messageMedia, model} = await req.json() as SendMessageRequest;

		if (!message) throw new Error('Message is required');
		if (!model) throw new Error('Models is required');
		if (!validateModel(model)) throw new Error('Invalid model');
		const messageContent = {
			textContent: message,
			mediaContent: messageMedia ?? [],
		};
		const chatbotService = new ChatbotService(new ObjectId(user_id), model as keyof typeof modelsEnum);
		const response = await chatbotService.createSectionMessage(message.split(' ').slice(0, 5).join(' '));
		const newSectionId = response._id.toString();
		const sendMessageResponse = await chatbotService.sendMessage(messageContent, new ObjectId(newSectionId));
		const generatedMessage = sendMessageResponse.message;
		return dataTemplate({
			_id: response._id,
			section_name: response.section_name,
			message_generated: generatedMessage,
		}, 200);
	} catch (error: any) {
		console.log(error);
		return dataTemplate({ error: error.message }, 500);
	}
}