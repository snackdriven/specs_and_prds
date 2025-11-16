# PRD: Task Management System

## Product Overview

The Task Management System is the core productivity feature of the Executive Dysfunction Center (EDC), designed specifically for users with ADHD and executive dysfunction. It provides comprehensive task tracking with dependency management, recurring tasks, impact analysis, and intelligent filtering to help users manage complex workflows while minimizing cognitive overhead.

## Problem Statement

Users with ADHD and executive dysfunction face unique challenges with traditional task management:
- **Decision Paralysis**: Too many tasks without clear starting points
- **Cognitive Overload**: Complex task lists that overwhelm rather than help
- **Dependency Blindness**: Inability to see which tasks block others
- **Planning Anxiety**: Difficulty understanding task completion impact
- **Time Blindness**: Poor estimation and tracking of task duration
- **Context Loss**: Forgetting why tasks were created or what they involve

## Target Users

- **Primary**: Adults with ADHD seeking structured task management
- **Secondary**: Individuals with executive dysfunction from any cause
- **Tertiary**: Power users who need dependency-aware task systems

## Goals & Success Metrics

### User Goals
1. Reduce decision paralysis by surfacing actionable tasks
2. Understand task relationships and blocking dependencies
3. Track recurring tasks without manual recreation
4. Estimate and track time spent on tasks
5. Organize tasks by priority, tags, and status

### Success Metrics
- **Engagement**: Daily active task interactions (completion, creation, updates)
- **Completion Rate**: Percentage of tasks completed vs created
- **Dependency Usage**: Percentage of users utilizing task dependencies
- **Recurring Task Adoption**: Users creating recurring vs one-time tasks
- **Time Estimation Accuracy**: Estimated vs actual time tracking delta

## Core Features

### 1. Task CRUD Operations

**Description**: Basic create, read, update, delete operations for tasks

**User Stories**:
- As a user, I want to create tasks with title and description
- As a user, I want to mark tasks as complete
- As a user, I want to edit task details at any time
- As a user, I want to delete tasks I no longer need

**Technical Implementation**:
- Database: `tasks` table (supabase/schema.sql:87-104)
- Hooks: `useTasks()` (hooks/tasks/)
- Components: `TasksView.tsx`, `EnhancedTaskCard.tsx`
- Real-time: Supabase subscriptions for live updates

**Fields**:
- `title` (required): Task name
- `description` (optional): Detailed task information
- `completed` (boolean): Completion status
- `status` (enum): pending | in_progress | completed
- `priority` (integer): 1-5 priority scale
- `due_date` (timestamp): Optional deadline
- `tags` (JSONB): Flexible categorization
- `estimated_minutes` (integer): Time estimation
- `actual_minutes` (integer): Time tracking

### 2. Task Dependencies

**Description**: Create parent-child relationships between tasks to model blocking dependencies

**User Stories**:
- As a user, I want to mark that Task B depends on Task A
- As a user, I want to see all tasks that block a given task
- As a user, I want to see all tasks blocked by a given task
- As a user, I want to be warned about circular dependencies

**Technical Implementation**:
- Database: Separate `task_dependencies` table
- Hooks: `useTaskDependencies()`, `useTaskImpactAnalysis()`
- Service: `lib/tasks/task-dependency-resolver.ts`
- Components: `TaskDependencyManager.tsx`
- Validation: Circular dependency detection

**Dependency Types**:
- **Blocks**: Task A must complete before Task B can start
- **Subtasks**: Parent-child hierarchy (via `parent_task_id`)

**Circular Dependency Protection**:
```typescript
// Algorithm: Detect cycles using depth-first search
validateNoCycles(taskId, dependencyId) → boolean
```

### 3. Impact Analysis

**Description**: Show the ripple effect of completing or deleting a task on dependent tasks

**User Stories**:
- As a user, when I complete a task, I want to see which blocked tasks are now actionable
- As a user, when I delete a task, I want to see which dependent tasks will be orphaned
- As a user, I want to understand the critical path through my task network

**Technical Implementation**:
- Hook: `useTaskImpactAnalysis()`
- Algorithm: Graph traversal to find all downstream dependencies
- Components: Impact visualization in task modals

**Impact Metrics**:
- Number of tasks directly unblocked
- Number of tasks indirectly affected
- Critical path length (longest dependency chain)

### 4. Recurring Tasks

**Description**: Create tasks that automatically regenerate on a schedule

**User Stories**:
- As a user, I want to create daily/weekly/monthly recurring tasks
- As a user, I want recurring tasks to auto-generate when the parent completes
- As a user, I want to customize recurrence rules (every N days/weeks/months)
- As a user, I want recurring tasks to stop after a certain date or count

**Technical Implementation**:
- Field: `recurrence_rule` (JSONB)
- Field: `next_due_date` (timestamp)
- Hook: `useRecurringTaskDependencies()`
- Auto-generation: On task completion, create next instance

**Recurrence Rule Schema**:
```typescript
interface RecurrenceRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
  interval: number // every N days/weeks/months
  until?: Date // end date
  count?: number // max occurrences
  daysOfWeek?: number[] // for weekly (0-6, Sun-Sat)
  dayOfMonth?: number // for monthly (1-31)
}
```

### 5. Subtasks (Parent-Child Hierarchy)

**Description**: Break down large tasks into smaller subtasks

**User Stories**:
- As a user, I want to create subtasks under a parent task
- As a user, I want to see subtask completion percentage on parent tasks
- As a user, I want subtasks to inherit tags/context from parents
- As a user, I want to convert subtasks to independent tasks

**Technical Implementation**:
- Field: `parent_task_id` (foreign key to self)
- Hook: `useSubtaskDependencies()`
- Components: `SubtasksList.tsx`
- Index: `idx_tasks_parent` for fast parent lookups

**Subtask Rules**:
- Subtasks can have their own subtasks (nested hierarchy)
- Parent completion percentage = completed subtasks / total subtasks
- Deleting parent task optionally deletes all subtasks

### 6. Smart Filtering & Views

**Description**: Multiple ways to filter and organize tasks to reduce cognitive load

**User Stories**:
- As a user, I want to filter tasks by status (pending, in progress, completed)
- As a user, I want to filter by priority level
- As a user, I want to filter by tags
- As a user, I want to filter by due date ranges
- As a user, I want to save custom filter configurations
- As a user, I want to see only actionable tasks (no blockers)

**Technical Implementation**:
- Components: `SmartFilters.tsx`, `SavedFilters.tsx`, `AdvancedSearch.tsx`
- Hook: `useTaskFilters()`
- State: Zustand store for filter persistence

**Filter Types**:
- **Status Filter**: Show only pending/in_progress/completed
- **Priority Filter**: Show only high/medium/low priority
- **Tag Filter**: Show tasks with specific tags
- **Due Date Filter**: Overdue, due today, due this week, no due date
- **Blocked Filter**: Show only tasks with no incomplete dependencies
- **Saved Filters**: User-defined combinations with names

### 7. Multiple Layout Views

**Description**: Different visual layouts optimized for different workflows

**User Stories**:
- As a user, I want a Kanban board view for workflow visualization
- As a user, I want a list view for quick scanning
- As a user, I want a focus flow view for single-task attention
- As a user, I want a desktop multi-column layout for power users

**Technical Implementation**:
- Components:
  - `KanbanBoard.tsx`: Drag-drop columns for status
  - `DesktopTaskLayout.tsx`: Multi-column layout
  - `FocusFlowLayout.tsx`: Single-focus mode
  - `TasksView.tsx`: Default list view

**View Modes**:
1. **List View**: Linear task list with grouping
2. **Kanban View**: Columns for pending → in_progress → completed
3. **Focus Flow**: One task at a time, minimize distractions
4. **Desktop Layout**: Side-by-side panels for tasks and details

### 8. Calendar Integration

**Description**: Tasks with due dates automatically sync to calendar events

**User Stories**:
- As a user, when I set a task due date, I want a calendar event created
- As a user, when I update a task due date, I want the calendar event updated
- As a user, when I delete a task, I want the calendar event deleted
- As a user, I want to see task-based events in my calendar views

**Technical Implementation**:
- Service: `lib/calendar/task-calendar-sync.ts`
- Database: `calendar_events.task_id` foreign key
- Sync: Automatic on task CRUD operations
- Integration: Google Calendar sync (if enabled)

**Sync Behavior**:
- Task with `due_date` → Creates calendar event
- Task `due_date` change → Updates calendar event
- Task deletion → Deletes calendar event
- Calendar event shows task title, description, status

### 9. Time Tracking

**Description**: Estimate and track actual time spent on tasks

**User Stories**:
- As a user, I want to estimate how long a task will take
- As a user, I want to log actual time spent on tasks
- As a user, I want to compare estimated vs actual time
- As a user, I want to improve my time estimation accuracy

**Technical Implementation**:
- Fields: `estimated_minutes`, `actual_minutes`
- Components: Time input fields in task forms
- Analytics: Estimation accuracy reports

**Time Tracking Features**:
- Manual time entry
- Estimation vs actual comparison
- Time-based task sorting
- Total time per tag/priority analysis

### 10. Undo/Redo Functionality

**Description**: Global undo/redo for task operations

**User Stories**:
- As a user, I want to undo accidental task completions
- As a user, I want to undo accidental task deletions
- As a user, I want keyboard shortcuts for undo/redo (Ctrl+Z, Ctrl+Shift+Z)

**Technical Implementation**:
- Context: `UndoProvider` (App.tsx)
- State: Undo stack with operation history
- Operations: Task create, update, delete, complete

## User Workflows

### Workflow 1: Creating a Simple Task
1. User clicks "New Task" button
2. User enters task title (required)
3. User optionally adds description, priority, due date, tags
4. User saves task
5. Task appears in task list
6. If due date set, calendar event created automatically

### Workflow 2: Creating Task with Dependencies
1. User creates Task A
2. User creates Task B
3. User opens Task B dependency manager
4. User adds Task A as a blocking dependency
5. Task B shows as "blocked" until Task A completes
6. When Task A completes, Task B becomes actionable
7. User receives notification/visual cue that Task B is now unblocked

### Workflow 3: Creating Recurring Task
1. User creates task "Weekly Review"
2. User enables recurring option
3. User sets frequency to "weekly" with interval 1
4. User sets start date and optional end date
5. User completes first instance
6. System auto-generates next instance with due date = current date + 1 week
7. Process repeats until end date or user stops recurrence

### Workflow 4: Using Filters to Find Actionable Tasks
1. User opens task pane
2. User applies "Status: Pending" filter
3. User applies "Not Blocked" filter (no incomplete dependencies)
4. User applies "Due This Week" filter
5. User sees focused list of actionable tasks
6. User saves filter as "This Week's Action Items"
7. User quickly accesses saved filter in future

### Workflow 5: Impact Analysis Before Deletion
1. User decides to delete Task A
2. User clicks delete button
3. System shows impact analysis modal
4. Modal displays: "Deleting this task will affect 3 dependent tasks"
5. Modal lists the 3 affected tasks
6. User confirms or cancels deletion
7. If confirmed, dependent tasks lose dependency reference

## Technical Architecture

### Database Schema
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  priority INTEGER DEFAULT 1,
  due_date TIMESTAMP WITH TIME ZONE,
  parent_task_id UUID REFERENCES tasks(id),
  status TEXT CHECK (status IN ('pending', 'in_progress', 'completed')),
  tags JSONB DEFAULT NULL,
  estimated_minutes INTEGER DEFAULT NULL,
  actual_minutes INTEGER DEFAULT NULL,
  recurrence_rule JSONB DEFAULT NULL,
  next_due_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
```

### Component Hierarchy
```
TasksContentOrchestrator (state management)
├── TasksContentRenderer (presentation)
│   ├── TasksView (main view)
│   │   ├── DesktopTaskLayout (multi-column)
│   │   │   ├── EnhancedTaskCard (individual tasks)
│   │   │   └── SubtasksList (nested tasks)
│   │   ├── KanbanBoard (kanban view)
│   │   └── FocusFlowLayout (focus mode)
│   ├── SmartFilters (filtering UI)
│   ├── SavedFilters (saved filter management)
│   └── AdvancedSearch (full-text search)
└── TaskDependencyManager (dependency editor)
```

### Key Hooks
- `useTasks()`: Main CRUD operations with real-time sync
- `useTaskDependencies()`: Dependency relationship management
- `useTaskImpactAnalysis()`: Impact calculation for operations
- `useTaskFilters()`: Filter state and application
- `useTaskStats()`: Statistics aggregation
- `useRecurringTaskDependencies()`: Recurring task logic
- `useSubtaskDependencies()`: Parent-child management

### State Management
- **TanStack Query**: Server state caching with `['tasks']` query key
- **Zustand**: Local UI state (filters, view modes, modal open/close)
- **Context**: Global undo/redo stack
- **Real-time**: Supabase subscriptions for live updates across tabs

## ADHD-Friendly Design Patterns

### 1. Progressive Disclosure
- Collapse completed tasks by default
- Expandable task cards for details
- Show only essential info in collapsed state

### 2. Visual Hierarchy
- High priority tasks: Bold + border accent
- Blocked tasks: Dimmed with lock icon
- Overdue tasks: Red text + exclamation icon
- Completed tasks: Strikethrough + checkmark

### 3. Contextual Loading
- Show "Loading tasks..." instead of generic spinner
- Show "Checking dependencies..." during validation
- Show "Creating recurring instance..." during auto-generation

### 4. Dopamine Triggers
- Celebration animation on task completion
- Progress percentage on subtask completion
- Streak tracking for recurring tasks
- "You unblocked 3 tasks!" notification on completion

### 5. Reduce Decision Fatigue
- Default to "pending" status
- Smart sort: overdue → due today → blocked → actionable
- "Quick add" with minimal fields, edit later

## Accessibility

- Keyboard navigation: Tab through tasks, Enter to complete
- Screen reader support: ARIA labels on all interactive elements
- Focus indicators: Clear focus rings on all elements
- Color contrast: WCAG AA compliance
- Semantic HTML: Proper heading hierarchy, button vs link usage

## Performance Considerations

- **Pagination**: Load 50 tasks at a time, infinite scroll for more
- **Indexing**: Database indexes on user_id, status, priority, due_date, tags
- **Real-time**: Selective subscription (only active user's tasks)
- **Memoization**: React.memo on TaskCard components
- **Lazy Loading**: Dependency graphs loaded on-demand

## Future Enhancements

1. **AI Task Suggestions**: Suggest task breakdown based on description
2. **Task Templates**: Save task structures for recurring projects
3. **Collaborative Tasks**: Share tasks with other users
4. **Task Import**: Import from external tools (Todoist, Asana, etc.)
5. **Voice Input**: Create tasks via voice commands
6. **Task Automation**: Auto-complete tasks based on external triggers
7. **Gantt Chart View**: Timeline visualization for project management
8. **Task Notes**: Rich text notes within tasks (separate from description)
9. **File Attachments**: Attach files/images to tasks
10. **Task Comments**: Threaded comments for task discussion

## Open Questions

1. Should we limit dependency depth (e.g., max 5 levels)?
2. Should recurring task instances maintain their own dependency chains?
3. How do we handle time zone differences for due dates?
4. Should we allow multiple parents per subtask?
5. Should we support task templates for common workflows?

## Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Circular dependency creation | High | Medium | Validation algorithm prevents cycles |
| Performance with 1000+ tasks | Medium | High | Pagination, indexing, lazy loading |
| Dependency graph complexity | Medium | Medium | Visual graph UI, clear documentation |
| Data loss on sync failure | High | Low | Optimistic updates + rollback on error |
| Cognitive overload from features | High | Medium | Progressive disclosure, smart defaults |

## Success Criteria for Launch

1. ✅ All CRUD operations functional with real-time sync
2. ✅ Dependency management with circular detection
3. ✅ Recurring tasks auto-generation working
4. ✅ At least 2 view modes (list + kanban)
5. ✅ Smart filtering functional
6. ✅ Calendar integration working
7. ✅ Mobile-responsive design
8. ✅ Accessibility audit passing
9. ✅ Performance: <500ms for task list load
10. ✅ Zero data loss in 1000-operation test

## References

- File: `components/panes/content/TasksContentOrchestrator.tsx`
- File: `components/tasks/TasksView.tsx`
- File: `hooks/tasks/useTasks.ts`
- File: `lib/tasks/task-dependency-resolver.ts`
- Schema: `supabase/schema.sql:87-122`
- Guide: `docs/guides/DEVELOPMENT_GUIDELINES.md`
