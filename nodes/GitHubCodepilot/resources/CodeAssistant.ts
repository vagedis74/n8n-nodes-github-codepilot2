import type { INodeProperties, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { Resource, CodeAssistantOp } from '../types';
import { SYSTEM_PROMPTS } from '../constants';
import { callCopilotApi } from '../utils';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: [Resource.CodeAssistant] } },
		options: [
			{ name: 'Chat', value: CodeAssistantOp.Chat, action: 'Chat with Copilot' },
			{ name: 'Generate Code', value: CodeAssistantOp.GenerateCode, action: 'Generate code' },
			{ name: 'Review Code', value: CodeAssistantOp.ReviewCode, action: 'Review code' },
			{ name: 'Fix Code', value: CodeAssistantOp.FixCode, action: 'Fix code' },
		],
		default: CodeAssistantOp.Chat,
	},
	{
		displayName: 'Message',
		name: 'message',
		type: 'string',
		typeOptions: { rows: 4 },
		displayOptions: { show: { resource: [Resource.CodeAssistant], operation: [CodeAssistantOp.Chat] } },
		default: '',
		required: true,
	},
	{
		displayName: 'Description',
		name: 'codeDescription',
		type: 'string',
		typeOptions: { rows: 4 },
		displayOptions: { show: { resource: [Resource.CodeAssistant], operation: [CodeAssistantOp.GenerateCode] } },
		default: '',
		required: true,
	},
	{
		displayName: 'Code',
		name: 'code',
		type: 'string',
		typeOptions: { rows: 10 },
		displayOptions: {
			show: { resource: [Resource.CodeAssistant], operation: [CodeAssistantOp.ReviewCode, CodeAssistantOp.FixCode] },
		},
		default: '',
		required: true,
	},
	{
		displayName: 'Language',
		name: 'language',
		type: 'options',
		displayOptions: { show: { resource: [Resource.CodeAssistant], operation: [CodeAssistantOp.GenerateCode] } },
		options: [
			{ name: 'JavaScript', value: 'javascript' },
			{ name: 'TypeScript', value: 'typescript' },
			{ name: 'Python', value: 'python' },
		],
		default: 'javascript',
	},
];

export async function execute(
	context: IExecuteFunctions,
	i: number,
	options: IDataObject,
	model: string,
): Promise<IDataObject> {
	const operation = context.getNodeParameter('operation', i) as string;
	let userMessage = '';

	if (operation === CodeAssistantOp.Chat) {
		userMessage = context.getNodeParameter('message', i) as string;
	} else if (operation === CodeAssistantOp.GenerateCode) {
		const desc = context.getNodeParameter('codeDescription', i) as string;
		const lang = context.getNodeParameter('language', i) as string;
		userMessage = `Generate ${lang} code for: ${desc}`;
	} else if (operation === CodeAssistantOp.ReviewCode) {
		const code = context.getNodeParameter('code', i) as string;
		userMessage = `Review this code:\n\`\`\`\n${code}\n\`\`\``;
	} else if (operation === CodeAssistantOp.FixCode) {
		const code = context.getNodeParameter('code', i) as string;
		userMessage = `Fix this code:\n\`\`\`\n${code}\n\`\`\``;
	}

	const response = await callCopilotApi(context, model, SYSTEM_PROMPTS.codeAssistant, userMessage, options);
	return { resource: Resource.CodeAssistant, operation, response };
}
