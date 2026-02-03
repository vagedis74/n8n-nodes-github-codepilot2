import { GitHubCodepilot2 } from '../nodes/GitHubCodepilot2/GitHubCodepilot2.node';
import { GitHubCodepilot2Api } from '../credentials/GitHubCodepilot2Api.credentials';

describe('GitHubCodepilot2 Node', () => {
	let node: GitHubCodepilot2;

	beforeEach(() => {
		node = new GitHubCodepilot2();
	});

	describe('Node Description', () => {
		it('should have correct display name', () => {
			expect(node.description.displayName).toBe('GitHub Codepilot2');
		});

		it('should have correct node name', () => {
			expect(node.description.name).toBe('gitHubCodepilot2');
		});

		it('should have version 1', () => {
			expect(node.description.version).toBe(1);
		});

		it('should have correct group', () => {
			expect(node.description.group).toContain('transform');
		});

		it('should require gitHubCodepilot2Api credentials', () => {
			const creds = node.description.credentials;
			expect(creds).toBeDefined();
			expect(creds![0].name).toBe('gitHubCodepilot2Api');
			expect(creds![0].required).toBe(true);
		});

		it('should have one input and one output', () => {
			expect(node.description.inputs).toEqual(['main']);
			expect(node.description.outputs).toEqual(['main']);
		});
	});

	describe('Resources', () => {
		it('should have all required resources', () => {
			const resourceProperty = node.description.properties.find(
				(p) => p.name === 'resource'
			);
			expect(resourceProperty).toBeDefined();
			expect(resourceProperty!.type).toBe('options');

			const options = (resourceProperty as any).options;
			const resourceValues = options.map((o: any) => o.value);

			expect(resourceValues).toContain('workflowBuilder');
			expect(resourceValues).toContain('codeAssistant');
			expect(resourceValues).toContain('mcpClient');
			expect(resourceValues).toContain('mcpServer');
			expect(resourceValues).toContain('plugin');
			expect(resourceValues).toContain('superSysAdmin');
			expect(resourceValues).toContain('promptReviewer');
		});
	});

	describe('Operations', () => {
		it('should have workflow builder operations', () => {
			const operationProperty = node.description.properties.find(
				(p) => p.name === 'operation' && (p.displayOptions as any)?.show?.resource?.includes('workflowBuilder')
			);
			expect(operationProperty).toBeDefined();

			const options = (operationProperty as any).options;
			const operationValues = options.map((o: any) => o.value);

			expect(operationValues).toContain('generateWorkflow');
			expect(operationValues).toContain('addNode');
			expect(operationValues).toContain('optimizeWorkflow');
			expect(operationValues).toContain('fixWorkflow');
			expect(operationValues).toContain('explainWorkflow');
		});

		it('should have code assistant operations', () => {
			const operationProperty = node.description.properties.find(
				(p) => p.name === 'operation' && (p.displayOptions as any)?.show?.resource?.includes('codeAssistant')
			);
			expect(operationProperty).toBeDefined();

			const options = (operationProperty as any).options;
			const operationValues = options.map((o: any) => o.value);

			expect(operationValues).toContain('chat');
			expect(operationValues).toContain('generateCode');
			expect(operationValues).toContain('reviewCode');
			expect(operationValues).toContain('fixCode');
		});

		it('should have prompt reviewer operation', () => {
			const operationProperty = node.description.properties.find(
				(p) => p.name === 'operation' && (p.displayOptions as any)?.show?.resource?.includes('promptReviewer')
			);
			expect(operationProperty).toBeDefined();

			const options = (operationProperty as any).options;
			const operationValues = options.map((o: any) => o.value);

			expect(operationValues).toContain('reviewPrompts');
		});
	});

	describe('Models', () => {
		it('should support multiple AI models', () => {
			const modelProperty = node.description.properties.find(
				(p) => p.name === 'model'
			);
			expect(modelProperty).toBeDefined();
			expect(modelProperty!.type).toBe('options');

			const options = (modelProperty as any).options;
			const modelValues = options.map((o: any) => o.value);

			expect(modelValues).toContain('gpt-4o');
			expect(modelValues).toContain('gpt-4o-mini');
			expect(modelValues).toContain('claude-3-5-sonnet');
		});
	});

	describe('Programming Languages', () => {
		it('should support common programming languages', () => {
			const languageProperty = node.description.properties.find(
				(p) => p.name === 'language'
			);
			expect(languageProperty).toBeDefined();

			const options = (languageProperty as any).options;
			const languageValues = options.map((o: any) => o.value);

			expect(languageValues).toContain('javascript');
			expect(languageValues).toContain('typescript');
			expect(languageValues).toContain('python');
		});
	});

	describe('Options', () => {
		it('should have temperature option', () => {
			const optionsProperty = node.description.properties.find(
				(p) => p.name === 'options'
			);
			expect(optionsProperty).toBeDefined();

			const options = (optionsProperty as any).options;
			const temperatureOption = options.find((o: any) => o.name === 'temperature');

			expect(temperatureOption).toBeDefined();
			expect(temperatureOption.type).toBe('number');
		});

		it('should have maxTokens option', () => {
			const optionsProperty = node.description.properties.find(
				(p) => p.name === 'options'
			);
			const options = (optionsProperty as any).options;
			const maxTokensOption = options.find((o: any) => o.name === 'maxTokens');

			expect(maxTokensOption).toBeDefined();
			expect(maxTokensOption.type).toBe('number');
		});
	});

	describe('Prompt Reviewer', () => {
		it('should have agentCount parameter with correct type and constraints', () => {
			const agentCountProperty = node.description.properties.find(
				(p) => p.name === 'agentCount'
			);
			expect(agentCountProperty).toBeDefined();
			expect(agentCountProperty!.type).toBe('number');
			expect((agentCountProperty!.typeOptions as any)?.minValue).toBe(1);
			expect((agentCountProperty!.typeOptions as any)?.maxValue).toBe(9);
			expect((agentCountProperty!.typeOptions as any)?.numberStepSize).toBe(1);
			expect(agentCountProperty!.default).toBe(1);
		});

		it('should have agent prompt fields 1 through 9', () => {
			for (let n = 1; n <= 9; n++) {
				const promptField = node.description.properties.find(
					(p) => p.name === `agentPrompt${n}`
				);
				expect(promptField).toBeDefined();
				expect(promptField!.type).toBe('string');
				expect((promptField!.typeOptions as any)?.rows).toBe(6);
				expect((promptField!.displayOptions as any)?.show?.resource).toEqual(['promptReviewer']);

				// Verify the agentCount visibility array starts at n and goes to 9
				const expectedCounts = [];
				for (let c = n; c <= 9; c++) expectedCounts.push(c);
				expect((promptField!.displayOptions as any)?.show?.agentCount).toEqual(expectedCounts);
			}
		});

		it('should have optional MCP server URL for prompt reviewer', () => {
			const mcpUrlField = node.description.properties.find(
				(p) => p.name === 'promptReviewerMcpServerUrl'
			);
			expect(mcpUrlField).toBeDefined();
			expect(mcpUrlField!.type).toBe('string');
			expect((mcpUrlField!.displayOptions as any)?.show?.resource).toEqual(['promptReviewer']);
		});

		it('should have loadPreviousAgents boolean field', () => {
			const loadPreviousField = node.description.properties.find(
				(p) => p.name === 'loadPreviousAgents'
			);
			expect(loadPreviousField).toBeDefined();
			expect(loadPreviousField!.type).toBe('boolean');
			expect(loadPreviousField!.default).toBe(false);
			expect((loadPreviousField!.displayOptions as any)?.show?.resource).toEqual(['promptReviewer']);
		});
	});
});

describe('GitHubCodepilot2Api Credentials', () => {
	let credentials: GitHubCodepilot2Api;

	beforeEach(() => {
		credentials = new GitHubCodepilot2Api();
	});

	it('should have correct credential name', () => {
		expect(credentials.name).toBe('gitHubCodepilot2Api');
	});

	it('should have correct display name', () => {
		expect(credentials.displayName).toBe('GitHub Codepilot2 API');
	});

	it('should have authentication method property', () => {
		const authMethodProp = credentials.properties.find(
			(p) => p.name === 'authMethod'
		);
		expect(authMethodProp).toBeDefined();
		expect(authMethodProp!.type).toBe('options');
	});

	it('should have accessToken property', () => {
		const accessTokenProp = credentials.properties.find(
			(p) => p.name === 'accessToken'
		);
		expect(accessTokenProp).toBeDefined();
		expect(accessTokenProp!.type).toBe('string');
		expect((accessTokenProp!.typeOptions as any)?.password).toBe(true);
	});

	it('should have baseUrl property with default', () => {
		const baseUrlProp = credentials.properties.find(
			(p) => p.name === 'baseUrl'
		);
		expect(baseUrlProp).toBeDefined();
		expect(baseUrlProp!.default).toBe('https://api.github.com');
	});

	it('should have authenticate configuration', () => {
		expect(credentials.authenticate).toBeDefined();
		expect(credentials.authenticate.type).toBe('generic');
	});

	it('should have test request configuration', () => {
		expect(credentials.test).toBeDefined();
		expect(credentials.test.request.url).toBe('/user');
	});
});
