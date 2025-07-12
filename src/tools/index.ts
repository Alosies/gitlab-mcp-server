import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { projectTools } from './projects.js';
import { issueTools } from './issues.js';
import { mergeRequestTools } from './merge-requests.js';
import { repositoryTools } from './repository.js';
import { pipelineTools } from './pipelines.js';
import { jobTools } from './jobs.js';
import { userTools } from './user.js';

export const allTools: Tool[] = [
  ...projectTools,
  ...issueTools,
  ...mergeRequestTools,
  ...repositoryTools,
  ...pipelineTools,
  ...jobTools,
  ...userTools,
];

export {
  projectTools,
  issueTools,
  mergeRequestTools,
  repositoryTools,
  pipelineTools,
  jobTools,
  userTools,
};