import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const repositoryTools: Tool[] = [
  {
    name: "list_project_branches",
    description: "List branches in a project",
    inputSchema: {
      type: "object",
      properties: {
        project_id: {
          type: "string",
          description: "Project ID or path",
        },
        search: {
          type: "string",
          description: "Search branches by name",
        },
        per_page: {
          type: "number",
          description: "Number of results per page (max 100)",
          maximum: 100,
          default: 20,
        },
      },
      required: ["project_id"],
    },
  },
  {
    name: "get_project_commits",
    description: "List repository commits with filtering options",
    inputSchema: {
      type: "object",
      properties: {
        project_id: {
          type: "string",
          description: "Project ID or path",
        },
        ref_name: {
          type: "string",
          description: "Branch, tag, or commit SHA",
          default: "main",
        },
        since: {
          type: "string",
          description:
            "ISO 8601 date format (YYYY-MM-DDTHH:MM:SSZ) - commits after this date",
        },
        until: {
          type: "string",
          description:
            "ISO 8601 date format (YYYY-MM-DDTHH:MM:SSZ) - commits before this date",
        },
        author: {
          type: "string",
          description: "Filter commits by author name",
        },
        path: {
          type: "string",
          description: "Filter commits by file path",
        },
        all: {
          type: "boolean",
          description: "Retrieve every commit from the repository",
        },
        with_stats: {
          type: "boolean",
          description: "Include commit stats (additions, deletions)",
        },
        first_parent: {
          type: "boolean",
          description: "Follow only the first parent commit on merge commits",
        },
        order: {
          type: "string",
          enum: ["default", "topo"],
          description: "List commits in order (default or topological)",
        },
        trailers: {
          type: "boolean",
          description: "Parse and include Git trailers for every commit",
        },
        page: {
          type: "number",
          description: "Page number for pagination (default: 1)",
        },
        per_page: {
          type: "number",
          description: "Number of results per page (max 100)",
          maximum: 100,
          default: 20,
        },
      },
      required: ["project_id"],
    },
  },
  {
    name: "get_commit",
    description: "Get details of a specific commit",
    inputSchema: {
      type: "object",
      properties: {
        project_id: {
          type: "string",
          description: "Project ID or path",
        },
        sha: {
          type: "string",
          description: "The commit hash or name of a repository branch or tag",
        },
        stats: {
          type: "boolean",
          description: "Include commit stats (additions, deletions)",
        },
      },
      required: ["project_id", "sha"],
    },
  },
  {
    name: "get_commit_diff",
    description: "Get changes/diffs of a specific commit",
    inputSchema: {
      type: "object",
      properties: {
        project_id: {
          type: "string",
          description: "Project ID or path",
        },
        sha: {
          type: "string",
          description: "The commit hash or name of a repository branch or tag",
        },
      },
      required: ["project_id", "sha"],
    },
  },
];
