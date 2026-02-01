import type { INodeProperties, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { Resource, WorkflowBuilderOp } from '../types';
import { SYSTEM_PROMPTS } from '../constants';
import { callCopilotApi, extractJson } from '../utils';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: [Resource.WorkflowBuilder] } },
		options: [
			{ name: 'Generate Workflow', value: WorkflowBuilderOp.Generate, action: 'Generate n8n workflow from description' },
			{ name: 'Add Node', value: WorkflowBuilderOp.AddNode, action: 'Add node to workflow' },
			{ name: 'Optimize Workflow', value: WorkflowBuilderOp.Optimize, action: 'Optimize workflow' },
			{ name: 'Fix Workflow', value: WorkflowBuilderOp.Fix, action: 'Fix workflow issues' },
			{ name: 'Explain Workflow', value: WorkflowBuilderOp.Explain, action: 'Explain workflow' },
		],
		default: WorkflowBuilderOp.Generate,
	},
	{
		displayName: 'Workflow Description',
		name: 'workflowDescription',
		type: 'string',
		typeOptions: { rows: 6 },
		displayOptions: { show: { resource: [Resource.WorkflowBuilder], operation: [WorkflowBuilderOp.Generate] } },
		default: '',
		required: true,
		placeholder: 'Describe the workflow you want to build...',
	},
	{
		displayName: 'Workflow JSON',
		name: 'workflowJson',
		type: 'string',
		typeOptions: { rows: 10 },
		displayOptions: {
			show: {
				resource: [Resource.WorkflowBuilder],
				operation: [WorkflowBuilderOp.AddNode, WorkflowBuilderOp.Optimize, WorkflowBuilderOp.Fix, WorkflowBuilderOp.Explain],
			},
		},
		default: '',
		required: true,
	},
	{
		displayName: 'Node Description',
		name: 'nodeDescription',
		type: 'string',
		displayOptions: { show: { resource: [Resource.WorkflowBuilder], operation: [WorkflowBuilderOp.AddNode] } },
		default: '',
		required: true,
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

	if (operation === WorkflowBuilderOp.Generate) {
		const desc = context.getNodeParameter('workflowDescription', i) as string;
		userMessage = `Generate a complete n8n workflow for: ${desc}`;
	} else if (operation === WorkflowBuilderOp.AddNode) {
		const json = context.getNodeParameter('workflowJson', i) as string;
		const nodeDesc = context.getNodeParameter('nodeDescription', i) as string;
		userMessage = `Add this node to the workflow: ${nodeDesc}\n\nWorkflow:\n${json}`;
	} else if (operation === WorkflowBuilderOp.Optimize) {
		const json = context.getNodeParameter('workflowJson', i) as string;
		userMessage = `Optimize this workflow:\n${json}`;
	} else if (operation === WorkflowBuilderOp.Fix) {
		const json = context.getNodeParameter('workflowJson', i) as string;
		userMessage = `Fix issues in this workflow:\n${json}`;
	} else if (operation === WorkflowBuilderOp.Explain) {
		const json = context.getNodeParameter('workflowJson', i) as string;
		userMessage = `Explain this workflow in detail:\n${json}`;
	}

	const response = await callCopilotApi(context, model, SYSTEM_PROMPTS.workflowBuilder, userMessage, options);
	const result: IDataObject = { resource: Resource.WorkflowBuilder, operation, response };

	const extracted = extractJson(response);
	if (extracted && typeof extracted === 'object' && !Array.isArray(extracted) && (extracted as IDataObject).nodes) {
		result.workflow = extracted;
	}

	return result;
}
