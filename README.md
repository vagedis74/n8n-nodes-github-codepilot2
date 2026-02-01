# n8n-nodes-github-copilot

An n8n community node for AI-powered vibecoding with GitHub Copilot Chat.

This node integrates GitHub Copilot (via GitHub Models API) into your n8n workflows, enabling automated code generation, review, refactoring, and more.

## Features

- **Chat Completion** - Direct conversation with Copilot AI models
- **Code Generation** - Generate code from natural language descriptions
- **Code Explanation** - Get detailed explanations of code
- **Code Review** - Automated code review with suggestions
- **Code Refactor** - Improve code quality and structure
- **Fix Code** - Debug and fix issues in code
- **Generate Tests** - Create comprehensive unit tests
- **Documentation** - Auto-generate code documentation

## Supported Models

- GPT-4o (Recommended)
- GPT-4o Mini
- Claude 3.5 Sonnet
- o1-preview
- o1-mini

## Installation

### Community Nodes (Recommended)

1. Go to **Settings > Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-github-copilot`
4. Confirm the installation

### Manual Installation

```bash
cd ~/.n8n/nodes
npm install n8n-nodes-github-copilot
```

Then restart n8n.

## Authentication

This node requires a GitHub Personal Access Token (PAT) with appropriate permissions.

### Getting a GitHub Token

1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Generate a new token (classic) with the following scopes:
   - `read:user` - For basic authentication validation
   - For GitHub Copilot access, you need an active Copilot subscription
3. Copy the token and use it in the n8n credentials

### Alternative: GitHub Models API

For broader model access, you can use the [GitHub Models](https://github.com/marketplace/models) platform:

1. Visit [GitHub Models](https://github.com/marketplace/models)
2. Get access to the models you want to use
3. Use your GitHub PAT for authentication

## Usage Examples

### Code Generation

Generate a TypeScript function:

```
Operation: Code Generation
Language: TypeScript
Description: Create a function that validates email addresses using regex and returns an object with isValid and domain properties
```

### Code Review

Submit code for automated review:

```
Operation: Code Review
Code: [paste your code]
```

The node will return detailed feedback on code quality, potential bugs, security issues, and improvement suggestions.

### Generate Tests

Automatically create unit tests:

```
Operation: Generate Tests
Language: JavaScript
Test Framework: Jest
Code: [paste your code]
```

### Fix Code

Debug and fix issues:

```
Operation: Fix Code
Code: [paste buggy code]
Error Description: TypeError: Cannot read property 'length' of undefined
```

## Configuration Options

| Option | Description | Default |
|--------|-------------|---------|
| Temperature | Controls creativity (0-2) | 0.7 |
| Max Tokens | Maximum response length | 4096 |
| System Prompt | Custom AI behavior instructions | (operation-specific) |
| Output Format | Code only, with explanation, or full | Code with Explanation |

## Workflow Integration

### Example: Automated PR Code Review

1. **GitHub Trigger** - Listen for PR events
2. **GitHub** - Fetch PR diff/files
3. **GitHub Copilot** - Review code with "Code Review" operation
4. **GitHub** - Post review comments

### Example: Documentation Generator

1. **Read File** - Get source code files
2. **GitHub Copilot** - Generate documentation
3. **Write File** - Save documentation

### Example: Test Generation Pipeline

1. **Watch Folder** - Monitor for new code files
2. **Read File** - Get file contents
3. **GitHub Copilot** - Generate tests
4. **Write File** - Save test files
5. **Execute Command** - Run tests

## Error Handling

The node includes comprehensive error handling:

- Invalid credentials are caught during execution
- API rate limits are reported with clear messages
- Model-specific errors are passed through

Enable "Continue On Fail" to process multiple items even if some fail.

## Limitations

- Requires active GitHub account
- For Copilot-specific models, requires GitHub Copilot subscription
- Rate limits apply based on your GitHub plan
- Maximum context length varies by model

## Development

```bash
# Clone the repo
git clone https://github.com/vagedis74/n8n-nodes-github-codepilot2.git

# Install dependencies
npm install

# Build
npm run build

# Link for local development
npm link
cd ~/.n8n/nodes
npm link n8n-nodes-github-copilot
```

## Contributing

Contributions are welcome! Please open an issue or PR.

## License

MIT License - see [LICENSE](LICENSE) file.

## Credits

Conceived by Romuald Czlonkowski - [www.aiadvisors.pl/en](https://www.aiadvisors.pl/en)
