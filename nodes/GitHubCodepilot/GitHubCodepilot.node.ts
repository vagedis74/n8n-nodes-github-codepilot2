import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { Resource } from './types';
import { MODELS } from './constants';
import * as WorkflowBuilder from './resources/WorkflowBuilder';
import * as CodeAssistant from './resources/CodeAssistant';
import * as McpClient from './resources/McpClient';
import * as McpServer from './resources/McpServer';
import * as Plugin from './resources/Plugin';
import * as SuperSysAdmin from './resources/SuperSysAdmin';
import * as PromptReviewer from './resources/PromptReviewer';

const resourceExecutors: Record<string, (ctx: IExecuteFunctions, i: number, opts: IDataObject, model: string) => Promise<IDataObject>> = {
	[Resource.WorkflowBuilder]: WorkflowBuilder.execute,
	[Resource.CodeAssistant]: CodeAssistant.execute,
	[Resource.McpClient]: McpClient.execute,
	[Resource.McpServer]: McpServer.execute,
	[Resource.Plugin]: Plugin.execute,
	[Resource.SuperSysAdmin]: SuperSysAdmin.execute,
	[Resource.PromptReviewer]: PromptReviewer.execute,
};

export class GitHubCodepilot implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'GitHub Codepilot',
		name: 'gitHubCodepilot',
		icon: 'file:github-codepilot.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
		description: 'AI-powered vibecoding, workflow building, and MCP integration with GitHub Copilot',
		defaults: { name: 'GitHub Codepilot' },
		inputs: ['main'],
		outputs: ['main'],
		credentials: [{ name: 'gitHubCodepilotApi', required: true }],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Workflow Builder', value: Resource.WorkflowBuilder, description: 'Automatically build n8n workflows using AI' },
					{ name: 'Code Assistant', value: Resource.CodeAssistant, description: 'AI-powered code generation and analysis' },
					{ name: 'MCP Client', value: Resource.McpClient, description: 'Connect to MCP servers and invoke tools' },
					{ name: 'MCP Server', value: Resource.McpServer, description: 'Expose n8n capabilities as MCP tools' },
					{ name: 'Plugin', value: Resource.Plugin, description: 'Manage and execute Copilot plugins' },
					{ name: 'Super SysAdmin Mode', value: Resource.SuperSysAdmin, description: 'Senior IT support specialist for analyzing and solving IT tickets' },
					{ name: 'Prompt Reviewer', value: Resource.PromptReviewer, description: 'Review and improve agent prompts to senior engineer level' },
				],
				default: Resource.WorkflowBuilder,
			},
			// Resource-specific operation selectors and fields
			...WorkflowBuilder.description,
			...CodeAssistant.description,
			...McpClient.description,
			...McpServer.description,
			...Plugin.description,
			...SuperSysAdmin.description,
			...PromptReviewer.description,
			// Model selector (shared)
			{
				displayName: 'Model',
				name: 'model',
				type: 'options',
				options: [...MODELS],
				default: 'gpt-4o',
			},
			// Options (shared)
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{ displayName: 'Temperature', name: 'temperature', type: 'number', default: 0.7 },
					{ displayName: 'Max Tokens', name: 'maxTokens', type: 'number', default: 4096 },
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const model = this.getNodeParameter('model', i) as string;
				const options = this.getNodeParameter('options', i, {}) as IDataObject;

				const handler = resourceExecutors[resource];
				if (!handler) {
					throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`, { itemIndex: i });
				}

				const result = await handler(this, i, options, model);
				returnData.push({ json: result, pairedItem: { item: i } });
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
				} else {
					throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
				}
			}
		}

		return [returnData];
	}
}
