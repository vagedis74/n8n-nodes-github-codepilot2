import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	IHttpRequestMethods,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

export class GitHubCodepilot implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'GitHub Codepilot',
		name: 'gitHubCodepilot',
		icon: 'file:github-codepilot.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
		description: 'AI-powered vibecoding, workflow building, and MCP integration with GitHub Copilot',
		defaults: {
			name: 'GitHub Codepilot',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'gitHubCodepilotApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Workflow Builder', value: 'workflowBuilder', description: 'Automatically build n8n workflows using AI' },
					{ name: 'Code Assistant', value: 'codeAssistant', description: 'AI-powered code generation and analysis' },
					{ name: 'MCP Client', value: 'mcpClient', description: 'Connect to MCP servers and invoke tools' },
					{ name: 'MCP Server', value: 'mcpServer', description: 'Expose n8n capabilities as MCP tools' },
					{ name: 'Plugin', value: 'plugin', description: 'Manage and execute Copilot plugins' },
					{ name: 'Super SysAdmin Mode', value: 'superSysAdmin', description: 'Senior IT support specialist for analyzing and solving IT tickets' },
				],
				default: 'workflowBuilder',
			},
			// Workflow Builder Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['workflowBuilder'] } },
				options: [
					{ name: 'Generate Workflow', value: 'generateWorkflow', action: 'Generate n8n workflow from description' },
					{ name: 'Add Node', value: 'addNode', action: 'Add node to workflow' },
					{ name: 'Optimize Workflow', value: 'optimizeWorkflow', action: 'Optimize workflow' },
					{ name: 'Fix Workflow', value: 'fixWorkflow', action: 'Fix workflow issues' },
					{ name: 'Explain Workflow', value: 'explainWorkflow', action: 'Explain workflow' },
				],
				default: 'generateWorkflow',
			},
			// Code Assistant Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['codeAssistant'] } },
				options: [
					{ name: 'Chat', value: 'chat', action: 'Chat with Copilot' },
					{ name: 'Generate Code', value: 'generateCode', action: 'Generate code' },
					{ name: 'Review Code', value: 'reviewCode', action: 'Review code' },
					{ name: 'Fix Code', value: 'fixCode', action: 'Fix code' },
				],
				default: 'chat',
			},
			// MCP Client Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['mcpClient'] } },
				options: [
					{ name: 'List Tools', value: 'listTools', action: 'List MCP tools' },
					{ name: 'Call Tool', value: 'callTool', action: 'Call MCP tool' },
					{ name: 'List Resources', value: 'listResources', action: 'List MCP resources' },
				],
				default: 'listTools',
			},
			// MCP Server Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['mcpServer'] } },
				options: [
					{ name: 'Register Tool', value: 'registerTool', action: 'Register tool' },
					{ name: 'Expose Workflow', value: 'exposeWorkflow', action: 'Expose workflow' },
				],
				default: 'registerTool',
			},
			// Plugin Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['plugin'] } },
				options: [
					{ name: 'List Plugins', value: 'listPlugins', action: 'List plugins' },
					{ name: 'Execute Plugin', value: 'executePlugin', action: 'Execute plugin' },
				],
				default: 'listPlugins',
			},
			// Super SysAdmin Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['superSysAdmin'] } },
				options: [
					{ name: 'Analyze Ticket', value: 'analyzeTicket', action: 'Analyze IT support ticket and provide solution' },
				],
				default: 'analyzeTicket',
			},
			// Model
			{
				displayName: 'Model',
				name: 'model',
				type: 'options',
				options: [
					{ name: 'GPT-4o', value: 'gpt-4o' },
					{ name: 'GPT-4o Mini', value: 'gpt-4o-mini' },
					{ name: 'Claude 3.5 Sonnet', value: 'claude-3-5-sonnet' },
				],
				default: 'gpt-4o',
			},
			// Workflow Description
			{
				displayName: 'Workflow Description',
				name: 'workflowDescription',
				type: 'string',
				typeOptions: { rows: 6 },
				displayOptions: { show: { resource: ['workflowBuilder'], operation: ['generateWorkflow'] } },
				default: '',
				required: true,
				placeholder: 'Describe the workflow you want to build...',
			},
			// Workflow JSON
			{
				displayName: 'Workflow JSON',
				name: 'workflowJson',
				type: 'string',
				typeOptions: { rows: 10 },
				displayOptions: { show: { resource: ['workflowBuilder'], operation: ['addNode', 'optimizeWorkflow', 'fixWorkflow', 'explainWorkflow'] } },
				default: '',
				required: true,
			},
			// Node Description
			{
				displayName: 'Node Description',
				name: 'nodeDescription',
				type: 'string',
				displayOptions: { show: { resource: ['workflowBuilder'], operation: ['addNode'] } },
				default: '',
				required: true,
			},
			// Chat Message
			{
				displayName: 'Message',
				name: 'message',
				type: 'string',
				typeOptions: { rows: 4 },
				displayOptions: { show: { resource: ['codeAssistant'], operation: ['chat'] } },
				default: '',
				required: true,
			},
			// Code Description
			{
				displayName: 'Description',
				name: 'codeDescription',
				type: 'string',
				typeOptions: { rows: 4 },
				displayOptions: { show: { resource: ['codeAssistant'], operation: ['generateCode'] } },
				default: '',
				required: true,
			},
			// Code
			{
				displayName: 'Code',
				name: 'code',
				type: 'string',
				typeOptions: { rows: 10 },
				displayOptions: { show: { resource: ['codeAssistant'], operation: ['reviewCode', 'fixCode'] } },
				default: '',
				required: true,
			},
			// Language
			{
				displayName: 'Language',
				name: 'language',
				type: 'options',
				displayOptions: { show: { resource: ['codeAssistant'], operation: ['generateCode'] } },
				options: [
					{ name: 'JavaScript', value: 'javascript' },
					{ name: 'TypeScript', value: 'typescript' },
					{ name: 'Python', value: 'python' },
				],
				default: 'javascript',
			},
			// MCP Server URL
			{
				displayName: 'MCP Server URL',
				name: 'mcpServerUrl',
				type: 'string',
				displayOptions: { show: { resource: ['mcpClient'] } },
				default: '',
				required: true,
			},
			// Tool Name
			{
				displayName: 'Tool Name',
				name: 'toolName',
				type: 'string',
				displayOptions: { show: { resource: ['mcpClient'], operation: ['callTool'] } },
				default: '',
				required: true,
			},
			// Tool Arguments
			{
				displayName: 'Tool Arguments',
				name: 'toolArguments',
				type: 'json',
				displayOptions: { show: { resource: ['mcpClient'], operation: ['callTool'] } },
				default: '{}',
			},
			// Workflow ID
			{
				displayName: 'Workflow ID',
				name: 'workflowId',
				type: 'string',
				displayOptions: { show: { resource: ['mcpServer'] } },
				default: '',
			},
			// Plugin ID
			{
				displayName: 'Plugin ID',
				name: 'pluginId',
				type: 'string',
				displayOptions: { show: { resource: ['plugin'], operation: ['executePlugin'] } },
				default: '',
			},
			// IT Support Ticket
			{
				displayName: 'IT Support Ticket',
				name: 'supportTicket',
				type: 'string',
				typeOptions: { rows: 8 },
				displayOptions: { show: { resource: ['superSysAdmin'], operation: ['analyzeTicket'] } },
				default: '',
				required: true,
				placeholder: 'Paste the IT support ticket details here...',
				description: 'The IT support ticket to analyze. Include all relevant details like error messages, symptoms, and environment information.',
			},
			// Options
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
				const operation = this.getNodeParameter('operation', i) as string;
				const model = this.getNodeParameter('model', i) as string;
				const options = this.getNodeParameter('options', i, {}) as IDataObject;

				let result: IDataObject = { resource, operation };

				if (resource === 'workflowBuilder') {
					const n8nSystemPrompt = `You are an expert n8n workflow architect. Create valid n8n workflow JSON.
Key structure: nodes array, connections object. Use n8n-nodes-base.* node types.
Return only valid JSON that can be imported into n8n.`;

					let userMessage = '';

					if (operation === 'generateWorkflow') {
						const desc = this.getNodeParameter('workflowDescription', i) as string;
						userMessage = `Generate a complete n8n workflow for: ${desc}`;
					} else if (operation === 'addNode') {
						const json = this.getNodeParameter('workflowJson', i) as string;
						const nodeDesc = this.getNodeParameter('nodeDescription', i) as string;
						userMessage = `Add this node to the workflow: ${nodeDesc}\n\nWorkflow:\n${json}`;
					} else if (operation === 'optimizeWorkflow') {
						const json = this.getNodeParameter('workflowJson', i) as string;
						userMessage = `Optimize this workflow:\n${json}`;
					} else if (operation === 'fixWorkflow') {
						const json = this.getNodeParameter('workflowJson', i) as string;
						userMessage = `Fix issues in this workflow:\n${json}`;
					} else if (operation === 'explainWorkflow') {
						const json = this.getNodeParameter('workflowJson', i) as string;
						userMessage = `Explain this workflow in detail:\n${json}`;
					}

					const response = await callCopilotApi(this, model, n8nSystemPrompt, userMessage, options);
					result.response = response;

					// Try to extract workflow JSON
					try {
						const match = response.match(/\{[\s\S]*"nodes"[\s\S]*\}/);
						if (match) result.workflow = JSON.parse(match[0]);
					} catch {}

				} else if (resource === 'codeAssistant') {
					let systemPrompt = 'You are an expert programmer.';
					let userMessage = '';

					if (operation === 'chat') {
						userMessage = this.getNodeParameter('message', i) as string;
					} else if (operation === 'generateCode') {
						const desc = this.getNodeParameter('codeDescription', i) as string;
						const lang = this.getNodeParameter('language', i) as string;
						userMessage = `Generate ${lang} code for: ${desc}`;
					} else if (operation === 'reviewCode') {
						const code = this.getNodeParameter('code', i) as string;
						userMessage = `Review this code:\n\`\`\`\n${code}\n\`\`\``;
					} else if (operation === 'fixCode') {
						const code = this.getNodeParameter('code', i) as string;
						userMessage = `Fix this code:\n\`\`\`\n${code}\n\`\`\``;
					}

					const response = await callCopilotApi(this, model, systemPrompt, userMessage, options);
					result.response = response;

				} else if (resource === 'mcpClient') {
					const mcpUrl = this.getNodeParameter('mcpServerUrl', i) as string;

					if (operation === 'listTools') {
						const response = await this.helpers.requestWithAuthentication.call(this, 'gitHubCodepilotApi', {
							method: 'POST' as IHttpRequestMethods,
							url: mcpUrl,
							body: { jsonrpc: '2.0', id: 1, method: 'tools/list' },
							json: true,
						});
						result.tools = response.result?.tools || [];
					} else if (operation === 'callTool') {
						const toolName = this.getNodeParameter('toolName', i) as string;
						const toolArgs = JSON.parse(this.getNodeParameter('toolArguments', i) as string);
						const response = await this.helpers.requestWithAuthentication.call(this, 'gitHubCodepilotApi', {
							method: 'POST' as IHttpRequestMethods,
							url: mcpUrl,
							body: { jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: toolName, arguments: toolArgs } },
							json: true,
						});
						result.result = response.result;
					} else if (operation === 'listResources') {
						const response = await this.helpers.requestWithAuthentication.call(this, 'gitHubCodepilotApi', {
							method: 'POST' as IHttpRequestMethods,
							url: mcpUrl,
							body: { jsonrpc: '2.0', id: 1, method: 'resources/list' },
							json: true,
						});
						result.resources = response.result?.resources || [];
					}

				} else if (resource === 'mcpServer') {
					const workflowId = this.getNodeParameter('workflowId', i, '') as string;

					if (operation === 'registerTool' || operation === 'exposeWorkflow') {
						result.registered = true;
						result.workflowId = workflowId;
						result.mcpTool = {
							name: `workflow_${workflowId}`,
							description: `Execute n8n workflow ${workflowId}`,
						};
					}

				} else if (resource === 'plugin') {
					if (operation === 'listPlugins') {
						result.plugins = [
							{ id: 'github-copilot-chat', name: 'GitHub Copilot Chat' },
							{ id: 'github-copilot-cli', name: 'GitHub Copilot CLI' },
						];
					} else if (operation === 'executePlugin') {
						const pluginId = this.getNodeParameter('pluginId', i) as string;
						const response = await callCopilotApi(this, model, `You are the ${pluginId} plugin.`, 'Execute', options);
						result.pluginId = pluginId;
						result.output = response;
					}

				} else if (resource === 'superSysAdmin') {
					const sysAdminSystemPrompt = `You are a senior system, network, and security engineer with 20+ years of experience. You are an expert IT support specialist who has seen every possible IT issue across Windows, Linux, macOS, networking, cloud infrastructure (AWS, Azure, GCP), Active Directory, Office 365, virtualization (VMware, Hyper-V), firewalls, VPNs, and enterprise applications.

Your task is to analyze IT support tickets and provide expert solutions. You must respond with ONLY valid JSON in this exact format:
{
  "confidence": "high/medium/low",
  "problem_summary": "brief description of the identified problem",
  "solution": "detailed step-by-step solution to resolve the issue",
  "reasoning": "technical explanation of why this solution works and what caused the problem"
}

Rules:
- "high" confidence: You've seen this exact issue many times and are certain of the solution
- "medium" confidence: The symptoms match a known issue but there could be multiple causes
- "low" confidence: The ticket lacks details or the issue is unusual/complex
- Always provide actionable solutions with specific commands, settings, or steps
- Consider security implications in your solutions
- If the ticket is vague, still provide the most likely solution based on available information`;

					if (operation === 'analyzeTicket') {
						const ticket = this.getNodeParameter('supportTicket', i) as string;
						const userMessage = `Analyze this IT support ticket and provide a solution:\n\n${ticket}`;
						const response = await callCopilotApi(this, model, sysAdminSystemPrompt, userMessage, options);

						// Try to parse the JSON response
						try {
							const jsonMatch = response.match(/\{[\s\S]*\}/);
							if (jsonMatch) {
								result.analysis = JSON.parse(jsonMatch[0]);
							} else {
								result.analysis = { raw: response };
							}
						} catch {
							result.analysis = { raw: response };
						}
						result.ticket = ticket;
					}
				}

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

async function callCopilotApi(
	context: IExecuteFunctions,
	model: string,
	systemPrompt: string,
	userMessage: string,
	options: IDataObject
): Promise<string> {
	const response = await context.helpers.requestWithAuthentication.call(context, 'gitHubCodepilotApi', {
		method: 'POST' as IHttpRequestMethods,
		url: 'https://models.inference.ai.azure.com/chat/completions',
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
