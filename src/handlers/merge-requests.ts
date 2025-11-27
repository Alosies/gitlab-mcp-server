import type { GitLabClient } from "../client.js";
import type {
  ListMergeRequestsParams,
  GetMergeRequestParams,
  CreateMergeRequestParams,
  UpdateMergeRequestParams,
  GetMergeRequestDiffsParams,
  ListMergeRequestDiffsParams,
  GetBranchDiffsParams,
  ListMRNotesParams,
  ListMRDiscussionsParams,
  CreateMRNoteParams,
  CreateMRDiscussionParams,
  ReplyToMRDiscussionParams,
  ResolveMRDiscussionParams,
  UpdateMRDiscussionNoteParams,
  CreateMRDiscussionNoteParams,
  DeleteMRDiscussionNoteParams,
  MarkMRAsDraftParams,
  MarkMRAsReadyParams,
  ListMRTemplatesParams,
  GetMRTemplateParams,
  GitLabMergeRequest,
} from "../types.js";

export class MergeRequestHandlers {
  constructor(private client: GitLabClient) {}

  /**
   * Helper method to resolve merge request IID from source branch name
   */
  private async resolveMergeRequestIid(
    projectId: string,
    mergeRequestIid?: number,
    sourceBranch?: string
  ): Promise<number> {
    if (mergeRequestIid) {
      return mergeRequestIid;
    }

    if (!sourceBranch) {
      throw new Error(
        "Either merge_request_iid or source_branch must be provided"
      );
    }

    // Find MR by source branch
    const mrs = (await this.client.get(
      `/projects/${encodeURIComponent(
        projectId
      )}/merge_requests?source_branch=${encodeURIComponent(
        sourceBranch
      )}&state=opened&per_page=1`
    )) as GitLabMergeRequest[];

    if (!mrs || mrs.length === 0) {
      // Try all states if no open MR found
      const allMrs = (await this.client.get(
        `/projects/${encodeURIComponent(
          projectId
        )}/merge_requests?source_branch=${encodeURIComponent(
          sourceBranch
        )}&per_page=1`
      )) as GitLabMergeRequest[];

      if (!allMrs || allMrs.length === 0) {
        throw new Error(
          `No merge request found for source branch: ${sourceBranch}`
        );
      }

      return allMrs[0].iid;
    }

    return mrs[0].iid;
  }

  async listMergeRequests(args: ListMergeRequestsParams) {
    const params = new URLSearchParams();

    if (args.state) params.append("state", args.state);
    if (args.target_branch) params.append("target_branch", args.target_branch);
    if (args.source_branch) params.append("source_branch", args.source_branch);
    if (args.assignee_id)
      params.append("assignee_id", String(args.assignee_id));
    if (args.author_id) params.append("author_id", String(args.author_id));
    if (args.reviewer_id)
      params.append("reviewer_id", String(args.reviewer_id));
    if (args.reviewer_username)
      params.append("reviewer_username", args.reviewer_username);
    if (args.search) params.append("search", args.search);
    // Only add scope if explicitly provided by user
    if (args.scope) params.append("scope", args.scope);
    params.append("per_page", String(args.per_page || 20));

    const data = await this.client.get(
      `/projects/${encodeURIComponent(
        args.project_id
      )}/merge_requests?${params.toString()}`
    );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  async getMergeRequest(args: GetMergeRequestParams) {
    const mergeRequestIid = await this.resolveMergeRequestIid(
      args.project_id,
      args.merge_request_iid,
      args.source_branch
    );

    const data = await this.client.get(
      `/projects/${encodeURIComponent(
        args.project_id
      )}/merge_requests/${mergeRequestIid}`
    );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  async getMergeRequestDiffs(args: GetMergeRequestDiffsParams) {
    const mergeRequestIid = await this.resolveMergeRequestIid(
      args.project_id,
      args.merge_request_iid,
      args.source_branch
    );

    const params = new URLSearchParams();
    if (args.view) params.append("view", args.view);

    const queryString = params.toString();
    const url = `/projects/${encodeURIComponent(
      args.project_id
    )}/merge_requests/${mergeRequestIid}/changes${
      queryString ? `?${queryString}` : ""
    }`;

    const data = await this.client.get(url);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  async listMergeRequestDiffs(args: ListMergeRequestDiffsParams) {
    const mergeRequestIid = await this.resolveMergeRequestIid(
      args.project_id,
      args.merge_request_iid,
      args.source_branch
    );

    const params = new URLSearchParams();
    if (args.page) params.append("page", String(args.page));
    if (args.per_page) params.append("per_page", String(args.per_page));
    if (args.unidiff !== undefined)
      params.append("unidiff", String(args.unidiff));

    const queryString = params.toString();
    const url = `/projects/${encodeURIComponent(
      args.project_id
    )}/merge_requests/${mergeRequestIid}/diffs${
      queryString ? `?${queryString}` : ""
    }`;

    const data = await this.client.get(url);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  async getBranchDiffs(args: GetBranchDiffsParams) {
    const params = new URLSearchParams();
    params.append("from", args.from);
    params.append("to", args.to);
    if (args.straight !== undefined)
      params.append("straight", String(args.straight));

    const url = `/projects/${encodeURIComponent(
      args.project_id
    )}/repository/compare?${params.toString()}`;

    const data = await this.client.get(url);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  async createMergeRequest(args: CreateMergeRequestParams) {
    const requestData: any = {
      title: args.title,
      source_branch: args.source_branch,
      target_branch: args.target_branch,
    };

    if (args.description) {
      requestData.description = args.description;
    }

    if (args.assignee_ids) requestData.assignee_ids = args.assignee_ids;
    if (args.reviewer_ids) requestData.reviewer_ids = args.reviewer_ids;
    if (args.labels) requestData.labels = args.labels;
    if (args.milestone_id) requestData.milestone_id = args.milestone_id;

    const data = await this.client.post(
      `/projects/${encodeURIComponent(args.project_id)}/merge_requests`,
      requestData
    );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  async updateMergeRequest(args: UpdateMergeRequestParams) {
    const mergeRequestIid = await this.resolveMergeRequestIid(
      args.project_id,
      args.merge_request_iid,
      args.source_branch
    );

    const requestData: any = {};

    // Only include provided parameters
    if (args.title !== undefined) requestData.title = args.title;
    if (args.description !== undefined)
      requestData.description = args.description;
    if (args.state_event !== undefined)
      requestData.state_event = args.state_event;
    if (args.target_branch !== undefined)
      requestData.target_branch = args.target_branch;
    if (args.assignee_id !== undefined)
      requestData.assignee_id = args.assignee_id;
    if (args.assignee_ids !== undefined)
      requestData.assignee_ids = args.assignee_ids;
    if (args.reviewer_ids !== undefined)
      requestData.reviewer_ids = args.reviewer_ids;
    if (args.milestone_id !== undefined)
      requestData.milestone_id = args.milestone_id;
    if (args.labels !== undefined) requestData.labels = args.labels;
    if (args.remove_source_branch !== undefined)
      requestData.remove_source_branch = args.remove_source_branch;
    if (args.squash !== undefined) requestData.squash = args.squash;
    if (args.allow_collaboration !== undefined)
      requestData.allow_collaboration = args.allow_collaboration;
    if (args.merge_when_pipeline_succeeds !== undefined)
      requestData.merge_when_pipeline_succeeds =
        args.merge_when_pipeline_succeeds;

    const data = await this.client.put(
      `/projects/${encodeURIComponent(
        args.project_id
      )}/merge_requests/${mergeRequestIid}`,
      requestData
    );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  async listMRNotes(args: ListMRNotesParams) {
    const params = new URLSearchParams();

    if (args.sort) params.append("sort", args.sort);
    if (args.order_by) params.append("order_by", args.order_by);
    if (args.page) params.append("page", String(args.page));
    params.append("per_page", String(args.per_page || 20));

    const data = await this.client.get(
      `/projects/${encodeURIComponent(args.project_id)}/merge_requests/${
        args.merge_request_iid
      }/notes?${params.toString()}`
    );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  async listMRDiscussions(args: ListMRDiscussionsParams) {
    const encodedProjectId = encodeURIComponent(args.project_id);
    const perPage = args.per_page || 20;

    // If unresolved_only is true, fetch all pages and filter
    if (args.unresolved_only) {
      const allDiscussions: any[] = [];
      let page = 1;
      let hasMore = true;

      // Fetch all pages (use max per_page for efficiency)
      while (hasMore) {
        const { data, headers } = await this.client.getWithHeaders(
          `/projects/${encodedProjectId}/merge_requests/${args.merge_request_iid}/discussions?per_page=100&page=${page}`
        );

        allDiscussions.push(...data);

        // Check if there are more pages
        const nextPage = headers['x-next-page'];
        hasMore = !!nextPage && nextPage !== '';
        page++;

        // Safety limit to prevent infinite loops
        if (page > 100) break;
      }

      // Filter to only unresolved discussions
      // A discussion is unresolved if it has resolvable notes and at least one is not resolved
      const unresolvedDiscussions = allDiscussions.filter((discussion) => {
        // Check if any note in the discussion is resolvable and not resolved
        const hasUnresolvedNotes = discussion.notes?.some(
          (note: any) => note.resolvable === true && note.resolved === false
        );
        return hasUnresolvedNotes;
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                discussions: unresolvedDiscussions,
                metadata: {
                  total_fetched: allDiscussions.length,
                  unresolved_count: unresolvedDiscussions.length,
                  filtered: true,
                },
              },
              null,
              2
            ),
          },
        ],
      };
    }

    // Normal pagination mode
    const params = new URLSearchParams();
    if (args.page) params.append("page", String(args.page));
    params.append("per_page", String(perPage));

    const data = await this.client.get(
      `/projects/${encodedProjectId}/merge_requests/${args.merge_request_iid}/discussions?${params.toString()}`
    );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  async createMRNote(args: CreateMRNoteParams) {
    const requestData = {
      body: args.body,
    };

    const data = await this.client.post(
      `/projects/${encodeURIComponent(args.project_id)}/merge_requests/${
        args.merge_request_iid
      }/notes`,
      requestData
    );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  async createMRDiscussion(args: CreateMRDiscussionParams) {
    const requestData: Record<string, unknown> = {
      body: args.body,
    };

    // Add position for inline/diff comments
    if (args.position) {
      requestData.position = {
        base_sha: args.position.base_sha,
        start_sha: args.position.start_sha,
        head_sha: args.position.head_sha,
        old_path: args.position.old_path,
        new_path: args.position.new_path,
        position_type: args.position.position_type || "text",
        ...(args.position.old_line !== undefined && {
          old_line: args.position.old_line,
        }),
        ...(args.position.new_line !== undefined && {
          new_line: args.position.new_line,
        }),
      };
    }

    const data = await this.client.post(
      `/projects/${encodeURIComponent(args.project_id)}/merge_requests/${
        args.merge_request_iid
      }/discussions`,
      requestData
    );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  async replyToMRDiscussion(args: ReplyToMRDiscussionParams) {
    const requestData = {
      body: args.body,
    };

    const data = await this.client.post(
      `/projects/${encodeURIComponent(args.project_id)}/merge_requests/${
        args.merge_request_iid
      }/discussions/${args.discussion_id}/notes`,
      requestData
    );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  async resolveMRDiscussion(args: ResolveMRDiscussionParams) {
    const data = await this.client.put(
      `/projects/${encodeURIComponent(args.project_id)}/merge_requests/${
        args.merge_request_iid
      }/discussions/${args.discussion_id}`,
      { resolved: true }
    );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  async unresolveMRDiscussion(args: ResolveMRDiscussionParams) {
    const data = await this.client.put(
      `/projects/${encodeURIComponent(args.project_id)}/merge_requests/${
        args.merge_request_iid
      }/discussions/${args.discussion_id}`,
      { resolved: false }
    );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  async updateMRDiscussionNote(args: UpdateMRDiscussionNoteParams) {
    const data = await this.client.put(
      `/projects/${encodeURIComponent(args.project_id)}/merge_requests/${
        args.merge_request_iid
      }/discussions/${args.discussion_id}/notes/${args.note_id}`,
      { body: args.body }
    );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  async createMRDiscussionNote(args: CreateMRDiscussionNoteParams) {
    const data = await this.client.post(
      `/projects/${encodeURIComponent(args.project_id)}/merge_requests/${
        args.merge_request_iid
      }/discussions/${args.discussion_id}/notes`,
      { body: args.body }
    );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  async deleteMRDiscussionNote(args: DeleteMRDiscussionNoteParams) {
    await this.client.delete(
      `/projects/${encodeURIComponent(args.project_id)}/merge_requests/${
        args.merge_request_iid
      }/discussions/${args.discussion_id}/notes/${args.note_id}`
    );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            { message: "Note deleted successfully" },
            null,
            2
          ),
        },
      ],
    };
  }

  async markMRAsDraft(args: MarkMRAsDraftParams) {
    // First get the current MR to check its title
    const mr = (await this.client.get(
      `/projects/${encodeURIComponent(args.project_id)}/merge_requests/${
        args.merge_request_iid
      }`
    )) as GitLabMergeRequest;

    // Check if already a draft
    if (mr.title.startsWith("Draft: ") || mr.title.startsWith("WIP: ")) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              { message: "Merge request is already marked as draft", ...mr },
              null,
              2
            ),
          },
        ],
      };
    }

    // Update the title to add Draft: prefix
    const data = await this.client.put(
      `/projects/${encodeURIComponent(args.project_id)}/merge_requests/${
        args.merge_request_iid
      }`,
      { title: `Draft: ${mr.title}` }
    );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  async markMRAsReady(args: MarkMRAsReadyParams) {
    // First get the current MR to check its title
    const mr = (await this.client.get(
      `/projects/${encodeURIComponent(args.project_id)}/merge_requests/${
        args.merge_request_iid
      }`
    )) as GitLabMergeRequest;

    // Check if it's a draft and remove the prefix
    let newTitle = mr.title;
    if (mr.title.startsWith("Draft: ")) {
      newTitle = mr.title.replace(/^Draft: /, "");
    } else if (mr.title.startsWith("WIP: ")) {
      newTitle = mr.title.replace(/^WIP: /, "");
    } else {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              { message: "Merge request is already marked as ready", ...mr },
              null,
              2
            ),
          },
        ],
      };
    }

    // Update the title to remove the draft prefix
    const data = await this.client.put(
      `/projects/${encodeURIComponent(args.project_id)}/merge_requests/${
        args.merge_request_iid
      }`,
      { title: newTitle }
    );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  async listMRTemplates(args: ListMRTemplatesParams) {
    const data = await this.client.get(
      `/projects/${encodeURIComponent(
        args.project_id
      )}/templates/merge_requests`
    );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  async getMRTemplate(args: GetMRTemplateParams) {
    const data = await this.client.get(
      `/projects/${encodeURIComponent(
        args.project_id
      )}/templates/merge_requests/${encodeURIComponent(args.name)}`
    );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }
}
