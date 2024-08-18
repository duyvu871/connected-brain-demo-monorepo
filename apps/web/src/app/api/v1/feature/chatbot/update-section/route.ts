import type { NextRequest } from 'next/server';
import { dataTemplate } from '@/helpers/returned_response_template';
import { getServerAuthSession } from '@/lib/nextauthOptions';
import { ChatbotService } from '@/services/Chatbot/chatbot.service';
import type { ObjectId } from 'mongodb';
import type { UpdateSectionRequest } from 'types/apps/chatbot/api.type';

export async function POST(req: NextRequest) {
	try {
		const session = await getServerAuthSession();
		const user = session?.user;
		if (!user) return dataTemplate({
			error: 'Unauthorized',
		}, 400);
		const user_id = user.id;
		const { update_data, section_id } = (await req.json()) as UpdateSectionRequest;

		const chatbotService = new ChatbotService(user_id as unknown as ObjectId);
		const response = await chatbotService.updateChatHistory(section_id, update_data);

		return dataTemplate({
			data: response,
		}, 200);
	} catch (error: any) {
		console.log(error);
		return dataTemplate({
			error: error.message,
		}, 500);
	}
}