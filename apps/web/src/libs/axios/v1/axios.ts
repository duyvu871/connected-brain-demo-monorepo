import type { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import axios from 'axios';
import type { TranslateResponse } from '@repo/translate';
import type {Page as TesseractPage} from "tesseract.js"

// Interface to define the shape of the `api.v1` object 
// This improves code clarity and type checking 
interface ApiV1 {
	translate: (
		body: {text: string, from?: string, to?: string},
		callback?: (error: AxiosError | null, translation?: string) => void
	) => Promise<string | undefined>;
	ocr: {
		// upload: (file: File, callback?: (error: AxiosError | null, filename?: string) => void) => Promise<string | undefined>;
		// extract: (image: string, callback?: (error: AxiosError | null, text?: string) => void) => Promise<string | undefined>;
		// uploadAndExtract: (file: File, callback?: (error: AxiosError | null, text?: string) => void) => Promise<string | undefined>;
		extractWithoutAuth: (file: File, options: AxiosRequestConfig, callback?: (error: AxiosError | null, pageData?: TesseractPage) => void) => Promise<TesseractPage | undefined>;
	}
	// ... Other methods for API v1 (products, ...) 
}

// Fetch the API endpoint from environment variables
// Using NEXT_PUBLIC_API_BASE_URL makes the endpoint available client-side
// If not defined (e.g., running locally), defaults to 'http://localhost:3000' 
const API_ENDPOINT = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

// Create the Axios instance with the base URL
const api= axios.create({
	baseURL: `${API_ENDPOINT}/api/v1`,
}) as  AxiosInstance & { v1: ApiV1 } ;

const apiTemplate = async <T>(
	api: AxiosInstance,
	path: string,
	data: any,
	options: {
		method: "post" | "get",
		configs: AxiosRequestConfig | undefined
	},
	callback?: (error: AxiosError|null, data: T | undefined) => void
) => {
	
	try {
		const response = await api[options.method]<T>(path, data, options.configs);
		if (callback) callback(null, response.data);
		return response;
		// @ts-expect-error Catch any errors during the API call
	} catch (error: AxiosError | null) {
		if (callback) {
			callback(error, undefined);
		} else {
			throw error;
		}
	}
}

// Define methods for API version 1
api.v1 = {
	translate: async (body, callback = undefined) => {
		try {
			// Make a POST request to the /translate endpoint
			// The response type is inferred from the TranslateResponse interface
			const response = await api.post<TranslateResponse>('/translate', {
				text: body.text,
				from: body.from,
				to: body.to
			});

			// If a callback is provided, invoke it with the translation result
			if (callback) {
				callback(null, response.data.translation);
			}
			// If no callback, return the translation directly
			return response.data.translation;
		// @ts-expect-error Catch any errors during the API call
		} catch (error: AxiosError | null) { // Capture any errors during the API call
			// If callback is provided, invoke it with the error
			if (callback) {

				callback(error, undefined);
			} else {
				// If no callback, throw the error to be handled elsewhere
				throw error;
			}
		}
	},
	ocr: {
		extractWithoutAuth: async (file, options, callback ) => {
			const formData = new FormData();
			formData.append('file', file);
			const response = await apiTemplate<TesseractPage>(
				api,
				'/feature/ocr/upload-without-auth',
				formData,
				{
				method: 'post',
				configs: {
					headers: {
						'Content-Type': 'multipart/form-data',
					},
					...options,
				},
			}, callback);
			return response?.data;
		}
	},
};

export default api;