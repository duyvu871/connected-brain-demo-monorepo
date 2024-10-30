import type { NextRequest } from 'next/server';
import { dataTemplate } from '@/helpers/returned_response_template';
import { getServerAuthSession } from '@/lib/nextauthOptions';

export async function POST(req: NextRequest) {
	try {
		const session = await getServerAuthSession();
		const user = session?.user;
		if (!user) return dataTemplate({
			error: 'Unauthorized',
		}, 400);
		const user_id = user.id;
		const { text } = (await req.json()) as {text: string};

		const response = await fetch('http://14.224.188.206:8502/api/v1/t2s', {
			headers: {
				'accept': 'application/json',
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: `text=${encodeURIComponent(text)}`
		});

		const dataResponse = await response.json();

		return dataTemplate(dataResponse, 200);
	} catch (error: any) {
		console.log(error);
		return dataTemplate({
			error: error.message,
		}, 500);
	}
}