import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { dataTemplate } from '@/helpers/returned_response_template';
import { getServerAuthSession } from '@/lib/nextauthOptions';
import type { SendMessageRequest } from '@/types/apps/chatbot/api.type.ts';
import { ChatbotService } from '@/services/Chatbot/chatbot.service';
import { ObjectId } from 'mongodb';
import markdownToTxt from 'markdown-to-txt';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
	try {
		const session = await getServerAuthSession();
		const user = session?.user;
		if (!user) return dataTemplate({
			error: 'Unauthorized',
		}, 400);
		const user_id = user.id;
		const { section_id } = await req.json() as SendMessageRequest;

		const chatbotService = new ChatbotService(new ObjectId(user_id));
		const response = await chatbotService.getChatHistoryDetail(new ObjectId(section_id));

		const dataFormatted = response.map((message) => {
			return `[${message.role === 'user' ? user.username : message.role}]: \n\t${markdownToTxt(message.message).replace(/\n/g, '\n\t')}`;
		}).join('\n\n');

		const buffer = Buffer.from(dataFormatted, 'utf-8');
		const headers = new Headers();
		headers.append(
			'Content-Disposition', // define the content disposition
			'attachment; filename="chatbot-history.txt"', // define the filename
		);
		headers.append('Content-Type', 'application/text');

		return new NextResponse(buffer, {
			headers,
		});
	} catch (error: any) {
		return dataTemplate({ error: error.message }, 500);
	}
}