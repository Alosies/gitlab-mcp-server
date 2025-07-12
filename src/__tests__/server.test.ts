import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock all dependencies before importing
vi.mock('../client.js', () => ({
  GitLabClient: vi.fn()
}));

vi.mock('../config.js', () => ({
  ConfigManager: vi.fn()
}));

vi.mock('../handlers/index.js', () => ({
  ProjectHandlers: vi.fn(),
  IssueHandlers: vi.fn(),
  MergeRequestHandlers: vi.fn(),
  RepositoryHandlers: vi.fn(),
  PipelineHandlers: vi.fn(),
  JobHandlers: vi.fn(),
  UserHandlers: vi.fn()
}));

vi.mock('../tools/index.js', () => ({
  allTools: [
    { name: 'list_projects', description: 'Test tool' }
  ]
}));

vi.mock('@modelcontextprotocol/sdk/server/index.js', () => ({
  Server: vi.fn()
}));

vi.mock('@modelcontextprotocol/sdk/server/stdio.js', () => ({
  StdioServerTransport: vi.fn()
}));

// Now import after mocks are set up
import { GitLabMCPServer } from '../server.js';
import { ConfigManager } from '../config.js';
import { GitLabClient } from '../client.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import * as handlers from '../handlers/index.js';

describe('GitLabMCPServer', () => {
  let mockConfigManager: any;
  let mockClient: any;
  let mockServer: any;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock ConfigManager
    mockConfigManager = {
      validate: vi.fn().mockReturnValue({ valid: true, errors: [] }),
      get: vi.fn().mockReturnValue({
        gitlab: { baseUrl: 'https://gitlab.com', token: undefined },
        server: { name: 'test-server', version: '1.0.0' }
      }),
      getDefaults: vi.fn().mockReturnValue({ perPage: 20, projectScope: 'owned' })
    };
    
    // Mock GitLabClient
    mockClient = {
      get: vi.fn(),
      post: vi.fn()
    };
    
    // Mock Server
    mockServer = {
      setRequestHandler: vi.fn(),
      connect: vi.fn()
    };
    
    // Mock all handlers
    const mockHandlerInstance = {
      listProjects: vi.fn(),
      getProject: vi.fn(),
      listIssues: vi.fn(),
      getIssue: vi.fn(),
      createIssue: vi.fn(),
      listMergeRequests: vi.fn(),
      getMergeRequest: vi.fn(),
      createMergeRequest: vi.fn(),
      updateMergeRequest: vi.fn(),
      listProjectBranches: vi.fn(),
      getProjectCommits: vi.fn(),
      listPipelines: vi.fn(),
      getPipeline: vi.fn(),
      createPipeline: vi.fn(),
      retryPipeline: vi.fn(),
      cancelPipeline: vi.fn(),
      deletePipeline: vi.fn(),
      getPipelineVariables: vi.fn(),
      listPipelineJobs: vi.fn(),
      getJobLogs: vi.fn(),
      getJobTrace: vi.fn(),
      getUser: vi.fn()
    };

    vi.mocked(ConfigManager).mockImplementation(() => mockConfigManager);
    vi.mocked(GitLabClient).mockImplementation(() => mockClient);
    vi.mocked(Server).mockImplementation(() => mockServer);
    
    // Mock all handler constructors
    vi.mocked(handlers.ProjectHandlers).mockImplementation(() => mockHandlerInstance);
    vi.mocked(handlers.IssueHandlers).mockImplementation(() => mockHandlerInstance);
    vi.mocked(handlers.MergeRequestHandlers).mockImplementation(() => mockHandlerInstance);
    vi.mocked(handlers.RepositoryHandlers).mockImplementation(() => mockHandlerInstance);
    vi.mocked(handlers.PipelineHandlers).mockImplementation(() => mockHandlerInstance);
    vi.mocked(handlers.JobHandlers).mockImplementation(() => mockHandlerInstance);
    vi.mocked(handlers.UserHandlers).mockImplementation(() => mockHandlerInstance);

    // Set environment variable for token
    process.env.NPM_CONFIG_TOKEN = 'test-token';
  });

  describe('constructor', () => {
    it('should create server with valid configuration', () => {
      expect(() => new GitLabMCPServer()).not.toThrow();
      
      expect(mockConfigManager.validate).toHaveBeenCalled();
      expect(mockConfigManager.get).toHaveBeenCalled();
    });

    it('should throw error with invalid configuration', () => {
      mockConfigManager.validate.mockReturnValue({
        valid: false,
        errors: ['Invalid config']
      });
      
      expect(() => new GitLabMCPServer()).toThrow('Configuration validation failed:\nInvalid config');
    });

    it('should throw error without GitLab token', () => {
      delete process.env.NPM_CONFIG_TOKEN;
      mockConfigManager.get.mockReturnValue({
        gitlab: { baseUrl: 'https://gitlab.com', token: undefined },
        server: { name: 'test-server', version: '1.0.0' }
      });
      
      expect(() => new GitLabMCPServer()).toThrow('GitLab token is required. Set NPM_CONFIG_TOKEN environment variable.');
    });

    it('should use token from config if available', () => {
      delete process.env.NPM_CONFIG_TOKEN;
      mockConfigManager.get.mockReturnValue({
        gitlab: { baseUrl: 'https://gitlab.com', token: 'config-token' },
        server: { name: 'test-server', version: '1.0.0' }
      });
      
      expect(() => new GitLabMCPServer()).not.toThrow();
    });

    it('should initialize all components', () => {
      new GitLabMCPServer();
      
      expect(vi.mocked(ConfigManager)).toHaveBeenCalled();
      expect(vi.mocked(GitLabClient)).toHaveBeenCalled();
      expect(vi.mocked(Server)).toHaveBeenCalled();
      expect(vi.mocked(handlers.ProjectHandlers)).toHaveBeenCalled();
      expect(vi.mocked(handlers.IssueHandlers)).toHaveBeenCalled();
      expect(vi.mocked(handlers.MergeRequestHandlers)).toHaveBeenCalled();
      expect(vi.mocked(handlers.RepositoryHandlers)).toHaveBeenCalled();
      expect(vi.mocked(handlers.PipelineHandlers)).toHaveBeenCalled();
      expect(vi.mocked(handlers.JobHandlers)).toHaveBeenCalled();
      expect(vi.mocked(handlers.UserHandlers)).toHaveBeenCalled();
    });

    it('should setup tool handlers', () => {
      new GitLabMCPServer();
      
      expect(mockServer.setRequestHandler).toHaveBeenCalledTimes(2);
    });
  });
});