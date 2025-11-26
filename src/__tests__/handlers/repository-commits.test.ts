import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RepositoryHandlers } from '../../handlers/repository.js';

// Mock dependencies
vi.mock('../../client.js');

describe('RepositoryHandlers - Commit Operations', () => {
  let repositoryHandlers: RepositoryHandlers;
  let mockClient: {
    get: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockClient = {
      get: vi.fn(),
    };

    repositoryHandlers = new RepositoryHandlers(mockClient as any);
  });

  describe('getProjectCommits', () => {
    it('should list commits with minimal parameters', async () => {
      const mockCommits = [
        { id: 'abc123', title: 'Commit 1' },
        { id: 'def456', title: 'Commit 2' },
      ];
      mockClient.get.mockResolvedValue(mockCommits);

      const result = await repositoryHandlers.getProjectCommits({ project_id: '123' });

      expect(mockClient.get).toHaveBeenCalledWith('/projects/123/repository/commits?per_page=20');
      expect(result.content[0].text).toBe(JSON.stringify(mockCommits, null, 2));
    });

    it('should list commits with all filters', async () => {
      const mockCommits = [{ id: 'abc123' }];
      mockClient.get.mockResolvedValue(mockCommits);

      await repositoryHandlers.getProjectCommits({
        project_id: '123',
        ref_name: 'main',
        since: '2024-01-01T00:00:00Z',
        until: '2024-12-31T23:59:59Z',
        author: 'john@example.com',
        path: 'src/index.ts',
        all: true,
        with_stats: true,
        first_parent: true,
        order: 'topo',
        trailers: true,
        page: 2,
        per_page: 50,
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/projects/123/repository/commits?ref_name=main&since=2024-01-01T00%3A00%3A00Z&until=2024-12-31T23%3A59%3A59Z&author=john%40example.com&path=src%2Findex.ts&all=true&with_stats=true&first_parent=true&order=topo&trailers=true&page=2&per_page=50'
      );
    });
  });

  describe('getCommit', () => {
    it('should get commit details by SHA', async () => {
      const mockCommit = {
        id: 'abc123def456',
        title: 'Test commit',
        message: 'Test commit message',
        author_name: 'John Doe',
        author_email: 'john@example.com',
      };
      mockClient.get.mockResolvedValue(mockCommit);

      const result = await repositoryHandlers.getCommit({
        project_id: '123',
        sha: 'abc123def456',
      });

      expect(mockClient.get).toHaveBeenCalledWith('/projects/123/repository/commits/abc123def456');
      expect(result.content[0].text).toBe(JSON.stringify(mockCommit, null, 2));
    });

    it('should get commit with stats', async () => {
      const mockCommit = {
        id: 'abc123',
        stats: { additions: 10, deletions: 5, total: 15 },
      };
      mockClient.get.mockResolvedValue(mockCommit);

      await repositoryHandlers.getCommit({
        project_id: '123',
        sha: 'abc123',
        stats: true,
      });

      expect(mockClient.get).toHaveBeenCalledWith('/projects/123/repository/commits/abc123?stats=true');
    });

    it('should handle branch name as SHA', async () => {
      const mockCommit = { id: 'abc123', title: 'Latest on main' };
      mockClient.get.mockResolvedValue(mockCommit);

      await repositoryHandlers.getCommit({
        project_id: '123',
        sha: 'main',
      });

      expect(mockClient.get).toHaveBeenCalledWith('/projects/123/repository/commits/main');
    });
  });

  describe('getCommitDiff', () => {
    it('should get commit diff by SHA', async () => {
      const mockDiffs = [
        {
          old_path: 'src/old.ts',
          new_path: 'src/new.ts',
          diff: '@@ -1,3 +1,5 @@\n+added line',
          new_file: false,
          renamed_file: true,
          deleted_file: false,
        },
      ];
      mockClient.get.mockResolvedValue(mockDiffs);

      const result = await repositoryHandlers.getCommitDiff({
        project_id: '123',
        sha: 'abc123def456',
      });

      expect(mockClient.get).toHaveBeenCalledWith('/projects/123/repository/commits/abc123def456/diff');
      expect(result.content[0].text).toBe(JSON.stringify(mockDiffs, null, 2));
    });

    it('should handle URL encoding for special characters in SHA', async () => {
      const mockDiffs = [];
      mockClient.get.mockResolvedValue(mockDiffs);

      await repositoryHandlers.getCommitDiff({
        project_id: 'group/subgroup/project',
        sha: 'feature/test-branch',
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/projects/group%2Fsubgroup%2Fproject/repository/commits/feature%2Ftest-branch/diff'
      );
    });
  });
});

