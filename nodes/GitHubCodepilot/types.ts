import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';

export enum Resource {
	WorkflowBuilder = 'workflowBuilder',
	CodeAssistant = 'codeAssistant',
	McpClient = 'mcpClient',
	McpServer = 'mcpServer',
	Plugin = 'plugin',
	SuperSysAdmin = 'superSysAdmin',
	PromptReviewer = 'promptReviewer',
}

export enum WorkflowBuilderOp {
	Generate = 'generateWorkflow',
	AddNode = 'addNode',
	Optimize = 'optimizeWorkflow',
	Fix = 'fixWorkflow',
	Explain = 'explainWorkflow',
}

export enum CodeAssistantOp {
	Chat = 'chat',
	GenerateCode = 'generateCode',
	ReviewCode = 'reviewCode',
	FixCode = 'fixCode',
}

export enum McpClientOp {
	ListTools = 'listTools',
	CallTool = 'callTool',
	ListResources = 'listResources',
}

export enum McpServerOp {
	RegisterTool = 'registerTool',
	ExposeWorkflow = 'exposeWorkflow',
}

export enum PluginOp {
	ListPlugins = 'listPlugins',
	ExecutePlugin = 'executePlugin',
}

export enum SuperSysAdminOp {
	AnalyzeTicket = 'analyzeTicket',
}

export enum PromptReviewerOp {
	ReviewPrompts = 'reviewPrompts',
}

export type ResourceExecuteFn = (
	context: IExecuteFunctions,
	i: number,
	options: IDataObject,
	model: string,
) => Promise<IDataObject>;
