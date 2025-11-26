# Available Tools

## Project Management

### `list_projects`
List GitLab projects with minimal info by default (to reduce token usage from 40k+ to much less)
- **Optional filters**: search, visibility, owned, per_page, simple
- **Token optimization**: Uses `simple=true` by default to return only essential project fields (id, name, path, web_url, etc.) instead of full project details
- **Full details**: Set `simple=false` when you need complete project information

### `get_project`
Get detailed information about a specific project
- **Required**: project_id (ID or path like "group/project")

## Issue Management

### `list_issues`
List issues in a project
- **Required**: project_id
- **Optional filters**: state, labels, assignee_id, author_id, search, scope, per_page

### `get_issue`
Get detailed information about a specific issue
- **Required**: project_id, issue_iid

### `create_issue`
Create a new issue
- **Required**: project_id, title
- **Optional**: description, labels, assignee_ids, milestone_id

## Merge Request Management

### `list_merge_requests`
List merge requests in a project
- **Required**: project_id
- **Optional filters**: state, target_branch, source_branch, assignee_id, author_id, reviewer_id, reviewer_username, search, scope, per_page

### `get_merge_request`
Get detailed information about a specific merge request
- **Required**: project_id, merge_request_iid

### `create_merge_request`
Create a new merge request
- **Required**: project_id, title, source_branch, target_branch
- **Optional**: description, assignee_ids, reviewer_ids, labels, milestone_id

### `update_merge_request`
Update an existing merge request
- **Required**: project_id, merge_request_iid
- **Optional**: title, description, state_event, target_branch, assignee_id, assignee_ids, reviewer_ids, labels, milestone_id, remove_source_branch, squash, allow_collaboration, merge_when_pipeline_succeeds

## Merge Request Comments & Discussions

### `list_mr_notes`
List all notes (comments) on a merge request
- **Required**: project_id, merge_request_iid
- **Optional**: sort (asc/desc), order_by (created_at/updated_at), page, per_page

### `list_mr_discussions`
List discussions (threaded comments) on a merge request
- **Required**: project_id, merge_request_iid
- **Optional**:
  - **unresolved_only**: If true, fetches all discussions and returns only unresolved ones (saves tokens)
  - **page**: Page number for pagination (ignored when unresolved_only=true)
  - **per_page**: Results per page (max 100)

### `create_mr_note`
Create a top-level comment on a merge request
- **Required**: project_id, merge_request_iid, body

### `create_mr_discussion`
Create a new discussion (optionally on a specific line of code)
- **Required**: project_id, merge_request_iid, body
- **Optional**: position (for inline comments on diff)
  - **position fields**: base_sha, start_sha, head_sha, old_path, new_path, old_line, new_line

### `reply_to_mr_discussion`
Reply to an existing discussion thread
- **Required**: project_id, merge_request_iid, discussion_id, body

### `resolve_mr_discussion`
Mark a discussion as resolved
- **Required**: project_id, merge_request_iid, discussion_id

### `unresolve_mr_discussion`
Mark a discussion as unresolved
- **Required**: project_id, merge_request_iid, discussion_id

## Merge Request Draft Status

### `mark_mr_as_draft`
Mark a merge request as draft (adds "Draft:" prefix)
- **Required**: project_id, merge_request_iid

### `mark_mr_as_ready`
Mark a merge request as ready (removes "Draft:" or "WIP:" prefix)
- **Required**: project_id, merge_request_iid

## Merge Request Templates

### `list_mr_templates`
List available merge request templates in a project
- **Required**: project_id

### `get_mr_template`
Get the content of a specific merge request template
- **Required**: project_id, name (template name)

## Repository Operations

### `list_project_branches`
List branches in a project
- **Required**: project_id
- **Optional**: search, per_page

### `get_project_commits`
Get commit history for a project
- **Required**: project_id
- **Optional**: ref_name, since, until, author, per_page

## Pipeline Management

### `list_pipelines`
List pipelines in a project
- **Required**: project_id
- **Optional filters**: status, ref, sha, yaml_errors, name, username, updated_after, updated_before, order_by, sort, per_page

### `get_pipeline`
Get detailed information about a specific pipeline
- **Required**: project_id, pipeline_id

### `create_pipeline`
Create a new pipeline
- **Required**: project_id, ref (branch or tag)
- **Optional**: variables (array of key-value pairs)

### `retry_pipeline`
Retry a failed pipeline
- **Required**: project_id, pipeline_id

### `cancel_pipeline`
Cancel a running pipeline
- **Required**: project_id, pipeline_id

### `delete_pipeline`
Delete a pipeline
- **Required**: project_id, pipeline_id

### `list_pipeline_jobs`
List jobs within a pipeline
- **Required**: project_id, pipeline_id
- **Optional**: scope (filter by job status), include_retried

### `get_pipeline_variables`
Get variables used in a pipeline
- **Required**: project_id, pipeline_id

### `get_job_logs`
Get the log (trace) file of a specific job
- **Required**: project_id, job_id

### `get_job_trace`
Get job trace with advanced options for large logs
- **Required**: project_id, job_id
- **Optional**: lines_limit (default: 1000), tail (default: false), raw (default: false)

## User Information

### `get_user`
Get current authenticated user information

## Enhanced Job Trace Features

The `get_job_trace` tool provides advanced options for handling large CI/CD job logs:

### Key Features

- **🔢 Line Limiting**: Control how many lines to retrieve (default: 1000)
- **🔚 Tail Mode**: Get the last N lines instead of first N lines
- **📄 Raw Mode**: Return clean log content without formatting
- **📊 Metadata**: Shows total lines, truncation info, and navigation hints
- **⚠️ Large Log Handling**: Automatic truncation warnings for logs > limit

### Usage Examples

**Get last 500 lines (tail mode):**
```
"Get the last 500 lines from job 123 in project myproject"
```

**Get first 100 lines for debugging:**
```
"Show me first 100 lines of job 456 logs"
```

**Raw output without formatting:**
```
"Get raw job logs for job 789 without metadata"
```

### When to Use Each Tool

- **`get_job_logs`**: For complete logs of small to medium jobs
- **`get_job_trace`**: For large logs where you need:
  - Only recent output (tail mode)
  - Quick debugging (line limits)
  - Clean output for scripts (raw mode)
  - Metadata about log size

## Scope Parameters

Issue and merge request scoping (`scope` parameter) is handled intelligently by the LLM based on user prompts rather than configuration. The LLM will automatically determine appropriate scopes like:

- `"created_by_me"` - Items created by current user
- `"assigned_to_me"` - Items assigned to current user  
- `"all"` - All items user has access to

The LLM chooses the most appropriate scope based on the context of your request.