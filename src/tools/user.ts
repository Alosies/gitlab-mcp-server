import { Tool } from '@modelcontextprotocol/sdk/types.js';

export const userTools: Tool[] = [
  {
    name: 'get_user',
    description: 'Get current user information',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];