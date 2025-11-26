import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// Import all tools
import { allTools } from './tools/index.js';

// Import client and handlers
import { GitLabClient } from './client.js';
import {
  ProjectHandlers,
  IssueHandlers,
  MergeRequestHandlers,
  RepositoryHandlers,
  PipelineHandlers,
  JobHandlers,
  UserHandlers,
} from './handlers/index.js';

// Import configuration
import { ConfigManager } from './config.js';

// Import all types
import type {
  GitLabConfig,
  IGitLabMCPServer,
  ListProjectsParams,
  GetProjectParams,
  ListIssuesParams,
  GetIssueParams,
  CreateIssueParams,
  ListMergeRequestsParams,
  GetMergeRequestParams,
  CreateMergeRequestParams,
  UpdateMergeRequestParams,
  ListMRNotesParams,
  ListMRDiscussionsParams,
  CreateMRNoteParams,
  CreateMRDiscussionParams,
  ReplyToMRDiscussionParams,
  ResolveMRDiscussionParams,
  MarkMRAsDraftParams,
  MarkMRAsReadyParams,
  ListMRTemplatesParams,
  GetMRTemplateParams,
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

export class GitLabMCPServer implements IGitLabMCPServer {
  private server: Server;
  private client: GitLabClient;
  private config: GitLabConfig;
  private configManager: ConfigManager;

  // Handler instances
  private projectHandlers: ProjectHandlers;
  private issueHandlers: IssueHandlers;
  private mergeRequestHandlers: MergeRequestHandlers;
  private repositoryHandlers: RepositoryHandlers;
  private pipelineHandlers: PipelineHandlers;
  private jobHandlers: JobHandlers;
  private userHandlers: UserHandlers;

  constructor(configPath?: string) {
    // Load configuration (optional)
    this.configManager = new ConfigManager(configPath);
    const validation = this.configManager.validate();
    
    if (!validation.valid) {
      throw new Error(`Configuration validation failed:\n${validation.errors.join('\n')}`);
    }
    
    const mcpConfig = this.configManager.get();
    
    // Token is required, but can come from env or config
    const token = mcpConfig.gitlab.token || process.env.NPM_CONFIG_TOKEN || '';
    if (!token) {
      throw new Error('GitLab token is required. Set NPM_CONFIG_TOKEN environment variable.');
    }
    
    this.config = {
      baseUrl: mcpConfig.gitlab.baseUrl!,
      token: token,
    };

    // Initialize GitLab client
    this.client = new GitLabClient(this.config);

    // Initialize handlers
    this.projectHandlers = new ProjectHandlers(this.client, this.configManager);
    this.issueHandlers = new IssueHandlers(this.client);
    this.mergeRequestHandlers = new MergeRequestHandlers(this.client);
    this.repositoryHandlers = new RepositoryHandlers(this.client);
    this.pipelineHandlers = new PipelineHandlers(this.client);
    this.jobHandlers = new JobHandlers(this.client);
    this.userHandlers = new UserHandlers(this.client);

    // Initialize MCP server
    this.server = new Server(
      {
        name: mcpConfig.server.name!,
        version: mcpConfig.server.version!,
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
    // Register all tools from modular structure
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: allTools,
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          // Project tools
          case 'list_projects':
            return await this.projectHandlers.listProjects(args as unknown as ListProjectsParams);
          case 'get_project':
            return await this.projectHandlers.getProject(args as unknown as GetProjectParams);

          // Issue tools
          case 'list_issues':
            return await this.issueHandlers.listIssues(args as unknown as ListIssuesParams);
          case 'get_issue':
            return await this.issueHandlers.getIssue(args as unknown as GetIssueParams);
          case 'create_issue':
            return await this.issueHandlers.createIssue(args as unknown as CreateIssueParams);

          // Merge request tools
          case 'list_merge_requests':
            return await this.mergeRequestHandlers.listMergeRequests(args as unknown as ListMergeRequestsParams);
          case 'get_merge_request':
            return await this.mergeRequestHandlers.getMergeRequest(args as unknown as GetMergeRequestParams);
          case 'create_merge_request':
            return await this.mergeRequestHandlers.createMergeRequest(args as unknown as CreateMergeRequestParams);
          case 'update_merge_request':
            return await this.mergeRequestHandlers.updateMergeRequest(args as unknown as UpdateMergeRequestParams);

          // Merge request notes/discussions tools
          case 'list_mr_notes':
            return await this.mergeRequestHandlers.listMRNotes(args as unknown as ListMRNotesParams);
          case 'list_mr_discussions':
            return await this.mergeRequestHandlers.listMRDiscussions(args as unknown as ListMRDiscussionsParams);
          case 'create_mr_note':
            return await this.mergeRequestHandlers.createMRNote(args as unknown as CreateMRNoteParams);
          case 'create_mr_discussion':
            return await this.mergeRequestHandlers.createMRDiscussion(args as unknown as CreateMRDiscussionParams);
          case 'reply_to_mr_discussion':
            return await this.mergeRequestHandlers.replyToMRDiscussion(args as unknown as ReplyToMRDiscussionParams);
          case 'resolve_mr_discussion':
            return await this.mergeRequestHandlers.resolveMRDiscussion(args as unknown as ResolveMRDiscussionParams);
          case 'unresolve_mr_discussion':
            return await this.mergeRequestHandlers.unresolveMRDiscussion(args as unknown as ResolveMRDiscussionParams);
          case 'mark_mr_as_draft':
            return await this.mergeRequestHandlers.markMRAsDraft(args as unknown as MarkMRAsDraftParams);
          case 'mark_mr_as_ready':
            return await this.mergeRequestHandlers.markMRAsReady(args as unknown as MarkMRAsReadyParams);
          case 'list_mr_templates':
            return await this.mergeRequestHandlers.listMRTemplates(args as unknown as ListMRTemplatesParams);
          case 'get_mr_template':
            return await this.mergeRequestHandlers.getMRTemplate(args as unknown as GetMRTemplateParams);

          // User tools
          case 'get_user':
            return await this.userHandlers.getUser();

          // Repository tools
          case 'list_project_branches':
            return await this.repositoryHandlers.listProjectBranches(args as unknown as ListProjectBranchesParams);
          case 'get_project_commits':
            return await this.repositoryHandlers.getProjectCommits(args as unknown as GetProjectCommitsParams);

          // Pipeline tools
          case 'list_pipelines':
            return await this.pipelineHandlers.listPipelines(args as unknown as ListPipelinesParams);
          case 'get_pipeline':
            return await this.pipelineHandlers.getPipeline(args as unknown as GetPipelineParams);
          case 'create_pipeline':
            return await this.pipelineHandlers.createPipeline(args as unknown as CreatePipelineParams);
          case 'retry_pipeline':
            return await this.pipelineHandlers.retryPipeline(args as unknown as PipelineActionParams);
          case 'cancel_pipeline':
            return await this.pipelineHandlers.cancelPipeline(args as unknown as PipelineActionParams);
          case 'delete_pipeline':
            return await this.pipelineHandlers.deletePipeline(args as unknown as PipelineActionParams);
          case 'get_pipeline_variables':
            return await this.pipelineHandlers.getPipelineVariables(args as unknown as GetPipelineVariablesParams);

          // Job tools
          case 'list_pipeline_jobs':
            return await this.jobHandlers.listPipelineJobs(args as unknown as ListPipelineJobsParams);
          case 'get_job_logs':
            return await this.jobHandlers.getJobLogs(args as unknown as GetJobLogsParams);
          case 'get_job_trace':
            return await this.jobHandlers.getJobTrace(args as unknown as GetJobTraceParams);

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

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('GitLab MCP server running on stdio');
  }
}