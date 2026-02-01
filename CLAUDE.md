# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

n8n community node package (`n8n-nodes-github-codepilot`) that integrates GitHub Copilot Chat, GitHub Models API, and MCP (Model Context Protocol) into n8n workflows. The node connects to the Azure Models inference endpoint (`https://models.inference.ai.azure.com/chat/completions`) using GitHub PAT or GitHub App authentication.

## Build & Development Commands

```bash
npm run build          # TypeScript compile + gulp icon copy to dist/
npm run dev            # TypeScript watch mode
npm test               # Run Jest test suite
npm run test:watch     # Jest in watch mode
npm run lint           # ESLint with auto-fix (nodes/ and credentials/)
npm run format         # Prettier (nodes/ and credentials/)
```

To run a single test file: `npx jest test/node.test.ts`

## Architecture

The package exports two things from `index.ts`:

1. **Credential type** (`credentials/GitHubCodepilotApi.credentials.ts`) — `ICredentialType` with PAT (default) and GitHub App auth. Credential test hits `/user`.

2. **Node type** (`nodes/GitHubCodepilot/GitHubCodepilot.node.ts`) — Thin router (~100 lines) that:
   - Assembles resource descriptions from 7 resource modules
   - Routes `execute()` by resource to the appropriate handler

### File Structure

```
nodes/GitHubCodepilot/
├── GitHubCodepilot.node.ts    # Main node class (router only)
├── github-codepilot.svg       # Icon
├── types.ts                   # Resource/Operation enums, ResourceExecuteFn type
├── constants.ts               # COPILOT_API_ENDPOINT, MODELS, SYSTEM_PROMPTS
├── utils.ts                   # callCopilotApi(), extractJson(), mcpJsonRpcRequest()
└── resources/
    ├── WorkflowBuilder.ts     # 5 ops: generate, add node, optimize, fix, explain
    ├── CodeAssistant.ts       # 4 ops: chat, generate, review, fix code
    ├── McpClient.ts           # 3 ops: list tools, call tool, list resources
    ├── McpServer.ts           # 2 ops: register tool, expose workflow (stub)
    ├── Plugin.ts              # 2 ops: list plugins, execute plugin (stub)
    ├── SuperSysAdmin.ts       # 1 op: analyze ticket
    └── PromptReviewer.ts      # 1 op: review prompts
```

Each resource file exports:
- `description: INodeProperties[]` — operation selector + parameter fields
- `execute(context, i, options, model): Promise<IDataObject>` — operation handler

### Key Design Decisions

- **One file per resource** (not per operation): 18 operations across 7 files keeps each file manageable (~80-150 lines).
- **Shared utilities in utils.ts**: `callCopilotApi()`, `extractJson()`, `mcpJsonRpcRequest()` avoid duplication.
- **System prompts in constants.ts**: Not buried in execute logic.
- **Type-safe enums in types.ts**: No magic strings for resources/operations.
- **The API endpoint** (`models.inference.ai.azure.com`) is in `constants.ts`, separate from the credential's `baseUrl` (defaults to `api.github.com`).

## n8n Node Conventions

- Node definition follows n8n community node v1 API (`n8nNodesApiVersion: 1`)
- The `n8n` field in `package.json` registers credential and node paths (must point to `dist/`)
- Uses `n8n-workflow` as a peer dependency
- ESLint uses `eslint-plugin-n8n-nodes-base` with the `community` preset
- Build runs `tsc` then `gulp build:icons` (copies SVGs to `dist/`)

## Code Style

- Tabs for indentation, semicolons, single quotes, trailing commas
- Print width: 120 characters
- `@typescript-eslint/no-explicit-any` is warn (not error)
- Unused variables with underscore prefix are allowed

## Testing

Tests in `test/` validate:
- `node.test.ts` — Node metadata, all 7 resources, all 18 operations, prompt reviewer fields
- `credentials.test.ts` — Credential schema, auth methods, test endpoint
- `utils.test.ts` — `extractJson()` with various inputs (direct JSON, embedded, arrays, edge cases)

Tests do not make API calls.

## Known Limitations

- **mcpServer and plugin resources are stubs** — Return hardcoded/mock data
- **JSON extraction** uses regex with fallback — improved over old code but still regex-based
