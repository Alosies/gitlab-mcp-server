import type { GitLabClient } from '../client.js';

export class UserHandlers {
  constructor(private client: GitLabClient) {}

  async getUser() {
    const data = await this.client.get('/user');
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }
}