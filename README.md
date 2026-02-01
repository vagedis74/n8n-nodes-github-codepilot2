# n8n-nodes-github-codepilot

An n8n community node for AI-powered workflow building, code assistance, and MCP integration with GitHub Copilot.

This node connects to the GitHub Models API (Azure inference endpoint) using GitHub PAT or GitHub App authentication.

## Resources & Operations

| Resource | Operations |
|----------|-----------|
| **Workflow Builder** | Generate Workflow, Add Node, Optimize, Fix, Explain |
| **Code Assistant** | Chat, Generate Code, Review Code, Fix Code |
| **MCP Client** | List Tools, Call Tool, List Resources |
| **MCP Server** | Register Tool, Expose Workflow *(stub)* |
| **Plugin** | List Plugins, Execute Plugin *(stub)* |
| **Super SysAdmin** | Analyze Ticket |
| **Prompt Reviewer** | Review Prompts |

## Supported Models

- GPT-4o (default)
- GPT-4o Mini
- Claude 3.5 Sonnet

## Installation

### Community Nodes

1. Go to **Settings > Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-github-codepilot`
4. Confirm the installation

### Manual / Development

```bash
git clone https://github.com/vagedis74/n8n-nodes-github-codepilot2.git
cd n8n-nodes-github-codepilot
npm install
npm run build
npm link
cd ~/.n8n/nodes
npm link n8n-nodes-github-codepilot
```

Then restart n8n.

## Authentication

Requires a GitHub Personal Access Token (PAT) with Copilot access, or a GitHub App installation token.

1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Generate a token with `read:user` scope and an active Copilot subscription
3. Add the token in n8n credentials as **GitHub Codepilot API**

## Development

```bash
npm run build          # TypeScript compile + gulp icon copy
npm run dev            # TypeScript watch mode
npm test               # Run Jest tests
npm run lint           # ESLint with auto-fix
npm run format         # Prettier
```

## License

MIT License - see [LICENSE](LICENSE) file.

## Credits

Conceived by Romuald Czlonkowski - [www.aiadvisors.pl/en](https://www.aiadvisors.pl/en)
