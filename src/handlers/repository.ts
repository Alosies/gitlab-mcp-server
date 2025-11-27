import type { GitLabClient } from "../client.js";
import type {
  ListProjectBranchesParams,
  GetProjectCommitsParams,
  GetCommitParams,
  GetCommitDiffParams,
} from "../types.js";

export class RepositoryHandlers {
  constructor(private client: GitLabClient) {}

  async listProjectBranches(args: ListProjectBranchesParams) {
    const params = new URLSearchParams();

    if (args.search) params.append("search", args.search);
    params.append("per_page", String(args.per_page || 20));

    const data = await this.client.get(
      `/projects/${encodeURIComponent(
        args.project_id
      )}/repository/branches?${params.toString()}`
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

  async getProjectCommits(args: GetProjectCommitsParams) {
    const params = new URLSearchParams();

    if (args.ref_name) params.append("ref_name", args.ref_name);
    if (args.since) params.append("since", args.since);
    if (args.until) params.append("until", args.until);
    if (args.author) params.append("author", args.author);
    if (args.path) params.append("path", args.path);
    if (args.all !== undefined) params.append("all", String(args.all));
    if (args.with_stats !== undefined)
      params.append("with_stats", String(args.with_stats));
    if (args.first_parent !== undefined)
      params.append("first_parent", String(args.first_parent));
    if (args.order) params.append("order", args.order);
    if (args.trailers !== undefined)
      params.append("trailers", String(args.trailers));
    if (args.page) params.append("page", String(args.page));
    params.append("per_page", String(args.per_page || 20));

    const data = await this.client.get(
      `/projects/${encodeURIComponent(
        args.project_id
      )}/repository/commits?${params.toString()}`
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

  async getCommit(args: GetCommitParams) {
    const params = new URLSearchParams();
    if (args.stats !== undefined) params.append("stats", String(args.stats));

    const queryString = params.toString();
    const url = `/projects/${encodeURIComponent(
      args.project_id
    )}/repository/commits/${encodeURIComponent(args.sha)}${
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

  async getCommitDiff(args: GetCommitDiffParams) {
    const data = await this.client.get(
      `/projects/${encodeURIComponent(
        args.project_id
      )}/repository/commits/${encodeURIComponent(args.sha)}/diff`
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
