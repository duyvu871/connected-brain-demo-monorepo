import { z } from 'zod';

// login schema for validation in login form
export const loginSchema = z.object({
	email: z.string().email(),
	password: z
		.string()
		.min(6, { message: 'Password is too short' })
		.max(20, { message: 'Password is too long' }),
});
// register schema for validation in register form
export const registerSchema = z.object({
	phone: z.string()
		.min(10, { message: 'Phone number is too short' })
		.max(11, { message: 'Phone number is too long' })
		.regex(/((09|03|07|08|05)+([0-9]{8})\b)/g, { message: 'Phone number is invalid' }),
	username: z.string().min(3, { message: 'Username is too short' }),
	email: z.string().email(),
	password: z
		.string()
		.min(8, { message: 'Password is too short' })
		.max(20, { message: 'Password is too long' }),
	confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
	message: 'Passwords do not match',
	path: ['confirmPassword'],
});
