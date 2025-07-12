# TypeScript Usage

This package provides complete TypeScript support with comprehensive type definitions.

## Import Types and Classes

```typescript
// Import the server class and types
import { GitLabMCPServer } from '@alosies/gitlab-mcp-server';
import type {
  GitLabProject,
  GitLabIssue,
  GitLabJob,
  ListProjectsParams,
  GetJobLogsParams,
  GetJobTraceParams
} from '@alosies/gitlab-mcp-server/types';
```

## Type-Safe Parameters

```typescript
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

const jobTraceParams: GetJobTraceParams = {
  project_id: '123',
  job_id: 456,
  lines_limit: 500,
  tail: true,
  raw: false
};
```

## Type-Safe Functions

```typescript
// Type-safe functions
function processProject(project: GitLabProject): string {
  return `Project: ${project.name} (${project.visibility})`;
}

function processJob(job: GitLabJob): string {
  return `Job: ${job.name} - Status: ${job.status}`;
}
```

## Available Type Categories

### API Objects
- `GitLabProject` - Project data structure
- `GitLabIssue` - Issue data structure  
- `GitLabMergeRequest` - Merge request data structure
- `GitLabPipeline` - Pipeline data structure
- `GitLabJob` - Job data structure
- `GitLabUser` - User data structure
- `GitLabBranch` - Branch data structure
- `GitLabCommit` - Commit data structure

### Parameter Types
- `ListProjectsParams` - Parameters for listing projects
- `GetProjectParams` - Parameters for getting project details
- `ListIssuesParams` - Parameters for listing issues
- `CreateIssueParams` - Parameters for creating issues
- `ListMergeRequestsParams` - Parameters for listing merge requests
- `CreateMergeRequestParams` - Parameters for creating merge requests
- `UpdateMergeRequestParams` - Parameters for updating merge requests
- `ListPipelinesParams` - Parameters for listing pipelines
- `CreatePipelineParams` - Parameters for creating pipelines
- `GetJobLogsParams` - Parameters for getting job logs
- `GetJobTraceParams` - Parameters for getting job traces with advanced options

### Response Types
- `MCPResponse` - Standard response format for all tool responses

### Server Interface
- `IGitLabMCPServer` - Interface for the main server class
- `GitLabConfig` - Configuration interface for GitLab connection
- `GitLabMCPConfig` - Complete MCP server configuration interface

## Configuration Types

```typescript
import type { GitLabMCPConfig } from '@alosies/gitlab-mcp-server';

const config: GitLabMCPConfig = {
  gitlab: {
    baseUrl: 'https://gitlab.com',
    token: 'your-token',
    defaultProject: 'myorg/myproject'
  },
  server: {
    name: 'gitlab-mcp-server',
    version: '1.0.0',
    timeout: 30000
  },
  defaults: {
    perPage: 50,
    projectScope: 'owned'
  },
  features: {
    enableCaching: false,
    enableMetrics: true,
    strictScoping: true
  }
};
```

## Server Usage

```typescript
import { GitLabMCPServer } from '@alosies/gitlab-mcp-server';

// Create server instance with optional config
const server = new GitLabMCPServer('./config.json');

// Run the server
await server.run();
```

## Type Checking

All types are fully compatible with TypeScript's strict mode and provide:

- **Compile-time validation** of parameter structures
- **IntelliSense support** in supported editors
- **Type inference** for function returns
- **Null safety** with optional properties clearly marked
- **Enum validation** for status values and scopes