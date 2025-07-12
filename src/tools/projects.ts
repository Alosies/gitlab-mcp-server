import { Tool } from '@modelcontextprotocol/sdk/types.js';

export const projectTools: Tool[] = [
  {
    name: 'list_projects',
    description: 'List GitLab projects with minimal info by default (to reduce token usage from 40k+ to much less). Use simple=false for full project details when needed.',
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
          description: 'Show only owned projects (default: true for privacy)',
          default: true,
        },
        per_page: {
          type: 'number',
          description: 'Number of results per page (max 100)',
          maximum: 100,
          default: 20,
        },
        simple: {
          type: 'boolean',
          description: 'Use simplified project info to reduce response size (default: true). Set to false for full project details.',
          default: true,
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
];