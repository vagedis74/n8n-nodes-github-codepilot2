import { GitHubCodepilotApi } from '../credentials/GitHubCodepilotApi.credentials';

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

	it('should have authentication method property with pat and app options', () => {
		const authMethod = credentials.properties.find((p) => p.name === 'authMethod');
		expect(authMethod).toBeDefined();
		expect(authMethod!.type).toBe('options');

		const values = (authMethod as any).options.map((o: any) => o.value);
		expect(values).toContain('pat');
		expect(values).toContain('app');
	});

	it('should have accessToken as password field', () => {
		const prop = credentials.properties.find((p) => p.name === 'accessToken');
		expect(prop).toBeDefined();
		expect(prop!.type).toBe('string');
		expect((prop!.typeOptions as any)?.password).toBe(true);
	});

	it('should have GitHub App fields (appId, privateKey, installationId)', () => {
		for (const name of ['appId', 'privateKey', 'installationId']) {
			const prop = credentials.properties.find((p) => p.name === name);
			expect(prop).toBeDefined();
			expect((prop!.displayOptions as any)?.show?.authMethod).toEqual(['app']);
		}
	});

	it('should have baseUrl with default api.github.com', () => {
		const prop = credentials.properties.find((p) => p.name === 'baseUrl');
		expect(prop).toBeDefined();
		expect(prop!.default).toBe('https://api.github.com');
	});

	it('should have authenticate configuration with Bearer token', () => {
		expect(credentials.authenticate).toBeDefined();
		expect(credentials.authenticate.type).toBe('generic');
	});

	it('should test against /user endpoint', () => {
		expect(credentials.test).toBeDefined();
		expect(credentials.test.request.url).toBe('/user');
	});
});
