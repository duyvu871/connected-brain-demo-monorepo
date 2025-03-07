/**
 * Utility functions for processing streamed text with special tokens
 */

/**
 * Special token to mark the end of chat content and beginning of additional data
 */
export const TEXT_CUT_TOKEN = '<end_of_chat>';

/**
 * Processes text with a cut token, separating the main content from additional data
 * @param text - The text to process
 * @param cutToken - The token that marks where to cut the text (defaults to TEXT_CUT_TOKEN)
 * @returns An object containing the text before and after the cut token
 */
export function processStreamedText(text: string, cutToken: string = TEXT_CUT_TOKEN) {
    const tokenIndex = text.indexOf(cutToken);

    // If token not found, return the entire text as content
    if (tokenIndex === -1) {
        return {
            content: text,
            additionalData: null
        };
    }

    // Split the text at the token
    const content = text.substring(0, tokenIndex);
    const additionalData = text.substring(tokenIndex + cutToken.length);

    return {
        content,
        additionalData: additionalData.trim()
    };
}

/**
 * Parses the additional data after the cut token as JSON
 * @param text - The text to process
 * @param cutToken - The token that marks where to cut the text (defaults to TEXT_CUT_TOKEN)
 * @returns An object containing the content and parsed JSON data (if valid)
 */
export function processStreamedTextAsJson(text: string, cutToken: string = TEXT_CUT_TOKEN) {
    const { content, additionalData } = processStreamedText(text, cutToken);

    if (!additionalData) {
        return {
            content,
            jsonData: null
        };
    }

    try {
        const jsonData = JSON.parse(additionalData);
        return {
            content,
            jsonData
        };
    } catch (error) {
        console.error('Failed to parse additional data as JSON:', error);
        return {
            content,
            jsonData: null,
            rawAdditionalData: additionalData
        };
    }
}