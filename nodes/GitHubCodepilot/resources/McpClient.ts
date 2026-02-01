import type { INodeProperties, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { Resource, McpClientOp } from '../types';
import { mcpJsonRpcRequest } from '../utils';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: [Resource.McpClient] } },
		options: [
			{ name: 'List Tools', value: McpClientOp.ListTools, action: 'List MCP tools' },
			{ name: 'Call Tool', value: McpClientOp.CallTool, action: 'Call MCP tool' },
			{ name: 'List Resources', value: McpClientOp.ListResources, action: 'List MCP resources' },
		],
		default: McpClientOp.ListTools,
	},
	{
		displayName: 'MCP Server URL',
		name: 'mcpServerUrl',
		type: 'string',
		displayOptions: { show: { resource: [Resource.McpClient] } },
		default: '',
		required: true,
	},
	{
		displayName: 'Tool Name',
		name: 'toolName',
		type: 'string',
		displayOptions: { show: { resource: [Resource.McpClient], operation: [McpClientOp.CallTool] } },
		default: '',
		required: true,
	},
	{
		displayName: 'Tool Arguments',
		name: 'toolArguments',
		type: 'json',
		displayOptions: { show: { resource: [Resource.McpClient], operation: [McpClientOp.CallTool] } },
		default: '{}',
	},
];

export async function execute(
	context: IExecuteFunctions,
	i: number,
	_options: IDataObject,
	_model: string,
): Promise<IDataObject> {
	const operation = context.getNodeParameter('operation', i) as string;
	const mcpUrl = context.getNodeParameter('mcpServerUrl', i) as string;
	const result: IDataObject = { resource: Resource.McpClient, operation };

	if (operation === McpClientOp.ListTools) {
		const response = await mcpJsonRpcRequest(context, mcpUrl, 'tools/list');
		result.tools = response.tools || [];
	} else if (operation === McpClientOp.CallTool) {
		const toolName = context.getNodeParameter('toolName', i) as string;
		const toolArgs = JSON.parse(context.getNodeParameter('toolArguments', i) as string);
		const response = await mcpJsonRpcRequest(context, mcpUrl, 'tools/call', {
			name: toolName,
			arguments: toolArgs,
		});
		result.result = response;
	} else if (operation === McpClientOp.ListResources) {
		const response = await mcpJsonRpcRequest(context, mcpUrl, 'resources/list');
		result.resources = response.resources || [];
	}

	return result;
}
