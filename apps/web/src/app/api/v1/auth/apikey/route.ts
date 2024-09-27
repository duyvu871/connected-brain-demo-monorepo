import { dataTemplate } from '@/global/helpers/returned_response_template';
import { getServerAuthSession } from '@/lib/nextauthOptions.ts';
import type { NextRequest } from 'next/server';

const keyBindings = {
	"gemini_api": "GEMINI_API_KEY",
	"deepgram_api": "DEEPGRAM_API_KEY",
};

export async function GET(request: NextRequest) {
	try {
		const session = await getServerAuthSession();
		if (!session) {
			return dataTemplate({ message: 'Unauthorized' }, 401);
		}
		const keyOrder = request.nextUrl.searchParams.get('order');
		if (!keyOrder) {
			return dataTemplate({ message: 'Invalid order' }, 400);
		}
		const keys = keyOrder.split(',');
		const responseKeys = keys.map((key) => {
			return {
				order: key,
				key: process.env[keyBindings[key as keyof typeof keyBindings]] || null,
			};
		});
		return dataTemplate(responseKeys, 200);
	} catch (error) {
		console.log(error);
		return dataTemplate({ message: 'Internal server error' }, 500);
	}
}