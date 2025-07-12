import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProjectHandlers } from '../../handlers/projects.js';
import { GitLabClient } from '../../client.js';
import { ConfigManager } from '../../config.js';

// Mock dependencies
vi.mock('../../client.js');
vi.mock('../../config.js');

describe('ProjectHandlers', () => {
  let projectHandlers: ProjectHandlers;
  let mockClient: any;
  let mockConfigManager: any;

  beforeEach(() => {
    mockClient = {
      get: vi.fn()
    };
    
    mockConfigManager = {
      getDefaults: vi.fn().mockReturnValue({
        perPage: 20,
        projectScope: 'owned'
      })
    };

    projectHandlers = new ProjectHandlers(mockClient, mockConfigManager);
  });

  describe('listProjects', () => {
    it('should list projects with default parameters', async () => {
      const mockProjects = [
        { id: 1, name: 'project1' },
        { id: 2, name: 'project2' }
      ];
      mockClient.get.mockResolvedValue(mockProjects);

      const result = await projectHandlers.listProjects({});

      expect(mockClient.get).toHaveBeenCalledWith('/projects?owned=true&simple=true&statistics=false&per_page=20');
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockProjects, null, 2),
          },
        ],
      });
    });

    it('should list projects with search parameter', async () => {
      const mockProjects = [{ id: 1, name: 'test-project' }];
      mockClient.get.mockResolvedValue(mockProjects);

      await projectHandlers.listProjects({ search: 'test' });

      expect(mockClient.get).toHaveBeenCalledWith('/projects?search=test&owned=true&simple=true&statistics=false&per_page=20');
    });

    it('should list projects with visibility parameter', async () => {
      const mockProjects = [{ id: 1, name: 'public-project' }];
      mockClient.get.mockResolvedValue(mockProjects);

      await projectHandlers.listProjects({ visibility: 'public' });

      expect(mockClient.get).toHaveBeenCalledWith('/projects?visibility=public&owned=true&simple=true&statistics=false&per_page=20');
    });

    it('should respect owned=false parameter', async () => {
      const mockProjects = [{ id: 1, name: 'all-projects' }];
      mockClient.get.mockResolvedValue(mockProjects);

      await projectHandlers.listProjects({ owned: false });

      expect(mockClient.get).toHaveBeenCalledWith('/projects?simple=true&statistics=false&per_page=20');
    });

    it('should use custom per_page parameter', async () => {
      const mockProjects: any[] = [];
      mockClient.get.mockResolvedValue(mockProjects);

      await projectHandlers.listProjects({ per_page: 50 });

      expect(mockClient.get).toHaveBeenCalledWith('/projects?owned=true&simple=true&statistics=false&per_page=50');
    });

    it('should use config defaults when projectScope is undefined', async () => {
      mockConfigManager.getDefaults.mockReturnValue({
        perPage: 30,
        projectScope: undefined
      });
      
      const mockProjects: any[] = [];
      mockClient.get.mockResolvedValue(mockProjects);

      await projectHandlers.listProjects({});

      expect(mockClient.get).toHaveBeenCalledWith('/projects?owned=true&simple=true&statistics=false&per_page=30');
    });

    it('should not add owned parameter when projectScope is all', async () => {
      mockConfigManager.getDefaults.mockReturnValue({
        perPage: 20,
        projectScope: 'all'
      });
      
      const mockProjects: any[] = [];
      mockClient.get.mockResolvedValue(mockProjects);

      await projectHandlers.listProjects({});

      expect(mockClient.get).toHaveBeenCalledWith('/projects?simple=true&statistics=false&per_page=20');
    });

    it('should use full project details when simple=false', async () => {
      const mockProjects: any[] = [];
      mockClient.get.mockResolvedValue(mockProjects);

      await projectHandlers.listProjects({ simple: false });

      expect(mockClient.get).toHaveBeenCalledWith('/projects?owned=true&per_page=20');
    });

    it('should use simple=true by default', async () => {
      const mockProjects: any[] = [];
      mockClient.get.mockResolvedValue(mockProjects);

      await projectHandlers.listProjects({});

      // Should include simple=true and statistics=false by default
      expect(mockClient.get).toHaveBeenCalledWith('/projects?owned=true&simple=true&statistics=false&per_page=20');
    });

    it('should combine simple=false with other parameters', async () => {
      const mockProjects: any[] = [];
      mockClient.get.mockResolvedValue(mockProjects);

      await projectHandlers.listProjects({ 
        search: 'test', 
        visibility: 'public', 
        simple: false,
        per_page: 10 
      });

      expect(mockClient.get).toHaveBeenCalledWith('/projects?search=test&visibility=public&owned=true&per_page=10');
    });
  });

  describe('getProject', () => {
    it('should get project by ID', async () => {
      const mockProject = { id: 123, name: 'test-project' };
      mockClient.get.mockResolvedValue(mockProject);

      const result = await projectHandlers.getProject({ project_id: '123' });

      expect(mockClient.get).toHaveBeenCalledWith('/projects/123');
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockProject, null, 2),
          },
        ],
      });
    });

    it('should get project by path', async () => {
      const mockProject = { id: 456, name: 'group-project' };
      mockClient.get.mockResolvedValue(mockProject);

      const result = await projectHandlers.getProject({ project_id: 'group/project' });

      expect(mockClient.get).toHaveBeenCalledWith('/projects/group%2Fproject');
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockProject, null, 2),
          },
        ],
      });
    });

    it('should handle special characters in project path', async () => {
      const mockProject = { id: 789, name: 'special-project' };
      mockClient.get.mockResolvedValue(mockProject);

      await projectHandlers.getProject({ project_id: 'group/project with spaces' });

      expect(mockClient.get).toHaveBeenCalledWith('/projects/group%2Fproject%20with%20spaces');
    });
  });
});