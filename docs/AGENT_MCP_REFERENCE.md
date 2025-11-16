# Agent & MCP Tools Reference Guide

**Last Updated**: 2025-11-16
**Purpose**: Quick reference to prevent deep exploration of available agents and MCP tools

---

## 🤖 CLAUDE CODE AGENTS (54 Total)

### 📋 Agent Execution Method
```javascript
// Use Claude Code's Task tool for ALL agent execution
Task("<description>", "<detailed instructions>", "<subagent_type>")
```

### Core Development Agents (5)
- `coder` - Implementation specialist for writing clean, efficient code
- `reviewer` - Code review and quality assurance specialist
- `tester` - Comprehensive testing and quality assurance specialist
- `planner` - Strategic planning and task orchestration agent
- `researcher` - Deep research and information gathering specialist

### Specialized Development Agents (8)
- `backend-dev` - Backend API development (REST/GraphQL)
- `mobile-dev` - React Native mobile app development (iOS/Android)
- `ml-developer` - Machine learning model development, training, deployment
- `cicd-engineer` - GitHub Actions CI/CD pipeline creation
- `api-docs` - OpenAPI/Swagger documentation expert
- `system-architect` - System architecture design and technical decisions
- `code-analyzer` - Advanced code quality analysis and reviews
- `base-template-generator` - Foundational templates and boilerplate code

### SPARC Methodology Agents (6)
- `sparc-coord` - SPARC methodology orchestrator
- `sparc-coder` - Transform specifications to code with TDD
- `specification` - SPARC Specification phase (requirements analysis)
- `pseudocode` - SPARC Pseudocode phase (algorithm design)
- `architecture` - SPARC Architecture phase (system design)
- `refinement` - SPARC Refinement phase (iterative improvement)

### Swarm Coordination Agents (5)
- `hierarchical-coordinator` - Queen-led hierarchical swarm with specialized workers
- `mesh-coordinator` - Peer-to-peer mesh network with distributed decision making
- `adaptive-coordinator` - Dynamic topology switching with self-organizing patterns
- `collective-intelligence-coordinator` - Distributed cognitive processes and consensus
- `swarm-memory-manager` - Distributed memory management across hive mind

### Hive Mind Agents (3)
- `queen-coordinator` - Sovereign orchestrator of hierarchical hive operations
- `scout-explorer` - Information reconnaissance and intelligence gathering
- `worker-specialist` - Dedicated task execution with progress reporting

### Consensus & Distributed Systems (7)
- `byzantine-coordinator` - Byzantine fault-tolerant consensus with malicious detection
- `raft-manager` - Raft consensus algorithm (leader election, log replication)
- `gossip-coordinator` - Gossip-based protocols for eventually consistent systems
- `consensus-builder` - General consensus protocol coordination
- `crdt-synchronizer` - Conflict-free Replicated Data Types (CRDT)
- `quorum-manager` - Dynamic quorum adjustment and membership management
- `security-manager` - Comprehensive security mechanisms for distributed protocols

### Performance & Optimization (6)
- `perf-analyzer` - Performance bottleneck identification and resolution
- `performance-benchmarker` - Comprehensive distributed protocol benchmarking
- `task-orchestrator` - Task decomposition, execution planning, result synthesis
- `memory-coordinator` - Persistent memory across sessions, cross-agent sharing
- `smart-agent` - Intelligent agent coordination and dynamic spawning
- `Topology Optimizer` - Dynamic swarm topology reconfiguration

### Performance Monitoring (3)
- `Performance Monitor` - Real-time metrics, bottleneck analysis, SLA monitoring
- `Resource Allocator` - Adaptive resource allocation and predictive scaling
- `Load Balancing Coordinator` - Dynamic task distribution and work-stealing
- `Benchmark Suite` - Performance benchmarking and regression detection

### GitHub & Repository Management (10)
- `github-modes` - Comprehensive GitHub workflow orchestration and PR management
- `pr-manager` - Complete pull request lifecycle management
- `code-review-swarm` - Comprehensive AI-powered code review beyond static analysis
- `issue-tracker` - Intelligent issue management with automated tracking
- `release-manager` - Automated release coordination and deployment
- `workflow-automation` - GitHub Actions automation with adaptive coordination
- `project-board-sync` - GitHub Projects visual task management sync
- `repo-architect` - Repository structure optimization and multi-repo management
- `multi-repo-swarm` - Cross-repository orchestration and collaboration
- `swarm-issue` - GitHub issue-based swarm coordination
- `swarm-pr` - Pull request swarm management and validation
- `sync-coordinator` - Multi-repository synchronization and version alignment

### Testing & Validation (2)
- `tdd-london-swarm` - TDD London School specialist (mock-driven development)
- `production-validator` - Production validation ensuring deployment readiness

### Planning & Intelligence (4)
- `goal-planner` - Goal-Oriented Action Planning (GOAP) specialist
- `code-goal-planner` - Code-centric GOAP for software development
- `sublinear-goal-planner` - Sublinear GOAP with optimized pathfinding
- `migration-planner` - Comprehensive migration planning

### Flow Nexus Specialized (10)
- `flow-nexus-app-store` - Application marketplace and template management
- `flow-nexus-auth` - Authentication and user management
- `flow-nexus-challenges` - Coding challenges and gamification
- `flow-nexus-neural` - Neural network training and deployment
- `flow-nexus-payments` - Credit management and billing
- `flow-nexus-sandbox` - E2B sandbox deployment and management
- `flow-nexus-swarm` - AI swarm orchestration and scaling
- `flow-nexus-user-tools` - User management and system utilities
- `flow-nexus-workflow` - Event-driven workflow automation

### Neural & Learning (1)
- `safla-neural` - Self-Aware Feedback Loop Algorithm with persistent memory

### Exploration & Search (2)
- `Explore` - Fast codebase exploration (file patterns, keyword search, analysis)
- `Plan` - Fast planning and codebase exploration specialist

### Other Specialized (1)
- `swarm-init` - Swarm initialization and topology optimization

---

## 🔧 MCP SERVERS & TOOLS

### MCP Server 1: RUV-SWARM (Core Coordination)
**Installation**: `claude mcp add ruv-swarm npx ruv-swarm mcp start`

#### Swarm Management (3 tools)
- `mcp__ruv-swarm__swarm_init` - Initialize swarm with topology (mesh/hierarchical/ring/star)
- `mcp__ruv-swarm__swarm_status` - Get current swarm status and agent info
- `mcp__ruv-swarm__swarm_monitor` - Monitor swarm activity in real-time

#### Agent Management (3 tools)
- `mcp__ruv-swarm__agent_spawn` - Spawn new agent in swarm
- `mcp__ruv-swarm__agent_list` - List all active agents
- `mcp__ruv-swarm__agent_metrics` - Get performance metrics for agents

#### Task Orchestration (3 tools)
- `mcp__ruv-swarm__task_orchestrate` - Orchestrate task across swarm
- `mcp__ruv-swarm__task_status` - Check progress of running tasks
- `mcp__ruv-swarm__task_results` - Retrieve results from completed tasks

#### System & Performance (4 tools)
- `mcp__ruv-swarm__benchmark_run` - Execute performance benchmarks
- `mcp__ruv-swarm__features_detect` - Detect runtime features and capabilities
- `mcp__ruv-swarm__memory_usage` - Get current memory usage statistics

#### Neural Agents (3 tools)
- `mcp__ruv-swarm__neural_status` - Get neural agent status and metrics
- `mcp__ruv-swarm__neural_train` - Train neural agents with sample tasks
- `mcp__ruv-swarm__neural_patterns` - Get cognitive pattern information

#### DAA (Decentralized Autonomous Agents) (11 tools)
- `mcp__ruv-swarm__daa_init` - Initialize DAA service
- `mcp__ruv-swarm__daa_agent_create` - Create autonomous agent
- `mcp__ruv-swarm__daa_agent_adapt` - Trigger agent adaptation
- `mcp__ruv-swarm__daa_workflow_create` - Create autonomous workflow
- `mcp__ruv-swarm__daa_workflow_execute` - Execute DAA workflow
- `mcp__ruv-swarm__daa_knowledge_share` - Share knowledge between agents
- `mcp__ruv-swarm__daa_learning_status` - Get learning progress
- `mcp__ruv-swarm__daa_cognitive_pattern` - Analyze/change cognitive patterns
- `mcp__ruv-swarm__daa_meta_learning` - Enable meta-learning across domains
- `mcp__ruv-swarm__daa_performance_metrics` - Get comprehensive performance metrics

**Total RUV-SWARM Tools**: 27

---

### MCP Server 2: GITHUB (Repository Management)
**Built-in GitHub Integration**

#### Repository Operations (6 tools)
- `mcp__github__create_repository` - Create new GitHub repository
- `mcp__github__search_repositories` - Search for repositories
- `mcp__github__fork_repository` - Fork repository to account/org
- `mcp__github__get_file_contents` - Get file/directory contents
- `mcp__github__create_branch` - Create new branch
- `mcp__github__list_commits` - Get list of commits

#### File Operations (3 tools)
- `mcp__github__create_or_update_file` - Create or update single file
- `mcp__github__push_files` - Push multiple files in single commit

#### Issue Management (6 tools)
- `mcp__github__create_issue` - Create new issue
- `mcp__github__list_issues` - List issues with filtering
- `mcp__github__get_issue` - Get specific issue details
- `mcp__github__update_issue` - Update existing issue
- `mcp__github__add_issue_comment` - Add comment to issue

#### Pull Request Management (11 tools)
- `mcp__github__create_pull_request` - Create new pull request
- `mcp__github__get_pull_request` - Get PR details
- `mcp__github__list_pull_requests` - List and filter PRs
- `mcp__github__create_pull_request_review` - Create review on PR
- `mcp__github__merge_pull_request` - Merge pull request
- `mcp__github__get_pull_request_files` - Get list of changed files
- `mcp__github__get_pull_request_status` - Get combined status checks
- `mcp__github__update_pull_request_branch` - Update PR branch with base
- `mcp__github__get_pull_request_comments` - Get review comments
- `mcp__github__get_pull_request_reviews` - Get reviews on PR

#### Search Operations (3 tools)
- `mcp__github__search_code` - Search for code across repositories
- `mcp__github__search_issues` - Search for issues and PRs
- `mcp__github__search_users` - Search for users

**Total GitHub Tools**: 29

---

### MCP Server 3: FLOW-NEXUS (Cloud Platform - Optional)
**Installation**: `claude mcp add flow-nexus npx flow-nexus@latest mcp start`
**Requires Registration**: `npx flow-nexus@latest register`

#### Swarm Orchestration (9 tools)
- `mcp__flow-nexus__swarm_init` - Initialize multi-agent swarm
- `mcp__flow-nexus__agent_spawn` - Create specialized AI agent
- `mcp__flow-nexus__task_orchestrate` - Orchestrate complex task
- `mcp__flow-nexus__swarm_list` - List active swarms
- `mcp__flow-nexus__swarm_status` - Get swarm status and details
- `mcp__flow-nexus__swarm_scale` - Scale swarm up or down
- `mcp__flow-nexus__swarm_destroy` - Destroy swarm and cleanup
- `mcp__flow-nexus__swarm_create_from_template` - Create from app store template
- `mcp__flow-nexus__swarm_templates_list` - List available templates

#### Neural Network Training (11 tools)
- `mcp__flow-nexus__neural_train` - Train neural network
- `mcp__flow-nexus__neural_predict` - Run inference on model
- `mcp__flow-nexus__neural_list_templates` - List NN templates
- `mcp__flow-nexus__neural_deploy_template` - Deploy template
- `mcp__flow-nexus__neural_training_status` - Check training job status
- `mcp__flow-nexus__neural_list_models` - List user's trained models
- `mcp__flow-nexus__neural_validation_workflow` - Create validation workflow
- `mcp__flow-nexus__neural_publish_template` - Publish model as template
- `mcp__flow-nexus__neural_rate_template` - Rate a template
- `mcp__flow-nexus__neural_performance_benchmark` - Run performance benchmarks
- `mcp__flow-nexus__neural_cluster_init` - Initialize distributed NN cluster

#### Distributed Neural Clusters (6 tools)
- `mcp__flow-nexus__neural_node_deploy` - Deploy NN node in E2B sandbox
- `mcp__flow-nexus__neural_cluster_connect` - Connect nodes in cluster
- `mcp__flow-nexus__neural_train_distributed` - Distributed training
- `mcp__flow-nexus__neural_cluster_status` - Get cluster status
- `mcp__flow-nexus__neural_predict_distributed` - Distributed inference
- `mcp__flow-nexus__neural_cluster_terminate` - Terminate cluster

#### E2B Sandbox Management (10 tools)
- `mcp__flow-nexus__sandbox_create` - Create code execution sandbox
- `mcp__flow-nexus__sandbox_execute` - Execute code in sandbox
- `mcp__flow-nexus__sandbox_list` - List all sandboxes
- `mcp__flow-nexus__sandbox_stop` - Stop running sandbox
- `mcp__flow-nexus__sandbox_configure` - Configure sandbox environment
- `mcp__flow-nexus__sandbox_delete` - Delete sandbox
- `mcp__flow-nexus__sandbox_status` - Get sandbox status
- `mcp__flow-nexus__sandbox_upload` - Upload file to sandbox
- `mcp__flow-nexus__sandbox_logs` - Get sandbox logs

#### Template & App Store (6 tools)
- `mcp__flow-nexus__template_list` - List deployment templates
- `mcp__flow-nexus__template_get` - Get template details
- `mcp__flow-nexus__template_deploy` - Deploy template with variables
- `mcp__flow-nexus__app_store_list_templates` - List application templates
- `mcp__flow-nexus__app_store_publish_app` - Publish app to store
- `mcp__flow-nexus__app_get` - Get specific app details
- `mcp__flow-nexus__app_update` - Update application info
- `mcp__flow-nexus__app_search` - Search applications with filters
- `mcp__flow-nexus__app_analytics` - Get app analytics
- `mcp__flow-nexus__app_installed` - Get user installed apps

#### Workflow Automation (7 tools)
- `mcp__flow-nexus__workflow_create` - Create event-driven workflow
- `mcp__flow-nexus__workflow_execute` - Execute workflow with queue
- `mcp__flow-nexus__workflow_status` - Get workflow status and metrics
- `mcp__flow-nexus__workflow_list` - List workflows with filtering
- `mcp__flow-nexus__workflow_agent_assign` - Assign optimal agent to task
- `mcp__flow-nexus__workflow_queue_status` - Check message queue status
- `mcp__flow-nexus__workflow_audit_trail` - Get workflow audit trail

#### Challenges & Gamification (6 tools)
- `mcp__flow-nexus__challenges_list` - List available challenges
- `mcp__flow-nexus__challenge_get` - Get challenge details
- `mcp__flow-nexus__challenge_submit` - Submit challenge solution
- `mcp__flow-nexus__app_store_complete_challenge` - Mark challenge completed
- `mcp__flow-nexus__leaderboard_get` - Get leaderboard rankings
- `mcp__flow-nexus__achievements_list` - List user achievements

#### Credits & Payments (5 tools)
- `mcp__flow-nexus__app_store_earn_ruv` - Award rUv credits to user
- `mcp__flow-nexus__ruv_balance` - Get user credit balance
- `mcp__flow-nexus__ruv_history` - Get transaction history
- `mcp__flow-nexus__check_balance` - Check credit balance and auto-refill
- `mcp__flow-nexus__create_payment_link` - Create secure payment link
- `mcp__flow-nexus__configure_auto_refill` - Configure auto credit refill
- `mcp__flow-nexus__get_payment_history` - Get payment history

#### Authentication & User Management (10 tools)
- `mcp__flow-nexus__auth_status` - Check auth status and permissions
- `mcp__flow-nexus__auth_init` - Initialize secure authentication
- `mcp__flow-nexus__user_register` - Register new user account
- `mcp__flow-nexus__user_login` - Login user and create session
- `mcp__flow-nexus__user_logout` - Logout and clear session
- `mcp__flow-nexus__user_verify_email` - Verify email with token
- `mcp__flow-nexus__user_reset_password` - Request password reset
- `mcp__flow-nexus__user_update_password` - Update password with token
- `mcp__flow-nexus__user_upgrade` - Upgrade user tier
- `mcp__flow-nexus__user_stats` - Get user statistics
- `mcp__flow-nexus__user_profile` - Get user profile
- `mcp__flow-nexus__user_update_profile` - Update user profile

#### Real-time & Streaming (7 tools)
- `mcp__flow-nexus__execution_stream_subscribe` - Subscribe to execution streams
- `mcp__flow-nexus__execution_stream_status` - Get stream status
- `mcp__flow-nexus__execution_files_list` - List files from execution
- `mcp__flow-nexus__execution_file_get` - Get file content from execution
- `mcp__flow-nexus__realtime_subscribe` - Subscribe to database changes
- `mcp__flow-nexus__realtime_unsubscribe` - Unsubscribe from changes
- `mcp__flow-nexus__realtime_list` - List active subscriptions

#### Storage & Files (4 tools)
- `mcp__flow-nexus__storage_upload` - Upload file to storage
- `mcp__flow-nexus__storage_delete` - Delete file from storage
- `mcp__flow-nexus__storage_list` - List files in bucket
- `mcp__flow-nexus__storage_get_url` - Get public URL for file

#### System & Admin (4 tools)
- `mcp__flow-nexus__system_health` - Check system health status
- `mcp__flow-nexus__audit_log` - Get audit log entries
- `mcp__flow-nexus__market_data` - Get market statistics and trends
- `mcp__flow-nexus__seraphina_chat` - Chat with Queen Seraphina AI assistant

#### GitHub Integration (1 tool)
- `mcp__flow-nexus__github_repo_analyze` - Analyze GitHub repository

#### DAA Integration (1 tool)
- `mcp__flow-nexus__daa_agent_create` - Create decentralized autonomous agent

**Total Flow-Nexus Tools**: 70+

---

## 📊 TOTAL TOOL COUNT SUMMARY

| Category | Count |
|----------|-------|
| **Claude Code Agents** | 54 |
| **RUV-SWARM MCP Tools** | 27 |
| **GitHub MCP Tools** | 29 |
| **Flow-Nexus MCP Tools** | 70+ |
| **GRAND TOTAL** | 180+ |

---

## 🎯 USAGE GUIDELINES

### Agent Spawning (REQUIRED METHOD)
```javascript
// ✅ CORRECT: Use Claude Code's Task tool
Task("Description", "Full instructions with hooks", "subagent_type")

// ❌ WRONG: Don't try to spawn agents with MCP tools alone
mcp__ruv-swarm__agent_spawn // Only for coordination topology
```

### MCP Tool Usage (COORDINATION ONLY)
```javascript
// MCP tools set up coordination structure
mcp__ruv-swarm__swarm_init({ topology: "mesh" })
mcp__ruv-swarm__agent_spawn({ type: "researcher" })

// But Claude Code Task tool does the ACTUAL WORK
Task("Research agent", "Do the research...", "researcher")
```

### Concurrent Execution Pattern
```javascript
[Single Message]:
  // All Task spawns together
  Task("Agent 1", "Instructions 1", "coder")
  Task("Agent 2", "Instructions 2", "tester")
  Task("Agent 3", "Instructions 3", "reviewer")

  // All todos batched
  TodoWrite({ todos: [...8-10 todos...] })

  // All file operations together
  Write "file1.js"
  Write "file2.js"
  Edit "file3.js"
```

---

## 🔍 QUICK REFERENCE BY USE CASE

### Full-Stack Development
**Agents**: `backend-dev`, `coder`, `tester`, `cicd-engineer`, `code-analyzer`
**MCP**: `mcp__ruv-swarm__swarm_init`, `mcp__github__*`

### Machine Learning Project
**Agents**: `ml-developer`, `researcher`, `tester`
**MCP**: `mcp__flow-nexus__neural_*`, `mcp__flow-nexus__sandbox_*`

### GitHub Repository Management
**Agents**: `github-modes`, `pr-manager`, `code-review-swarm`, `issue-tracker`
**MCP**: `mcp__github__*` (all 29 tools)

### Distributed Systems
**Agents**: `byzantine-coordinator`, `raft-manager`, `gossip-coordinator`
**MCP**: `mcp__ruv-swarm__daa_*`

### SPARC Methodology
**Agents**: `sparc-coord`, `specification`, `pseudocode`, `architecture`, `refinement`, `sparc-coder`
**MCP**: `mcp__ruv-swarm__task_orchestrate`

### Performance Optimization
**Agents**: `perf-analyzer`, `performance-benchmarker`, `task-orchestrator`
**MCP**: `mcp__ruv-swarm__benchmark_run`, `mcp__ruv-swarm__agent_metrics`

---

## ⚡ CRITICAL REMINDERS

1. **NEVER save files to root folder** - Use /docs, /src, /tests, etc.
2. **ALWAYS batch operations** - Single message = all related tasks
3. **Task tool for execution** - MCP for coordination only
4. **Include hooks in agent instructions** - Pre/post task, memory coordination
5. **TodoWrite with 5-10+ items** - Batch all todos in one call
6. **Parallel file operations** - All reads/writes/edits together

---

**Last Updated**: 2025-11-16
**Version**: 1.0
**Purpose**: Prevent repetitive exploration, enable instant reference
