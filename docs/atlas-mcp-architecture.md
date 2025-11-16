# ATLAS MCP Integration Architecture

## MCP Server Design

### Technology Stack
- **MCP Framework**: `@modelcontextprotocol/sdk`
- **JIRA Client**: `jira-client` npm package
- **WebSocket**: For real-time webhook relay to app
- **Caching**: Redis (optional) or in-memory for rate limit optimization

### Architecture Layers

```
┌─────────────────────────────────────────────────┐
│              Main Productivity App               │
│         (React Frontend + Supabase Backend)     │
└────────────────────┬────────────────────────────┘
                     │
                     │ MCP Protocol (JSON-RPC)
                     │
┌────────────────────┴────────────────────────────┐
│             ATLAS MCP Server                     │
│         (Node.js + MCP SDK + Jira Client)       │
├──────────────────────────────────────────────────┤
│                                                   │
│  ┌─────────────────┐  ┌─────────────────┐       │
│  │  MCP Tools      │  │  Webhook Server │       │
│  │  (10 methods)   │  │  (Express)      │       │
│  └────────┬────────┘  └────────┬────────┘       │
│           │                     │                │
│  ┌────────┴─────────────────────┴────────┐      │
│  │      JIRA Client Wrapper              │      │
│  │  - Auth handling                      │      │
│  │  - Rate limiting                      │      │
│  │  - Error retry logic                  │      │
│  │  - Response caching                   │      │
│  └────────┬──────────────────────────────┘      │
│           │                                      │
└───────────┼──────────────────────────────────────┘
            │
            │ JIRA REST API v3
            │
┌───────────┴──────────────────────────────────────┐
│              JIRA Cloud Instance                 │
│         (your-company.atlassian.net)            │
└──────────────────────────────────────────────────┘
```

## MCP Server Implementation

### 1. Server Initialization

```typescript
// atlas-mcp-server/src/server.ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import JiraClient from 'jira-client';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

class AtlasMCPServer {
  private server: Server;
  private jiraClient: JiraClient;

  constructor() {
    this.server = new Server(
      {
        name: 'atlas-jira-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Initialize JIRA client
    this.jiraClient = new JiraClient({
      protocol: 'https',
      host: process.env.JIRA_HOST, // 'your-company.atlassian.net'
      username: process.env.JIRA_EMAIL,
      password: process.env.JIRA_API_TOKEN,
      apiVersion: '3',
      strictSSL: true
    });

    this.setupHandlers();
  }

  private setupHandlers() {
    // List available MCP tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'jira_get_assigned_issues',
          description: 'Fetch all JIRA issues assigned to the current user',
          inputSchema: {
            type: 'object',
            properties: {
              status: {
                type: 'string',
                description: 'Filter by status (optional): To Do, In Progress, Testing, Done',
                enum: ['To Do', 'In Progress', 'Testing', 'Done']
              },
              maxResults: {
                type: 'number',
                description: 'Maximum number of issues to return (default: 50)',
                default: 50
              }
            }
          }
        },
        {
          name: 'jira_get_issue',
          description: 'Get detailed information about a specific JIRA issue',
          inputSchema: {
            type: 'object',
            properties: {
              issueKey: {
                type: 'string',
                description: 'JIRA issue key (e.g., PROJ-123)',
                required: true
              }
            },
            required: ['issueKey']
          }
        },
        {
          name: 'jira_update_issue_status',
          description: 'Move a JIRA issue to a new status (e.g., start testing)',
          inputSchema: {
            type: 'object',
            properties: {
              issueKey: { type: 'string', required: true },
              transition: {
                type: 'string',
                description: 'Target status or transition name',
                enum: ['To Do', 'In Progress', 'Testing', 'Done', 'Blocked'],
                required: true
              }
            },
            required: ['issueKey', 'transition']
          }
        },
        {
          name: 'jira_add_comment',
          description: 'Add a comment to a JIRA issue (e.g., test notes)',
          inputSchema: {
            type: 'object',
            properties: {
              issueKey: { type: 'string', required: true },
              comment: { type: 'string', required: true }
            },
            required: ['issueKey', 'comment']
          }
        },
        {
          name: 'jira_create_issue',
          description: 'Create a new JIRA issue (e.g., bug found during testing)',
          inputSchema: {
            type: 'object',
            properties: {
              project: { type: 'string', required: true },
              summary: { type: 'string', required: true },
              description: { type: 'string' },
              issueType: {
                type: 'string',
                enum: ['Bug', 'Task', 'Story', 'Sub-task'],
                default: 'Bug'
              },
              priority: {
                type: 'string',
                enum: ['Highest', 'High', 'Medium', 'Low', 'Lowest'],
                default: 'Medium'
              }
            },
            required: ['project', 'summary']
          }
        },
        {
          name: 'jira_add_worklog',
          description: 'Log time spent on a JIRA issue (sync testing session time)',
          inputSchema: {
            type: 'object',
            properties: {
              issueKey: { type: 'string', required: true },
              timeSpentSeconds: { type: 'number', required: true },
              comment: { type: 'string' },
              started: { type: 'string', description: 'ISO 8601 timestamp' }
            },
            required: ['issueKey', 'timeSpentSeconds']
          }
        },
        {
          name: 'jira_get_transitions',
          description: 'Get available status transitions for an issue',
          inputSchema: {
            type: 'object',
            properties: {
              issueKey: { type: 'string', required: true }
            },
            required: ['issueKey']
          }
        },
        {
          name: 'jira_search_issues',
          description: 'Search JIRA issues using JQL (JIRA Query Language)',
          inputSchema: {
            type: 'object',
            properties: {
              jql: {
                type: 'string',
                description: 'JQL query string',
                required: true
              },
              maxResults: { type: 'number', default: 50 }
            },
            required: ['jql']
          }
        },
        {
          name: 'jira_get_sprints',
          description: 'Get active and upcoming sprints for sprint planning',
          inputSchema: {
            type: 'object',
            properties: {
              boardId: { type: 'number', required: true }
            },
            required: ['boardId']
          }
        },
        {
          name: 'jira_get_project_metadata',
          description: 'Get project configuration (issue types, statuses, workflows)',
          inputSchema: {
            type: 'object',
            properties: {
              projectKey: { type: 'string', required: true }
            },
            required: ['projectKey']
          }
        }
      ]
    }));

    // Handle tool execution
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'jira_get_assigned_issues':
            return await this.getAssignedIssues(args);
          case 'jira_get_issue':
            return await this.getIssue(args);
          case 'jira_update_issue_status':
            return await this.updateIssueStatus(args);
          case 'jira_add_comment':
            return await this.addComment(args);
          case 'jira_create_issue':
            return await this.createIssue(args);
          case 'jira_add_worklog':
            return await this.addWorklog(args);
          case 'jira_get_transitions':
            return await this.getTransitions(args);
          case 'jira_search_issues':
            return await this.searchIssues(args);
          case 'jira_get_sprints':
            return await this.getSprints(args);
          case 'jira_get_project_metadata':
            return await this.getProjectMetadata(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`
            }
          ],
          isError: true
        };
      }
    });
  }

  // Tool implementations
  private async getAssignedIssues(args: any) {
    const jql = `assignee = currentUser()${args.status ? ` AND status = "${args.status}"` : ''} ORDER BY priority DESC, updated DESC`;
    const issues = await this.jiraClient.searchJira(jql, {
      maxResults: args.maxResults || 50,
      fields: ['summary', 'status', 'priority', 'assignee', 'created', 'updated', 'duedate', 'issuetype', 'project']
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(issues, null, 2)
        }
      ]
    };
  }

  private async getIssue(args: any) {
    const issue = await this.jiraClient.findIssue(args.issueKey);
    return {
      content: [{ type: 'text', text: JSON.stringify(issue, null, 2) }]
    };
  }

  private async updateIssueStatus(args: any) {
    // First get available transitions
    const transitions = await this.jiraClient.listTransitions(args.issueKey);
    const targetTransition = transitions.transitions.find(
      t => t.name.toLowerCase() === args.transition.toLowerCase() ||
           t.to.name.toLowerCase() === args.transition.toLowerCase()
    );

    if (!targetTransition) {
      throw new Error(`Transition "${args.transition}" not available for ${args.issueKey}`);
    }

    await this.jiraClient.transitionIssue(args.issueKey, {
      transition: { id: targetTransition.id }
    });

    return {
      content: [{ type: 'text', text: `Successfully moved ${args.issueKey} to ${args.transition}` }]
    };
  }

  private async addComment(args: any) {
    await this.jiraClient.addComment(args.issueKey, args.comment);
    return {
      content: [{ type: 'text', text: `Comment added to ${args.issueKey}` }]
    };
  }

  private async createIssue(args: any) {
    const issue = await this.jiraClient.addNewIssue({
      fields: {
        project: { key: args.project },
        summary: args.summary,
        description: args.description || '',
        issuetype: { name: args.issueType || 'Bug' },
        priority: { name: args.priority || 'Medium' }
      }
    });

    return {
      content: [{ type: 'text', text: JSON.stringify(issue, null, 2) }]
    };
  }

  private async addWorklog(args: any) {
    await this.jiraClient.addWorklog(args.issueKey, {
      timeSpentSeconds: args.timeSpentSeconds,
      comment: args.comment,
      started: args.started || new Date().toISOString()
    });

    return {
      content: [{ type: 'text', text: `Worklog added to ${args.issueKey}: ${args.timeSpentSeconds}s` }]
    };
  }

  private async getTransitions(args: any) {
    const transitions = await this.jiraClient.listTransitions(args.issueKey);
    return {
      content: [{ type: 'text', text: JSON.stringify(transitions, null, 2) }]
    };
  }

  private async searchIssues(args: any) {
    const results = await this.jiraClient.searchJira(args.jql, {
      maxResults: args.maxResults || 50
    });
    return {
      content: [{ type: 'text', text: JSON.stringify(results, null, 2) }]
    };
  }

  private async getSprints(args: any) {
    const sprints = await this.jiraClient.getAllSprints(args.boardId);
    return {
      content: [{ type: 'text', text: JSON.stringify(sprints, null, 2) }]
    };
  }

  private async getProjectMetadata(args: any) {
    const project = await this.jiraClient.getProject(args.projectKey);
    return {
      content: [{ type: 'text', text: JSON.stringify(project, null, 2) }]
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('ATLAS MCP Server running on stdio');
  }
}

// Start the server
const server = new AtlasMCPServer();
server.run().catch(console.error);
```

### 2. Webhook Server (Real-time Updates)

```typescript
// atlas-mcp-server/src/webhook-server.ts
import express from 'express';
import { WebSocket, WebSocketServer } from 'ws';

class JiraWebhookServer {
  private app = express();
  private wss: WebSocketServer;
  private clients: Set<WebSocket> = new Set();

  constructor(port: number = 3001) {
    this.app.use(express.json());

    // JIRA webhook endpoint
    this.app.post('/jira/webhook', (req, res) => {
      const event = req.body;

      // Filter relevant events
      if (this.isRelevantEvent(event)) {
        this.broadcastToClients({
          type: 'jira_event',
          event: event.webhookEvent,
          issue: event.issue,
          timestamp: new Date().toISOString()
        });
      }

      res.sendStatus(200);
    });

    // WebSocket server for real-time relay to app
    this.wss = new WebSocketServer({ port: 3002 });
    this.wss.on('connection', (ws) => {
      this.clients.add(ws);
      ws.on('close', () => this.clients.delete(ws));
    });

    this.app.listen(port, () => {
      console.log(`JIRA Webhook Server listening on port ${port}`);
      console.log(`WebSocket Server listening on port 3002`);
    });
  }

  private isRelevantEvent(event: any): boolean {
    const relevantEvents = [
      'jira:issue_updated',
      'jira:issue_created',
      'comment_created',
      'worklog_updated'
    ];

    // Only events for current user
    return relevantEvents.includes(event.webhookEvent) &&
           event.issue?.fields?.assignee?.emailAddress === process.env.JIRA_EMAIL;
  }

  private broadcastToClients(message: any) {
    const data = JSON.stringify(message);
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }
}

new JiraWebhookServer();
```

### 3. Background Sync Worker

```typescript
// atlas-mcp-server/src/sync-worker.ts
import cron from 'node-cron';
import { AtlasMCPServer } from './server';

class BackgroundSyncWorker {
  private mcpServer: AtlasMCPServer;

  constructor() {
    // Run sync every 15 minutes
    cron.schedule('*/15 * * * *', async () => {
      await this.performSync();
    });
  }

  private async performSync() {
    console.log('[Sync] Starting background JIRA sync...');

    try {
      // Fetch assigned issues
      const issues = await this.mcpServer.getAssignedIssues({ maxResults: 100 });

      // Update local database (via Supabase API)
      await this.updateDatabase(issues);

      console.log(`[Sync] Successfully synced ${issues.total} issues`);
    } catch (error) {
      console.error('[Sync] Failed:', error);
    }
  }

  private async updateDatabase(issues: any) {
    // Call main app's API to update JIRA ticket cache
    // This could be a Supabase Edge Function or REST endpoint
  }
}

new BackgroundSyncWorker();
```

## Configuration

### Environment Variables

```bash
# .env
JIRA_HOST=your-company.atlassian.net
JIRA_EMAIL=your-email@company.com
JIRA_API_TOKEN=your_api_token_here
WEBHOOK_SECRET=random_secret_for_webhook_verification
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
```

### Claude Desktop Configuration

```json
{
  "mcpServers": {
    "atlas-jira": {
      "command": "node",
      "args": [
        "C:/Users/bette/Desktop/specs_and_prds/atlas-mcp-server/dist/server.js"
      ],
      "env": {
        "JIRA_HOST": "your-company.atlassian.net",
        "JIRA_EMAIL": "your-email@company.com",
        "JIRA_API_TOKEN": "your_token"
      }
    }
  }
}
```

## Data Flow

### Sync Flow Diagram

```
┌─────────────────────────────────────────────────────┐
│                   JIRA Cloud                         │
└────────┬────────────────────────────────────┬───────┘
         │                                     │
         │ Webhook (real-time)        REST API (polling)
         │                                     │
         ▼                                     ▼
┌─────────────────┐                   ┌───────────────┐
│ Webhook Server  │                   │  Background   │
│  (Port 3001)    │                   │  Sync Worker  │
└────────┬────────┘                   └───────┬───────┘
         │                                     │
         │ WebSocket                    HTTP POST
         │                                     │
         ▼                                     ▼
┌─────────────────────────────────────────────────────┐
│              Main Productivity App                   │
│         (Supabase Edge Function/API)                │
└────────┬────────────────────────────────────────────┘
         │
         │ Database Write
         ▼
┌─────────────────────────────────────────────────────┐
│              PostgreSQL (Supabase)                   │
│  - jira_tickets (cached ticket data)                │
│  - jira_sync_log (sync history)                     │
└─────────────────────────────────────────────────────┘
```

## Rate Limiting & Caching

```typescript
// Implement simple in-memory cache to avoid hitting JIRA API limits
class RateLimitedJiraClient {
  private cache = new Map<string, { data: any, timestamp: number }>();
  private CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  async getIssue(issueKey: string) {
    const cached = this.cache.get(issueKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }

    const data = await this.jiraClient.findIssue(issueKey);
    this.cache.set(issueKey, { data, timestamp: Date.now() });
    return data;
  }
}
```

## Security Considerations

1. **API Token Storage**: Use environment variables, never commit to git
2. **Webhook Verification**: Verify JIRA webhook signature
3. **CORS**: Restrict webhook endpoint to JIRA IPs only
4. **Rate Limiting**: Implement request throttling (JIRA allows 10 req/sec for Cloud)
5. **Error Logging**: Don't expose sensitive JIRA data in error messages

## Deployment

```bash
# Build MCP server
cd atlas-mcp-server
npm install
npm run build

# Start webhook server (in production)
npm run webhook-server

# Start background sync worker
npm run sync-worker

# MCP server runs via Claude Desktop config (stdio transport)
```

## Testing

```typescript
// Test MCP tools locally
import { Client } from '@modelcontextprotocol/sdk/client/index.js';

const client = new Client({
  name: 'atlas-test-client',
  version: '1.0.0'
});

// Connect to MCP server
await client.connect(transport);

// Call a tool
const result = await client.callTool({
  name: 'jira_get_assigned_issues',
  arguments: { status: 'In Progress' }
});

console.log(result);
```
