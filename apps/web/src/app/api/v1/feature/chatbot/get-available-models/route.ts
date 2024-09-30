import { ChatbotService } from '@/services/Chatbot/chatbot.service';
import type { NextRequest } from 'next/server';
import type { SendMessageRequest } from '@/types/apps/chatbot/api.type';
import { ObjectId } from 'mongodb';
import { dataTemplate } from '@/helpers/returned_response_template';
import { getServerAuthSession } from '@/lib/nextauthOptions';
import { models } from '@/lib/llms/models-definition.ts';

export const maxDuration = 60;

export async function GET(req: NextRequest) {
	try {
		const session = await getServerAuthSession();
		const user = session?.user;
		if (!user) return dataTemplate({
			error: 'Unauthorized',
		}, 400);
		return dataTemplate({
			models
		}, 200);
	} catch (error: any) {
		return dataTemplate({ error: error.message }, 500);
	}
}