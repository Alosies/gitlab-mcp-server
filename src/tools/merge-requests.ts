import { Tool } from '@modelcontextprotocol/sdk/types.js';

export const mergeRequestTools: Tool[] = [
  {
    name: 'list_merge_requests',
    description: 'List merge requests in a project',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'Project ID or path',
        },
        state: {
          type: 'string',
          enum: ['opened', 'closed', 'merged', 'all'],
          description: 'Filter by merge request state',
          default: 'opened',
        },
        target_branch: {
          type: 'string',
          description: 'Filter by target branch',
        },
        source_branch: {
          type: 'string',
          description: 'Filter by source branch',
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
          description: 'Search merge requests by title and description',
        },
        scope: {
          type: 'string',
          enum: ['created_by_me', 'assigned_to_me', 'all'],
          description: 'Return merge requests with the given scope (optional)',
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
    name: 'get_merge_request',
    description: 'Get details of a specific merge request',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'Project ID or path',
        },
        merge_request_iid: {
          type: 'number',
          description: 'Merge request internal ID',
        },
      },
      required: ['project_id', 'merge_request_iid'],
    },
  },
  {
    name: 'create_merge_request',
    description: 'Create a new merge request',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'Project ID or path',
        },
        title: {
          type: 'string',
          description: 'Merge request title',
        },
        source_branch: {
          type: 'string',
          description: 'Source branch name',
        },
        target_branch: {
          type: 'string',
          description: 'Target branch name',
        },
        description: {
          type: 'string',
          description: 'Merge request description',
        },
        assignee_ids: {
          type: 'array',
          items: { type: 'number' },
          description: 'Array of user IDs to assign',
        },
        reviewer_ids: {
          type: 'array',
          items: { type: 'number' },
          description: 'Array of user IDs to review',
        },
        labels: {
          type: 'string',
          description: 'Comma-separated list of labels',
        },
        milestone_id: {
          type: 'number',
          description: 'Milestone ID',
        },
      },
      required: ['project_id', 'title', 'source_branch', 'target_branch'],
    },
  },
  {
    name: 'update_merge_request',
    description: 'Update an existing merge request',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'Project ID or path',
        },
        merge_request_iid: {
          type: 'number',
          description: 'Merge request internal ID',
        },
        title: {
          type: 'string',
          description: 'Update merge request title',
        },
        description: {
          type: 'string',
          description: 'Update merge request description (max 1,048,576 characters)',
        },
        state_event: {
          type: 'string',
          enum: ['close', 'reopen'],
          description: 'Change the state (close or reopen the MR)',
        },
        target_branch: {
          type: 'string',
          description: 'Change the target branch',
        },
        assignee_id: {
          type: 'number',
          description: 'Assign a user to the merge request (use 0 to unassign)',
        },
        assignee_ids: {
          type: 'array',
          items: { type: 'number' },
          description: 'Assign multiple users to the merge request',
        },
        reviewer_ids: {
          type: 'array',
          items: { type: 'number' },
          description: 'Set reviewers for the merge request',
        },
        milestone_id: {
          type: 'number',
          description: 'Assign a milestone (use 0 to remove)',
        },
        labels: {
          type: 'string',
          description: 'Update labels (comma-separated)',
        },
        remove_source_branch: {
          type: 'boolean',
          description: 'Flag to remove source branch after merging',
        },
        squash: {
          type: 'boolean',
          description: 'Toggle squash commits on merge',
        },
        allow_collaboration: {
          type: 'boolean',
          description: 'Allow commits from members who can merge',
        },
        merge_when_pipeline_succeeds: {
          type: 'boolean',
          description: 'Set MR to merge when pipeline succeeds',
        },
      },
      required: ['project_id', 'merge_request_iid'],
    },
  },
];