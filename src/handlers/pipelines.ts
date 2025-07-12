import type { GitLabClient } from '../client.js';
import type { 
  ListPipelinesParams,
  GetPipelineParams,
  CreatePipelineParams,
  PipelineActionParams,
  GetPipelineVariablesParams
} from '../types.js';

export class PipelineHandlers {
  constructor(private client: GitLabClient) {}

  async listPipelines(args: ListPipelinesParams) {
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

    const data = await this.client.get(`/projects/${encodeURIComponent(args.project_id)}/pipelines?${params.toString()}`);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  async getPipeline(args: GetPipelineParams) {
    const data = await this.client.get(`/projects/${encodeURIComponent(args.project_id)}/pipelines/${args.pipeline_id}`);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  async createPipeline(args: CreatePipelineParams) {
    const requestData: any = {
      ref: args.ref,
    };

    if (args.variables && args.variables.length > 0) {
      requestData.variables = args.variables;
    }

    const data = await this.client.post(`/projects/${encodeURIComponent(args.project_id)}/pipeline`, requestData);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  async retryPipeline(args: PipelineActionParams) {
    const data = await this.client.post(`/projects/${encodeURIComponent(args.project_id)}/pipelines/${args.pipeline_id}/retry`);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  async cancelPipeline(args: PipelineActionParams) {
    const data = await this.client.post(`/projects/${encodeURIComponent(args.project_id)}/pipelines/${args.pipeline_id}/cancel`);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  async deletePipeline(args: PipelineActionParams) {
    const response = await this.client.delete(`/projects/${encodeURIComponent(args.project_id)}/pipelines/${args.pipeline_id}`);
    
    return {
      content: [
        {
          type: 'text',
          text: response.status === 204 ? 'Pipeline deleted successfully' : JSON.stringify(response.data, null, 2),
        },
      ],
    };
  }

  async getPipelineVariables(args: GetPipelineVariablesParams) {
    const data = await this.client.get(`/projects/${encodeURIComponent(args.project_id)}/pipelines/${args.pipeline_id}/variables`);
    
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