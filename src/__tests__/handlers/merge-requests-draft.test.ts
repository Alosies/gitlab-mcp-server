import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MergeRequestHandlers } from '../../handlers/merge-requests.js';

// Mock dependencies
vi.mock('../../client.js');

describe('MergeRequestHandlers - Draft/Ready Status', () => {
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

  describe('markMRAsDraft', () => {
    it('should mark MR as draft by adding prefix', async () => {
      const mockMR = { id: 1, iid: 42, title: 'Feature implementation' };
      const updatedMR = { id: 1, iid: 42, title: 'Draft: Feature implementation' };
      mockClient.get.mockResolvedValue(mockMR);
      mockClient.put.mockResolvedValue(updatedMR);

      const result = await mergeRequestHandlers.markMRAsDraft({
        project_id: '123',
        merge_request_iid: 42,
      });

      expect(mockClient.get).toHaveBeenCalledWith('/projects/123/merge_requests/42');
      expect(mockClient.put).toHaveBeenCalledWith('/projects/123/merge_requests/42', {
        title: 'Draft: Feature implementation',
      });
      expect(result.content[0].text).toBe(JSON.stringify(updatedMR, null, 2));
    });

    it('should not change MR already marked as Draft', async () => {
      const mockMR = { id: 1, iid: 42, title: 'Draft: Already draft' };
      mockClient.get.mockResolvedValue(mockMR);

      const result = await mergeRequestHandlers.markMRAsDraft({
        project_id: '123',
        merge_request_iid: 42,
      });

      expect(mockClient.get).toHaveBeenCalledWith('/projects/123/merge_requests/42');
      expect(mockClient.put).not.toHaveBeenCalled();
      expect(result.content[0].text).toContain('already marked as draft');
    });

    it('should not change MR with WIP prefix', async () => {
      const mockMR = { id: 1, iid: 42, title: 'WIP: Work in progress' };
      mockClient.get.mockResolvedValue(mockMR);

      const result = await mergeRequestHandlers.markMRAsDraft({
        project_id: '123',
        merge_request_iid: 42,
      });

      expect(mockClient.put).not.toHaveBeenCalled();
      expect(result.content[0].text).toContain('already marked as draft');
    });

    it('should handle URL encoding for project paths', async () => {
      const mockMR = { id: 1, iid: 42, title: 'Feature' };
      const updatedMR = { id: 1, iid: 42, title: 'Draft: Feature' };
      mockClient.get.mockResolvedValue(mockMR);
      mockClient.put.mockResolvedValue(updatedMR);

      await mergeRequestHandlers.markMRAsDraft({
        project_id: 'group/project',
        merge_request_iid: 42,
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/projects/group%2Fproject/merge_requests/42'
      );
      expect(mockClient.put).toHaveBeenCalledWith(
        '/projects/group%2Fproject/merge_requests/42',
        { title: 'Draft: Feature' }
      );
    });
  });

  describe('markMRAsReady', () => {
    it('should remove Draft prefix', async () => {
      const mockMR = { id: 1, iid: 42, title: 'Draft: Feature implementation' };
      const updatedMR = { id: 1, iid: 42, title: 'Feature implementation' };
      mockClient.get.mockResolvedValue(mockMR);
      mockClient.put.mockResolvedValue(updatedMR);

      const result = await mergeRequestHandlers.markMRAsReady({
        project_id: '123',
        merge_request_iid: 42,
      });

      expect(mockClient.get).toHaveBeenCalledWith('/projects/123/merge_requests/42');
      expect(mockClient.put).toHaveBeenCalledWith('/projects/123/merge_requests/42', {
        title: 'Feature implementation',
      });
      expect(result.content[0].text).toBe(JSON.stringify(updatedMR, null, 2));
    });

    it('should remove WIP prefix', async () => {
      const mockMR = { id: 1, iid: 42, title: 'WIP: Old style draft' };
      const updatedMR = { id: 1, iid: 42, title: 'Old style draft' };
      mockClient.get.mockResolvedValue(mockMR);
      mockClient.put.mockResolvedValue(updatedMR);

      await mergeRequestHandlers.markMRAsReady({
        project_id: '123',
        merge_request_iid: 42,
      });

      expect(mockClient.put).toHaveBeenCalledWith('/projects/123/merge_requests/42', {
        title: 'Old style draft',
      });
    });

    it('should not change MR already ready', async () => {
      const mockMR = { id: 1, iid: 42, title: 'Already ready MR' };
      mockClient.get.mockResolvedValue(mockMR);

      const result = await mergeRequestHandlers.markMRAsReady({
        project_id: '123',
        merge_request_iid: 42,
      });

      expect(mockClient.put).not.toHaveBeenCalled();
      expect(result.content[0].text).toContain('already marked as ready');
    });

    it('should handle URL encoding for project paths', async () => {
      const mockMR = { id: 1, iid: 42, title: 'Draft: Feature' };
      const updatedMR = { id: 1, iid: 42, title: 'Feature' };
      mockClient.get.mockResolvedValue(mockMR);
      mockClient.put.mockResolvedValue(updatedMR);

      await mergeRequestHandlers.markMRAsReady({
        project_id: 'group/project',
        merge_request_iid: 42,
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/projects/group%2Fproject/merge_requests/42'
      );
      expect(mockClient.put).toHaveBeenCalledWith(
        '/projects/group%2Fproject/merge_requests/42',
        { title: 'Feature' }
      );
    });
  });
});
