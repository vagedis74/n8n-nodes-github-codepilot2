import { GitHubCodepilot } from '../nodes/GitHubCodepilot/GitHubCodepilot.node';
import { GitHubCodepilotApi } from '../credentials/GitHubCodepilotApi.credentials';

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

	describe('Operations', () => {
		it('should have all required operations', () => {
			const operationProperty = node.description.properties.find(
				(p) => p.name === 'operation'
			);
			expect(operationProperty).toBeDefined();
			expect(operationProperty!.type).toBe('options');

			const options = (operationProperty as any).options;
			const operationValues = options.map((o: any) => o.value);

			expect(operationValues).toContain('chatCompletion');
			expect(operationValues).toContain('codeGeneration');
			expect(operationValues).toContain('codeExplanation');
			expect(operationValues).toContain('codeReview');
			expect(operationValues).toContain('codeRefactor');
			expect(operationValues).toContain('fixCode');
			expect(operationValues).toContain('generateTests');
			expect(operationValues).toContain('documentation');
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
			expect(modelValues).toContain('o1-preview');
			expect(modelValues).toContain('o1-mini');
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
			expect(languageValues).toContain('java');
			expect(languageValues).toContain('csharp');
			expect(languageValues).toContain('go');
			expect(languageValues).toContain('rust');
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

		it('should have systemPrompt option', () => {
			const optionsProperty = node.description.properties.find(
				(p) => p.name === 'options'
			);
			const options = (optionsProperty as any).options;
			const systemPromptOption = options.find((o: any) => o.name === 'systemPrompt');

			expect(systemPromptOption).toBeDefined();
			expect(systemPromptOption.type).toBe('string');
		});
	});
});

describe('GitHubCodepilotApi Credentials', () => {
	let credentials: GitHubCodepilotApi;

	beforeEach(() => {
		credentials = new GitHubCodepilotApi();
	});

	it('should have correct credential name', () => {
		expect(credentials.name).toBe('gitHubCodepilotApi');
	});

	it('should have correct display name', () => {
		expect(credentials.displayName).toBe('GitHub Codepilot API');
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
