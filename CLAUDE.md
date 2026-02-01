# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

n8n community node package (`n8n-nodes-github-codepilot2`) that integrates GitHub Copilot Chat, GitHub Models API, and MCP (Model Context Protocol) into n8n workflows. The node connects to the Azure Models inference endpoint (`https://models.inference.ai.azure.com/chat/completions`) using GitHub PAT or GitHub App authentication.

## Build & Development Commands

```bash
npm run build          # TypeScript compile + gulp icon copy to dist/
npm run dev            # TypeScript watch mode
npm test               # Run Jest test suite
npm run test:watch     # Jest in watch mode
npm run lint           # ESLint with auto-fix (nodes/ and credentials/)
npm run format         # Prettier (nodes/ and credentials/)
```

To run a single test file: `npx jest test/GitHubCodepilot.test.ts`

## Architecture

The package exports exactly two things from `index.ts`:

1. **Credential type** (`credentials/GitHubCodepilotApi.credentials.ts`) — Implements `ICredentialType` with two auth methods: Personal Access Token (default) and GitHub App (App ID + private key + installation ID). Credential test hits `/user` endpoint.

2. **Node type** (`nodes/GitHubCodepilot/GitHubCodepilot.node.ts`) — Implements `INodeType` with 6 resources, each containing multiple operations:
   - **Workflow Builder** — Generate/add/optimize/fix/explain n8n workflows
   - **Code Assistant** — Chat, generate code, review code, fix code
   - **MCP Client** — List tools, call tools, list resources from MCP servers
   - **MCP Server** — Register tools, expose workflows as MCP endpoints
   - **Plugin** — List and execute Copilot plugins
   - **Super SysAdmin** — Analyze IT support tickets (returns structured JSON with confidence/solution/reasoning)

The `execute()` method routes on `resource` + `operation`, constructs operation-specific system prompts, then calls `callCopilotApi()` which posts to the Azure Models chat completions endpoint. Workflow builder operations include regex-based JSON extraction from AI responses.

## n8n Node Conventions

- Node definition follows n8n community node v1 API (`n8nNodesApiVersion: 1`)
- The `n8n` field in `package.json` registers credential and node paths (must point to `dist/` compiled output)
- Uses `n8n-workflow` as a peer dependency — types like `INodeType`, `ICredentialType`, `IExecuteFunctions`, `NodeOperationError`
- ESLint uses `eslint-plugin-n8n-nodes-base` with the `community` preset for n8n-specific rules

## Code Style

- Tabs for indentation, semicolons, single quotes, trailing commas
- Print width: 120 characters
- `@typescript-eslint/no-explicit-any` is set to warn (not error)
- Unused variables with underscore prefix are allowed

## Testing

Tests (`test/GitHubCodepilot.test.ts`) validate node and credential metadata/schema — they check that all operations, parameters, models, and configuration options are correctly defined. They do not test API execution.
