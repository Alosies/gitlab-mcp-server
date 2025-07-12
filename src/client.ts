import axios, { AxiosInstance } from 'axios';
import type { GitLabConfig } from './types.js';

/**
 * GitLab API client wrapper
 */
export class GitLabClient {
  private axios: AxiosInstance;

  constructor(config: GitLabConfig) {
    this.axios = axios.create({
      baseURL: `${config.baseUrl}/api/v4`,
      headers: {
        'Authorization': `Bearer ${config.token}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Get the underlying axios instance for API calls
   */
  getAxios(): AxiosInstance {
    return this.axios;
  }

  /**
   * Make a GET request to the GitLab API
   */
  async get(endpoint: string): Promise<any> {
    const response = await this.axios.get(endpoint);
    return response.data;
  }

  /**
   * Make a POST request to the GitLab API
   */
  async post(endpoint: string, data?: any): Promise<any> {
    const response = await this.axios.post(endpoint, data);
    return response.data;
  }

  /**
   * Make a PUT request to the GitLab API
   */
  async put(endpoint: string, data?: any): Promise<any> {
    const response = await this.axios.put(endpoint, data);
    return response.data;
  }

  /**
   * Make a DELETE request to the GitLab API
   */
  async delete(endpoint: string): Promise<any> {
    const response = await this.axios.delete(endpoint);
    return response;
  }
}