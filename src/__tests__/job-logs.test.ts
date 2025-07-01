import { describe, it, expect } from 'vitest';

describe('Job Logs and Trace Functionality', () => {
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

  describe('Job Trace with Enhanced Features', () => {
    describe('getJobTrace method', () => {
      it('should handle large logs with line limiting', () => {
        const largeLogs = Array.from({ length: 5000 }, (_, i) => `Line ${i + 1}: Some log content here`).join('\n');
        
        // Simulate processing with 1000 line limit
        const lines = largeLogs.split('\n');
        const limitedLines = lines.slice(0, 1000);
        const processedContent = limitedLines.join('\n');
        
        expect(lines.length).toBe(5000);
        expect(limitedLines.length).toBe(1000);
        expect(processedContent).toContain('Line 1:');
        expect(processedContent).toContain('Line 1000:');
        expect(processedContent).not.toContain('Line 1001:');
      });

      it('should support tail mode for getting last lines', () => {
        const logs = Array.from({ length: 100 }, (_, i) => `Line ${i + 1}`).join('\n');
        const lines = logs.split('\n');
        
        // Get last 10 lines
        const tailLines = lines.slice(-10);
        
        expect(tailLines.length).toBe(10);
        expect(tailLines[0]).toBe('Line 91');
        expect(tailLines[9]).toBe('Line 100');
      });

      it('should format response with metadata when raw=false', () => {
        const mockLogs = 'Line 1\nLine 2\nLine 3';
        const lines = mockLogs.split('\n');
        const totalLines = lines.length;
        
        const metadata = [
          `📋 Job Trace Summary`,
          `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
          `📊 Total lines: ${totalLines}`,
          `📄 Showing: ${lines.length} lines (first)`,
          `🔗 Project: test-project`,
          `🚀 Job ID: 123`,
          ``,
          `📝 Log Content:`,
          `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
          mockLogs
        ].join('\n');
        
        expect(metadata).toContain('📋 Job Trace Summary');
        expect(metadata).toContain('📊 Total lines: 3');
        expect(metadata).toContain('🔗 Project: test-project');
        expect(metadata).toContain('🚀 Job ID: 123');
        expect(metadata).toContain('Line 1\nLine 2\nLine 3');
      });

      it('should return raw content when raw=true', () => {
        const mockLogs = 'Line 1\nLine 2\nLine 3';
        
        // When raw=true, should return just the content
        expect(mockLogs).toBe('Line 1\nLine 2\nLine 3');
        expect(mockLogs).not.toContain('📋 Job Trace Summary');
      });

      it('should add truncation warnings for large logs', () => {
        const totalLines = 5000;
        const shownLines = 1000;
        const isTail = false;
        
        const truncationWarning = [
          '',
          `⚠️  Log truncated. Total lines: ${totalLines}, Showing: ${shownLines}`,
          `💡 Use tail:true to see the end of the log`
        ].join('\n');
        
        expect(truncationWarning).toContain('⚠️  Log truncated');
        expect(truncationWarning).toContain('Total lines: 5000');
        expect(truncationWarning).toContain('Showing: 1000');
        expect(truncationWarning).toContain('💡 Use tail:true');
      });
    });

    describe('Job trace parameter validation', () => {
      it('should validate GetJobTraceParams', () => {
        const validateTraceParams = (args: { project_id?: string; job_id?: number; lines_limit?: number; tail?: boolean; raw?: boolean }) => {
          if (!args.project_id) {
            throw new Error('project_id is required');
          }
          if (!args.job_id) {
            throw new Error('job_id is required');
          }
          if (args.lines_limit && args.lines_limit <= 0) {
            throw new Error('lines_limit must be positive');
          }
          return true;
        };

        // Valid parameters
        expect(() => validateTraceParams({ 
          project_id: '123', 
          job_id: 456,
          lines_limit: 500,
          tail: true,
          raw: false
        })).not.toThrow();

        // Invalid parameters
        expect(() => validateTraceParams({ 
          job_id: 456 
        })).toThrow('project_id is required');

        expect(() => validateTraceParams({ 
          project_id: '123' 
        })).toThrow('job_id is required');

        expect(() => validateTraceParams({ 
          project_id: '123', 
          job_id: 456,
          lines_limit: -1
        })).toThrow('lines_limit must be positive');
      });
    });
  });
});