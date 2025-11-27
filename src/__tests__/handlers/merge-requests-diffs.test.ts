import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MergeRequestHandlers } from '../../handlers/merge-requests.js';

// Mock dependencies
vi.mock('../../client.js');

describe('MergeRequestHandlers - Diff Operations', () => {
  let mergeRequestHandlers: MergeRequestHandlers;
  let mockClient: {
    get: ReturnType<typeof vi.fn>;
    post: ReturnType<typeof vi.fn>;
    put: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockClient = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    };

    mergeRequestHandlers = new MergeRequestHandlers(mockClient as any);
  });

  describe('getMergeRequest with source_branch', () => {
    it('should get merge request by IID', async () => {
      const mockMR = { id: 1, iid: 42, title: 'Test MR' };
      mockClient.get.mockResolvedValue(mockMR);

      const result = await mergeRequestHandlers.getMergeRequest({
        project_id: '123',
        merge_request_iid: 42,
      });

      expect(mockClient.get).toHaveBeenCalledWith('/projects/123/merge_requests/42');
      expect(result.content[0].text).toBe(JSON.stringify(mockMR, null, 2));
    });

    it('should get merge request by source_branch', async () => {
      const mockMRList = [{ id: 1, iid: 42, title: 'Test MR' }];
      const mockMR = { id: 1, iid: 42, title: 'Test MR', full: true };
      
      mockClient.get
        .mockResolvedValueOnce(mockMRList) // First call to find MR by branch
        .mockResolvedValueOnce(mockMR); // Second call to get full MR details

      const result = await mergeRequestHandlers.getMergeRequest({
        project_id: '123',
        source_branch: 'feature-branch',
      });

      expect(mockClient.get).toHaveBeenNthCalledWith(
        1,
        '/projects/123/merge_requests?source_branch=feature-branch&state=opened&per_page=1'
      );
      expect(mockClient.get).toHaveBeenNthCalledWith(2, '/projects/123/merge_requests/42');
      expect(result.content[0].text).toBe(JSON.stringify(mockMR, null, 2));
    });

    it('should throw error when no MR found for source_branch', async () => {
      mockClient.get.mockResolvedValueOnce([]).mockResolvedValueOnce([]);

      await expect(
        mergeRequestHandlers.getMergeRequest({
          project_id: '123',
          source_branch: 'non-existent-branch',
        })
      ).rejects.toThrow('No merge request found for source branch: non-existent-branch');
    });

    it('should throw error when neither iid nor source_branch provided', async () => {
      await expect(
        mergeRequestHandlers.getMergeRequest({
          project_id: '123',
        })
      ).rejects.toThrow('Either merge_request_iid or source_branch must be provided');
    });
  });

  describe('getMergeRequestDiffs', () => {
    it('should get merge request diffs by IID', async () => {
      const mockDiffs = { changes: [{ diff: 'content' }] };
      mockClient.get.mockResolvedValue(mockDiffs);

      const result = await mergeRequestHandlers.getMergeRequestDiffs({
        project_id: '123',
        merge_request_iid: 42,
      });

      expect(mockClient.get).toHaveBeenCalledWith('/projects/123/merge_requests/42/changes');
      expect(result.content[0].text).toBe(JSON.stringify(mockDiffs, null, 2));
    });

    it('should get merge request diffs with view option', async () => {
      const mockDiffs = { changes: [] };
      mockClient.get.mockResolvedValue(mockDiffs);

      await mergeRequestHandlers.getMergeRequestDiffs({
        project_id: '123',
        merge_request_iid: 42,
        view: 'parallel',
      });

      expect(mockClient.get).toHaveBeenCalledWith('/projects/123/merge_requests/42/changes?view=parallel');
    });

    it('should get merge request diffs by source_branch', async () => {
      const mockMRList = [{ iid: 42 }];
      const mockDiffs = { changes: [] };
      
      mockClient.get
        .mockResolvedValueOnce(mockMRList)
        .mockResolvedValueOnce(mockDiffs);

      await mergeRequestHandlers.getMergeRequestDiffs({
        project_id: '123',
        source_branch: 'feature',
      });

      expect(mockClient.get).toHaveBeenNthCalledWith(
        1,
        '/projects/123/merge_requests?source_branch=feature&state=opened&per_page=1'
      );
      expect(mockClient.get).toHaveBeenNthCalledWith(2, '/projects/123/merge_requests/42/changes');
    });
  });

  describe('listMergeRequestDiffs', () => {
    it('should list merge request diffs with pagination', async () => {
      const mockDiffs = [{ old_path: 'file.ts', new_path: 'file.ts' }];
      mockClient.get.mockResolvedValue(mockDiffs);

      const result = await mergeRequestHandlers.listMergeRequestDiffs({
        project_id: '123',
        merge_request_iid: 42,
        page: 2,
        per_page: 50,
      });

      expect(mockClient.get).toHaveBeenCalledWith('/projects/123/merge_requests/42/diffs?page=2&per_page=50');
      expect(result.content[0].text).toBe(JSON.stringify(mockDiffs, null, 2));
    });

    it('should list merge request diffs with unidiff option', async () => {
      const mockDiffs = [];
      mockClient.get.mockResolvedValue(mockDiffs);

      await mergeRequestHandlers.listMergeRequestDiffs({
        project_id: '123',
        merge_request_iid: 42,
        unidiff: true,
      });

      expect(mockClient.get).toHaveBeenCalledWith('/projects/123/merge_requests/42/diffs?unidiff=true');
    });
  });

  describe('getBranchDiffs', () => {
    it('should get diffs between two branches', async () => {
      const mockCompare = {
        commits: [{ id: 'abc123' }],
        diffs: [{ old_path: 'file.ts' }],
      };
      mockClient.get.mockResolvedValue(mockCompare);

      const result = await mergeRequestHandlers.getBranchDiffs({
        project_id: '123',
        from: 'main',
        to: 'feature',
      });

      expect(mockClient.get).toHaveBeenCalledWith('/projects/123/repository/compare?from=main&to=feature');
      expect(result.content[0].text).toBe(JSON.stringify(mockCompare, null, 2));
    });

    it('should get diffs with straight comparison', async () => {
      const mockCompare = { commits: [], diffs: [] };
      mockClient.get.mockResolvedValue(mockCompare);

      await mergeRequestHandlers.getBranchDiffs({
        project_id: '123',
        from: 'main',
        to: 'feature',
        straight: true,
      });

      expect(mockClient.get).toHaveBeenCalledWith('/projects/123/repository/compare?from=main&to=feature&straight=true');
    });
  });

  describe('updateMergeRequest with source_branch', () => {
    it('should update merge request by source_branch', async () => {
      const mockMRList = [{ iid: 42 }];
      const mockUpdatedMR = { id: 1, iid: 42, title: 'Updated Title' };
      
      mockClient.get.mockResolvedValueOnce(mockMRList);
      mockClient.put.mockResolvedValue(mockUpdatedMR);

      const result = await mergeRequestHandlers.updateMergeRequest({
        project_id: '123',
        source_branch: 'feature',
        title: 'Updated Title',
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/projects/123/merge_requests?source_branch=feature&state=opened&per_page=1'
      );
      expect(mockClient.put).toHaveBeenCalledWith('/projects/123/merge_requests/42', {
        title: 'Updated Title',
      });
      expect(result.content[0].text).toBe(JSON.stringify(mockUpdatedMR, null, 2));
    });
  });
});

