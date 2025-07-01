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
  search?: string;
  per_page?: number;
}

export interface GetMergeRequestParams {
  project_id: string;
  merge_request_iid: number;
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
  per_page?: number;
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