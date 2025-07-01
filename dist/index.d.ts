#!/usr/bin/env node
import type { IGitLabMCPServer } from './types.js';
declare class GitLabMCPServer implements IGitLabMCPServer {
    private server;
    private axios;
    private config;
    constructor();
    private setupToolHandlers;
    private listProjects;
    private getProject;
    private listIssues;
    private getIssue;
    private createIssue;
    private listMergeRequests;
    private getMergeRequest;
    private createMergeRequest;
    private getUser;
    private listProjectBranches;
    private getProjectCommits;
    private listPipelines;
    private getPipeline;
    private createPipeline;
    private retryPipeline;
    private cancelPipeline;
    private deletePipeline;
    private listPipelineJobs;
    private getPipelineVariables;
    private getJobLogs;
    private getJobTrace;
    run(): Promise<void>;
}
export { GitLabMCPServer };
export type * from './types.js';
//# sourceMappingURL=index.d.ts.map