# Development Guide

## Project Structure

```
gitlab-mcp-server/
├── src/
│   ├── index.ts              # Main server implementation
│   ├── config.ts             # Configuration management
│   ├── types.ts              # TypeScript type definitions
│   └── tools/                # Modular tool organization
│       ├── index.ts          # Tool exports
│       ├── projects.ts       # Project-related tools
│       ├── issues.ts         # Issue-related tools
│       ├── merge-requests.ts # Merge request tools
│       ├── repository.ts     # Repository tools
│       ├── pipelines.ts      # Pipeline tools
│       ├── jobs.ts           # Job-related tools
│       └── user.ts           # User tools
├── dist/                     # Compiled JavaScript (generated)
├── docs/                     # Documentation files
├── examples/                 # Configuration examples
├── tests/                    # Test files
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
└── README.md                 # Main documentation
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- TypeScript 5.0+
- GitLab personal access token

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gitlab-mcp-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   export NPM_CONFIG_TOKEN="your-gitlab-token"
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

## Development Scripts

### Building

```bash
# Build TypeScript to JavaScript
npm run build

# Watch mode for development
npm run dev
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Linting and Formatting

```bash
# Run ESLint
npm run lint

# Fix linting issues
npm run lint:fix

# Run TypeScript type checking
npm run typecheck
```

### Local Testing

```bash
# Test server locally
npm start

# Test with specific config
npm start -- --config ./examples/gitlab-mcp.config.json

# Test configuration loading
node test-config.js
```

## Architecture

### Core Components

1. **GitLabMCPServer** (`src/index.ts`)
   - Main server class implementing the MCP protocol
   - Handles tool registration and request routing
   - Manages GitLab API communication

2. **ConfigManager** (`src/config.ts`)
   - Handles configuration file loading and merging
   - Supports multiple config file formats and locations
   - Environment variable override support

3. **Tool Modules** (`src/tools/`)
   - Modular organization of GitLab API tools
   - Each module handles related functionality
   - Centralized tool registration via `src/tools/index.ts`

4. **Type Definitions** (`src/types.ts`)
   - Comprehensive TypeScript types for all GitLab API objects
   - Parameter interfaces for all tools
   - Configuration interfaces

### Design Patterns

- **Modular Tool Organization**: Tools are organized by functionality (projects, issues, etc.)
- **Configuration Hierarchy**: Environment variables > config files > defaults
- **Type Safety**: Full TypeScript coverage with strict typing
- **Error Handling**: Comprehensive error handling and user-friendly messages

## Adding New Tools

### 1. Define Types

Add parameter and response types to `src/types.ts`:

```typescript
export interface NewToolParams {
  project_id: string;
  required_param: string;
  optional_param?: string;
}
```

### 2. Create Tool Definition

Add to appropriate tool module (e.g., `src/tools/projects.ts`):

```typescript
export const newTool: Tool = {
  name: 'new_tool',
  description: 'Description of what this tool does',
  inputSchema: {
    type: 'object',
    properties: {
      project_id: {
        type: 'string',
        description: 'Project ID or path'
      },
      required_param: {
        type: 'string',
        description: 'Required parameter description'
      },
      optional_param: {
        type: 'string',
        description: 'Optional parameter description'
      }
    },
    required: ['project_id', 'required_param']
  }
};
```

### 3. Implement Handler

Add method to `GitLabMCPServer` class in `src/index.ts`:

```typescript
private async newTool(args: NewToolParams) {
  // Implementation here
  const response = await this.axios.get(`/endpoint/${args.project_id}`);
  
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(response.data, null, 2),
      },
    ],
  };
}
```

### 4. Register Tool

Add case to switch statement in `setupToolHandlers()`:

```typescript
case 'new_tool':
  return await this.newTool(args as unknown as NewToolParams);
```

### 5. Export Tool

Add to `src/tools/index.ts`:

```typescript
export { newTool } from './projects.js';
```

## Testing

### Unit Tests

Create test files in `tests/` directory:

```typescript
import { describe, it, expect } from 'vitest';
import { GitLabMCPServer } from '../src/index.js';

describe('NewTool', () => {
  it('should handle valid parameters', async () => {
    // Test implementation
  });
});
```

### Integration Tests

Test with real GitLab API (use test token):

```bash
npm run test:integration
```

### Manual Testing

Use the test configuration script:

```bash
node test-config.js
```

## Code Style Guidelines

### TypeScript

- Use strict TypeScript configuration
- Prefer interfaces over types for object shapes
- Use explicit return types for public methods
- Avoid `any` type - use proper typing

### Naming Conventions

- Use camelCase for variables and functions
- Use PascalCase for classes and interfaces
- Use kebab-case for file names
- Use UPPER_CASE for constants

### Error Handling

- Always handle errors gracefully
- Return user-friendly error messages
- Use proper HTTP status code interpretation
- Log errors appropriately for debugging

## Contributing

### Pull Request Process

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow code style guidelines
   - Add tests for new functionality
   - Update documentation as needed

4. **Test your changes**
   ```bash
   npm run test
   npm run lint
   npm run typecheck
   ```

5. **Commit your changes**
   ```bash
   git commit -m "feat: add new feature description"
   ```

6. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Format

Use conventional commits format:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test additions or modifications
- `chore:` - Maintenance tasks

## Release Process

1. **Update version** in `package.json`
2. **Update CHANGELOG.md**
3. **Create release tag**
4. **Publish to npm**

```bash
npm version patch|minor|major
npm publish
git push --tags
```

## Debugging

### Enable Debug Logging

```bash
DEBUG=gitlab-mcp* npm start
```

### Configuration Debugging

```bash
npm start 2>&1 | grep "Loading config"
```

### API Debugging

Enable axios request/response logging for development.

## Support

For development questions:

1. Check existing issues and discussions
2. Review the GitLab API documentation
3. Check the MCP specification
4. Create a new issue with detailed information