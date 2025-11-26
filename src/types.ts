// GitLab API Types
export interface GitLabConfig {
  baseUrl: string;
  token: string;
}

// Common GitLab API Response Types
export interface GitLabUser {
  id: number;
  name: string;
  username: string;
  state: string;
  avatar_url: string;
  web_url: string;
  created_at: string;
  bio?: string;
  location?: string;
  public_email: string;
  skype: string;
  linkedin: string;
  twitter: string;
  website_url: string;
  organization?: string;
}

export interface GitLabProject {
  id: number;
  name: string;
  name_with_namespace: string;
  path: string;
  path_with_namespace: string;
  description?: string;
  default_branch: string;
  visibility: 'private' | 'internal' | 'public';
  web_url: string;
  created_at: string;
  last_activity_at: string;
}

export interface GitLabIssue {
  id: number;
  iid: number;
  project_id: number;
  title: string;
  description?: string;
  state: 'opened' | 'closed';
  created_at: string;
  updated_at: string;
  labels: string[];
  milestone?: GitLabMilestone;
  assignees: GitLabUser[];
  author: GitLabUser;
  web_url: string;
}

export interface GitLabMergeRequest {
  id: number;
  iid: number;
  project_id: number;
  title: string;
  description?: string;
  state: 'opened' | 'closed' | 'merged';
  created_at: string;
  updated_at: string;
  target_branch: string;
  source_branch: string;
  author: GitLabUser;
  assignees: GitLabUser[];
  reviewers: GitLabUser[];
  labels: string[];
  web_url: string;
}

export interface GitLabPipeline {
  id: number;
  project_id: number;
  sha: string;
  ref: string;
  status: 'created' | 'waiting_for_resource' | 'preparing' | 'pending' | 'running' | 'success' | 'failed' | 'canceled' | 'skipped' | 'manual' | 'scheduled';
  source: string;
  created_at: string;
  updated_at: string;
  web_url: string;
}

export interface GitLabJob {
  id: number;
  status: 'created' | 'pending' | 'running' | 'failed' | 'success' | 'canceled' | 'skipped' | 'waiting_for_resource' | 'manual';
  stage: string;
  name: string;
  ref: string;
  tag: boolean;
  coverage?: number;
  allow_failure: boolean;
  created_at: string;
  started_at?: string;
  finished_at?: string;
  erased_at?: string;
  duration?: number;
  queued_duration: number;
  user?: GitLabUser;
  commit: GitLabCommit;
  pipeline: GitLabPipeline;
  web_url: string;
  project: {
    ci_job_token_scope_enabled: boolean;
  };
  artifacts: GitLabArtifact[];
  runner?: GitLabRunner;
  runner_manager?: GitLabRunnerManager;
  artifacts_file?: {
    filename: string;
    size: number;
  };
  artifacts_expire_at?: string;
  tag_list: string[];
  failure_reason?: string;
}

export interface GitLabCommit {
  id: string;
  short_id: string;
  title: string;
  message: string;
  author_name: string;
  author_email: string;
  authored_date: string;
  committer_name: string;
  committer_email: string;
  committed_date: string;
  created_at: string;
  parent_ids: string[];
}

export interface GitLabBranch {
  name: string;
  commit: GitLabCommit;
  merged: boolean;
  protected: boolean;
  developers_can_push: boolean;
  developers_can_merge: boolean;
  can_push: boolean;
  default: boolean;
  web_url: string;
}

export interface GitLabMilestone {
  id: number;
  title: string;
  description?: string;
  state: 'active' | 'closed';
  created_at: string;
  updated_at: string;
  due_date?: string;
  start_date?: string;
  web_url: string;
}

export interface GitLabArtifact {
  file_type: string;
  size: number;
  filename: string;
  file_format: string;
}

export interface GitLabRunner {
  id: number;
  description: string;
  ip_address?: string;
  active: boolean;
  paused: boolean;
  is_shared: boolean;
  runner_type: string;
  name?: string;
  online: boolean;
  status: string;
}

export interface GitLabRunnerManager {
  id: number;
  system_id: string;
  version: string;
  revision: string;
  platform: string;
  architecture: string;
  created_at: string;
  contacted_at: string;
  ip_address: string;
  status: string;
}

export interface GitLabVariable {
  key: string;
  value: string;
  variable_type: 'env_var' | 'file';
  protected: boolean;
  masked: boolean;
  raw: boolean;
  environment_scope: string;
}

// MCP Tool Parameter Types
export interface ListProjectsParams {
  search?: string;
  visibility?: 'public' | 'internal' | 'private';
  owned?: boolean;
  per_page?: number;
  simple?: boolean; // Use simple=true for minimal project info (default: true)
}

export interface GetProjectParams {
  project_id: string;
}

export interface ListIssuesParams {
  project_id: string;
  state?: 'opened' | 'closed' | 'all';
  labels?: string;
  assignee_id?: number;
  author_id?: number;
  search?: string;
  scope?: 'created_by_me' | 'assigned_to_me' | 'all';
  per_page?: number;
}

export interface GetIssueParams {
  project_id: string;
  issue_iid: number;
}

export interface CreateIssueParams {
  project_id: string;
  title: string;
  description?: string;
  labels?: string;
  assignee_ids?: number[];
  milestone_id?: number;
}

export interface ListMergeRequestsParams {
  project_id: string;
  state?: 'opened' | 'closed' | 'merged' | 'all';
  target_branch?: string;
  source_branch?: string;
  assignee_id?: number;
  author_id?: number;
  reviewer_id?: number;
  reviewer_username?: string;
  search?: string;
  scope?: 'created_by_me' | 'assigned_to_me' | 'all';
  per_page?: number;
}

export interface GetMergeRequestParams {
  project_id: string;
  merge_request_iid?: number;
  source_branch?: string;
}

export interface GetMergeRequestDiffsParams {
  project_id: string;
  merge_request_iid?: number;
  source_branch?: string;
  view?: 'inline' | 'parallel';
}

export interface ListMergeRequestDiffsParams {
  project_id: string;
  merge_request_iid?: number;
  source_branch?: string;
  page?: number;
  per_page?: number;
  unidiff?: boolean;
}

export interface GetBranchDiffsParams {
  project_id: string;
  from: string;
  to: string;
  straight?: boolean;
}

export interface CreateMergeRequestParams {
  project_id: string;
  title: string;
  source_branch: string;
  target_branch: string;
  description?: string;
  assignee_ids?: number[];
  reviewer_ids?: number[];
  labels?: string;
  milestone_id?: number;
}

export interface UpdateMergeRequestParams {
  project_id: string;
  merge_request_iid?: number;
  source_branch?: string;
  title?: string;
  description?: string;
  state_event?: 'close' | 'reopen';
  target_branch?: string;
  assignee_id?: number;
  assignee_ids?: number[];
  reviewer_ids?: number[];
  milestone_id?: number;
  labels?: string;
  remove_source_branch?: boolean;
  squash?: boolean;
  allow_collaboration?: boolean;
  merge_when_pipeline_succeeds?: boolean;
}

export interface ListProjectBranchesParams {
  project_id: string;
  search?: string;
  per_page?: number;
}

export interface GetProjectCommitsParams {
  project_id: string;
  ref_name?: string;
  since?: string;
  until?: string;
  author?: string;
  path?: string;
  all?: boolean;
  with_stats?: boolean;
  first_parent?: boolean;
  order?: 'default' | 'topo';
  trailers?: boolean;
  page?: number;
  per_page?: number;
}

export interface GetCommitParams {
  project_id: string;
  sha: string;
  stats?: boolean;
}

export interface GetCommitDiffParams {
  project_id: string;
  sha: string;
}

export interface ListPipelinesParams {
  project_id: string;
  status?: GitLabPipeline['status'];
  ref?: string;
  sha?: string;
  yaml_errors?: boolean;
  name?: string;
  username?: string;
  updated_after?: string;
  updated_before?: string;
  order_by?: 'id' | 'status' | 'ref' | 'updated_at' | 'user_id';
  sort?: 'asc' | 'desc';
  per_page?: number;
}

export interface GetPipelineParams {
  project_id: string;
  pipeline_id: number;
}

export interface CreatePipelineParams {
  project_id: string;
  ref: string;
  variables?: Array<{
    key: string;
    value: string;
    variable_type?: 'env_var' | 'file';
  }>;
}

export interface PipelineActionParams {
  project_id: string;
  pipeline_id: number;
}

export interface ListPipelineJobsParams {
  project_id: string;
  pipeline_id: number;
  scope?: GitLabJob['status'][];
  include_retried?: boolean;
}

export interface GetPipelineVariablesParams {
  project_id: string;
  pipeline_id: number;
}

export interface GetJobLogsParams {
  project_id: string;
  job_id: number;
}

export interface GetJobTraceParams {
  project_id: string;
  job_id: number;
  lines_limit?: number;
  tail?: boolean;
  raw?: boolean;
}

// Merge Request Notes/Comments Types
export interface GitLabNote {
  id: number;
  type: string | null;
  body: string;
  attachment: string | null;
  author: GitLabUser;
  created_at: string;
  updated_at: string;
  system: boolean;
  noteable_id: number;
  noteable_type: string;
  noteable_iid: number | null;
  resolvable: boolean;
  resolved?: boolean;
  resolved_by?: GitLabUser | null;
  resolved_at?: string | null;
}

export interface GitLabDiffPosition {
  base_sha: string;
  start_sha: string;
  head_sha: string;
  old_path: string;
  new_path: string;
  position_type: 'text' | 'image';
  old_line?: number | null;
  new_line?: number | null;
}

export interface GitLabDiff {
  old_path: string;
  new_path: string;
  a_mode: string;
  b_mode: string;
  diff: string;
  new_file: boolean;
  renamed_file: boolean;
  deleted_file: boolean;
}

export interface GitLabCompare {
  commit: GitLabCommit;
  commits: GitLabCommit[];
  diffs: GitLabDiff[];
  compare_timeout: boolean;
  compare_same_ref: boolean;
}

export interface GitLabDiscussion {
  id: string;
  individual_note: boolean;
  notes: GitLabNote[];
}

export interface GitLabTemplate {
  name: string;
  content: string;
}

// Merge Request Notes/Discussion Parameter Types
export interface ListMRNotesParams {
  project_id: string;
  merge_request_iid: number;
  sort?: 'asc' | 'desc';
  order_by?: 'created_at' | 'updated_at';
  per_page?: number;
}

export interface ListMRDiscussionsParams {
  project_id: string;
  merge_request_iid: number;
  per_page?: number;
}

export interface CreateMRNoteParams {
  project_id: string;
  merge_request_iid: number;
  body: string;
}

export interface CreateMRDiscussionParams {
  project_id: string;
  merge_request_iid: number;
  body: string;
  position?: {
    base_sha: string;
    start_sha: string;
    head_sha: string;
    old_path: string;
    new_path: string;
    position_type?: 'text';
    old_line?: number;
    new_line?: number;
  };
}

export interface ReplyToMRDiscussionParams {
  project_id: string;
  merge_request_iid: number;
  discussion_id: string;
  body: string;
}

export interface ResolveMRDiscussionParams {
  project_id: string;
  merge_request_iid: number;
  discussion_id: string;
  resolved?: boolean;
}

export interface UpdateMRDiscussionNoteParams {
  project_id: string;
  merge_request_iid: number;
  discussion_id: string;
  note_id: number;
  body: string;
}

export interface CreateMRDiscussionNoteParams {
  project_id: string;
  merge_request_iid: number;
  discussion_id: string;
  body: string;
}

export interface DeleteMRDiscussionNoteParams {
  project_id: string;
  merge_request_iid: number;
  discussion_id: string;
  note_id: number;
}

export interface MarkMRAsDraftParams {
  project_id: string;
  merge_request_iid: number;
}

export interface MarkMRAsReadyParams {
  project_id: string;
  merge_request_iid: number;
}

export interface ListMRTemplatesParams {
  project_id: string;
}

export interface GetMRTemplateParams {
  project_id: string;
  name: string;
}

// MCP Response Types
export interface MCPResponse {
  content: Array<{
    type: 'text';
    text: string;
  }>;
  isError?: boolean;
}

// Export main server class type
export interface IGitLabMCPServer {
  run(): Promise<void>;
}