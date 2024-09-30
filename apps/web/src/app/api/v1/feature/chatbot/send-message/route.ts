import { ChatbotService } from '@/services/Chatbot/chatbot.service';
import type { NextRequest } from 'next/server';
import type { SendMessageRequest } from '@/types/apps/chatbot/api.type';
import { ObjectId } from 'mongodb';
import { dataTemplate } from '@/helpers/returned_response_template';
import { getServerAuthSession } from '@/lib/nextauthOptions';
import type { modelsEnum} from '@/lib/llms/models-definition.ts';
import { validateModel } from '@/lib/llms/models-definition.ts';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
	try {
		const session = await getServerAuthSession();
		const user = session?.user;
		if (!user) return dataTemplate({
			error: 'Unauthorized',
		}, 400);
		const user_id = user.id;
		const { section_id, message, messageMedia, model } = await req.json() as SendMessageRequest;
		if (!user_id) throw new Error('User ID is required');
		if (!section_id) throw new Error('Section ID is required');
		if (!message) throw new Error('Message is required');
		if (!model) throw new Error('Models is required');
		if (!validateModel(model)) throw new Error('Invalid model');
		const messageContent = {
			textContent: message,
			mediaContent: messageMedia ?? [],
		};
		// console.log(messageContent);
		const chatbotService = new ChatbotService(new ObjectId(user_id), model as keyof typeof modelsEnum);
		const response = await chatbotService.sendMessage(messageContent, new ObjectId(section_id));
		return dataTemplate({
			_id: response._id,
			message: response.message,
			role: response.role,
			reference_link: response.reference_link,
			createdAt: response.createdAt,
			updatedAt: response.updatedAt,
		}, 200);
	} catch (error: any) {
		return dataTemplate({ error: error.message }, 500);
	}
}