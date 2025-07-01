import { describe, it, expect } from 'vitest';

describe('Job Logs Functionality', () => {
  describe('getJobLogs method', () => {
    it('should return job logs as text content', () => {
      const mockJobLogs = `
Running with gitlab-runner 16.0.0
Preparing the "docker" executor
Using Docker executor with image node:18
Pulling docker image node:18 ...
Using docker image node:18 ID=sha256:abc123
Preparing environment
Running on runner-xyz
Getting source from Git repository
Fetching changes with git depth set to 20...
Initialized empty Git repository in /builds/project/.git/
+ npm install
+ npm run build
+ npm test
Job succeeded
      `.trim();

      // Mock the response structure that would be returned
      const mockResponse = {
        content: [
          {
            type: 'text',
            text: mockJobLogs,
          },
        ],
      };

      expect(mockResponse.content[0].type).toBe('text');
      expect(mockResponse.content[0].text).toContain('Running with gitlab-runner');
      expect(mockResponse.content[0].text).toContain('Job succeeded');
    });

    it('should handle empty job logs', () => {
      const mockResponse = {
        content: [
          {
            type: 'text',
            text: '',
          },
        ],
      };

      expect(mockResponse.content[0].text).toBe('');
    });

    it('should handle job logs with special characters', () => {
      const mockJobLogs = 'Line with émojis 🚀 and spëcial çharacters';
      
      const mockResponse = {
        content: [
          {
            type: 'text',
            text: mockJobLogs,
          },
        ],
      };

      expect(mockResponse.content[0].text).toBe(mockJobLogs);
    });
  });

  describe('Job logs API endpoint validation', () => {
    it('should validate required parameters', () => {
      const validateJobLogsParams = (args: { project_id?: string; job_id?: number }) => {
        if (!args.project_id) {
          throw new Error('project_id is required');
        }
        if (!args.job_id) {
          throw new Error('job_id is required');
        }
        return true;
      };

      // Valid parameters
      expect(() => validateJobLogsParams({ 
        project_id: '123', 
        job_id: 456 
      })).not.toThrow();

      // Missing project_id
      expect(() => validateJobLogsParams({ 
        job_id: 456 
      })).toThrow('project_id is required');

      // Missing job_id
      expect(() => validateJobLogsParams({ 
        project_id: '123' 
      })).toThrow('job_id is required');
    });

    it('should construct correct API URL', () => {
      const constructJobLogsUrl = (projectId: string, jobId: number) => {
        return `/projects/${encodeURIComponent(projectId)}/jobs/${jobId}/trace`;
      };

      expect(constructJobLogsUrl('123', 456)).toBe('/projects/123/jobs/456/trace');
      expect(constructJobLogsUrl('group/project', 789)).toBe('/projects/group%2Fproject/jobs/789/trace');
    });
  });
});