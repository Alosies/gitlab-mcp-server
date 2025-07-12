# GitLab MCP Server Configuration

The GitLab MCP Server supports optional configuration files to provide additional context and customize behavior. **The config file is completely optional** - the server works perfectly with just the `NPM_CONFIG_TOKEN` environment variable.

## Quick Start (No Config Required)

```bash
# Just set your GitLab token and run
export NPM_CONFIG_TOKEN='your-gitlab-token-here'
npm start
```

## Configuration File Support

### Supported Formats

The server automatically searches for configuration files in these locations (in order):

1. **Explicit path**: `--config /path/to/config.json`
2. **Environment variable**: `GITLAB_MCP_CONFIG=/path/to/config.json`
3. **Current directory**:
   - `gitlab-mcp.json`
   - `.gitlab-mcp.json` 
   - `gitlab-mcp.config.json`
4. **User home directory**:
   - `~/.gitlab-mcp.json`
   - `~/.config/gitlab-mcp/config.json`
5. **Standard MCP locations**:
   - Claude Desktop config
   - VS Code MCP config

### Configuration Structure

```json
{
  "gitlab": {
    "baseUrl": "https://gitlab.com",
    "token": "optional-token-here",
    "defaultProject": "myorg/myproject"
  },
  "server": {
    "name": "gitlab-mcp-server",
    "version": "1.2.0", 
    "timeout": 30000
  },
  "defaults": {
    "perPage": 50,
    "projectScope": "owned"
  },
  "features": {
    "enableCaching": false,
    "enableMetrics": true,
    "strictScoping": true
  }
}
```

## Configuration Options

### GitLab Settings (`gitlab`)

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `baseUrl` | string | `"https://gitlab.com"` | GitLab instance URL |
| `token` | string | `undefined` | GitLab personal access token (prefer env var) |
| `defaultProject` | string | `undefined` | Default project for operations |

### Server Settings (`server`)

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `name` | string | `"gitlab-mcp-server"` | MCP server name |
| `version` | string | `"1.0.0"` | MCP server version |
| `timeout` | number | `30000` | Request timeout in ms |

### Default Parameters (`defaults`)

| Option | Type | Default | Accepted Values | Description |
|--------|------|---------|-----------------|-------------|
| `perPage` | number | `20` | `1-100` | Default items per page |
| `projectScope` | string | `"owned"` | `"owned"`, `"all"` | Default project scope for list_projects |

**Note**: Issue and merge request scoping (`scope` parameter) is handled intelligently by the LLM based on user prompts rather than configuration. The LLM will automatically determine appropriate scopes like `"created_by_me"`, `"assigned_to_me"`, or `"all"` based on the context of the user's request.

### Feature Toggles (`features`)

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enableCaching` | boolean | `false` | Enable response caching |
| `enableMetrics` | boolean | `false` | Enable metrics collection |
| `strictScoping` | boolean | `true` | Enforce strict data scoping |

## Environment Variables

Environment variables have **highest priority** and override config file settings:

```bash
# GitLab connection
export NPM_CONFIG_TOKEN='your-token'           # Required
export GITLAB_BASE_URL='https://gitlab.com'    # Optional
export GITLAB_DEFAULT_PROJECT='myorg/myproject' # Optional

# Server behavior  
export GITLAB_MCP_TIMEOUT=30000                # Optional
export GITLAB_MCP_PER_PAGE=50                  # Optional
export GITLAB_MCP_PROJECT_SCOPE=owned          # Optional

# Features
export GITLAB_MCP_ENABLE_CACHING=true          # Optional
export GITLAB_MCP_ENABLE_METRICS=true          # Optional  
export GITLAB_MCP_STRICT_SCOPING=false         # Optional
```

## Usage Examples

### 1. Environment Variable Only (Recommended)

```bash
export NPM_CONFIG_TOKEN='glpat-xxxxxxxxxxxxxxxxxxxx'
npm start
```

### 2. With Custom Config File

```bash
export NPM_CONFIG_TOKEN='glpat-xxxxxxxxxxxxxxxxxxxx'
npm start -- --config ./my-config.json
```

### 3. Claude Desktop Integration

**Without config file:**
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

**With additional environment settings:**
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

### 4. Self-Hosted GitLab

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

## Configuration Priority

Settings are merged in this order (highest to lowest priority):

1. **Environment variables** (highest priority)
2. **Configuration file** 
3. **Default values** (lowest priority)

## Validation

The server validates configuration on startup:

- ✅ **Token required**: Must be provided via env var or config file
- ✅ **Valid URLs**: Base URL must be a valid URL format
- ✅ **Valid ranges**: `perPage` must be 1-100, timeout must be >= 1000ms
- ✅ **Valid enums**: Scope values must match allowed options

## Troubleshooting

### Common Issues

```bash
# ❌ No token provided
Error: GitLab token is required. Set NPM_CONFIG_TOKEN environment variable.

# ✅ Solution
export NPM_CONFIG_TOKEN='your-token-here'
```

```bash
# ❌ Invalid config file
Configuration validation failed: Invalid GitLab base URL: not-a-url

# ✅ Solution: Use valid URL
{
  "gitlab": {
    "baseUrl": "https://gitlab.mycompany.com"
  }
}
```

### Debug Configuration Loading

```bash
# See which config files are being loaded
npm start 2>&1 | grep "Loading config"
```

## Migration from Environment-Only Setup

**Before (still works):**
```bash
export NPM_CONFIG_TOKEN='token'
npm start
```

**After (optional enhancement):**
```bash
export NPM_CONFIG_TOKEN='token'  # Still required
# Optional: Add gitlab-mcp.json for additional context
npm start
```

No breaking changes - all existing setups continue to work unchanged!

## GitLab API Parameter Reference

Many configuration options correspond directly to GitLab API parameters. Here's the complete reference:

### Project Visibility Options

For `list_projects` tool and `projectScope` config:

| Value | Description | GitLab API Reference |
|-------|-------------|---------------------|
| `"public"` | Public projects visible to everyone | [Projects API](https://docs.gitlab.com/api/projects/) |
| `"internal"` | Internal projects visible to logged-in users | |
| `"private"` | Private projects visible to project members | |

### Issue State Options

For `list_issues` tool `state` parameter:

| Value | Description | GitLab API Reference |
|-------|-------------|---------------------|
| `"opened"` | Open issues (default) | [Issues API](https://docs.gitlab.com/api/issues/) |
| `"closed"` | Closed issues | |
| `"all"` | All issues regardless of state | |

### Issue Scope Options

For `list_issues` tool `scope` parameter:

| Value | Description | GitLab API Reference |
|-------|-------------|---------------------|
| `"created_by_me"` | Issues created by current user (GitLab API default) | [Issues API - Scope](https://docs.gitlab.com/api/issues/) |
| `"assigned_to_me"` | Issues assigned to current user | |
| `"all"` | All issues user has access to | |

### Merge Request State Options

For `list_merge_requests` tool `state` parameter:

| Value | Description | GitLab API Reference |
|-------|-------------|---------------------|
| `"opened"` | Open merge requests (default) | [Merge Requests API](https://docs.gitlab.com/api/merge_requests/) |
| `"closed"` | Closed merge requests | |
| `"merged"` | Merged merge requests | |
| `"all"` | All merge requests regardless of state | |

### Merge Request Scope Options

For `list_merge_requests` tool `scope` parameter:

| Value | Description | GitLab API Reference |
|-------|-------------|---------------------|
| `"created_by_me"` | MRs created by current user (GitLab API default) | [Merge Requests API - Scope](https://docs.gitlab.com/api/merge_requests/) |
| `"assigned_to_me"` | MRs assigned to current user | |
| `"all"` | All MRs user has access to | |

### Pipeline Status Options

For `list_pipelines` tool `status` parameter:

| Value | Description | GitLab API Reference |
|-------|-------------|---------------------|
| `"created"` | Pipeline was created | [Pipelines API](https://docs.gitlab.com/api/pipelines/) |
| `"waiting_for_resource"` | Pipeline is waiting for resources | |
| `"preparing"` | Pipeline is preparing | |
| `"pending"` | Pipeline is pending | |
| `"running"` | Pipeline is running | |
| `"success"` | Pipeline completed successfully | |
| `"failed"` | Pipeline failed | |
| `"canceled"` | Pipeline was canceled | |
| `"skipped"` | Pipeline was skipped | |
| `"manual"` | Pipeline requires manual action | |
| `"scheduled"` | Pipeline is scheduled | |

### Job Status Options

For `list_pipeline_jobs` tool `scope` parameter:

| Value | Description | GitLab API Reference |
|-------|-------------|---------------------|
| `"created"` | Job was created | [Jobs API](https://docs.gitlab.com/api/jobs/) |
| `"pending"` | Job is pending | |
| `"running"` | Job is running | |
| `"failed"` | Job failed | |
| `"success"` | Job completed successfully | |
| `"canceled"` | Job was canceled | |
| `"skipped"` | Job was skipped | |
| `"waiting_for_resource"` | Job is waiting for resources | |
| `"manual"` | Job requires manual action | |

### Merge Request State Events

For `update_merge_request` tool `state_event` parameter:

| Value | Description | GitLab API Reference |
|-------|-------------|---------------------|
| `"close"` | Close the merge request | [Update MR API](https://docs.gitlab.com/api/merge_requests/#update-mr) |
| `"reopen"` | Reopen a closed merge request | |

## GitLab API Documentation

For complete parameter details and additional options, refer to the official GitLab API documentation:

- **[Projects API](https://docs.gitlab.com/api/projects/)** - Project management endpoints
- **[Issues API](https://docs.gitlab.com/api/issues/)** - Issue management endpoints  
- **[Merge Requests API](https://docs.gitlab.com/api/merge_requests/)** - Merge request endpoints
- **[Pipelines API](https://docs.gitlab.com/api/pipelines/)** - Pipeline management
- **[Jobs API](https://docs.gitlab.com/api/jobs/)** - Job and trace endpoints
- **[Branches API](https://docs.gitlab.com/api/branches/)** - Repository branch operations
- **[Commits API](https://docs.gitlab.com/api/commits/)** - Repository commit operations

### Custom GitLab Instances

For self-hosted GitLab instances, the API paths remain the same but use your instance's base URL:

```json
{
  "gitlab": {
    "baseUrl": "https://gitlab.mycompany.com"
  }
}
```

API endpoints will be: `https://gitlab.mycompany.com/api/v4/...`