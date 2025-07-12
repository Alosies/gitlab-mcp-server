import type { GitLabClient } from '../client.js';
import type { ConfigManager } from '../config.js';
import type { 
  ListProjectsParams, 
  GetProjectParams
} from '../types.js';

export class ProjectHandlers {
  constructor(
    private client: GitLabClient,
    private configManager: ConfigManager
  ) {}

  async listProjects(args: ListProjectsParams) {
    const params = new URLSearchParams();
    const defaults = this.configManager.getDefaults();
    
    if (args.search) params.append('search', args.search);
    if (args.visibility) params.append('visibility', args.visibility);
    
    // Use config default for project scope, fallback to owned=true for privacy
    const shouldShowOwned = args.owned !== false && (defaults.projectScope === 'owned' || defaults.projectScope === undefined);
    if (shouldShowOwned) params.append('owned', 'true');
    
    // Use simple=true by default to reduce payload size (40k+ tokens -> much smaller)
    // Only use full details when explicitly requested with simple=false
    const useSimple = args.simple !== false; // Default to true unless explicitly set to false
    if (useSimple) {
      params.append('simple', 'true');
      params.append('statistics', 'false'); // Also exclude statistics for even smaller payload
    }
    
    // Use config default for per_page
    params.append('per_page', String(args.per_page || defaults.perPage || 20));

    const data = await this.client.get(`/projects?${params.toString()}`);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  async getProject(args: GetProjectParams) {
    const data = await this.client.get(`/projects/${encodeURIComponent(args.project_id)}`);
    
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