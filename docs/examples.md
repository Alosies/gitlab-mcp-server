# Usage Examples

Once configured with Claude Desktop, you can use natural language to interact with GitLab:

## Project Management

- "List my GitLab projects" (returns minimal info by default for faster responses)
- "Show me all public projects"
- "Get details of project mygroup/myproject"
- "Find projects with 'backend' in the name"
- "List my projects with full details" (use when you need complete project information)

## Issue Management

- "Show me open issues in project mygroup/myproject"
- "List all issues assigned to me in project 123"
- "Get details of issue #42 in myproject"
- "Create a new issue titled 'Bug fix needed' in project 123"
- "Find issues with label 'bug' in project mygroup/frontend"

## Merge Request Management

- "List merge requests for the main branch"
- "Show me all open merge requests I created"
- "Get details of merge request #42 in myproject"
- "Create a merge request from feature-branch to main"
- "Update merge request #123 to change the title"
- "Close merge request #456 in project mygroup/backend"

## Pipeline and CI/CD

- "Show me all pipelines in project 123"
- "Get the status of pipeline #456 in myproject"
- "Create a new pipeline for the main branch"
- "Retry the failed pipeline #789"
- "Cancel the running pipeline #101"
- "Show me all jobs in pipeline #456"

## Job Logs and Debugging

- "Get the logs for job #789 in project myproject"
- "Get the last 500 lines of logs for job #789"
- "Show me the first 100 lines of job trace for debugging"
- "Get raw job logs for job #456 without formatting"

## Repository Operations

- "List all branches in project mygroup/myproject"
- "Show me recent commits in the main branch"
- "Get commit history for the last week"

## User Information

- "Show me my GitLab profile information"
- "Get current user details"

## Advanced Usage Examples

### Working with Large Logs

**For debugging build failures:**
```
"Get the first 200 lines of job 123 logs to see the build start"
```

**For checking deployment results:**
```
"Show me the last 100 lines from job 456 to see if deployment succeeded"
```

**For script processing:**
```
"Get raw job logs for job 789 without any formatting or metadata"
```

### Project Scoping

**User's own projects (default):**
```
"List my projects"
```

**All accessible projects:**
```
"Show me all projects I have access to"
```

### Issue and MR Filtering

The LLM intelligently determines scope based on your request:

**Your own items:**
- "Show me issues I created"
- "List merge requests I submitted"

**Items assigned to you:**
- "What issues are assigned to me?"
- "Show me merge requests I need to review"

**All accessible items:**
- "List all open issues in the project"
- "Show me all merge requests targeting main branch"

### Pipeline Management

**Creating pipelines with variables:**
```
"Create a pipeline on main branch with environment variable DEPLOY_ENV=staging"
```

**Monitoring pipeline status:**
```
"Show me the status of all running pipelines"
```

**Managing failed pipelines:**
```
"Retry all failed pipelines from today"
```

### Branch and Commit Analysis

**Finding specific commits:**
```
"Show me commits by john.doe@company.com in the last month"
```

**Branch comparison:**
```
"List all feature branches that haven't been merged"
```

## Common Workflows

### 1. Daily Standup Preparation

```
1. "Show me issues assigned to me"
2. "List merge requests I created that are still open"
3. "Get status of pipelines for my recent commits"
```

### 2. Code Review Process

```
1. "Show me merge requests waiting for my review"
2. "Get details of merge request #123 including pipeline status"
3. "List jobs in the latest pipeline for this MR"
```

### 3. Debugging Failed Builds

```
1. "Show me failed pipelines in project mygroup/backend"
2. "Get jobs for pipeline #456 that failed"
3. "Show me the last 200 lines of logs for failed job #789"
4. "Get full trace of job #789 to analyze the error"
```

### 4. Release Management

```
1. "Create a new pipeline on release branch"
2. "Monitor pipeline #123 status for release deployment"
3. "Get deployment job logs to verify release success"
```

### 5. Issue Triage

```
1. "List all unassigned issues with label 'bug'"
2. "Show me high priority issues created this week"
3. "Get details of issue #456 to understand the problem"
```

## Error Handling Examples

The server provides helpful error messages:

**Invalid project:**
```
"Error: Project not found or access denied"
```

**Missing permissions:**
```
"Error: Insufficient permissions to access this resource"
```

**Invalid parameters:**
```
"Error: Pipeline ID must be a number"
```

## Tips for Better Results

1. **Be specific with project identifiers**: Use full paths like "myorg/myproject" or exact project IDs

2. **Use natural language**: The LLM understands context like "my issues", "recent commits", "failed jobs"

3. **Combine operations**: Ask for related information in one request like "show me the merge request and its pipeline status"

4. **Specify time ranges**: Use phrases like "last week", "today", "this month" for filtering

5. **Use branch names**: Reference specific branches when looking at commits or creating pipelines

## Configuration Examples

### Environment Variables Only

```bash
export NPM_CONFIG_TOKEN='glpat-xxxxxxxxxxxxxxxxxxxx'
npm start
```

### With Custom Config File

```bash
export NPM_CONFIG_TOKEN='glpat-xxxxxxxxxxxxxxxxxxxx'
npm start -- --config ./my-config.json
```

### Claude Desktop Integration

**Basic setup:**
```json
{
  "mcpServers": {
    "gitlab": {
      "command": "npx",
      "args": ["-y", "@alosies/gitlab-mcp-server"],
      "env": {
        "NPM_CONFIG_TOKEN": "your-token-here"
      }
    }
  }
}
```

**With additional settings:**
```json
{
  "mcpServers": {
    "gitlab": {
      "command": "npx", 
      "args": ["-y", "@alosies/gitlab-mcp-server"],
      "env": {
        "NPM_CONFIG_TOKEN": "your-token-here",
        "GITLAB_DEFAULT_PROJECT": "myorg/myproject",
        "GITLAB_MCP_PER_PAGE": "30"
      }
    }
  }
}
```

### Self-Hosted GitLab

```json
{
  "gitlab": {
    "baseUrl": "https://gitlab.mycompany.com",
    "defaultProject": "internal/myproject"
  },
  "defaults": {
    "perPage": 100,
    "projectScope": "owned"
  }
}
```