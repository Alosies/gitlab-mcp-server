import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MergeRequestHandlers } from '../../handlers/merge-requests.js';

// Mock dependencies
vi.mock('../../client.js');

describe('MergeRequestHandlers - Notes and Discussions', () => {
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

  describe('listMRNotes', () => {
    it('should list notes with minimal parameters', async () => {
      const mockNotes = [
        { id: 1, body: 'Note 1', author: { username: 'user1' } },
        { id: 2, body: 'Note 2', author: { username: 'user2' } },
      ];
      mockClient.get.mockResolvedValue(mockNotes);

      const result = await mergeRequestHandlers.listMRNotes({
        project_id: 'group/project',
        merge_request_iid: 42,
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/projects/group%2Fproject/merge_requests/42/notes?per_page=20'
      );
      expect(result.content[0].text).toBe(JSON.stringify(mockNotes, null, 2));
    });

    it('should list notes with all filters', async () => {
      mockClient.get.mockResolvedValue([]);

      await mergeRequestHandlers.listMRNotes({
        project_id: '123',
        merge_request_iid: 42,
        sort: 'asc',
        order_by: 'updated_at',
        per_page: 50,
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/projects/123/merge_requests/42/notes?sort=asc&order_by=updated_at&per_page=50'
      );
    });
  });

  describe('listMRDiscussions', () => {
    it('should list discussions', async () => {
      const mockDiscussions = [
        { id: 'abc123', individual_note: false, notes: [{ id: 1, body: 'Comment' }] },
      ];
      mockClient.get.mockResolvedValue(mockDiscussions);

      const result = await mergeRequestHandlers.listMRDiscussions({
        project_id: '123',
        merge_request_iid: 42,
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/projects/123/merge_requests/42/discussions?per_page=20'
      );
      expect(result.content[0].text).toBe(JSON.stringify(mockDiscussions, null, 2));
    });

    it('should list discussions with custom per_page', async () => {
      mockClient.get.mockResolvedValue([]);

      await mergeRequestHandlers.listMRDiscussions({
        project_id: 'group/project',
        merge_request_iid: 42,
        per_page: 100,
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/projects/group%2Fproject/merge_requests/42/discussions?per_page=100'
      );
    });
  });

  describe('createMRNote', () => {
    it('should create a top-level note', async () => {
      const mockNote = { id: 1, body: 'New comment', author: { username: 'user1' } };
      mockClient.post.mockResolvedValue(mockNote);

      const result = await mergeRequestHandlers.createMRNote({
        project_id: 'group/project',
        merge_request_iid: 42,
        body: 'New comment',
      });

      expect(mockClient.post).toHaveBeenCalledWith(
        '/projects/group%2Fproject/merge_requests/42/notes',
        { body: 'New comment' }
      );
      expect(result.content[0].text).toBe(JSON.stringify(mockNote, null, 2));
    });
  });

  describe('createMRDiscussion', () => {
    it('should create a general discussion', async () => {
      const mockDiscussion = { id: 'abc123', notes: [{ id: 1, body: 'Discussion' }] };
      mockClient.post.mockResolvedValue(mockDiscussion);

      const result = await mergeRequestHandlers.createMRDiscussion({
        project_id: '123',
        merge_request_iid: 42,
        body: 'Discussion',
      });

      expect(mockClient.post).toHaveBeenCalledWith(
        '/projects/123/merge_requests/42/discussions',
        { body: 'Discussion' }
      );
      expect(result.content[0].text).toBe(JSON.stringify(mockDiscussion, null, 2));
    });

    it('should create an inline comment on the diff (new line)', async () => {
      const mockDiscussion = { id: 'def456', notes: [{ id: 2, body: 'Inline comment' }] };
      mockClient.post.mockResolvedValue(mockDiscussion);

      await mergeRequestHandlers.createMRDiscussion({
        project_id: '123',
        merge_request_iid: 42,
        body: 'Inline comment',
        position: {
          base_sha: 'abc123',
          start_sha: 'abc123',
          head_sha: 'def456',
          old_path: 'src/file.ts',
          new_path: 'src/file.ts',
          new_line: 25,
        },
      });

      expect(mockClient.post).toHaveBeenCalledWith(
        '/projects/123/merge_requests/42/discussions',
        {
          body: 'Inline comment',
          position: {
            base_sha: 'abc123',
            start_sha: 'abc123',
            head_sha: 'def456',
            old_path: 'src/file.ts',
            new_path: 'src/file.ts',
            position_type: 'text',
            new_line: 25,
          },
        }
      );
    });

    it('should create comment on deleted line', async () => {
      mockClient.post.mockResolvedValue({ id: 'xyz' });

      await mergeRequestHandlers.createMRDiscussion({
        project_id: '123',
        merge_request_iid: 42,
        body: 'Comment on deletion',
        position: {
          base_sha: 'abc123',
          start_sha: 'abc123',
          head_sha: 'def456',
          old_path: 'src/old.ts',
          new_path: 'src/old.ts',
          old_line: 10,
        },
      });

      expect(mockClient.post).toHaveBeenCalledWith(
        '/projects/123/merge_requests/42/discussions',
        {
          body: 'Comment on deletion',
          position: {
            base_sha: 'abc123',
            start_sha: 'abc123',
            head_sha: 'def456',
            old_path: 'src/old.ts',
            new_path: 'src/old.ts',
            position_type: 'text',
            old_line: 10,
          },
        }
      );
    });

    it('should create comment on context line (both old and new)', async () => {
      mockClient.post.mockResolvedValue({ id: 'xyz' });

      await mergeRequestHandlers.createMRDiscussion({
        project_id: '123',
        merge_request_iid: 42,
        body: 'Comment on context',
        position: {
          base_sha: 'abc123',
          start_sha: 'abc123',
          head_sha: 'def456',
          old_path: 'src/file.ts',
          new_path: 'src/file.ts',
          old_line: 15,
          new_line: 20,
        },
      });

      expect(mockClient.post).toHaveBeenCalledWith(
        '/projects/123/merge_requests/42/discussions',
        {
          body: 'Comment on context',
          position: {
            base_sha: 'abc123',
            start_sha: 'abc123',
            head_sha: 'def456',
            old_path: 'src/file.ts',
            new_path: 'src/file.ts',
            position_type: 'text',
            old_line: 15,
            new_line: 20,
          },
        }
      );
    });
  });

  describe('replyToMRDiscussion', () => {
    it('should reply to an existing discussion', async () => {
      const mockReply = { id: 99, body: 'Reply text', author: { username: 'user1' } };
      mockClient.post.mockResolvedValue(mockReply);

      const result = await mergeRequestHandlers.replyToMRDiscussion({
        project_id: 'group/project',
        merge_request_iid: 42,
        discussion_id: 'abc123def456',
        body: 'Reply text',
      });

      expect(mockClient.post).toHaveBeenCalledWith(
        '/projects/group%2Fproject/merge_requests/42/discussions/abc123def456/notes',
        { body: 'Reply text' }
      );
      expect(result.content[0].text).toBe(JSON.stringify(mockReply, null, 2));
    });
  });

  describe('resolveMRDiscussion', () => {
    it('should resolve a discussion', async () => {
      const mockDiscussion = { id: 'abc123', resolved: true };
      mockClient.put.mockResolvedValue(mockDiscussion);

      const result = await mergeRequestHandlers.resolveMRDiscussion({
        project_id: 'group/project',
        merge_request_iid: 42,
        discussion_id: 'abc123',
      });

      expect(mockClient.put).toHaveBeenCalledWith(
        '/projects/group%2Fproject/merge_requests/42/discussions/abc123',
        { resolved: true }
      );
      expect(result.content[0].text).toBe(JSON.stringify(mockDiscussion, null, 2));
    });
  });

  describe('unresolveMRDiscussion', () => {
    it('should unresolve a discussion', async () => {
      const mockDiscussion = { id: 'abc123', resolved: false };
      mockClient.put.mockResolvedValue(mockDiscussion);

      const result = await mergeRequestHandlers.unresolveMRDiscussion({
        project_id: '123',
        merge_request_iid: 42,
        discussion_id: 'abc123',
      });

      expect(mockClient.put).toHaveBeenCalledWith(
        '/projects/123/merge_requests/42/discussions/abc123',
        { resolved: false }
      );
      expect(result.content[0].text).toBe(JSON.stringify(mockDiscussion, null, 2));
    });
  });
});
