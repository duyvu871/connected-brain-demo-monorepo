// import { NotificationForAdmin } from '@/services/notification_for_admin';
import process from 'node:process';

/**
 * Sign up with the given credentials
 * @param credentials - The credentials to sign up
 * @returns The user record
 * @throws Error
 * @example
 * const user = await signUp({
 * 	 username: 'username',
 * 	 password: 'password',
 * 	 phone: 'phone',
 * 	 email: 'email@example.com'
 * 	 role: 'user'
 * 	 avatar: 'avatar'
 * 	 ...
 * });
 */
export async function signUp(
	credentials: Record<'username' | 'password' | 'phone' | 'email', string> | undefined,
) {

	const username = credentials?.username;
	const password = credentials?.password;
	const email = credentials?.email;
	const myHeaders = new Headers();
	myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

	const urlencoded = new URLSearchParams();
	if (typeof email === 'string') {
		urlencoded.append('email', email);
	}
	if (typeof password === 'string') {
		urlencoded.append('password', password);
	}
	if (typeof username === 'string') {
		urlencoded.append('username', username);
	}

	const requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: urlencoded,
		// redirect: "follow"
	};

	const response = await fetch(process.env.API_ENDPOINT + '/api/v1/auth/register', requestOptions);
	const result = await response.json();

	if (response.status !== 200) {
		throw new Error(result.errors || result.message);
	}
	return {
		message: 'Đăng ký thành công',
	};
}
