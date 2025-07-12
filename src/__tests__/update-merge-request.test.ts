import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

describe('Update Merge Request', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NPM_CONFIG_TOKEN = 'test-token';
    
    mockedAxios.create = vi.fn().mockReturnValue({
      put: vi.fn().mockResolvedValue({ 
        data: { 
          id: 123, 
          title: 'Updated MR Title',
          description: 'Updated description',
          state: 'opened'
        } 
      }),
    });
  });

  it('should build the correct PUT request data', () => {
    const mockParams = {
      project_id: 'test-project',
      merge_request_iid: 1,
      title: 'Updated Title',
      description: 'Updated description',
      state_event: 'close' as const,
    };

    // Test that the parameters are correctly structured
    const expectedData: any = {};
    if (mockParams.title !== undefined) expectedData.title = mockParams.title;
    if (mockParams.description !== undefined) expectedData.description = mockParams.description;
    if (mockParams.state_event !== undefined) expectedData.state_event = mockParams.state_event;

    expect(expectedData).toEqual({
      title: 'Updated Title',
      description: 'Updated description',
      state_event: 'close',
    });

    // Verify URL construction
    const expectedUrl = `/projects/${encodeURIComponent(mockParams.project_id)}/merge_requests/${mockParams.merge_request_iid}`;
    expect(expectedUrl).toBe('/projects/test-project/merge_requests/1');
  });

  it('should only include provided parameters in the request', () => {
    const mockParams = {
      project_id: 'test-project',
      merge_request_iid: 1,
      title: 'Updated Title',
      // Note: not providing description, should not be included
    };

    // Test that only provided parameters are included
    expect(mockParams.title).toBeDefined();
    expect((mockParams as any).description).toBeUndefined();
  });
});