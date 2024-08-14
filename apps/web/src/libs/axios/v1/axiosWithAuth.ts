import type { InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';
import { getSession } from 'next-auth/react';

const axiosNextAuth = axios.create();

axiosNextAuth.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
	const session = await getSession();
	// console.log('session', session);
	if (session?.token) {
		config.headers.Authorization = `Bearer ${session.token}`;
	}

	return config;
});

const implementAxiosNextAuth = (axiosInstance: typeof axios) => {
	axiosInstance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
		const session = await getSession();
		// console.log('session', session);
		if (session?.token) {
			config.headers.Authorization = `Bearer ${session.token}`;
		}

		return config;
	});

	return axiosInstance;
}

export { implementAxiosNextAuth };

export default axiosNextAuth;