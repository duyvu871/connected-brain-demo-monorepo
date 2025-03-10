import { NextRequest } from 'next/server';
import { getServerAuthSession } from '@/lib/nextauthOptions';
import { dataTemplate } from '@/helpers/returned_response_template';
import { TEXT_CUT_TOKEN } from '@/helpers/streamTextProcessor';

export const maxDuration = 60;

// This API route supports streaming responses
export async function POST(req: NextRequest) {
    try {
        // Authenticate the user
        const session = await getServerAuthSession();
        const user = session?.user;
        if (!user) {
            return dataTemplate({
                error: 'Unauthorized',
            }, 400);
        }

        // Parse the request body
        const { message, messageMedia } = await req.json();

        if (!message) {
            return dataTemplate({
                error: 'Message is required',
            }, 400);
        }

        // Forward the request to the external API
        const apiUrl = 'https://api.connectedbrain.com.vn/api/v1/chatbot/stream';
        
        // Create a request to the external API
        const externalResponse = await fetch(`${apiUrl}?prompt=${encodeURIComponent(message)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // You can add additional headers if needed for authentication
            // headers: {
            //     'Authorization': `Bearer ${process.env.API_TOKEN}`,
            // },
        });

        // Check if the external API request was successful
        if (!externalResponse.ok) {
            console.error('External API error:', externalResponse.statusText);
            return dataTemplate({
                error: 'Error connecting to chatbot service',
            }, 500);
        }

        // Get the readable stream from the external response
        const externalStream = externalResponse.body;
        
        if (!externalStream) {
            return dataTemplate({
                error: 'No stream received from chatbot service',
            }, 500);
        }

        // Create a transform stream to process the incoming data if needed
        let buffer = '';
        // Using the standardized token from our utility
        const transformStream = new TransformStream({
            transform(chunk, controller) {
                try {
                    // Convert the chunk to a string and add it to our buffer
                    const decoder = new TextDecoder();
                    const text = decoder.decode(chunk);
                    buffer += text;
                    
                    // Check if the buffer contains the text cut token
                    const endTokenIndex = buffer.indexOf(TEXT_CUT_TOKEN);
                    
                    if (endTokenIndex !== -1) {
                        try {
                            // We found the token, split the buffer
                            const beforeToken = buffer.substring(0, endTokenIndex);
                            const afterToken = buffer.substring(endTokenIndex + TEXT_CUT_TOKEN.length);
                            
                            // Send the text before the token as is
                            if (beforeToken) {
                                const encoder = new TextEncoder();
                                controller.enqueue(encoder.encode(beforeToken));
                            }
                            controller.enqueue(TEXT_CUT_TOKEN);
                            // Process the paths after the token
                            console.log("buffer: ", buffer);
                            console.log('afterToken: ', afterToken);
                            
                            if (afterToken) {
                                try {
                                    // Split by spaces or newlines to get individual paths
                                    const paths = afterToken.trim().split(/\s+/);
                                    // Clean and format each path to ensure proper URL structure
                                    const formattedPaths = paths.map(path => {
                                        // Remove any leading/trailing slashes and clean the path
                                        const cleanPath = path.replace(/^\/+|\/+$/g, '').replace(/\/+/g, '/');
                                        return `https://api.connectedbrain.com.vn/${cleanPath}`;
                                    });
                                    
                                    // Create a JSON response with the paths
                                    const jsonResponse = JSON.stringify({ references: formattedPaths });
                                    const encoder = new TextEncoder();
                                    controller.enqueue(encoder.encode(jsonResponse));
                                } catch (pathError) {
                                    console.error('Error processing paths:', pathError);
                                    const errorResponse = JSON.stringify({ error: 'Error processing reference paths' });
                                    controller.enqueue(new TextEncoder().encode(errorResponse));
                                }
                            }
                            
                            // Clear the buffer as we've processed everything
                            buffer = '';
                        } catch (tokenError) {
                            console.error('Error processing token:', tokenError);
                            controller.enqueue(chunk); // Fallback to passing through the original chunk
                        }
                    } else {
                        // No token found yet, just pass through the chunk as is
                        controller.enqueue(chunk);
                    }
                } catch (error) {
                    console.error('Error in transform stream:', error);
                    controller.enqueue(chunk); // Ensure the stream continues even if there's an error
                }
            },
        });

        // Pipe the external stream through our transform stream
        const stream = externalStream.pipeThrough(transformStream);

        // Return the streaming response
        return new Response(stream, {
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