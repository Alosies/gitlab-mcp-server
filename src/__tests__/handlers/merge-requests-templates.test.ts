import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MergeRequestHandlers } from '../../handlers/merge-requests.js';

// Mock dependencies
vi.mock('../../client.js');

describe('MergeRequestHandlers - Templates', () => {
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

  describe('listMRTemplates', () => {
    it('should list MR templates', async () => {
      const mockTemplates = [
        { name: 'Default', content: '## Summary\n...' },
        { name: 'Bug Fix', content: '## Bug Description\n...' },
      ];
      mockClient.get.mockResolvedValue(mockTemplates);

      const result = await mergeRequestHandlers.listMRTemplates({
        project_id: 'group/project',
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/projects/group%2Fproject/templates/merge_requests'
      );
      expect(result.content[0].text).toBe(JSON.stringify(mockTemplates, null, 2));
    });

    it('should handle numeric project IDs', async () => {
      const mockTemplates = [{ name: 'Default', content: '...' }];
      mockClient.get.mockResolvedValue(mockTemplates);

      await mergeRequestHandlers.listMRTemplates({
        project_id: '123',
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/projects/123/templates/merge_requests'
      );
    });

    it('should return empty array when no templates exist', async () => {
      mockClient.get.mockResolvedValue([]);

      const result = await mergeRequestHandlers.listMRTemplates({
        project_id: '123',
      });

      expect(result.content[0].text).toBe(JSON.stringify([], null, 2));
    });
  });

  describe('getMRTemplate', () => {
    it('should get a specific MR template', async () => {
      const mockTemplate = {
        name: 'Default',
        content: '## Summary\n\n## Changes\n\n## Testing',
      };
      mockClient.get.mockResolvedValue(mockTemplate);

      const result = await mergeRequestHandlers.getMRTemplate({
        project_id: 'group/project',
        name: 'Default',
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/projects/group%2Fproject/templates/merge_requests/Default'
      );
      expect(result.content[0].text).toBe(JSON.stringify(mockTemplate, null, 2));
    });

    it('should encode template name with special characters', async () => {
      const mockTemplate = { name: 'Bug Fix', content: '...' };
      mockClient.get.mockResolvedValue(mockTemplate);

      await mergeRequestHandlers.getMRTemplate({
        project_id: '123',
        name: 'Bug Fix',
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/projects/123/templates/merge_requests/Bug%20Fix'
      );
    });

    it('should handle template names with slashes', async () => {
      const mockTemplate = { name: 'feature/new', content: '...' };
      mockClient.get.mockResolvedValue(mockTemplate);

      await mergeRequestHandlers.getMRTemplate({
        project_id: '123',
        name: 'feature/new',
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/projects/123/templates/merge_requests/feature%2Fnew'
      );
    });

    it('should handle both project path and template name encoding', async () => {
      const mockTemplate = { name: 'Bug Fix', content: '...' };
      mockClient.get.mockResolvedValue(mockTemplate);

      await mergeRequestHandlers.getMRTemplate({
        project_id: 'my-group/my-project',
        name: 'Bug Fix',
      });

      expect(mockClient.get).toHaveBeenCalledWith(
        '/projects/my-group%2Fmy-project/templates/merge_requests/Bug%20Fix'
      );
    });
  });
});
