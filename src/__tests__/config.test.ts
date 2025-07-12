import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ConfigManager, DEFAULT_CONFIG } from '../config.js';
import { existsSync, readFileSync } from 'fs';
import { resolve, join } from 'path';
import { homedir } from 'os';

// Mock filesystem
vi.mock('fs');
vi.mock('path');
vi.mock('os');

const mockedExistsSync = vi.mocked(existsSync);
const mockedReadFileSync = vi.mocked(readFileSync);
const mockedResolve = vi.mocked(resolve);
const mockedJoin = vi.mocked(join);
const mockedHomedir = vi.mocked(homedir);

describe('ConfigManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear environment variables
    delete process.env.NPM_CONFIG_TOKEN;
    delete process.env.GITLAB_BASE_URL;
    delete process.env.GITLAB_MCP_CONFIG;
    delete process.env.GITLAB_MCP_PER_PAGE;
    delete process.env.GITLAB_MCP_PROJECT_SCOPE;
    
    // Mock path functions
    mockedResolve.mockImplementation((path: string) => path);
    mockedJoin.mockImplementation((...paths: string[]) => paths.join('/'));
    mockedHomedir.mockReturnValue('/home/user');
    
    // Mock console.error to avoid noise in tests
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('constructor and config loading', () => {
    it('should load default config when no files exist', () => {
      mockedExistsSync.mockReturnValue(false);
      
      const configManager = new ConfigManager();
      const config = configManager.get();
      
      expect(config).toEqual(DEFAULT_CONFIG);
    });

    it('should load config from specified file path', () => {
      const customConfig = {
        gitlab: { baseUrl: 'https://custom.gitlab.com' },
        defaults: { perPage: 50 }
      };
      
      mockedExistsSync.mockImplementation((path) => path === '/custom/config.json');
      mockedReadFileSync.mockReturnValue(JSON.stringify(customConfig));
      
      const configManager = new ConfigManager('/custom/config.json');
      const config = configManager.get();
      
      expect(config.gitlab.baseUrl).toBe('https://custom.gitlab.com');
      expect(config.defaults.perPage).toBe(50);
    });

    it('should merge config with defaults correctly', () => {
      const partialConfig = {
        gitlab: { baseUrl: 'https://custom.gitlab.com' },
        defaults: { perPage: 100 }
      };
      
      mockedExistsSync.mockImplementation((path) => path === '/custom/config.json');
      mockedReadFileSync.mockReturnValue(JSON.stringify(partialConfig));
      
      const configManager = new ConfigManager('/custom/config.json');
      const config = configManager.get();
      
      expect(config.gitlab.baseUrl).toBe('https://custom.gitlab.com');
      expect(config.gitlab.token).toBeUndefined(); // from default
      expect(config.server.name).toBe('gitlab-mcp-server'); // from default
      expect(config.defaults.perPage).toBe(100); // overridden
      expect(config.defaults.projectScope).toBe('owned'); // from default
    });

    it('should handle Claude Desktop config format', () => {
      const claudeConfig = {
        mcpServers: {
          gitlab: {
            env: {
              NPM_CONFIG_TOKEN: 'claude-token',
              GITLAB_BASE_URL: 'https://claude.gitlab.com',
              GITLAB_DEFAULT_PROJECT: 'claude/project'
            }
          }
        }
      };
      
      mockedExistsSync.mockImplementation((path) => path === '/claude/config.json');
      mockedReadFileSync.mockReturnValue(JSON.stringify(claudeConfig));
      
      const configManager = new ConfigManager('/claude/config.json');
      const config = configManager.get();
      
      expect(config.gitlab.token).toBe('claude-token');
      expect(config.gitlab.baseUrl).toBe('https://claude.gitlab.com');
      expect(config.gitlab.defaultProject).toBe('claude/project');
    });

    it('should handle malformed JSON gracefully', () => {
      mockedExistsSync.mockImplementation((path) => path === '/bad/config.json');
      mockedReadFileSync.mockReturnValue('{ invalid json }');
      
      const configManager = new ConfigManager('/bad/config.json');
      const config = configManager.get();
      
      // Should fall back to defaults
      expect(config).toEqual(DEFAULT_CONFIG);
    });
  });

  describe('environment variable override', () => {
    it('should override config with environment variables', () => {
      process.env.NPM_CONFIG_TOKEN = 'env-token';
      process.env.GITLAB_BASE_URL = 'https://env.gitlab.com';
      process.env.GITLAB_MCP_PER_PAGE = '75';
      process.env.GITLAB_MCP_PROJECT_SCOPE = 'all';
      
      const configManager = new ConfigManager();
      const config = configManager.get();
      
      expect(config.gitlab.token).toBe('env-token');
      expect(config.gitlab.baseUrl).toBe('https://env.gitlab.com');
      expect(config.defaults.perPage).toBe(75);
      expect(config.defaults.projectScope).toBe('all');
    });

    it('should prioritize env vars over config file', () => {
      const fileConfig = {
        gitlab: { token: 'file-token', baseUrl: 'https://file.gitlab.com' }
      };
      
      process.env.NPM_CONFIG_TOKEN = 'env-token';
      
      mockedExistsSync.mockImplementation((path) => path === '/test/config.json');
      mockedReadFileSync.mockReturnValue(JSON.stringify(fileConfig));
      
      const configManager = new ConfigManager('/test/config.json');
      const config = configManager.get();
      
      expect(config.gitlab.token).toBe('env-token'); // from env
      expect(config.gitlab.baseUrl).toBe('https://file.gitlab.com'); // from file
    });

    it('should handle boolean environment variables', () => {
      process.env.GITLAB_MCP_ENABLE_CACHING = 'true';
      process.env.GITLAB_MCP_ENABLE_METRICS = 'true';
      process.env.GITLAB_MCP_STRICT_SCOPING = 'false';
      
      const configManager = new ConfigManager();
      const config = configManager.get();
      
      expect(config.features.enableCaching).toBe(true);
      expect(config.features.enableMetrics).toBe(true);
      expect(config.features.strictScoping).toBe(false);
    });
  });

  describe('validation', () => {
    it('should validate valid config', () => {
      const configManager = new ConfigManager();
      const validation = configManager.validate();
      
      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should validate invalid base URL', () => {
      const invalidConfig = {
        gitlab: { baseUrl: 'not-a-url' }
      };
      
      mockedExistsSync.mockImplementation((path) => path === '/invalid/config.json');
      mockedReadFileSync.mockReturnValue(JSON.stringify(invalidConfig));
      
      const configManager = new ConfigManager('/invalid/config.json');
      const validation = configManager.validate();
      
      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain('Invalid GitLab base URL: not-a-url');
    });

    it('should validate invalid perPage range', () => {
      const invalidConfig = {
        defaults: { perPage: 150 }
      };
      
      mockedExistsSync.mockImplementation((path) => path === '/invalid/config.json');
      mockedReadFileSync.mockReturnValue(JSON.stringify(invalidConfig));
      
      const configManager = new ConfigManager('/invalid/config.json');
      const validation = configManager.validate();
      
      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain('perPage must be between 1 and 100');
    });

    it('should validate invalid timeout', () => {
      const invalidConfig = {
        server: { timeout: 500 }
      };
      
      mockedExistsSync.mockImplementation((path) => path === '/invalid/config.json');
      mockedReadFileSync.mockReturnValue(JSON.stringify(invalidConfig));
      
      const configManager = new ConfigManager('/invalid/config.json');
      const validation = configManager.validate();
      
      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain('Server timeout must be at least 1000ms');
    });
  });

  describe('getter methods', () => {
    it('should return correct config sections', () => {
      const customConfig = {
        gitlab: { baseUrl: 'https://test.gitlab.com', token: 'test-token' },
        server: { name: 'test-server', timeout: 5000 },
        defaults: { perPage: 25, projectScope: 'all' },
        features: { enableCaching: true, enableMetrics: false }
      };
      
      mockedExistsSync.mockImplementation((path) => path === '/test/config.json');
      mockedReadFileSync.mockReturnValue(JSON.stringify(customConfig));
      
      const configManager = new ConfigManager('/test/config.json');
      
      expect(configManager.getGitLabConfig()).toEqual({
        baseUrl: 'https://test.gitlab.com',
        token: 'test-token',
        defaultProject: undefined
      });
      
      expect(configManager.getServerConfig()).toEqual({
        name: 'test-server',
        version: '1.3.1', // from default
        timeout: 5000
      });
      
      expect(configManager.getDefaults()).toEqual({
        perPage: 25,
        projectScope: 'all'
      });
      
      expect(configManager.getFeatures()).toEqual({
        enableCaching: true,
        enableMetrics: true,
        strictScoping: false
      });
    });
  });
});