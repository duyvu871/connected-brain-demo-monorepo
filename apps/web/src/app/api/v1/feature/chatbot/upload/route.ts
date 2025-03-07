import { NextRequest } from 'next/server';
import { getServerAuthSession } from '@/lib/nextauthOptions';
import { dataTemplate } from '@/helpers/returned_response_template';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
    try {
        // Authenticate the user
        const session = await getServerAuthSession();
        const user = session?.user;
        if (!user) {
            return dataTemplate({ error: 'Unauthorized' }, 400);
        }

        // Get the form data from the request
        const formData = await req.formData();
        const file = formData.get('file');

        if (!file) {
            return dataTemplate({ error: 'No file uploaded' }, 400);
        }

        // Create form data for the external API
        const externalFormData = new FormData();
        externalFormData.append('file', file);

        // Forward the request to the external API
        const apiUrl = 'https://api.connectedbrain.com.vn/api/v1/chatbot/extract-content';
        const response = await fetch(apiUrl, {
            method: 'POST',
            body: externalFormData
        });

        if (!response.ok) {
            console.error('External API error:', response.statusText);
            return dataTemplate({ error: 'Error processing file' }, response.status);
        }

        // Get the response from the external API
        const result = await response.json();
        return dataTemplate(result, 200);

    } catch (error: any) {
        console.error('Error in file upload API:', error);
        return dataTemplate({ error: error.message }, 500);
    }
}