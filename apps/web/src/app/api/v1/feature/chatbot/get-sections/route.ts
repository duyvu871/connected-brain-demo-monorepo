import { ChatbotService } from '@/services/Chatbot/chatbot.service';
import { dataTemplate } from '@/helpers/returned_response_template';
import { ObjectId } from 'mongodb';
import type { NextRequest } from 'next/server';
import { getServerAuthSession } from '@/lib/nextauthOptions';

export async function GET(req: NextRequest) {
	try {
		const session = await getServerAuthSession();
		const user = session?.user;
		if (!user) return dataTemplate({
			error: 'Unauthorized',
		}, 400);
		const user_id = user.id;
		
		const chatbotService = new ChatbotService(new ObjectId(user_id));
		const response = await chatbotService.getChatSection();
		return dataTemplate({
			data: response,
		}, 200);
	} catch (error: any) {
		return dataTemplate({ error: error.message }, 500);
	}
}