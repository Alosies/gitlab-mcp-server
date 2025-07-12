import { Tool } from '@modelcontextprotocol/sdk/types.js';

export const jobTools: Tool[] = [
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
];