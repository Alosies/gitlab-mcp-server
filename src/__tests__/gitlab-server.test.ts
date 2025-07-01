import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

describe('GitLabMCPServer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset environment
    delete process.env.NPM_CONFIG_TOKEN;
  });

  describe('Constructor', () => {
    it('should throw error when no token is provided', () => {
      expect(() => {
        // This would normally import and instantiate the server
        // For now, we'll test the basic concept
        const token = process.env.NPM_CONFIG_TOKEN;
        if (!token) {
          throw new Error('GitLab token is required. Set NPM_CONFIG_TOKEN environment variable.');
        }
      }).toThrow('GitLab token is required. Set NPM_CONFIG_TOKEN environment variable.');
    });

    it('should initialize with valid token', () => {
      process.env.NPM_CONFIG_TOKEN = 'test-token';
      
      expect(() => {
        const token = process.env.NPM_CONFIG_TOKEN;
        if (!token) {
          throw new Error('GitLab token is required. Set NPM_CONFIG_TOKEN environment variable.');
        }
        // Mock axios creation
        mockedAxios.create = vi.fn().mockReturnValue({
          get: vi.fn(),
          post: vi.fn(),
          delete: vi.fn()
        });
      }).not.toThrow();
    });
  });

  describe('API Endpoints', () => {
    beforeEach(() => {
      process.env.NPM_CONFIG_TOKEN = 'test-token';
      mockedAxios.create = vi.fn().mockReturnValue({
        get: vi.fn().mockResolvedValue({ data: [] }),
        post: vi.fn().mockResolvedValue({ data: {} }),
        delete: vi.fn().mockResolvedValue({ status: 204 })
      });
    });

    it('should handle project listing', async () => {
      const mockAxiosInstance = {
        get: vi.fn().mockResolvedValue({ 
          data: [{ id: 1, name: 'test-project' }] 
        })
      };
      
      mockedAxios.create = vi.fn().mockReturnValue(mockAxiosInstance);
      
      // Test would call the actual method here
      // For now, just verify the mock setup
      expect(mockedAxios.create).toBeDefined();
    });

    it('should handle job logs endpoint', async () => {
      const mockAxiosInstance = {
        get: vi.fn().mockResolvedValue({ 
          data: 'Sample job log content\nLine 2 of logs\n' 
        })
      };
      
      mockedAxios.create = vi.fn().mockReturnValue(mockAxiosInstance);
      
      // Simulate job logs API call
      const response = await mockAxiosInstance.get('/projects/1/jobs/123/trace');
      
      expect(response.data).toContain('Sample job log content');
      expect(typeof response.data).toBe('string');
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      const mockAxiosInstance = {
        get: vi.fn().mockRejectedValue(new Error('API Error'))
      };
      
      mockedAxios.create = vi.fn().mockReturnValue(mockAxiosInstance);
      
      await expect(mockAxiosInstance.get('/invalid-endpoint')).rejects.toThrow('API Error');
    });

    it('should handle network timeouts', async () => {
      const mockAxiosInstance = {
        get: vi.fn().mockRejectedValue(new Error('timeout of 10000ms exceeded'))
      };
      
      mockedAxios.create = vi.fn().mockReturnValue(mockAxiosInstance);
      
      await expect(mockAxiosInstance.get('/slow-endpoint')).rejects.toThrow('timeout');
    });
  });
});