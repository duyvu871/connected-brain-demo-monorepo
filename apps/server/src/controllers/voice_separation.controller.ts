import AsyncMiddleware from '@/helpers/waiter.helper';
import { response_header_template } from '@/helpers/response_header_template.helper';
import { HttpStatusCode } from '@/helpers/http_status_code';


export class VoiceSeparationController {
	public static upload = AsyncMiddleware.asyncHandler(async (req, res) => {
		try {
			const file = req.file as Express.Multer.File;

			response_header_template(res).status(HttpStatusCode.Ok).send({
				message: 'File uploaded'
			});
		} catch (error: any) {
			response_header_template(res).status(error.statusCode || HttpStatusCode.InternalServerError).send({
				message: error.message
			});
		}
	});
}