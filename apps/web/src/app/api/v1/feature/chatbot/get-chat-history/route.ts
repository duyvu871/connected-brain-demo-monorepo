import type { NextRequest } from 'next/server';
import { ChatbotService } from '@/services/Chatbot/chatbot.service';
import { ObjectId } from 'mongodb';
import { dataTemplate } from '@/helpers/returned_response_template';
import { getServerAuthSession } from '@/lib/nextauthOptions';

export async function GET(req: NextRequest) {
	try {
		const session = await getServerAuthSession();
		const user = session?.user;
		if (!user) return dataTemplate({
			error: 'Unauthorized',
		}, 400);
		const user_id = user.id;
		const section_id = req.nextUrl.searchParams.get('section_id');
		if (!user_id) throw new Error('User ID is required');
		if (!section_id) throw new Error('Section ID is required');

		const chatbotService = new ChatbotService(new ObjectId(user_id));
		const response = await chatbotService.getChatHistoryDetail(new ObjectId(section_id));
		return dataTemplate({
			data: response,
		}, 200);
	} catch (error: any) {
		return dataTemplate({ error: error.message }, 500);
	}
}