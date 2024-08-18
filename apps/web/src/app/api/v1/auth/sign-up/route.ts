import type { NextRequest } from 'next/server';
import { signUp } from '@/lib/auth/signup';
import { dataTemplate } from '@/helpers/returned_response_template';

interface ISignUpRequest {
	username: string;
	password: string;
	email: string;
	phone: string;
}

export async function POST(request: NextRequest) {
	try {
		const json: ISignUpRequest = await request.json();

		const response = await signUp({ ...json });

		return dataTemplate(response, 200);
	} catch (e: any) {
		return dataTemplate({ error: e.message }, 500);
	}
}

export const dynamic = 'force-dynamic';