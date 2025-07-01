#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import axios, { AxiosInstance } from 'axios';

// Import all types
import type {
  GitLabConfig,
  MCPResponse,
  IGitLabMCPServer,
  ListProjectsParams,
  GetProjectParams,
  ListIssuesParams,
  GetIssueParams,
  CreateIssueParams,
  ListMergeRequestsParams,
  GetMergeRequestParams,
  CreateMergeRequestParams,
  ListProjectBranchesParams,
  GetProjectCommitsParams,
  ListPipelinesParams,
  GetPipelineParams,
  CreatePipelineParams,
  PipelineActionParams,
  ListPipelineJobsParams,
  GetPipelineVariablesParams,
  GetJobLogsParams,
  GetJobTraceParams,
} from './types.js';

class GitLabMCPServer implements IGitLabMCPServer {
  private server: Server;
  private axios: AxiosInstance;
  private config: GitLabConfig;

  constructor() {
    this.config = {
      baseUrl: 'https://gitlab.com',
      token: process.env.NPM_CONFIG_TOKEN || '',
    };

    if (!this.config.token) {
      throw new Error('GitLab token is required. Set NPM_CONFIG_TOKEN environment variable.');
    }

    this.axios = axios.create({
      baseURL: `${this.config.baseUrl}/api/v4`,
      headers: {
        'Authorization': `Bearer ${this.config.token}`,
        'Content-Type': 'application/json',
      },
    });

    this.server = new Server(
      {
        name: 'gitlab-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'list_projects',
            description: 'List GitLab projects accessible to the authenticated user',
            inputSchema: {
              type: 'object',
              properties: {
                search: {
                  type: 'string',
                  description: 'Search projects by name',
                },
                visibility: {
                  type: 'string',
                  enum: ['public', 'internal', 'private'],
                  description: 'Filter by visibility level',
                },
                owned: {
                  type: 'boolean',
                  description: 'Show only owned projects',
                },
                per_page: {
                  type: 'number',
                  description: 'Number of results per page (max 100)',
                  maximum: 100,
                  default: 20,
                },
              },
            },
          },
          {
            name: 'get_project',
            description: 'Get details of a specific project',
            inputSchema: {
              type: 'object',
              properties: {
                project_id: {
                  type: 'string',
                  description: 'Project ID or path (e.g., "1" or "group/project")',
                },
              },
              required: ['project_id'],
            },
          },
          {
            name: 'list_issues',
            description: 'List issues in a project',
            inputSchema: {
              type: 'object',
              properties: {
                project_id: {
                  type: 'string',
                  description: 'Project ID or path',
                },
                state: {
                  type: 'string',
                  enum: ['opened', 'closed', 'all'],
                  description: 'Filter by issue state',
                  default: 'opened',
                },
                labels: {
                  type: 'string',
                  description: 'Comma-separated list of labels',
                },
                assignee_id: {
                  type: 'number',
                  description: 'Filter by assignee user ID',
                },
                author_id: {
                  type: 'number',
                  description: 'Filter by author user ID',
                },
                search: {
                  type: 'string',
                  description: 'Search issues by title and description',
                },
                per_page: {
                  type: 'number',
                  description: 'Number of results per page (max 100)',
                  maximum: 100,
                  default: 20,
                },
              },
              required: ['project_id'],
            },
          },
          {
            name: 'get_issue',
            description: 'Get details of a specific issue',
            inputSchema: {
              type: 'object',
              properties: {
                project_id: {
                  type: 'string',
                  description: 'Project ID or path',
                },
                issue_iid: {
                  type: 'number',
                  description: 'Issue internal ID',
                },
              },
              required: ['project_id', 'issue_iid'],
            },
          },
          {
            name: 'create_issue',
            description: 'Create a new issue',
            inputSchema: {
              type: 'object',
              properties: {
                project_id: {
                  type: 'string',
                  description: 'Project ID or path',
                },
                title: {
                  type: 'string',
                  description: 'Issue title',
                },
                description: {
                  type: 'string',
                  description: 'Issue description',
                },
                labels: {
                  type: 'string',
                  description: 'Comma-separated list of labels',
                },
                assignee_ids: {
                  type: 'array',
                  items: { type: 'number' },
                  description: 'Array of user IDs to assign',
                },
                milestone_id: {
                  type: 'number',
                  description: 'Milestone ID',
                },
              },
              required: ['project_id', 'title'],
            },
          },
          {
            name: 'list_merge_requests',
            description: 'List merge requests in a project',
            inputSchema: {
              type: 'object',
              properties: {
                project_id: {
                  type: 'string',
                  description: 'Project ID or path',
                },
                state: {
                  type: 'string',
                  enum: ['opened', 'closed', 'merged', 'all'],
                  description: 'Filter by merge request state',
                  default: 'opened',
                },
                target_branch: {
                  type: 'string',
                  description: 'Filter by target branch',
                },
                source_branch: {
                  type: 'string',
                  description: 'Filter by source branch',
                },
                assignee_id: {
                  type: 'number',
                  description: 'Filter by assignee user ID',
                },
                author_id: {
                  type: 'number',
                  description: 'Filter by author user ID',
                },
                search: {
                  type: 'string',
                  description: 'Search merge requests by title and description',
                },
                per_page: {
                  type: 'number',
                  description: 'Number of results per page (max 100)',
                  maximum: 100,
                  default: 20,
                },
              },
              required: ['project_id'],
            },
          },
          {
            name: 'get_merge_request',
            description: 'Get details of a specific merge request',
            inputSchema: {
              type: 'object',
              properties: {
                project_id: {
                  type: 'string',
                  description: 'Project ID or path',
                },
                merge_request_iid: {
                  type: 'number',
                  description: 'Merge request internal ID',
                },
              },
              required: ['project_id', 'merge_request_iid'],
            },
          },
          {
            name: 'create_merge_request',
            description: 'Create a new merge request',
            inputSchema: {
              type: 'object',
              properties: {
                project_id: {
                  type: 'string',
                  description: 'Project ID or path',
                },
                title: {
                  type: 'string',
                  description: 'Merge request title',
                },
                source_branch: {
                  type: 'string',
                  description: 'Source branch name',
                },
                target_branch: {
                  type: 'string',
                  description: 'Target branch name',
                },
                description: {
                  type: 'string',
                  description: 'Merge request description',
                },
                assignee_ids: {
                  type: 'array',
                  items: { type: 'number' },
                  description: 'Array of user IDs to assign',
                },
                reviewer_ids: {
                  type: 'array',
                  items: { type: 'number' },
                  description: 'Array of user IDs to review',
                },
                labels: {
                  type: 'string',
                  description: 'Comma-separated list of labels',
                },
                milestone_id: {
                  type: 'number',
                  description: 'Milestone ID',
                },
              },
              required: ['project_id', 'title', 'source_branch', 'target_branch'],
            },
          },
          {
            name: 'get_user',
            description: 'Get current user information',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'list_project_branches',
            description: 'List branches in a project',
            inputSchema: {
              type: 'object',
              properties: {
                project_id: {
                  type: 'string',
                  description: 'Project ID or path',
                },
                search: {
                  type: 'string',
                  description: 'Search branches by name',
                },
                per_page: {
                  type: 'number',
                  description: 'Number of results per page (max 100)',
                  maximum: 100,
                  default: 20,
                },
              },
              required: ['project_id'],
            },
          },
          {
            name: 'get_project_commits',
            description: 'List commits in a project',
            inputSchema: {
              type: 'object',
              properties: {
                project_id: {
                  type: 'string',
                  description: 'Project ID or path',
                },
                ref_name: {
                  type: 'string',
                  description: 'Branch, tag, or commit SHA',
                  default: 'main',
                },
                since: {
                  type: 'string',
                  description: 'ISO 8601 date format (YYYY-MM-DDTHH:MM:SSZ)',
                },
                until: {
                  type: 'string',
                  description: 'ISO 8601 date format (YYYY-MM-DDTHH:MM:SSZ)',
                },
                author: {
                  type: 'string',
                  description: 'Filter by author name',
                },
                per_page: {
                  type: 'number',
                  description: 'Number of results per page (max 100)',
                  maximum: 100,
                  default: 20,
                },
              },
              required: ['project_id'],
            },
          },
          {
            name: 'list_pipelines',
            description: 'List pipelines in a project',
            inputSchema: {
              type: 'object',
              properties: {
                project_id: {
                  type: 'string',
                  description: 'Project ID or path',
                },
                status: {
                  type: 'string',
                  enum: ['created', 'waiting_for_resource', 'preparing', 'pending', 'running', 'success', 'failed', 'canceled', 'skipped', 'manual', 'scheduled'],
                  description: 'Filter by pipeline status',
                },
                ref: {
                  type: 'string',
                  description: 'Filter by branch or tag name',
                },
                sha: {
                  type: 'string',
                  description: 'Filter by commit SHA',
                },
                yaml_errors: {
                  type: 'boolean',
                  description: 'Filter pipelines with YAML errors',
                },
                name: {
                  type: 'string',
                  description: 'Filter by pipeline name',
                },
                username: {
                  type: 'string',
                  description: 'Filter by username of the user who triggered the pipeline',
                },
                updated_after: {
                  type: 'string',
                  description: 'Filter pipelines updated after this date (ISO 8601 format)',
                },
                updated_before: {
                  type: 'string',
                  description: 'Filter pipelines updated before this date (ISO 8601 format)',
                },
                order_by: {
                  type: 'string',
                  enum: ['id', 'status', 'ref', 'updated_at', 'user_id'],
                  description: 'Order pipelines by field',
                  default: 'id',
                },
                sort: {
                  type: 'string',
                  enum: ['asc', 'desc'],
                  description: 'Sort order',
                  default: 'desc',
                },
                per_page: {
                  type: 'number',
                  description: 'Number of results per page (max 100)',
                  maximum: 100,
                  default: 20,
                },
              },
              required: ['project_id'],
            },
          },
          {
            name: 'get_pipeline',
            description: 'Get details of a specific pipeline',
            inputSchema: {
              type: 'object',
              properties: {
                project_id: {
                  type: 'string',
                  description: 'Project ID or path',
                },
                pipeline_id: {
                  type: 'number',
                  description: 'Pipeline ID',
                },
              },
              required: ['project_id', 'pipeline_id'],
            },
          },
          {
            name: 'create_pipeline',
            description: 'Create a new pipeline',
            inputSchema: {
              type: 'object',
              properties: {
                project_id: {
                  type: 'string',
                  description: 'Project ID or path',
                },
                ref: {
                  type: 'string',
                  description: 'Branch or tag name',
                },
                variables: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      key: { type: 'string' },
                      value: { type: 'string' },
                      variable_type: {
                        type: 'string',
                        enum: ['env_var', 'file'],
                        default: 'env_var',
                      },
                    },
                    required: ['key', 'value'],
                  },
                  description: 'Pipeline variables',
                },
              },
              required: ['project_id', 'ref'],
            },
          },
          {
            name: 'retry_pipeline',
            description: 'Retry a failed pipeline',
            inputSchema: {
              type: 'object',
              properties: {
                project_id: {
                  type: 'string',
                  description: 'Project ID or path',
                },
                pipeline_id: {
                  type: 'number',
                  description: 'Pipeline ID',
                },
              },
              required: ['project_id', 'pipeline_id'],
            },
          },
          {
            name: 'cancel_pipeline',
            description: 'Cancel a running pipeline',
            inputSchema: {
              type: 'object',
              properties: {
                project_id: {
                  type: 'string',
                  description: 'Project ID or path',
                },
                pipeline_id: {
                  type: 'number',
                  description: 'Pipeline ID',
                },
              },
              required: ['project_id', 'pipeline_id'],
            },
          },
          {
            name: 'delete_pipeline',
            description: 'Delete a pipeline',
            inputSchema: {
              type: 'object',
              properties: {
                project_id: {
                  type: 'string',
                  description: 'Project ID or path',
                },
                pipeline_id: {
                  type: 'number',
                  description: 'Pipeline ID',
                },
              },
              required: ['project_id', 'pipeline_id'],
            },
          },
          {
            name: 'list_pipeline_jobs',
            description: 'List jobs in a pipeline',
            inputSchema: {
              type: 'object',
              properties: {
                project_id: {
                  type: 'string',
                  description: 'Project ID or path',
                },
                pipeline_id: {
                  type: 'number',
                  description: 'Pipeline ID',
                },
                scope: {
                  type: 'array',
                  items: {
                    type: 'string',
                    enum: ['created', 'pending', 'running', 'failed', 'success', 'canceled', 'skipped', 'waiting_for_resource', 'manual'],
                  },
                  description: 'Filter jobs by status',
                },
                include_retried: {
                  type: 'boolean',
                  description: 'Include retried jobs',
                  default: false,
                },
              },
              required: ['project_id', 'pipeline_id'],
            },
          },
          {
            name: 'get_pipeline_variables',
            description: 'Get variables of a pipeline',
            inputSchema: {
              type: 'object',
              properties: {
                project_id: {
                  type: 'string',
                  description: 'Project ID or path',
                },
                pipeline_id: {
                  type: 'number',
                  description: 'Pipeline ID',
                },
              },
              required: ['project_id', 'pipeline_id'],
            },
          },
          {
            name: 'get_job_logs',
            description: 'Get the log (trace) file of a specific job',
            inputSchema: {
              type: 'object',
              properties: {
                project_id: {
                  type: 'string',
                  description: 'Project ID or path',
                },
                job_id: {
                  type: 'number',
                  description: 'Job ID',
                },
              },
              required: ['project_id', 'job_id'],
            },
          },
          {
            name: 'get_job_trace',
            description: 'Get job trace with options for partial logs, tail mode, and line limits',
            inputSchema: {
              type: 'object',
              properties: {
                project_id: {
                  type: 'string',
                  description: 'Project ID or path',
                },
                job_id: {
                  type: 'number',
                  description: 'Job ID',
                },
                lines_limit: {
                  type: 'number',
                  description: 'Maximum number of lines to return (default: 1000)',
                  default: 1000,
                },
                tail: {
                  type: 'boolean',
                  description: 'Get the last N lines instead of first N lines',
                  default: false,
                },
                raw: {
                  type: 'boolean',
                  description: 'Return raw log without formatting',
                  default: false,
                },
              },
              required: ['project_id', 'job_id'],
            },
          },
        ] as Tool[],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'list_projects':
            return await this.listProjects(args as unknown as ListProjectsParams);
          case 'get_project':
            return await this.getProject(args as unknown as GetProjectParams);
          case 'list_issues':
            return await this.listIssues(args as unknown as ListIssuesParams);
          case 'get_issue':
            return await this.getIssue(args as unknown as GetIssueParams);
          case 'create_issue':
            return await this.createIssue(args as unknown as CreateIssueParams);
          case 'list_merge_requests':
            return await this.listMergeRequests(args as unknown as ListMergeRequestsParams);
          case 'get_merge_request':
            return await this.getMergeRequest(args as unknown as GetMergeRequestParams);
          case 'create_merge_request':
            return await this.createMergeRequest(args as unknown as CreateMergeRequestParams);
          case 'get_user':
            return await this.getUser(args as unknown as Record<string, never>);
          case 'list_project_branches':
            return await this.listProjectBranches(args as unknown as ListProjectBranchesParams);
          case 'get_project_commits':
            return await this.getProjectCommits(args as unknown as GetProjectCommitsParams);
          case 'list_pipelines':
            return await this.listPipelines(args as unknown as ListPipelinesParams);
          case 'get_pipeline':
            return await this.getPipeline(args as unknown as GetPipelineParams);
          case 'create_pipeline':
            return await this.createPipeline(args as unknown as CreatePipelineParams);
          case 'retry_pipeline':
            return await this.retryPipeline(args as unknown as PipelineActionParams);
          case 'cancel_pipeline':
            return await this.cancelPipeline(args as unknown as PipelineActionParams);
          case 'delete_pipeline':
            return await this.deletePipeline(args as unknown as PipelineActionParams);
          case 'list_pipeline_jobs':
            return await this.listPipelineJobs(args as unknown as ListPipelineJobsParams);
          case 'get_pipeline_variables':
            return await this.getPipelineVariables(args as unknown as GetPipelineVariablesParams);
          case 'get_job_logs':
            return await this.getJobLogs(args as unknown as GetJobLogsParams);
          case 'get_job_trace':
            return await this.getJobTrace(args as unknown as GetJobTraceParams);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  private async listProjects(args: ListProjectsParams): Promise<MCPResponse> {
    const params = new URLSearchParams();
    
    if (args.search) params.append('search', args.search);
    if (args.visibility) params.append('visibility', args.visibility);
    if (args.owned) params.append('owned', 'true');
    params.append('per_page', String(args.per_page || 20));

    const response = await this.axios.get(`/projects?${params.toString()}`);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  }

  private async getProject(args: GetProjectParams): Promise<MCPResponse> {
    const response = await this.axios.get(`/projects/${encodeURIComponent(args.project_id)}`);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  }

  private async listIssues(args: ListIssuesParams): Promise<MCPResponse> {
    const params = new URLSearchParams();
    
    if (args.state) params.append('state', args.state);
    if (args.labels) params.append('labels', args.labels);
    if (args.assignee_id) params.append('assignee_id', String(args.assignee_id));
    if (args.author_id) params.append('author_id', String(args.author_id));
    if (args.search) params.append('search', args.search);
    params.append('per_page', String(args.per_page || 20));

    const response = await this.axios.get(`/projects/${encodeURIComponent(args.project_id)}/issues?${params.toString()}`);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  }

  private async getIssue(args: any) {
    const response = await this.axios.get(`/projects/${encodeURIComponent(args.project_id)}/issues/${args.issue_iid}`);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  }

  private async createIssue(args: CreateIssueParams): Promise<MCPResponse> {
    const data: any = {
      title: args.title,
    };

    if (args.description) data.description = args.description;
    if (args.labels) data.labels = args.labels;
    if (args.assignee_ids) data.assignee_ids = args.assignee_ids;
    if (args.milestone_id) data.milestone_id = args.milestone_id;

    const response = await this.axios.post(`/projects/${encodeURIComponent(args.project_id)}/issues`, data);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  }

  private async listMergeRequests(args: any) {
    const params = new URLSearchParams();
    
    if (args.state) params.append('state', args.state);
    if (args.target_branch) params.append('target_branch', args.target_branch);
    if (args.source_branch) params.append('source_branch', args.source_branch);
    if (args.assignee_id) params.append('assignee_id', String(args.assignee_id));
    if (args.author_id) params.append('author_id', String(args.author_id));
    if (args.search) params.append('search', args.search);
    params.append('per_page', String(args.per_page || 20));

    const response = await this.axios.get(`/projects/${encodeURIComponent(args.project_id)}/merge_requests?${params.toString()}`);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  }

  private async getMergeRequest(args: any) {
    const response = await this.axios.get(`/projects/${encodeURIComponent(args.project_id)}/merge_requests/${args.merge_request_iid}`);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  }

  private async createMergeRequest(args: any) {
    const data: any = {
      title: args.title,
      source_branch: args.source_branch,
      target_branch: args.target_branch,
    };

    if (args.description) data.description = args.description;
    if (args.assignee_ids) data.assignee_ids = args.assignee_ids;
    if (args.reviewer_ids) data.reviewer_ids = args.reviewer_ids;
    if (args.labels) data.labels = args.labels;
    if (args.milestone_id) data.milestone_id = args.milestone_id;

    const response = await this.axios.post(`/projects/${encodeURIComponent(args.project_id)}/merge_requests`, data);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  }

  private async getUser(args: Record<string, never>): Promise<MCPResponse> {
    const response = await this.axios.get('/user');
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  }

  private async listProjectBranches(args: any) {
    const params = new URLSearchParams();
    
    if (args.search) params.append('search', args.search);
    params.append('per_page', String(args.per_page || 20));

    const response = await this.axios.get(`/projects/${encodeURIComponent(args.project_id)}/repository/branches?${params.toString()}`);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  }

  private async getProjectCommits(args: any) {
    const params = new URLSearchParams();
    
    if (args.ref_name) params.append('ref_name', args.ref_name);
    if (args.since) params.append('since', args.since);
    if (args.until) params.append('until', args.until);
    if (args.author) params.append('author', args.author);
    params.append('per_page', String(args.per_page || 20));

    const response = await this.axios.get(`/projects/${encodeURIComponent(args.project_id)}/repository/commits?${params.toString()}`);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  }

  private async listPipelines(args: ListPipelinesParams): Promise<MCPResponse> {
    const params = new URLSearchParams();
    
    if (args.status) params.append('status', args.status);
    if (args.ref) params.append('ref', args.ref);
    if (args.sha) params.append('sha', args.sha);
    if (args.yaml_errors !== undefined) params.append('yaml_errors', String(args.yaml_errors));
    if (args.name) params.append('name', args.name);
    if (args.username) params.append('username', args.username);
    if (args.updated_after) params.append('updated_after', args.updated_after);
    if (args.updated_before) params.append('updated_before', args.updated_before);
    if (args.order_by) params.append('order_by', args.order_by);
    if (args.sort) params.append('sort', args.sort);
    params.append('per_page', String(args.per_page || 20));

    const response = await this.axios.get(`/projects/${encodeURIComponent(args.project_id)}/pipelines?${params.toString()}`);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  }

  private async getPipeline(args: any) {
    const response = await this.axios.get(`/projects/${encodeURIComponent(args.project_id)}/pipelines/${args.pipeline_id}`);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  }

  private async createPipeline(args: any) {
    const data: any = {
      ref: args.ref,
    };

    if (args.variables && args.variables.length > 0) {
      data.variables = args.variables;
    }

    const response = await this.axios.post(`/projects/${encodeURIComponent(args.project_id)}/pipeline`, data);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  }

  private async retryPipeline(args: any) {
    const response = await this.axios.post(`/projects/${encodeURIComponent(args.project_id)}/pipelines/${args.pipeline_id}/retry`);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  }

  private async cancelPipeline(args: any) {
    const response = await this.axios.post(`/projects/${encodeURIComponent(args.project_id)}/pipelines/${args.pipeline_id}/cancel`);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  }

  private async deletePipeline(args: any) {
    const response = await this.axios.delete(`/projects/${encodeURIComponent(args.project_id)}/pipelines/${args.pipeline_id}`);
    
    return {
      content: [
        {
          type: 'text',
          text: response.status === 204 ? 'Pipeline deleted successfully' : JSON.stringify(response.data, null, 2),
        },
      ],
    };
  }

  private async listPipelineJobs(args: any) {
    const params = new URLSearchParams();
    
    if (args.scope && args.scope.length > 0) {
      args.scope.forEach((status: string) => params.append('scope[]', status));
    }
    if (args.include_retried !== undefined) params.append('include_retried', String(args.include_retried));

    const response = await this.axios.get(`/projects/${encodeURIComponent(args.project_id)}/pipelines/${args.pipeline_id}/jobs?${params.toString()}`);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  }

  private async getPipelineVariables(args: any) {
    const response = await this.axios.get(`/projects/${encodeURIComponent(args.project_id)}/pipelines/${args.pipeline_id}/variables`);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  }

  private async getJobLogs(args: GetJobLogsParams): Promise<MCPResponse> {
    const response = await this.axios.get(`/projects/${encodeURIComponent(args.project_id)}/jobs/${args.job_id}/trace`);
    
    return {
      content: [
        {
          type: 'text',
          text: response.data,
        },
      ],
    };
  }

  private async getJobTrace(args: GetJobTraceParams): Promise<MCPResponse> {
    try {
      const response = await this.axios.get(`/projects/${encodeURIComponent(args.project_id)}/jobs/${args.job_id}/trace`);
      
      let logContent = response.data;
      const linesLimit = args.lines_limit || 1000;
      
      if (typeof logContent === 'string' && logContent) {
        const lines = logContent.split('\n');
        const totalLines = lines.length;
        
        // Apply line limiting
        let processedLines: string[];
        
        if (args.tail) {
          // Get last N lines
          processedLines = lines.slice(-linesLimit);
        } else {
          // Get first N lines
          processedLines = lines.slice(0, linesLimit);
        }
        
        const processedContent = processedLines.join('\n');
        
        // Prepare response with metadata
        let responseText: string;
        
        if (args.raw) {
          responseText = processedContent;
        } else {
          const metadata = [
            `📋 Job Trace Summary`,
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
            `📊 Total lines: ${totalLines}`,
            `📄 Showing: ${processedLines.length} lines ${args.tail ? '(last)' : '(first)'}`,
            `🔗 Project: ${args.project_id}`,
            `🚀 Job ID: ${args.job_id}`,
            ``,
            `📝 Log Content:`,
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
            processedContent
          ];
          
          if (totalLines > linesLimit) {
            metadata.push('', `⚠️  Log truncated. Total lines: ${totalLines}, Showing: ${processedLines.length}`);
            if (args.tail) {
              metadata.push(`💡 Use tail:false to see the beginning of the log`);
            } else {
              metadata.push(`💡 Use tail:true to see the end of the log`);
            }
          }
          
          responseText = metadata.join('\n');
        }
        
        return {
          content: [
            {
              type: 'text',
              text: responseText,
            },
          ],
        };
      } else {
        return {
          content: [
            {
              type: 'text',
              text: `No log content available for job ${args.job_id} in project ${args.project_id}`,
            },
          ],
        };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to retrieve job trace: ${errorMessage}`,
          },
        ],
        isError: true,
      };
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('GitLab MCP server running on stdio');
  }
}

// Export the server class and types for library usage
export { GitLabMCPServer };
export type * from './types.js';

// CLI execution
const server = new GitLabMCPServer();
server.run().catch(console.error);