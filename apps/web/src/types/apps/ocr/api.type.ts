export type UploadPDFResponse = {
	id: string;
	path: string;
	numPages: number;
	pageImages: {
		page: number;
		image: string;
	}[];
}