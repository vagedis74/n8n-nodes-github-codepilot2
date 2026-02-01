import type { INodeProperties, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { Resource, PluginOp } from '../types';
import { callCopilotApi } from '../utils';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: [Resource.Plugin] } },
		options: [
			{ name: 'List Plugins', value: PluginOp.ListPlugins, action: 'List plugins' },
			{ name: 'Execute Plugin', value: PluginOp.ExecutePlugin, action: 'Execute plugin' },
		],
		default: PluginOp.ListPlugins,
	},
	{
		displayName: 'Plugin ID',
		name: 'pluginId',
		type: 'string',
		displayOptions: { show: { resource: [Resource.Plugin], operation: [PluginOp.ExecutePlugin] } },
		default: '',
	},
];

export async function execute(
	context: IExecuteFunctions,
	i: number,
	options: IDataObject,
	model: string,
): Promise<IDataObject> {
	const operation = context.getNodeParameter('operation', i) as string;
	const result: IDataObject = { resource: Resource.Plugin, operation };

	if (operation === PluginOp.ListPlugins) {
		// Stub implementation
		result.plugins = [
			{ id: 'github-copilot-chat', name: 'GitHub Copilot Chat' },
			{ id: 'github-copilot-cli', name: 'GitHub Copilot CLI' },
		];
	} else if (operation === PluginOp.ExecutePlugin) {
		const pluginId = context.getNodeParameter('pluginId', i) as string;
		const response = await callCopilotApi(context, model, `You are the ${pluginId} plugin.`, 'Execute', options);
		result.pluginId = pluginId;
		result.output = response;
	}

	return result;
}
