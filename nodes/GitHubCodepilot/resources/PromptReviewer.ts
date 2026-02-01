import type { INodeProperties, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { Resource, PromptReviewerOp } from '../types';
import { SYSTEM_PROMPTS } from '../constants';
import { callCopilotApi, extractJson, mcpJsonRpcRequest } from '../utils';

const agentCountRange = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function agentPromptField(n: number): INodeProperties {
	const showFrom = agentCountRange.filter((c) => c >= n);
	return {
		displayName: `Agent Prompt ${n}`,
		name: `agentPrompt${n}`,
		type: 'string',
		typeOptions: { rows: 6 },
		displayOptions: { show: { resource: [Resource.PromptReviewer], agentCount: showFrom } },
		default: '',
		placeholder: 'Enter agent/prompt definition...',
	};
}

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: [Resource.PromptReviewer] } },
		options: [
			{
				name: 'Review Prompts',
				value: PromptReviewerOp.ReviewPrompts,
				action: 'Review and improve agent prompts',
			},
		],
		default: PromptReviewerOp.ReviewPrompts,
	},
	{
		displayName: 'How Many Agents/Prompts Do You Want to Provide?',
		name: 'agentCount',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 9, numberStepSize: 1 },
		default: 1,
		displayOptions: { show: { resource: [Resource.PromptReviewer] } },
	},
	...Array.from({ length: 9 }, (_, idx) => agentPromptField(idx + 1)),
	{
		displayName: 'MCP Server URL',
		name: 'promptReviewerMcpServerUrl',
		type: 'string',
		displayOptions: { show: { resource: [Resource.PromptReviewer] } },
		default: '',
		placeholder: 'http://localhost:3000/mcp',
		description: 'Optional MCP server URL to discover available tools for agent recommendations',
	},
	{
		displayName: 'Load Previously Stored Agents',
		name: 'loadPreviousAgents',
		type: 'boolean',
		displayOptions: { show: { resource: [Resource.PromptReviewer] } },
		default: false,
		description: 'Whether to load and include previously reviewed agents from workflow static data',
	},
];

export async function execute(
	context: IExecuteFunctions,
	i: number,
	options: IDataObject,
	model: string,
): Promise<IDataObject> {
	const agentCount = context.getNodeParameter('agentCount', i) as number;

	// Collect filled prompts
	const prompts: { index: number; prompt: string }[] = [];
	for (let n = 1; n <= agentCount; n++) {
		const prompt = context.getNodeParameter(`agentPrompt${n}`, i, '') as string;
		if (prompt) {
			prompts.push({ index: n, prompt });
		}
	}

	// Optional: discover MCP tools
	let mcpContext = '';
	const mcpUrl = context.getNodeParameter('promptReviewerMcpServerUrl', i, '') as string;
	if (mcpUrl) {
		try {
			const toolsResponse = await mcpJsonRpcRequest(context, mcpUrl, 'tools/list');
			const tools = (toolsResponse.tools as IDataObject[]) || [];
			mcpContext = `\nAvailable MCP tools: ${JSON.stringify(tools.map((t: IDataObject) => ({ name: t.name, description: t.description })))}`;
		} catch {
			mcpContext = '\nNote: MCP server was unreachable, skipping tool discovery.';
		}
	}

	// Optional: load previous agents
	const staticData = context.getWorkflowStaticData('global');
	let previousContext = '';
	const loadPrevious = context.getNodeParameter('loadPreviousAgents', i, false) as boolean;
	if (loadPrevious && staticData.reviewedAgents) {
		previousContext = `\nPreviously reviewed agents: ${JSON.stringify(staticData.reviewedAgents)}`;
	}

	const userMessage = `Review these agent/prompt definitions:\n${JSON.stringify(prompts, null, 2)}${mcpContext}${previousContext}`;
	const response = await callCopilotApi(context, model, SYSTEM_PROMPTS.promptReviewer, userMessage, options);

	const result: IDataObject = {
		resource: Resource.PromptReviewer,
		operation: PromptReviewerOp.ReviewPrompts,
		agentCount,
	};

	const parsed = extractJson(response);
	if (Array.isArray(parsed)) {
		result.review = parsed;

		// Store in static data
		const existing = (staticData.reviewedAgents as IDataObject) || {};
		const newAgents: IDataObject = {};
		for (const agent of parsed) {
			newAgents[`agent_${agent.agent_index}`] = {
				recommended_prompt: agent.recommended_prompt,
				rating: agent.rating,
			};
		}
		staticData.reviewedAgents = { ...existing, ...newAgents, timestamp: Date.now() };
	} else {
		result.review = { raw: response };
	}

	return result;
}
