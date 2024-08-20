import CredentialsProvider from 'next-auth/providers/credentials';
import type { AuthOptions} from 'next-auth';
import { getServerSession } from 'next-auth';
import { signIn } from '@/lib/auth/signin';
import type { UserInterface, UserSessionPayload } from '@/types/user.type';

export const nextauthOptions: AuthOptions = {
	session: {
		strategy: 'jwt',
		maxAge: 24 * 60 * 60, // 24 hours
	},

	providers: [
		CredentialsProvider({
			type: 'credentials',
			id: 'credentials',
			name: 'Credentials',
			credentials: {
				username: {
					// label: "Username",
					type: 'text',
				},
				password: {
					// label: "Password",
					type: 'password',
				},
				role: {
					type: 'text',
					optional: true,
				},
			},
			// @ts-expect-error
			async authorize(credentials: Record<'password' | 'username' | 'role', string>) {
					return await signIn(credentials as any) as unknown as UserSessionPayload;
			},
		}),
		// ...add more providers here
	],
	pages: {
		signIn: '/auth/method?type=login',
		newUser: '/auth/method?type=register',
	},
	callbacks: {
		// eslint-disable-next-line @typescript-eslint/require-await
		async jwt({ token, account, user }) {
			if (user) {
				token.user_data = user?.userPayload;
				token.accessToken = user?.accessToken;
			}
			return token;
		},
		// eslint-disable-next-line @typescript-eslint/require-await
		async session({ session, token }) {
			session.user = token.user_data as UserInterface;
			// @ts-expect-error
			session.token = token.accessToken;
			return session;
		},
	},
};
/*
	Get server session with the following options:
	- nextauthOptions: AuthOptions
	@Return:
		AuthOptions
	@example:
	const session = await getServerAuthSession();
	if (!session) {
		return NextResponse.redirect('/');
	}
	const { user } = session;
 */
export const getServerAuthSession = () => getServerSession(nextauthOptions);
export default nextauthOptions;