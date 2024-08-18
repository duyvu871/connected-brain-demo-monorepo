import type { DefaultSession } from 'next-auth';
import type { UserSessionPayload, UserInterface } from '@/types/user.type.ts';

declare module 'next-auth' {
	interface Session {
		user: UserInterface
			& DefaultSession['user'];
		token?: string;
	}

	interface User {
		userPayload: UserInterface;
		accessToken: string;
	}

	interface NextAuthUser extends UserSessionPayload, DefaultSession.user {}
}