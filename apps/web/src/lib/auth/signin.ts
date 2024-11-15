import clientPromise from '@/lib/mongodb';
import * as bcrypt from 'bcrypt';
import { extractProperties } from '@/global/helpers/extractProperties';
import type { UserInterface } from '@/types/user.type.ts';
import * as process from 'node:process';

type UserRecord<T extends 'username' | 'password' | 'role'> = T extends 'role'
	? {
		admin: {
			email: string;
			password: string;
			role: 'admin';
		};
		user: {
			email: string;
			password: string;
			role: 'user';
		};
	}['admin' | 'user']
	: T extends 'email'
		? { email: string }
		: T extends 'password'
			? { password: string }
			: never;

type LoginResponse = { user: UserInterface & { id: string }, token: { accessToken: string, refreshToken: string } };

/**
 * Sign in with the given credentials
 * @param credentials - The credentials to sign in
 * @returns The user record
 * @throws Error
 * @example
 * const user = await signIn({
 * 	 email: 'email@example.com'
 * 	 password: 'password'
 * 	 role: 'admin'
 * });
 */

export async function signIn(credentials: UserRecord<'role'>) {
	// const client = await clientPromise;
	// console.log(credentials);
	if (credentials.role !== 'admin' && credentials.role !== 'user') {
		throw new Error('Role is required.');
	}
	// if (credentials.role === 'admin') {
	// 	const adminsCollection = client
	// 		.db(process.env.DB_NAME)
	// 		.collection('admin');
	// 	const email = credentials?.email;
	// 	if (!email) {
	// 		throw new Error('Email is required.');
	// 	}
	// 	const admin = await adminsCollection.findOne({ email });
	// 	if (!admin) {
	// 		throw new Error('Admin does not exist.');
	// 	}
	// 	const passwordIsValid = await bcrypt.compare(
	// 		credentials?.password,
	// 		admin.password,
	// 	);
	// 	if (!passwordIsValid) {
	// 		throw new Error('Password is wrong');
	// 	}
	// 	return extractProperties(admin, ['email', 'role', 'uid', '_id']);
	// }

	const email = credentials?.email;
	const password = credentials?.password;

	const myHeaders = new Headers();
	myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

	const urlencoded = new URLSearchParams();
	if (typeof email === 'string') {
		urlencoded.append('email', email);
	}
	if (typeof password === 'string') {
		urlencoded.append('password', password);
	}

	const requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: urlencoded,
		// redirect: "follow"
	};

	const api_endpoint = 'http://localhost:3001'//process.env.API_ENDPOINT;
	console.log('api_endpoint', api_endpoint);
	const response = await fetch(api_endpoint + '/api/v1/auth/login', requestOptions);
	const result = await response.json();
	// console.log(result);
	if (response.status !== 200) {
		throw new Error(result.errors || result.message);
	}
	const { user, token } = result;
	const extractedUser = user//extractProperties(user, ['email', 'role', 'uid', 'id']);
	const changeKey = {
		id: 'id',
	};

	const userPayload = Object.keys(extractedUser).reduce<Record<string, string>>((acc, key) => {
		// @ts-ignore
		const newKey = changeKey[key] || key;
		acc[newKey] = extractedUser[key];
		return acc;
	}, {});

	return {
		userPayload,
		accessToken: token.accessToken,
	};
}

