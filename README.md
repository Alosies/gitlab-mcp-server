# GitLab MCP Server

A fully typed TypeScript [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server for comprehensive GitLab integration.

<a href="https://glama.ai/mcp/servers/@Alosies/gitlab-mcp-server">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@Alosies/gitlab-mcp-server/badge" alt="GitLab Server MCP server" />
</a>

## Quick Start

### 1. Get a GitLab Token

Create a [GitLab Personal Access Token](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html) with `api`, `read_user`, and `read_repository` scopes.

### 2. Add to Claude Desktop

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

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

### 3. Start Using

Ask Claude things like:
- "List my GitLab projects"
- "Show me open issues in myproject"
- "Create a merge request from feature-branch to main"
- "Get the logs for job #123"

## Features

- **Projects**: List, get details
- **Issues**: List, get, create  
- **Merge Requests**: List, get, create, update
- **Pipelines**: List, get, create, retry, cancel, delete
- **Jobs**: List jobs, get logs with advanced trace options
- **Repository**: List branches, get commits
- **User**: Get current user info
- **TypeScript**: Fully typed with comprehensive type definitions

## Documentation

- **[Installation Guide](docs/installation.md)** - Detailed installation options and setup
- **[Available Tools](docs/tools.md)** - Complete list of tools and parameters  
- **[Configuration](docs/configuration.md)** - Optional configuration file setup
- **[Usage Examples](docs/examples.md)** - Real-world usage examples and workflows
- **[TypeScript Guide](docs/typescript.md)** - TypeScript usage and type definitions
- **[Development](docs/development.md)** - Contributing and development setup

## Self-Hosted GitLab

For self-hosted GitLab instances, add your base URL:

```json
{
  "mcpServers": {
    "gitlab": {
      "command": "npx",
      "args": ["-y", "@alosies/gitlab-mcp-server"],
      "env": {
        "NPM_CONFIG_TOKEN": "your-token",
        "GITLAB_BASE_URL": "https://gitlab.mycompany.com"
      }
    }
  }
}
```

## Support

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **GitLab API**: [GitLab API Documentation](https://docs.gitlab.com/ee/api/)
- **MCP Protocol**: [Model Context Protocol](https://modelcontextprotocol.io/)

## License

MIT License