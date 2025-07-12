import { Tool } from '@modelcontextprotocol/sdk/types.js';

export const repositoryTools: Tool[] = [
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
];