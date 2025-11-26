import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MergeRequestHandlers } from '../../handlers/merge-requests.js';

// Mock dependencies
vi.mock('../../client.js');

describe('MergeRequestHandlers - Core Operations', () => {
  let mergeRequestHandlers: MergeRequestHandlers;
  let mockClient: {
    get: ReturnType<typeof vi.fn>;
    post: ReturnType<typeof vi.fn>;
    put: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockClient = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
    };

    mergeRequestHandlers = new MergeRequestHandlers(mockClient as any);
  });

  describe('listMergeRequests', () => {
    it('should list merge requests with minimal parameters', async () => {
      const mockMRs = [
        { id: 1, title: 'MR 1' },
        { id: 2, title: 'MR 2' },
      ];
      mockClient.get.mockResolvedValue(mockMRs);

      const result = await mergeRequestHandlers.listMergeRequests({ project_id: '123' });

      expect(mockClient.get).toHaveBeenCalledWith('/projects/123/merge_requests?per_page=20');
      expect(result.content[0].text).toBe(JSON.stringify(mockMRs, null, 2));
    });

    it('should list merge requests with all filters', async () => {
      const mockMRs = [{ id: 1, title: 'Filtered MR' }];
      mockClient.get.mockResolvedValue(mockMRs);

      await mergeRequestHandlers.listMergeRequests({
        project_id: '123',
        state: 'opened',
        target_branch: 'main',
        source_branch: 'feature',
        assignee_id: 456,
        author_id: 789,
        search: 'test',
        scope: 'created_by_me',
        per_page: 30,
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/projects/123/merge_requests?state=opened&target_branch=main&source_branch=feature&assignee_id=456&author_id=789&search=test&scope=created_by_me&per_page=30'
      );
    });

    it('should not include scope if not provided', async () => {
      const mockMRs: unknown[] = [];
      mockClient.get.mockResolvedValue(mockMRs);

      await mergeRequestHandlers.listMergeRequests({
        project_id: '123',
        state: 'merged',
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/projects/123/merge_requests?state=merged&per_page=20'
      );
    });

    it('should filter by reviewer_id', async () => {
      mockClient.get.mockResolvedValue([]);

      await mergeRequestHandlers.listMergeRequests({
        project_id: '123',
        reviewer_id: 456,
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/projects/123/merge_requests?reviewer_id=456&per_page=20'
      );
    });

    it('should filter by reviewer_username', async () => {
      mockClient.get.mockResolvedValue([]);

      await mergeRequestHandlers.listMergeRequests({
        project_id: '123',
        reviewer_username: 'john_doe',
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/projects/123/merge_requests?reviewer_username=john_doe&per_page=20'
      );
    });
  });

  describe('getMergeRequest', () => {
    it('should get specific merge request', async () => {
      const mockMR = { id: 1, iid: 42, title: 'Test MR' };
      mockClient.get.mockResolvedValue(mockMR);

      const result = await mergeRequestHandlers.getMergeRequest({
        project_id: '123',
        merge_request_iid: 42,
      });

      expect(mockClient.get).toHaveBeenCalledWith('/projects/123/merge_requests/42');
      expect(result.content[0].text).toBe(JSON.stringify(mockMR, null, 2));
    });
  });

  describe('createMergeRequest', () => {
    it('should create merge request with minimal data', async () => {
      const mockMR = { id: 1, title: 'New MR' };
      mockClient.post.mockResolvedValue(mockMR);

      const result = await mergeRequestHandlers.createMergeRequest({
        project_id: '123',
        title: 'New MR',
        source_branch: 'feature',
        target_branch: 'main',
      });

      expect(mockClient.post).toHaveBeenCalledWith('/projects/123/merge_requests', {
        title: 'New MR',
        source_branch: 'feature',
        target_branch: 'main',
      });
      expect(result.content[0].text).toBe(JSON.stringify(mockMR, null, 2));
    });

    it('should create merge request with all optional fields', async () => {
      const mockMR = { id: 1, title: 'Complete MR' };
      mockClient.post.mockResolvedValue(mockMR);

      await mergeRequestHandlers.createMergeRequest({
        project_id: '123',
        title: 'Complete MR',
        source_branch: 'feature',
        target_branch: 'main',
        description: 'This is a detailed description',
        assignee_ids: [456],
        reviewer_ids: [789],
        labels: 'enhancement',
        milestone_id: 10,
      });

      expect(mockClient.post).toHaveBeenCalledWith('/projects/123/merge_requests', {
        title: 'Complete MR',
        source_branch: 'feature',
        target_branch: 'main',
        description: 'This is a detailed description',
        assignee_ids: [456],
        reviewer_ids: [789],
        labels: 'enhancement',
        milestone_id: 10,
      });
    });
  });

  describe('updateMergeRequest', () => {
    it('should update merge request with single field', async () => {
      const mockMR = { id: 1, title: 'Updated MR' };
      mockClient.put.mockResolvedValue(mockMR);

      const result = await mergeRequestHandlers.updateMergeRequest({
        project_id: '123',
        merge_request_iid: 42,
        title: 'Updated MR',
      });

      expect(mockClient.put).toHaveBeenCalledWith('/projects/123/merge_requests/42', {
        title: 'Updated MR',
      });
      expect(result.content[0].text).toBe(JSON.stringify(mockMR, null, 2));
    });

    it('should update merge request with multiple fields', async () => {
      const mockMR = { id: 1, title: 'Updated MR' };
      mockClient.put.mockResolvedValue(mockMR);

      await mergeRequestHandlers.updateMergeRequest({
        project_id: '123',
        merge_request_iid: 42,
        title: 'Updated MR',
        description: 'Updated description',
        state_event: 'close',
        assignee_ids: [456, 789],
        labels: 'bug,fixed',
        squash: true,
        remove_source_branch: true,
      });

      expect(mockClient.put).toHaveBeenCalledWith('/projects/123/merge_requests/42', {
        title: 'Updated MR',
        description: 'Updated description',
        state_event: 'close',
        assignee_ids: [456, 789],
        labels: 'bug,fixed',
        squash: true,
        remove_source_branch: true,
      });
    });

    it('should only include defined fields in update', async () => {
      const mockMR = { id: 1, title: 'Partial Update' };
      mockClient.put.mockResolvedValue(mockMR);

      await mergeRequestHandlers.updateMergeRequest({
        project_id: '123',
        merge_request_iid: 42,
        title: 'Partial Update',
        description: undefined, // Should not be included
        assignee_ids: [456],
      });

      expect(mockClient.put).toHaveBeenCalledWith('/projects/123/merge_requests/42', {
        title: 'Partial Update',
        assignee_ids: [456],
      });
    });

    it('should handle boolean false values correctly', async () => {
      const mockMR = { id: 1 };
      mockClient.put.mockResolvedValue(mockMR);

      await mergeRequestHandlers.updateMergeRequest({
        project_id: '123',
        merge_request_iid: 42,
        squash: false,
        remove_source_branch: false,
        allow_collaboration: false,
        merge_when_pipeline_succeeds: false,
      });

      expect(mockClient.put).toHaveBeenCalledWith('/projects/123/merge_requests/42', {
        squash: false,
        remove_source_branch: false,
        allow_collaboration: false,
        merge_when_pipeline_succeeds: false,
      });
    });
  });
});
