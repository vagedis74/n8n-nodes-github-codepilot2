import type { INodeProperties, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { Resource, McpServerOp } from '../types';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: [Resource.McpServer] } },
		options: [
			{ name: 'Register Tool', value: McpServerOp.RegisterTool, action: 'Register tool' },
			{ name: 'Expose Workflow', value: McpServerOp.ExposeWorkflow, action: 'Expose workflow' },
		],
		default: McpServerOp.RegisterTool,
	},
	{
		displayName: 'Workflow ID',
		name: 'workflowId',
		type: 'string',
		displayOptions: { show: { resource: [Resource.McpServer] } },
		default: '',
	},
];

export async function execute(
	context: IExecuteFunctions,
	i: number,
	_options: IDataObject,
	_model: string,
): Promise<IDataObject> {
	const operation = context.getNodeParameter('operation', i) as string;
	const workflowId = context.getNodeParameter('workflowId', i, '') as string;

	// Stub implementation - returns registration confirmation
	return {
		resource: Resource.McpServer,
		operation,
		registered: true,
		workflowId,
		mcpTool: {
			name: `workflow_${workflowId}`,
			description: `Execute n8n workflow ${workflowId}`,
		},
	};
}
