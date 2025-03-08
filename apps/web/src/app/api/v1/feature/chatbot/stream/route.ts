import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { getServerAuthSession } from '@/lib/nextauthOptions';
import { dataTemplate } from '@/helpers/returned_response_template';
import { TEXT_CUT_TOKEN } from '@/helpers/streamTextProcessor';
import { e } from '@repo/utils/object-utils-DgKP8euw';

export const maxDuration = 60;
const referencePrefix = "/media/";

// This API route supports streaming responses
export async function POST(req: NextRequest) {
    try {
        // // Authenticate the user
        const session = await getServerAuthSession();
        const user = session?.user;
        if (!user) {
            return dataTemplate({ error: 'Unauthorized' }, 400);
        }

        let message, messageMedia;
        try {
            const body = await req.json();
            message = body.message;
            messageMedia = body.messageMedia;
        } catch (error) {
            return dataTemplate({ error: 'Invalid JSON body' }, 400);
        }
        if (!message) {
            return dataTemplate({ error: 'Message is required' }, 400);
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 20000); // Timeout sau 20 giây
        // Forward the request to the external API
        const apiUrl = 'http://localhost:8000/stream'//'https://api.connectedbrain.com.vn/api/v1/chatbot/stream';
        const externalResponse = await fetch(`${apiUrl}?prompt=${encodeURIComponent(message)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
        });
        clearTimeout(timeout);

        if (!externalResponse.ok) {
            console.error('External API error:', externalResponse.statusText);
            return dataTemplate({ error: 'Error connecting to chatbot service' }, 500);
        }

        const externalStream = externalResponse.clone().body;
        if (!externalStream) {
            return dataTemplate({ error: 'No stream received from chatbot service' }, 500);
        }

        let buffer = '';
        let stopProcessing = false;
        let references: string[] = [];

        const encoder = new TextEncoder();

        const transformStream = new TransformStream({
            transform(chunk, controller) {
                try {
                    const decoder = new TextDecoder();
                    const text = decoder.decode(chunk);
                    buffer += text;
                    console.log('text: ', text);
                    controller.enqueue(encoder.encode(buffer));
                    buffer = '';

                    // Kiểm tra xem buffer có chứa token TEXT_CUT_TOKEN hay không
                    const tokenIndex = buffer.indexOf(TEXT_CUT_TOKEN);
                    
                    // if (tokenIndex !== -1 && !stopProcessing) {
                    //     stopProcessing = true;
                    //     // Lấy phần text trước token và gửi ra (nếu cần)
                    //     const beforeToken = buffer.substring(0, tokenIndex);
                    //     // if (beforeToken) {
                    //     //     controller.enqueue(encoder.encode(beforeToken));
                    //     // }

                    //     // Xử lý phần sau token chứa các đường dẫn
                    //     const afterToken = buffer.substring(tokenIndex + TEXT_CUT_TOKEN.length);

                    //     console.log('beforeToken: ', beforeToken);
                    //     console.log('afterToken: ', afterToken);
                    //     console.log("buffer: ", buffer);
                        

                    //     // if (afterToken) {
                    //     //     references.push(afterToken);
                    //     //     const markedReferences = "\n\nReferences:\n" + references.join("\n");
                    //     //     controller.enqueue(encoder.encode(markedReferences));

                    //     //     buffer = TEXT_CUT_TOKEN;
                    //     // } else {

                    //     //     buffer = '';
                    //     // }
                    //     controller.enqueue(encoder.encode(buffer));
                    // } else {
                    //     // Nếu chưa gặp token, gửi hết nội dung buffer ra và reset lại buffer
                    //     controller.enqueue(encoder.encode(buffer));
                    //     buffer = '';
                    // }
                } catch (error) {
                    console.error('Error in transform stream:', error);
                    controller.enqueue(chunk);
                }
            },
        });
    
        // Pipe external stream qua transform stream của chúng ta
        const stream = externalStream.pipeThrough(transformStream);
        return new NextResponse(stream, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Transfer-Encoding': 'chunked',
            },
        });
    } catch (error: any) {
        console.error('Error in streaming API:', error);
        return dataTemplate({ error: error.message }, 500);
    }
}
