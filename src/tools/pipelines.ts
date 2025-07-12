import { Tool } from '@modelcontextprotocol/sdk/types.js';

export const pipelineTools: Tool[] = [
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
];