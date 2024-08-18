// import { NextResponse } from 'next/server';
//
// export interface MiddlewareResponse {
// 	pass: boolean;
// 	response?: NextResponse;
// 	data?: any;
// }
//
// export async function handleRequest(
// 	request: { passedData: NonNullable<unknown>; },
// 	payload: any, // extra data from api function
// 	callback: (req: any, res: any) => Promise<NextResponse<any>>, // main handler
// 	middleware: any[] = [], // middlewares functions
// ) {
// 	for (const middlewareFunction of middleware) {
// 		const result: MiddlewareResponse = await middlewareFunction(
// 			request,
// 			payload,
// 		);
//
// 		if (!result.pass) {
// 			return result.response;
// 		} else if (result.data) {
// 			if (!request.passedData) {
// 				request.passedData = {};
// 			}
//
// 			try {
// 				// NOTE: If there are multiple middlewares that need data, this would overwrite the data from the previous middleware.
// 				request.passedData = {
// 					...request.passedData,
// 					...result.data,
// 				};
// 			} catch (e) {
// 				console.error(e);
// 				return NextResponse.json({
// 					message: 'Internal server error',
// 				}, {
// 					status: 500,
// 					headers: {
// 						'Content-Type': 'application/json',
// 					},
// 				});
// 			}
// 		}
// 	}
//
// 	return await callback(request, payload);
// }