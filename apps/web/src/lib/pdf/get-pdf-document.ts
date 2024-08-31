import type { PDFDocumentProxy } from 'pdfjs-dist';
import { pdfjs } from 'react-pdf';
// this function takes an argument we named path that
// can be a path to the file or can be an external link
// that contains the PDF
export const getPDFDocument = async (data: any) => {
	if (!pdfjs.GlobalWorkerOptions.workerSrc) {
		pdfjs.GlobalWorkerOptions.workerSrc =
			window.location.origin + "/workers/pdf.worker.mjs";
	}

	return new Promise((resolve, reject) => {
		pdfjs
			.getDocument(data)
			.promise.then((document: any) => {
			resolve(document);
		})
			.catch(reject);
	});
};
