import { GitHubCodepilot } from '../nodes/GitHubCodepilot/GitHubCodepilot.node';

describe('GitHubCodepilot Node', () => {
	let node: GitHubCodepilot;

	beforeEach(() => {
		node = new GitHubCodepilot();
	});

	describe('Node Description', () => {
		it('should have correct display name', () => {
			expect(node.description.displayName).toBe('GitHub Codepilot');
		});

		it('should have correct node name', () => {
			expect(node.description.name).toBe('gitHubCodepilot');
		});

		it('should have version 1', () => {
			expect(node.description.version).toBe(1);
		});

		it('should have correct group', () => {
			expect(node.description.group).toContain('transform');
		});

		it('should require gitHubCodepilotApi credentials', () => {
			const creds = node.description.credentials;
			expect(creds).toBeDefined();
			expect(creds![0].name).toBe('gitHubCodepilotApi');
			expect(creds![0].required).toBe(true);
		});

		it('should have one input and one output', () => {
			expect(node.description.inputs).toEqual(['main']);
			expect(node.description.outputs).toEqual(['main']);
		});
	});

	describe('Resources', () => {
		it('should have all 7 resources', () => {
			const resourceProperty = node.description.properties.find((p) => p.name === 'resource');
			expect(resourceProperty).toBeDefined();
			expect(resourceProperty!.type).toBe('options');

			const options = (resourceProperty as any).options;
			const values = options.map((o: any) => o.value);

			expect(values).toContain('workflowBuilder');
			expect(values).toContain('codeAssistant');
			expect(values).toContain('mcpClient');
			expect(values).toContain('mcpServer');
			expect(values).toContain('plugin');
			expect(values).toContain('superSysAdmin');
			expect(values).toContain('promptReviewer');
			expect(values).toHaveLength(7);
		});
	});

	describe('Operations', () => {
		function getOperationValues(resourceValue: string): string[] {
			const operationProperty = node.description.properties.find(
				(p) =>
					p.name === 'operation' &&
					(p.displayOptions as any)?.show?.resource?.includes(resourceValue),
			);
			expect(operationProperty).toBeDefined();
			return (operationProperty as any).options.map((o: any) => o.value);
		}

		it('should have 5 workflow builder operations', () => {
			const ops = getOperationValues('workflowBuilder');
			expect(ops).toEqual([
				'generateWorkflow',
				'addNode',
				'optimizeWorkflow',
				'fixWorkflow',
				'explainWorkflow',
			]);
		});

		it('should have 4 code assistant operations', () => {
			const ops = getOperationValues('codeAssistant');
			expect(ops).toEqual(['chat', 'generateCode', 'reviewCode', 'fixCode']);
		});

		it('should have 3 MCP client operations', () => {
			const ops = getOperationValues('mcpClient');
			expect(ops).toEqual(['listTools', 'callTool', 'listResources']);
		});

		it('should have 2 MCP server operations', () => {
			const ops = getOperationValues('mcpServer');
			expect(ops).toEqual(['registerTool', 'exposeWorkflow']);
		});

		it('should have 2 plugin operations', () => {
			const ops = getOperationValues('plugin');
			expect(ops).toEqual(['listPlugins', 'executePlugin']);
		});

		it('should have 1 super sysadmin operation', () => {
			const ops = getOperationValues('superSysAdmin');
			expect(ops).toEqual(['analyzeTicket']);
		});

		it('should have 1 prompt reviewer operation', () => {
			const ops = getOperationValues('promptReviewer');
			expect(ops).toEqual(['reviewPrompts']);
		});
	});

	describe('Models', () => {
		it('should support gpt-4o, gpt-4o-mini, and claude-3-5-sonnet', () => {
			const modelProperty = node.description.properties.find((p) => p.name === 'model');
			expect(modelProperty).toBeDefined();
			expect(modelProperty!.type).toBe('options');

			const values = (modelProperty as any).options.map((o: any) => o.value);
			expect(values).toContain('gpt-4o');
			expect(values).toContain('gpt-4o-mini');
			expect(values).toContain('claude-3-5-sonnet');
		});
	});

	describe('Shared Options', () => {
		it('should have temperature and maxTokens options', () => {
			const optionsProperty = node.description.properties.find((p) => p.name === 'options');
			expect(optionsProperty).toBeDefined();

			const subOptions = (optionsProperty as any).options;
			const names = subOptions.map((o: any) => o.name);
			expect(names).toContain('temperature');
			expect(names).toContain('maxTokens');
		});
	});

	describe('Prompt Reviewer Fields', () => {
		it('should have agentCount with min 1 max 9', () => {
			const prop = node.description.properties.find((p) => p.name === 'agentCount');
			expect(prop).toBeDefined();
			expect(prop!.type).toBe('number');
			expect((prop!.typeOptions as any)?.minValue).toBe(1);
			expect((prop!.typeOptions as any)?.maxValue).toBe(9);
			expect((prop!.typeOptions as any)?.numberStepSize).toBe(1);
		});

		it('should have agent prompt fields 1 through 9 with correct visibility', () => {
			for (let n = 1; n <= 9; n++) {
				const prop = node.description.properties.find((p) => p.name === `agentPrompt${n}`);
				expect(prop).toBeDefined();
				expect(prop!.type).toBe('string');
				expect((prop!.typeOptions as any)?.rows).toBe(6);

				const expectedCounts = [];
				for (let c = n; c <= 9; c++) expectedCounts.push(c);
				expect((prop!.displayOptions as any)?.show?.agentCount).toEqual(expectedCounts);
			}
		});

		it('should have optional MCP server URL for prompt reviewer', () => {
			const prop = node.description.properties.find((p) => p.name === 'promptReviewerMcpServerUrl');
			expect(prop).toBeDefined();
			expect(prop!.type).toBe('string');
		});

		it('should have loadPreviousAgents boolean', () => {
			const prop = node.description.properties.find((p) => p.name === 'loadPreviousAgents');
			expect(prop).toBeDefined();
			expect(prop!.type).toBe('boolean');
			expect(prop!.default).toBe(false);
		});
	});
});
