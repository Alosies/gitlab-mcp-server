import type { GitLabClient } from '../client.js';
import type { 
  ListIssuesParams, 
  GetIssueParams,
  CreateIssueParams
} from '../types.js';

export class IssueHandlers {
  constructor(private client: GitLabClient) {}

  async listIssues(args: ListIssuesParams) {
    const params = new URLSearchParams();
    
    if (args.state) params.append('state', args.state);
    if (args.labels) params.append('labels', args.labels);
    if (args.assignee_id) params.append('assignee_id', String(args.assignee_id));
    if (args.author_id) params.append('author_id', String(args.author_id));
    if (args.search) params.append('search', args.search);
    // Only add scope if explicitly provided by user
    if (args.scope) params.append('scope', args.scope);
    params.append('per_page', String(args.per_page || 20));

    const data = await this.client.get(`/projects/${encodeURIComponent(args.project_id)}/issues?${params.toString()}`);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  async getIssue(args: GetIssueParams) {
    const data = await this.client.get(`/projects/${encodeURIComponent(args.project_id)}/issues/${args.issue_iid}`);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  async createIssue(args: CreateIssueParams) {
    const requestData: any = {
      title: args.title,
    };

    if (args.description) requestData.description = args.description;
    if (args.labels) requestData.labels = args.labels;
    if (args.assignee_ids) requestData.assignee_ids = args.assignee_ids;
    if (args.milestone_id) requestData.milestone_id = args.milestone_id;

    const data = await this.client.post(`/projects/${encodeURIComponent(args.project_id)}/issues`, requestData);
    
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