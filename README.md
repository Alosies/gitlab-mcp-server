# GitLab MCP Server

A fully typed TypeScript Model Context Protocol (MCP) server that provides comprehensive integration with GitLab's REST API. This server allows you to interact with GitLab projects, issues, merge requests, pipelines, jobs, and more through the MCP protocol with complete type safety.

## Features

- **Projects**: List projects, get project details
- **Issues**: List, get, and create issues
- **Merge Requests**: List, get, and create merge requests
- **Pipelines**: List, get, create, retry, cancel, and delete pipelines
- **Pipeline Jobs**: List jobs within pipelines
- **Pipeline Variables**: Get pipeline variables
- **Job Logs**: Get log files (traces) for specific jobs
- **Branches**: List repository branches
- **Commits**: Get project commit history
- **User**: Get current user information
- **TypeScript**: Fully typed with comprehensive type definitions
- **Developer Experience**: Complete IntelliSense and type safety

## Prerequisites

- Node.js 18+ and npm
- GitLab personal access token
- TypeScript 5.0+ (for development or type-checking)

## Installation

### Option 1: Install from npm (Recommended)

```bash
npm install -g @alosies/gitlab-mcp-server
```

### Option 2: Install from source

1. Clone or download this repository
2. Install dependencies:

```bash
npm install
```

3. Build the TypeScript code:

```bash
npm run build
```

4. Link globally (optional):

```bash
npm link
```

## Configuration

The server requires a GitLab personal access token to authenticate with the GitLab API. You need to set this token in the `NPM_CONFIG_TOKEN` environment variable.

### Creating a GitLab Personal Access Token

1. Go to GitLab.com (or your GitLab instance)
2. Navigate to **Settings** > **Access Tokens**
3. Create a new token with the following scopes:
   - `api` - Full API access
   - `read_user` - Read user information
   - `read_repository` - Read repository data

### Environment Setup

Set your GitLab token as an environment variable:

```bash
export NPM_CONFIG_TOKEN="your-gitlab-token-here"
```

Or create a `.env` file (not recommended for production):

```
NPM_CONFIG_TOKEN=your-gitlab-token-here
```

## Usage

### Running the Server

**If installed globally via npm:**

```bash
gitlab-mcp-server
```

**If installed from source:**

```bash
npm start
```

**For development with auto-rebuild:**

```bash
npm run dev
```

### Configuring with Claude Desktop

Add the following to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

**If installed globally via npm:**

```json
{
  "mcpServers": {
    "gitlab": {
      "command": "gitlab-mcp-server",
      "env": {
        "NPM_CONFIG_TOKEN": "your-gitlab-token-here"
      }
    }
  }
}
```

**If installed from source:**

```json
{
  "mcpServers": {
    "gitlab": {
      "command": "node",
      "args": ["/path/to/gitlab-mcp-server/dist/index.js"],
      "env": {
        "NPM_CONFIG_TOKEN": "your-gitlab-token-here"
      }
    }
  }
}
```

## Available Tools

### Project Management

- **`list_projects`**: List GitLab projects
  - Optional filters: search, visibility, owned, per_page

- **`get_project`**: Get detailed information about a specific project
  - Required: project_id (ID or path like "group/project")

### Issue Management

- **`list_issues`**: List issues in a project
  - Required: project_id
  - Optional filters: state, labels, assignee_id, author_id, search, per_page

- **`get_issue`**: Get detailed information about a specific issue
  - Required: project_id, issue_iid

- **`create_issue`**: Create a new issue
  - Required: project_id, title
  - Optional: description, labels, assignee_ids, milestone_id

### Merge Request Management

- **`list_merge_requests`**: List merge requests in a project
  - Required: project_id
  - Optional filters: state, target_branch, source_branch, assignee_id, author_id, search, per_page

- **`get_merge_request`**: Get detailed information about a specific merge request
  - Required: project_id, merge_request_iid

- **`create_merge_request`**: Create a new merge request
  - Required: project_id, title, source_branch, target_branch
  - Optional: description, assignee_ids, reviewer_ids, labels, milestone_id

### Repository Operations

- **`list_project_branches`**: List branches in a project
  - Required: project_id
  - Optional: search, per_page

- **`get_project_commits`**: Get commit history for a project
  - Required: project_id
  - Optional: ref_name, since, until, author, per_page

### Pipeline Management

- **`list_pipelines`**: List pipelines in a project
  - Required: project_id
  - Optional filters: status, ref, sha, yaml_errors, name, username, updated_after, updated_before, order_by, sort, per_page

- **`get_pipeline`**: Get detailed information about a specific pipeline
  - Required: project_id, pipeline_id

- **`create_pipeline`**: Create a new pipeline
  - Required: project_id, ref (branch or tag)
  - Optional: variables (array of key-value pairs)

- **`retry_pipeline`**: Retry a failed pipeline
  - Required: project_id, pipeline_id

- **`cancel_pipeline`**: Cancel a running pipeline
  - Required: project_id, pipeline_id

- **`delete_pipeline`**: Delete a pipeline
  - Required: project_id, pipeline_id

- **`list_pipeline_jobs`**: List jobs within a pipeline
  - Required: project_id, pipeline_id
  - Optional: scope (filter by job status), include_retried

- **`get_pipeline_variables`**: Get variables used in a pipeline
  - Required: project_id, pipeline_id

- **`get_job_logs`**: Get the log (trace) file of a specific job
  - Required: project_id, job_id

### User Information

- **`get_user`**: Get current authenticated user information

## Example Usage

Once configured with Claude Desktop, you can use natural language to interact with GitLab:

- "List my GitLab projects"
- "Show me open issues in project mygroup/myproject"
- "Create a new issue titled 'Bug fix needed' in project 123"
- "List merge requests for the main branch"
- "Get details of merge request #42 in myproject"
- "Show me all pipelines in project 123"
- "Get the status of pipeline #456 in myproject"
- "Create a new pipeline for the main branch"
- "Retry the failed pipeline #789"
- "Cancel the running pipeline #101"
- "Show me all jobs in pipeline #456"
- "Get the logs for job #789 in project myproject"

## TypeScript Usage

This package provides complete TypeScript support with comprehensive type definitions:

```typescript
// Import the server class and types
import { GitLabMCPServer } from '@alosies/gitlab-mcp-server';
import type {
  GitLabProject,
  GitLabIssue,
  GitLabJob,
  ListProjectsParams,
  GetJobLogsParams
} from '@alosies/gitlab-mcp-server/types';

// Use typed parameters
const projectParams: ListProjectsParams = {
  search: 'my-project',
  visibility: 'private',
  per_page: 10
};

const jobLogsParams: GetJobLogsParams = {
  project_id: '123',
  job_id: 456
};

// Type-safe functions
function processProject(project: GitLabProject): string {
  return `Project: ${project.name} (${project.visibility})`;
}

function processJob(job: GitLabJob): string {
  return `Job: ${job.name} - Status: ${job.status}`;
}
```

### Available Type Categories

- **API Objects**: `GitLabProject`, `GitLabIssue`, `GitLabMergeRequest`, `GitLabPipeline`, `GitLabJob`, etc.
- **Parameter Types**: `ListProjectsParams`, `CreateIssueParams`, `GetJobLogsParams`, etc.
- **Response Types**: `MCPResponse` for all tool responses
- **Server Interface**: `IGitLabMCPServer` for the main server class

## API Configuration

By default, the server connects to GitLab.com. To use with a self-hosted GitLab instance, modify the `baseUrl` in the `GitLabConfig` interface in `src/index.ts`:

```typescript
this.config = {
  baseUrl: 'https://your-gitlab-instance.com',  // Change this
  token: process.env.NPM_CONFIG_TOKEN || '',
};
```

## Error Handling

The server includes comprehensive error handling for:
- Missing authentication tokens
- Invalid project IDs or paths
- API rate limits
- Network errors
- Invalid parameters

Errors are returned in a user-friendly format through the MCP protocol.

## Development

### Project Structure

```
gitlab-mcp-server/
├── src/
│   └── index.ts          # Main server implementation
├── dist/                 # Compiled JavaScript (generated)
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

### Building

```bash
npm run build
```

### Development Mode

```bash
npm run dev
```

This will watch for changes and automatically rebuild the TypeScript code.

## License

MIT License

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For issues and questions:
1. Check the GitLab API documentation: https://docs.gitlab.com/ee/api/
2. Review the MCP specification: https://modelcontextprotocol.io/
3. Create an issue in this repository