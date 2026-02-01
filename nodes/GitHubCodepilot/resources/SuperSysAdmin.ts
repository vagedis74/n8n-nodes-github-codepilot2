import type { INodeProperties, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { Resource, SuperSysAdminOp } from '../types';
import { SYSTEM_PROMPTS } from '../constants';
import { callCopilotApi, extractJson } from '../utils';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: [Resource.SuperSysAdmin] } },
		options: [
			{
				name: 'Analyze Ticket',
				value: SuperSysAdminOp.AnalyzeTicket,
				action: 'Analyze IT support ticket and provide solution',
			},
		],
		default: SuperSysAdminOp.AnalyzeTicket,
	},
	{
		displayName: 'IT Support Ticket',
		name: 'supportTicket',
		type: 'string',
		typeOptions: { rows: 8 },
		displayOptions: { show: { resource: [Resource.SuperSysAdmin], operation: [SuperSysAdminOp.AnalyzeTicket] } },
		default: '',
		required: true,
		placeholder: 'Paste the IT support ticket details here...',
		description:
			'The IT support ticket to analyze. Include all relevant details like error messages, symptoms, and environment information.',
	},
];

export async function execute(
	context: IExecuteFunctions,
	i: number,
	options: IDataObject,
	model: string,
): Promise<IDataObject> {
	const ticket = context.getNodeParameter('supportTicket', i) as string;
	const userMessage = `Analyze this IT support ticket and provide a solution:\n\n${ticket}`;
	const response = await callCopilotApi(context, model, SYSTEM_PROMPTS.superSysAdmin, userMessage, options);

	const parsed = extractJson(response);
	return {
		resource: Resource.SuperSysAdmin,
		operation: SuperSysAdminOp.AnalyzeTicket,
		analysis: parsed || { raw: response },
		ticket,
	};
}
