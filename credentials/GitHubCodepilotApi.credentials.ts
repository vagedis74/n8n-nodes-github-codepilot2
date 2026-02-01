import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class GitHubCodepilotApi implements ICredentialType {
	name = 'gitHubCodepilotApi';
	displayName = 'GitHub Codepilot API';
	documentationUrl = 'https://docs.github.com/en/copilot';
	properties: INodeProperties[] = [
		{
			displayName: 'Authentication Method',
			name: 'authMethod',
			type: 'options',
			options: [
				{
					name: 'GitHub Token (Personal Access Token)',
					value: 'pat',
					description: 'Use a GitHub Personal Access Token with Copilot access',
				},
				{
					name: 'GitHub App',
					value: 'app',
					description: 'Use a GitHub App installation token',
				},
			],
			default: 'pat',
		},
		{
			displayName: 'GitHub Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			displayOptions: {
				show: { authMethod: ['pat'] },
			},
			description:
				'GitHub Personal Access Token with copilot scope. Generate at GitHub Settings > Developer settings > Personal access tokens.',
		},
		{
			displayName: 'App ID',
			name: 'appId',
			type: 'string',
			default: '',
			displayOptions: {
				show: { authMethod: ['app'] },
			},
			description: 'GitHub App ID',
		},
		{
			displayName: 'Private Key',
			name: 'privateKey',
			type: 'string',
			typeOptions: { password: true, rows: 5 },
			default: '',
			displayOptions: {
				show: { authMethod: ['app'] },
			},
			description: 'GitHub App private key (PEM format)',
		},
		{
			displayName: 'Installation ID',
			name: 'installationId',
			type: 'string',
			default: '',
			displayOptions: {
				show: { authMethod: ['app'] },
			},
			description: 'GitHub App installation ID',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.github.com',
			description: 'GitHub API base URL. Change for GitHub Enterprise.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.accessToken}}',
				Accept: 'application/vnd.github+json',
				'X-GitHub-Api-Version': '2022-11-28',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/user',
		},
	};
}
