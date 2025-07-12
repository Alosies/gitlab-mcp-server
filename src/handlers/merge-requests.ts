import type { GitLabClient } from '../client.js';
import type { 
  ListMergeRequestsParams, 
  GetMergeRequestParams,
  CreateMergeRequestParams,
  UpdateMergeRequestParams
} from '../types.js';

export class MergeRequestHandlers {
  constructor(
    private client: GitLabClient
  ) {}

  async listMergeRequests(args: ListMergeRequestsParams) {
    const params = new URLSearchParams();
    
    if (args.state) params.append('state', args.state);
    if (args.target_branch) params.append('target_branch', args.target_branch);
    if (args.source_branch) params.append('source_branch', args.source_branch);
    if (args.assignee_id) params.append('assignee_id', String(args.assignee_id));
    if (args.author_id) params.append('author_id', String(args.author_id));
    if (args.search) params.append('search', args.search);
    // Only add scope if explicitly provided by user
    if (args.scope) params.append('scope', args.scope);
    params.append('per_page', String(args.per_page || 20));

    const data = await this.client.get(`/projects/${encodeURIComponent(args.project_id)}/merge_requests?${params.toString()}`);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  async getMergeRequest(args: GetMergeRequestParams) {
    const data = await this.client.get(`/projects/${encodeURIComponent(args.project_id)}/merge_requests/${args.merge_request_iid}`);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  async createMergeRequest(args: CreateMergeRequestParams) {
    const requestData: any = {
      title: args.title,
      source_branch: args.source_branch,
      target_branch: args.target_branch,
    };

    if (args.description) {
      requestData.description = args.description;
    }

    if (args.assignee_ids) requestData.assignee_ids = args.assignee_ids;
    if (args.reviewer_ids) requestData.reviewer_ids = args.reviewer_ids;
    if (args.labels) requestData.labels = args.labels;
    if (args.milestone_id) requestData.milestone_id = args.milestone_id;

    const data = await this.client.post(`/projects/${encodeURIComponent(args.project_id)}/merge_requests`, requestData);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  async updateMergeRequest(args: UpdateMergeRequestParams) {
    const requestData: any = {};

    // Only include provided parameters
    if (args.title !== undefined) requestData.title = args.title;
    if (args.description !== undefined) requestData.description = args.description;
    if (args.state_event !== undefined) requestData.state_event = args.state_event;
    if (args.target_branch !== undefined) requestData.target_branch = args.target_branch;
    if (args.assignee_id !== undefined) requestData.assignee_id = args.assignee_id;
    if (args.assignee_ids !== undefined) requestData.assignee_ids = args.assignee_ids;
    if (args.reviewer_ids !== undefined) requestData.reviewer_ids = args.reviewer_ids;
    if (args.milestone_id !== undefined) requestData.milestone_id = args.milestone_id;
    if (args.labels !== undefined) requestData.labels = args.labels;
    if (args.remove_source_branch !== undefined) requestData.remove_source_branch = args.remove_source_branch;
    if (args.squash !== undefined) requestData.squash = args.squash;
    if (args.allow_collaboration !== undefined) requestData.allow_collaboration = args.allow_collaboration;
    if (args.merge_when_pipeline_succeeds !== undefined) requestData.merge_when_pipeline_succeeds = args.merge_when_pipeline_succeeds;

    const data = await this.client.put(`/projects/${encodeURIComponent(args.project_id)}/merge_requests/${args.merge_request_iid}`, requestData);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }
}