# Installation Guide

## Prerequisites

- Node.js 18+ and npm
- GitLab personal access token
- TypeScript 5.0+ (for development or type-checking)

## Installation Options

### Option 1: Use with npx (Recommended)

No installation required! Claude Desktop will automatically download and run the latest version:

```json
{
  "mcpServers": {
    "gitlab": {
      "command": "npx",
      "args": ["-y", "@alosies/gitlab-mcp-server"],
      "env": {
        "NPM_CONFIG_TOKEN": "your-gitlab-token-here"
      }
    }
  }
}
```

### Option 2: Global Installation

```bash
npm install -g @alosies/gitlab-mcp-server
```

Then use in Claude Desktop:
```json
{
  "mcpServers": {
    "gitlab": {
      "command": "gitlab-mcp-server",
      "env": {
        "NPM_CONFIG_TOKEN": "your-gitlab-token-here"
      }
    }
  }
}
```

### Option 3: Development from Source

1. Clone this repository
2. Install dependencies: `npm install`
3. Build the TypeScript code: `npm run build`
4. Use in Claude Desktop with full path

## Creating a GitLab Personal Access Token

1. Go to GitLab.com (or your GitLab instance)
2. Navigate to **Settings** > **Access Tokens**
3. Create a new token with the following scopes:
   - `api` - Full API access
   - `read_user` - Read user information
   - `read_repository` - Read repository data

## Environment Setup

Set your GitLab token as an environment variable:

```bash
export NPM_CONFIG_TOKEN="your-gitlab-token-here"
```

Or create a `.env` file (not recommended for production):

```
NPM_CONFIG_TOKEN=your-gitlab-token-here
```

## Claude Desktop Configuration

Add the following to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

**Recommended: Using npx (always gets latest version):**

```json
{
  "mcpServers": {
    "gitlab": {
      "command": "npx",
      "args": ["-y", "@alosies/gitlab-mcp-server"],
      "env": {
        "NPM_CONFIG_TOKEN": "your-gitlab-token-here"
      }
    }
  }
}
```

**Alternative: Global installation:**

```bash
npm install -g @alosies/gitlab-mcp-server
```

```json
{
  "mcpServers": {
    "gitlab": {
      "command": "gitlab-mcp-server",
      "env": {
        "NPM_CONFIG_TOKEN": "your-gitlab-token-here"
      }
    }
  }
}
```

**Development: From source:**

```json
{
  "mcpServers": {
    "gitlab": {
      "command": "node",
      "args": ["/path/to/gitlab-mcp-server/dist/index.js"],
      "env": {
        "NPM_CONFIG_TOKEN": "your-gitlab-token-here"
      }
    }
  }
}
```

## Running the Server

### With npx (recommended):
```bash
npx -y @alosies/gitlab-mcp-server
```

### If installed globally:
```bash
gitlab-mcp-server
```

### Development from source:
```bash
npm start
# or for auto-rebuild:
npm run dev
```

**⚠️ Security Note**: Never commit your GitLab token to version control. The token in the example above is just a placeholder.

## Configuration (Optional)

The GitLab MCP Server supports **optional configuration files** for additional customization. The server works perfectly with just the `NPM_CONFIG_TOKEN` environment variable - configuration files only provide additional context.

### Quick Start (No Config Required)

```bash
# Just set your token and run - that's it!
export NPM_CONFIG_TOKEN='your-gitlab-token-here'
npm start
```

### Optional Configuration File

For additional customization, you can create a configuration file:

**Example `gitlab-mcp.json`:**
```json
{
  "gitlab": {
    "baseUrl": "https://gitlab.com",
    "defaultProject": "myorg/myproject"
  },
  "defaults": {
    "perPage": 50,
    "projectScope": "owned"
  },
  "features": {
    "strictScoping": true
  }
}
```

**Usage with config file:**
```bash
export NPM_CONFIG_TOKEN='your-token'
npm start --config ./gitlab-mcp.json
```

### Configuration Locations

The server automatically searches for config files in:
- `--config /path/to/config.json` (command line)
- `GITLAB_MCP_CONFIG=/path/to/config.json` (environment variable)
- `./gitlab-mcp.json` (current directory)
- `~/.gitlab-mcp.json` (user home)
- Claude Desktop config (automatic)

### Environment Variables (Highest Priority)

```bash
export NPM_CONFIG_TOKEN='your-token'           # Required
export GITLAB_BASE_URL='https://gitlab.com'    # Optional
export GITLAB_DEFAULT_PROJECT='myorg/project'  # Optional
export GITLAB_MCP_PER_PAGE=50                  # Optional
```

For complete configuration documentation, see [configuration.md](configuration.md).