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
        reviewer_id: {
          type: 'number',
          description: 'Filter by reviewer user ID',
        },
        reviewer_username: {
          type: 'string',
          description: 'Filter by reviewer username',
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
  {
    name: 'list_mr_notes',
    description: 'List all notes (comments) on a merge request',
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
        sort: {
          type: 'string',
          enum: ['asc', 'desc'],
          description: 'Sort order (asc or desc)',
          default: 'desc',
        },
        order_by: {
          type: 'string',
          enum: ['created_at', 'updated_at'],
          description: 'Field to order by',
          default: 'created_at',
        },
        per_page: {
          type: 'number',
          description: 'Number of results per page (max 100)',
          maximum: 100,
          default: 20,
        },
      },
      required: ['project_id', 'merge_request_iid'],
    },
  },
  {
    name: 'list_mr_discussions',
    description:
      'List all discussions (threaded comments including inline code comments) on a merge request',
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
        per_page: {
          type: 'number',
          description: 'Number of results per page (max 100)',
          maximum: 100,
          default: 20,
        },
      },
      required: ['project_id', 'merge_request_iid'],
    },
  },
  {
    name: 'create_mr_note',
    description: 'Add a new top-level comment to a merge request',
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
        body: {
          type: 'string',
          description: 'The content of the comment (supports Markdown)',
        },
      },
      required: ['project_id', 'merge_request_iid', 'body'],
    },
  },
  {
    name: 'create_mr_discussion',
    description:
      'Create a new discussion on a merge request. Can be a general discussion or an inline comment on the diff',
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
        body: {
          type: 'string',
          description: 'The content of the discussion (supports Markdown)',
        },
        position: {
          type: 'object',
          description:
            'Position for inline/diff comments. Required fields: base_sha, start_sha, head_sha, old_path, new_path. Use new_line for additions, old_line for deletions, both for context lines.',
          properties: {
            base_sha: {
              type: 'string',
              description: 'Base commit SHA (merge request target branch HEAD)',
            },
            start_sha: {
              type: 'string',
              description:
                'SHA of the commit when the MR was created (typically same as base_sha)',
            },
            head_sha: {
              type: 'string',
              description: 'HEAD commit SHA of the merge request source branch',
            },
            old_path: {
              type: 'string',
              description:
                'File path before the change (use same as new_path for new files)',
            },
            new_path: {
              type: 'string',
              description: 'File path after the change',
            },
            position_type: {
              type: 'string',
              enum: ['text'],
              description: 'Type of position (text for code comments)',
              default: 'text',
            },
            old_line: {
              type: 'number',
              description:
                'Line number in old version (for deleted lines or context)',
            },
            new_line: {
              type: 'number',
              description:
                'Line number in new version (for added lines or context)',
            },
          },
          required: ['base_sha', 'start_sha', 'head_sha', 'old_path', 'new_path'],
        },
      },
      required: ['project_id', 'merge_request_iid', 'body'],
    },
  },
  {
    name: 'reply_to_mr_discussion',
    description: 'Reply to an existing discussion thread on a merge request',
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
        discussion_id: {
          type: 'string',
          description: 'The ID of the discussion to reply to',
        },
        body: {
          type: 'string',
          description: 'The content of the reply (supports Markdown)',
        },
      },
      required: ['project_id', 'merge_request_iid', 'discussion_id', 'body'],
    },
  },
  {
    name: 'resolve_mr_discussion',
    description: 'Mark a discussion on a merge request as resolved',
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
        discussion_id: {
          type: 'string',
          description: 'The ID of the discussion to resolve',
        },
      },
      required: ['project_id', 'merge_request_iid', 'discussion_id'],
    },
  },
  {
    name: 'unresolve_mr_discussion',
    description: 'Mark a discussion on a merge request as unresolved',
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
        discussion_id: {
          type: 'string',
          description: 'The ID of the discussion to unresolve',
        },
      },
      required: ['project_id', 'merge_request_iid', 'discussion_id'],
    },
  },
  {
    name: 'mark_mr_as_draft',
    description:
      'Mark a merge request as draft (work in progress, not ready for review)',
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
    name: 'mark_mr_as_ready',
    description:
      'Mark a merge request as ready (remove draft status, ready for review)',
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
    name: 'list_mr_templates',
    description:
      'List available merge request description templates in a project',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'Project ID or path',
        },
      },
      required: ['project_id'],
    },
  },
  {
    name: 'get_mr_template',
    description: 'Get a specific merge request description template by name',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          description: 'Project ID or path',
        },
        name: {
          type: 'string',
          description: 'Template name (without .md extension)',
        },
      },
      required: ['project_id', 'name'],
    },
  },
];