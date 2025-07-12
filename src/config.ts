import { readFileSync, existsSync } from 'fs';
import { resolve, join } from 'path';
import { homedir } from 'os';

export interface GitLabMCPConfig {
  // GitLab connection settings
  gitlab: {
    baseUrl?: string;
    token?: string;
    defaultProject?: string;
  };
  
  // Server behavior settings
  server: {
    name?: string;
    version?: string;
    timeout?: number;
  };
  
  // Default parameters for tools
  defaults: {
    perPage?: number;
    projectScope?: 'owned' | 'all';
  };
  
  // Feature toggles
  features: {
    enableCaching?: boolean;
    enableMetrics?: boolean;
    strictScoping?: boolean;
  };
}

export const DEFAULT_CONFIG: GitLabMCPConfig = {
  gitlab: {
    baseUrl: 'https://gitlab.com',
    token: undefined,
    defaultProject: undefined,
  },
  server: {
    name: 'gitlab-mcp-server',
    version: '1.3.1',
    timeout: 30000,
  },
  defaults: {
    perPage: 20,
    projectScope: 'owned',
  },
  features: {
    enableCaching: false,
    enableMetrics: false,
    strictScoping: true,
  },
};

export class ConfigManager {
  private config: GitLabMCPConfig;
  
  constructor(configPath?: string) {
    this.config = this.loadConfig(configPath);
  }
  
  private loadConfig(configPath?: string): GitLabMCPConfig {
    let loadedConfig: Partial<GitLabMCPConfig> = {};
    
    // Try loading from specified path or standard locations
    const configPaths = this.getConfigPaths(configPath);
    
    for (const path of configPaths) {
      if (existsSync(path)) {
        try {
          console.error(`📄 Loading config from: ${path}`);
          const fileContent = readFileSync(path, 'utf-8');
          const parsed = JSON.parse(fileContent);
          
          // Support different config formats
          if (parsed.gitlab || parsed.server || parsed.defaults || parsed.features) {
            // Direct GitLab MCP config format
            loadedConfig = { ...loadedConfig, ...parsed };
          } else if (parsed.mcpServers?.gitlab) {
            // Claude Desktop style config - extract gitlab server config
            const gitlabServer = parsed.mcpServers.gitlab;
            if (gitlabServer.env) {
              loadedConfig.gitlab = {
                ...loadedConfig.gitlab,
                token: gitlabServer.env.NPM_CONFIG_TOKEN || gitlabServer.env.GITLAB_TOKEN,
                baseUrl: gitlabServer.env.GITLAB_BASE_URL,
                defaultProject: gitlabServer.env.GITLAB_DEFAULT_PROJECT,
              };
            }
          }
          break;
        } catch (error) {
          console.error(`⚠️  Failed to parse config file ${path}:`, error);
        }
      }
    }
    
    // Override with environment variables (highest priority)
    const envConfig = this.loadFromEnv();
    
    // Merge: DEFAULT_CONFIG <- file config <- env config
    return {
      ...DEFAULT_CONFIG,
      ...this.deepMerge(DEFAULT_CONFIG, loadedConfig),
      ...this.deepMerge(this.deepMerge(DEFAULT_CONFIG, loadedConfig), envConfig),
    };
  }
  
  private getConfigPaths(configPath?: string): string[] {
    const paths: string[] = [];
    
    // 1. Explicit path provided
    if (configPath) {
      paths.push(resolve(configPath));
    }
    
    // 2. Environment variable
    if (process.env.GITLAB_MCP_CONFIG) {
      paths.push(resolve(process.env.GITLAB_MCP_CONFIG));
    }
    
    // 3. Current working directory
    paths.push(
      join(process.cwd(), 'gitlab-mcp.json'),
      join(process.cwd(), '.gitlab-mcp.json'),
      join(process.cwd(), 'gitlab-mcp.config.json'),
    );
    
    // 4. User home directory  
    paths.push(
      join(homedir(), '.gitlab-mcp.json'),
      join(homedir(), '.config', 'gitlab-mcp', 'config.json'),
    );
    
    // 5. Standard MCP config locations (VS Code, Claude Desktop)
    if (process.platform === 'darwin') {
      paths.push(
        join(homedir(), 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json'),
      );
    } else if (process.platform === 'win32') {
      paths.push(
        join(process.env.APPDATA || '', 'Claude', 'claude_desktop_config.json'),
      );
    }
    
    paths.push(join(process.cwd(), '.vscode', 'mcp.json'));
    
    return paths;
  }
  
  private loadFromEnv(): Partial<GitLabMCPConfig> {
    return {
      gitlab: {
        baseUrl: process.env.GITLAB_BASE_URL || process.env.NPM_CONFIG_BASE_URL,
        token: process.env.NPM_CONFIG_TOKEN || process.env.GITLAB_TOKEN || process.env.GITLAB_ACCESS_TOKEN,
        defaultProject: process.env.GITLAB_DEFAULT_PROJECT,
      },
      server: {
        timeout: process.env.GITLAB_MCP_TIMEOUT ? parseInt(process.env.GITLAB_MCP_TIMEOUT, 10) : undefined,
      },
      defaults: {
        perPage: process.env.GITLAB_MCP_PER_PAGE ? parseInt(process.env.GITLAB_MCP_PER_PAGE, 10) : undefined,
        projectScope: (process.env.GITLAB_MCP_PROJECT_SCOPE as any) || undefined,
      },
      features: {
        enableCaching: process.env.GITLAB_MCP_ENABLE_CACHING === 'true',
        enableMetrics: process.env.GITLAB_MCP_ENABLE_METRICS === 'true',
        strictScoping: process.env.GITLAB_MCP_STRICT_SCOPING !== 'false', // default true
      },
    };
  }
  
  private deepMerge(target: any, source: any): any {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] !== null && source[key] !== undefined) {
        if (typeof source[key] === 'object' && !Array.isArray(source[key])) {
          result[key] = this.deepMerge(target[key] || {}, source[key]);
        } else {
          result[key] = source[key];
        }
      }
    }
    
    return result;
  }
  
  public get(): GitLabMCPConfig {
    return this.config;
  }
  
  public getGitLabConfig() {
    return this.config.gitlab;
  }
  
  public getServerConfig() {
    return this.config.server;
  }
  
  public getDefaults() {
    return this.config.defaults;
  }
  
  public getFeatures() {
    return this.config.features;
  }
  
  public validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // GitLab token is not required in config validation - it can come from env only
    
    // URL validation
    if (this.config.gitlab.baseUrl) {
      try {
        new URL(this.config.gitlab.baseUrl);
      } catch {
        errors.push(`Invalid GitLab base URL: ${this.config.gitlab.baseUrl}`);
      }
    }
    
    // Numeric validations
    if (this.config.defaults.perPage && (this.config.defaults.perPage < 1 || this.config.defaults.perPage > 100)) {
      errors.push('perPage must be between 1 and 100');
    }
    
    if (this.config.server.timeout && this.config.server.timeout < 1000) {
      errors.push('Server timeout must be at least 1000ms');
    }
    
    return {
      valid: errors.length === 0,
      errors,
    };
  }
}