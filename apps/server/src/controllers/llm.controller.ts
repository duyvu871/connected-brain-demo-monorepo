import AsyncMiddleware from '@/helpers/waiter.helper';
import { Request, Response } from 'express';
import { response_header_template } from '@/helpers/response_header_template.helper';
import { HttpStatusCode } from '@/helpers/http_status_code';
import fsPromise from 'fs/promises';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { retryWrapper } from '@/helpers/retry';
import { timeout } from '@/helpers/delay_action';

export default class LLMController {
	// @ts-ignore
	public static uploadFile =
		AsyncMiddleware.asyncHandler(async (req: Request, res: Response) => {
			try {
				const file = req.file as Express.Multer.File;
				const clientId = req.query.clientId as string;
				const {
					buffer: fileData,
					originalname,
					mimetype: fileType
				} = file;

				// Check if file is PDF
				if (fileType !== 'application/pdf') {
					throw new Error('Only PDF files are allowed');
				}

				// Generate unique ID for the file
				const fileId = uuidv4();
				const directoryPath = path.posix.join(process.cwd(), `storage/Assets/chatbot`);
				
				// Create directory if it doesn't exist
				await fsPromise.mkdir(directoryPath, { recursive: true }).then(() => {
					console.log('create dir:', directoryPath);
				});
				
				// Save file with UUID name
				const filePath = path.posix.join(directoryPath, `${fileId}.pdf`);
				await fsPromise.writeFile(filePath, fileData).then(() => {
					console.log('write file:', filePath);
				});
				await timeout(500);

				// Generate URL for the file
				const fileUrl = `https://api.connectedbrain.com.vn/storage/Assets/chatbot/${fileId}.pdf`;

				const response = {
					id: fileId,
					originalName: originalname,
					url: fileUrl
				};

				response_header_template(res).status(HttpStatusCode.Ok).send(response);
			} catch (error: any) {
				console.log(error);
				response_header_template(res)
					.status(error.statusCode || HttpStatusCode.InternalServerError)
					.send({ message: error.message });
			}
	});

	// @ts-ignore
	public static uploadFileWithoutAuth =
		AsyncMiddleware.asyncHandler(async (req: Request, res: Response) => {
			try {
				const clientId = req.query.clientId as string;
				const file = req.file as Express.Multer.File;
				const { buffer: fileData, originalname, mimetype: fileType } = file;

				// Check if file is PDF
				if (fileType !== 'application/pdf') {
					throw new Error('Only PDF files are allowed');
				}

				// Generate unique ID for the file
				const fileId = uuidv4();
				const directoryPath = path.resolve(process.cwd(), `storage/Assets/chatbot`);
				
				// Create directory if it doesn't exist
				await fsPromise.mkdir(directoryPath, { recursive: true }).then(() => {
					console.log('create dir');
				});
				
				// Save file with UUID name
				const filePath = path.resolve(directoryPath, `${fileId}.pdf`);
				await fsPromise.writeFile(filePath, fileData).then(() => {
					console.log('write file');
				});

				// Generate URL for the file
				const fileUrl = `/static/Assets/chatbot/${fileId}.pdf`;

				response_header_template(res).status(HttpStatusCode.Ok).send({
					id: fileId,
					originalName: originalname,
					path: filePath,
					url: fileUrl
				});
			} catch (error: any) {
				console.log(error);
				response_header_template(res)
					.status(error.statusCode || HttpStatusCode.InternalServerError)
					.send({ message: error.message });
			}
	});

	public static uploadURL =
		AsyncMiddleware.asyncHandler(async (req: Request, res: Response) => {
			// Implementation for URL upload if needed
		});
}