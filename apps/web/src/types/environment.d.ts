declare global {
	namespace NodeJS {
		interface ProcessEnv {
			MONGODB_URI: string;
			DB_NAME: string;
			NEXTAUTH_SECRET: string;
			NEXTAUTH_URL: string;
			SECRET_KEY: string;
			GEMINI_API_KEY: string;
			API_ENDPOINT: string;
			NEXT_PUBLIC_API_BASE_URL: string;
			NEXT_PUBLIC_SOCKET_URL: string;
			BLOB_READ_WRITE_TOKEN: string;
		}
	}
}

export {};