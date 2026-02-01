import type { IDataObject, IExecuteFunctions, IHttpRequestMethods } from 'n8n-workflow';
import { COPILOT_API_ENDPOINT } from './constants';

/**
 * Call the GitHub Copilot / Azure Models chat completions API.
 */
export async function callCopilotApi(
	context: IExecuteFunctions,
	model: string,
	systemPrompt: string,
	userMessage: string,
	options: IDataObject,
): Promise<string> {
	const response = await context.helpers.requestWithAuthentication.call(context, 'gitHubCodepilotApi', {
		method: 'POST' as IHttpRequestMethods,
		url: COPILOT_API_ENDPOINT,
		headers: { 'Content-Type': 'application/json' },
		body: {
			model,
			messages: [
				{ role: 'system', content: systemPrompt },
				{ role: 'user', content: userMessage },
			],
			temperature: (options.temperature as number) ?? 0.7,
			max_tokens: (options.maxTokens as number) ?? 4096,
		},
		json: true,
	});
	return response.choices?.[0]?.message?.content || '';
}

/**
 * Extract a JSON object from a string that may contain surrounding text.
 * Tries to find the outermost valid JSON object or array.
 */
export function extractJson(text: string): unknown | null {
	// Try direct parse first
	try {
		return JSON.parse(text);
	} catch {
		// continue to extraction
	}

	// Try to find a JSON object
	const objectMatch = text.match(/\{[\s\S]*\}/);
	if (objectMatch) {
		try {
			return JSON.parse(objectMatch[0]);
		} catch {
			// try nested match
		}
	}

	// Try to find a JSON array
	const arrayMatch = text.match(/\[[\s\S]*\]/);
	if (arrayMatch) {
		try {
			return JSON.parse(arrayMatch[0]);
		} catch {
			// fall through
		}
	}

	return null;
}

/**
 * Send a JSON-RPC request to an MCP server.
 */
export async function mcpJsonRpcRequest(
	context: IExecuteFunctions,
	url: string,
	method: string,
	params?: IDataObject,
): Promise<IDataObject> {
	const response = await context.helpers.requestWithAuthentication.call(context, 'gitHubCodepilotApi', {
		method: 'POST' as IHttpRequestMethods,
		url,
		body: {
			jsonrpc: '2.0',
			id: 1,
			method,
			...(params ? { params } : {}),
		},
		json: true,
	});
	return response.result as IDataObject || {};
}
