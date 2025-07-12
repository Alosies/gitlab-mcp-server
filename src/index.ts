#!/usr/bin/env node

// Export the server class and types for library usage
export { GitLabMCPServer } from './server.js';
export { GitLabClient } from './client.js';
export type * from './types.js';

// Import for CLI execution
import { GitLabMCPServer } from './server.js';

// CLI execution
// Support optional config file path from command line argument
const configPath = process.argv.includes('--config') 
  ? process.argv[process.argv.indexOf('--config') + 1] 
  : undefined;

const server = new GitLabMCPServer(configPath);
server.run().catch(console.error);