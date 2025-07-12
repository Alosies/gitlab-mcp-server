import { Tool } from '@modelcontextprotocol/sdk/types.js';

export const issueTools: Tool[] = [
  {
    name: 'list_issues',
    description: 'List issues in a project',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'Project ID or path',
        },
        state: {
          type: 'string',
          enum: ['opened', 'closed', 'all'],
          description: 'Filter by issue state',
          default: 'opened',
        },
        labels: {
          type: 'string',
          description: 'Comma-separated list of labels',
        },
        assignee_id: {
          type: 'number',
          description: 'Filter by assignee user ID',
        },
        author_id: {
          type: 'number',
          description: 'Filter by author user ID',
        },
        search: {
          type: 'string',
          description: 'Search issues by title and description',
        },
        scope: {
          type: 'string',
          enum: ['created_by_me', 'assigned_to_me', 'all'],
          description: 'Return issues with the given scope (optional)',
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
    name: 'get_issue',
    description: 'Get details of a specific issue',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'Project ID or path',
        },
        issue_iid: {
          type: 'number',
          description: 'Issue internal ID',
        },
      },
      required: ['project_id', 'issue_iid'],
    },
  },
  {
    name: 'create_issue',
    description: 'Create a new issue',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'Project ID or path',
        },
        title: {
          type: 'string',
          description: 'Issue title',
        },
        description: {
          type: 'string',
          description: 'Issue description',
        },
        labels: {
          type: 'string',
          description: 'Comma-separated list of labels',
        },
        assignee_ids: {
          type: 'array',
          items: { type: 'number' },
          description: 'Array of user IDs to assign',
        },
        milestone_id: {
          type: 'number',
          description: 'Milestone ID',
        },
      },
      required: ['project_id', 'title'],
    },
  },
];