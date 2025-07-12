import type { GitLabClient } from '../client.js';
import type { 
  ListProjectBranchesParams,
  GetProjectCommitsParams
} from '../types.js';

export class RepositoryHandlers {
  constructor(private client: GitLabClient) {}

  async listProjectBranches(args: ListProjectBranchesParams) {
    const params = new URLSearchParams();
    
    if (args.search) params.append('search', args.search);
    params.append('per_page', String(args.per_page || 20));

    const data = await this.client.get(`/projects/${encodeURIComponent(args.project_id)}/repository/branches?${params.toString()}`);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  async getProjectCommits(args: GetProjectCommitsParams) {
    const params = new URLSearchParams();
    
    if (args.ref_name) params.append('ref_name', args.ref_name);
    if (args.since) params.append('since', args.since);
    if (args.until) params.append('until', args.until);
    if (args.author) params.append('author', args.author);
    params.append('per_page', String(args.per_page || 20));

    const data = await this.client.get(`/projects/${encodeURIComponent(args.project_id)}/repository/commits?${params.toString()}`);
    
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