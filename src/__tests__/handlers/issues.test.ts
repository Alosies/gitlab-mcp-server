import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IssueHandlers } from '../../handlers/issues.js';
import { GitLabClient } from '../../client.js';

// Mock dependencies
vi.mock('../../client.js');

describe('IssueHandlers', () => {
  let issueHandlers: IssueHandlers;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      get: vi.fn(),
      post: vi.fn()
    };

    issueHandlers = new IssueHandlers(mockClient);
  });

  describe('listIssues', () => {
    it('should list issues with minimal parameters', async () => {
      const mockIssues = [
        { id: 1, title: 'Issue 1' },
        { id: 2, title: 'Issue 2' }
      ];
      mockClient.get.mockResolvedValue(mockIssues);

      const result = await issueHandlers.listIssues({ project_id: '123' });

      expect(mockClient.get).toHaveBeenCalledWith('/projects/123/issues?per_page=20');
      expect(result.content[0].text).toBe(JSON.stringify(mockIssues, null, 2));
    });

    it('should list issues with all parameters', async () => {
      const mockIssues = [{ id: 1, title: 'Filtered Issue' }];
      mockClient.get.mockResolvedValue(mockIssues);

      await issueHandlers.listIssues({
        project_id: '123',
        state: 'opened',
        labels: 'bug,urgent',
        assignee_id: 456,
        author_id: 789,
        search: 'test',
        scope: 'assigned_to_me',
        per_page: 50
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/projects/123/issues?state=opened&labels=bug%2Curgent&assignee_id=456&author_id=789&search=test&scope=assigned_to_me&per_page=50'
      );
    });

    it('should not include scope if not provided', async () => {
      const mockIssues: any[] = [];
      mockClient.get.mockResolvedValue(mockIssues);

      await issueHandlers.listIssues({
        project_id: '123',
        state: 'closed'
      });

      expect(mockClient.get).toHaveBeenCalledWith('/projects/123/issues?state=closed&per_page=20');
    });

    it('should handle project path with special characters', async () => {
      const mockIssues: any[] = [];
      mockClient.get.mockResolvedValue(mockIssues);

      await issueHandlers.listIssues({ project_id: 'group/project name' });

      expect(mockClient.get).toHaveBeenCalledWith('/projects/group%2Fproject%20name/issues?per_page=20');
    });
  });

  describe('getIssue', () => {
    it('should get specific issue', async () => {
      const mockIssue = { id: 1, iid: 42, title: 'Test Issue' };
      mockClient.get.mockResolvedValue(mockIssue);

      const result = await issueHandlers.getIssue({
        project_id: '123',
        issue_iid: 42
      });

      expect(mockClient.get).toHaveBeenCalledWith('/projects/123/issues/42');
      expect(result.content[0].text).toBe(JSON.stringify(mockIssue, null, 2));
    });
  });

  describe('createIssue', () => {
    it('should create issue with minimal data', async () => {
      const mockIssue = { id: 1, title: 'New Issue' };
      mockClient.post.mockResolvedValue(mockIssue);

      const result = await issueHandlers.createIssue({
        project_id: '123',
        title: 'New Issue'
      });

      expect(mockClient.post).toHaveBeenCalledWith('/projects/123/issues', {
        title: 'New Issue'
      });
      expect(result.content[0].text).toBe(JSON.stringify(mockIssue, null, 2));
    });

    it('should create issue with all optional fields', async () => {
      const mockIssue = { id: 1, title: 'Complete Issue' };
      mockClient.post.mockResolvedValue(mockIssue);

      await issueHandlers.createIssue({
        project_id: '123',
        title: 'Complete Issue',
        description: 'This is a detailed description',
        labels: 'bug,urgent',
        assignee_ids: [456, 789],
        milestone_id: 10
      });

      expect(mockClient.post).toHaveBeenCalledWith('/projects/123/issues', {
        title: 'Complete Issue',
        description: 'This is a detailed description',
        labels: ['bug', 'urgent'],
        assignee_ids: [456, 789],
        milestone_id: 10
      });
    });

    it('should create issue with only some optional fields', async () => {
      const mockIssue = { id: 1, title: 'Partial Issue' };
      mockClient.post.mockResolvedValue(mockIssue);

      await issueHandlers.createIssue({
        project_id: '123',
        title: 'Partial Issue',
        description: 'Description only',
        assignee_ids: [456]
      });

      expect(mockClient.post).toHaveBeenCalledWith('/projects/123/issues', {
        title: 'Partial Issue',
        description: 'Description only',
        assignee_ids: [456]
      });
    });
  });
});