import type { GitLabClient } from '../client.js';
import type { 
  ListPipelineJobsParams,
  GetJobLogsParams,
  GetJobTraceParams
} from '../types.js';

export class JobHandlers {
  constructor(private client: GitLabClient) {}

  async listPipelineJobs(args: ListPipelineJobsParams) {
    const params = new URLSearchParams();
    
    if (args.scope && args.scope.length > 0) {
      args.scope.forEach((status: string) => params.append('scope[]', status));
    }
    if (args.include_retried !== undefined) params.append('include_retried', String(args.include_retried));

    const data = await this.client.get(`/projects/${encodeURIComponent(args.project_id)}/pipelines/${args.pipeline_id}/jobs?${params.toString()}`);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  async getJobLogs(args: GetJobLogsParams) {
    const data = await this.client.get(`/projects/${encodeURIComponent(args.project_id)}/jobs/${args.job_id}/trace`);
    
    return {
      content: [
        {
          type: 'text',
          text: data,
        },
      ],
    };
  }

  async getJobTrace(args: GetJobTraceParams) {
    try {
      const logContent = await this.client.get(`/projects/${encodeURIComponent(args.project_id)}/jobs/${args.job_id}/trace`);
      const linesLimit = args.lines_limit || 1000;
      
      if (typeof logContent === 'string' && logContent) {
        const lines = logContent.split('\n');
        const totalLines = lines.length;
        
        // Apply line limiting
        let processedLines: string[];
        
        if (args.tail) {
          // Get last N lines
          processedLines = lines.slice(-linesLimit);
        } else {
          // Get first N lines
          processedLines = lines.slice(0, linesLimit);
        }
        
        const processedContent = processedLines.join('\n');
        
        // Prepare response with metadata
        let responseText: string;
        
        if (args.raw) {
          responseText = processedContent;
        } else {
          const metadata = [
            `📋 Job Trace Summary`,
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
            `📊 Total lines: ${totalLines}`,
            `📄 Showing: ${processedLines.length} lines ${args.tail ? '(last)' : '(first)'}`,
            `🔗 Project: ${args.project_id}`,
            `🚀 Job ID: ${args.job_id}`,
            ``,
            `📝 Log Content:`,
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
            processedContent
          ];
          
          if (totalLines > linesLimit) {
            metadata.push('', `⚠️  Log truncated. Total lines: ${totalLines}, Showing: ${processedLines.length}`);
            if (args.tail) {
              metadata.push(`💡 Use tail:false to see the beginning of the log`);
            } else {
              metadata.push(`💡 Use tail:true to see the end of the log`);
            }
          }
          
          responseText = metadata.join('\n');
        }
        
        return {
          content: [
            {
              type: 'text',
              text: responseText,
            },
          ],
        };
      } else {
        return {
          content: [
            {
              type: 'text',
              text: `No log content available for job ${args.job_id} in project ${args.project_id}`,
            },
          ],
        };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [
          {
            type: 'text',
            text: `Failed to retrieve job trace: ${errorMessage}`,
          },
        ],
        isError: true,
      };
    }
  }
}