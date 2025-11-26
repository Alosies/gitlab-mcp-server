import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MergeRequestHandlers } from '../../handlers/merge-requests.js';

// Mock dependencies
vi.mock('../../client.js');

describe('MergeRequestHandlers - Discussion Note Operations', () => {
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

  describe('updateMRDiscussionNote', () => {
    it('should update a discussion note', async () => {
      const mockUpdatedNote = {
        id: 789,
        body: 'Updated note content',
        author: { username: 'testuser' },
      };
      mockClient.put.mockResolvedValue(mockUpdatedNote);

      const result = await mergeRequestHandlers.updateMRDiscussionNote({
        project_id: '123',
        merge_request_iid: 42,
        discussion_id: 'disc-abc123',
        note_id: 789,
        body: 'Updated note content',
      });

      expect(mockClient.put).toHaveBeenCalledWith(
        '/projects/123/merge_requests/42/discussions/disc-abc123/notes/789',
        { body: 'Updated note content' }
      );
      expect(result.content[0].text).toBe(JSON.stringify(mockUpdatedNote, null, 2));
    });

    it('should update note with markdown content', async () => {
      const mockUpdatedNote = { id: 789, body: '**Bold** and *italic*' };
      mockClient.put.mockResolvedValue(mockUpdatedNote);

      await mergeRequestHandlers.updateMRDiscussionNote({
        project_id: '123',
        merge_request_iid: 42,
        discussion_id: 'disc-abc123',
        note_id: 789,
        body: '**Bold** and *italic*',
      });

      expect(mockClient.put).toHaveBeenCalledWith(
        '/projects/123/merge_requests/42/discussions/disc-abc123/notes/789',
        { body: '**Bold** and *italic*' }
      );
    });
  });

  describe('createMRDiscussionNote', () => {
    it('should create a new note in discussion', async () => {
      const mockNewNote = {
        id: 999,
        body: 'This is a reply',
        author: { username: 'testuser' },
      };
      mockClient.post.mockResolvedValue(mockNewNote);

      const result = await mergeRequestHandlers.createMRDiscussionNote({
        project_id: '123',
        merge_request_iid: 42,
        discussion_id: 'disc-abc123',
        body: 'This is a reply',
      });

      expect(mockClient.post).toHaveBeenCalledWith(
        '/projects/123/merge_requests/42/discussions/disc-abc123/notes',
        { body: 'This is a reply' }
      );
      expect(result.content[0].text).toBe(JSON.stringify(mockNewNote, null, 2));
    });

    it('should create note with code snippet', async () => {
      const codeSnippet = '```javascript\nconsole.log("test");\n```';
      const mockNewNote = { id: 999, body: codeSnippet };
      mockClient.post.mockResolvedValue(mockNewNote);

      await mergeRequestHandlers.createMRDiscussionNote({
        project_id: '123',
        merge_request_iid: 42,
        discussion_id: 'disc-abc123',
        body: codeSnippet,
      });

      expect(mockClient.post).toHaveBeenCalledWith(
        '/projects/123/merge_requests/42/discussions/disc-abc123/notes',
        { body: codeSnippet }
      );
    });
  });

  describe('deleteMRDiscussionNote', () => {
    it('should delete a discussion note', async () => {
      mockClient.delete.mockResolvedValue({});

      const result = await mergeRequestHandlers.deleteMRDiscussionNote({
        project_id: '123',
        merge_request_iid: 42,
        discussion_id: 'disc-abc123',
        note_id: 789,
      });

      expect(mockClient.delete).toHaveBeenCalledWith(
        '/projects/123/merge_requests/42/discussions/disc-abc123/notes/789'
      );
      expect(result.content[0].text).toBe(
        JSON.stringify({ message: 'Note deleted successfully' }, null, 2)
      );
    });

    it('should handle URL-encoded project path', async () => {
      mockClient.delete.mockResolvedValue({});

      await mergeRequestHandlers.deleteMRDiscussionNote({
        project_id: 'group/subgroup/project',
        merge_request_iid: 42,
        discussion_id: 'disc-abc123',
        note_id: 789,
      });

      expect(mockClient.delete).toHaveBeenCalledWith(
        '/projects/group%2Fsubgroup%2Fproject/merge_requests/42/discussions/disc-abc123/notes/789'
      );
    });
  });

  describe('replyToMRDiscussion (existing functionality)', () => {
    it('should reply to a discussion', async () => {
      const mockReply = { id: 1000, body: 'My reply' };
      mockClient.post.mockResolvedValue(mockReply);

      const result = await mergeRequestHandlers.replyToMRDiscussion({
        project_id: '123',
        merge_request_iid: 42,
        discussion_id: 'disc-abc123',
        body: 'My reply',
      });

      expect(mockClient.post).toHaveBeenCalledWith(
        '/projects/123/merge_requests/42/discussions/disc-abc123/notes',
        { body: 'My reply' }
      );
      expect(result.content[0].text).toBe(JSON.stringify(mockReply, null, 2));
    });
  });
});

