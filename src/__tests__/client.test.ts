import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { GitLabClient } from '../client.js';
import type { GitLabConfig } from '../types.js';

// Mock axios
vi.mock('axios', () => ({
  default: {
    create: vi.fn()
  }
}));
const mockedAxios = axios as any;

describe('GitLabClient', () => {
  let client: GitLabClient;
  let mockAxiosInstance: any;
  const mockConfig: GitLabConfig = {
    baseUrl: 'https://gitlab.example.com',
    token: 'test-token'
  };

  beforeEach(() => {
    mockAxiosInstance = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn()
    };
    
    mockedAxios.create.mockReturnValue(mockAxiosInstance);
    client = new GitLabClient(mockConfig);
  });

  it('should create axios instance with correct config', () => {
    expect(mockedAxios.create).toHaveBeenCalledWith({
      baseURL: 'https://gitlab.example.com/api/v4',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json',
      },
    });
  });

  it('should make GET requests', async () => {
    const mockData = { id: 1, name: 'test' };
    mockAxiosInstance.get.mockResolvedValue({ data: mockData });

    const result = await client.get('/test');

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test');
    expect(result).toEqual(mockData);
  });

  it('should make POST requests', async () => {
    const mockData = { id: 1, name: 'created' };
    const requestData = { name: 'test' };
    mockAxiosInstance.post.mockResolvedValue({ data: mockData });

    const result = await client.post('/test', requestData);

    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/test', requestData);
    expect(result).toEqual(mockData);
  });

  it('should make PUT requests', async () => {
    const mockData = { id: 1, name: 'updated' };
    const requestData = { name: 'updated' };
    mockAxiosInstance.put.mockResolvedValue({ data: mockData });

    const result = await client.put('/test/1', requestData);

    expect(mockAxiosInstance.put).toHaveBeenCalledWith('/test/1', requestData);
    expect(result).toEqual(mockData);
  });

  it('should make DELETE requests', async () => {
    const mockResponse = { status: 204 };
    mockAxiosInstance.delete.mockResolvedValue(mockResponse);

    const result = await client.delete('/test/1');

    expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/test/1');
    expect(result).toEqual(mockResponse);
  });

  it('should return axios instance', () => {
    const axiosInstance = client.getAxios();
    expect(axiosInstance).toBe(mockAxiosInstance);
  });
});