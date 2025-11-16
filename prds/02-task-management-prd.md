# Task Management - Product Requirements Document

**Feature Area:** Task Management System
**Version:** 1.0
**Last Updated:** 2025-11-15
**Status:** Implemented

---

## Overview

The Task Management system is EDC's comprehensive solution for tracking work, managing priorities, and visualizing complex task relationships. It supports hierarchical tasks, dependencies, time tracking, and multiple viewing modes optimized for ADHD brains.

## Problem Statement

Traditional task managers fail ADHD users by:
- **Forcing single views** - Different mental states need different perspectives
- **Hidden complexity** - Subtasks and dependencies become overwhelming quickly
- **Poor time awareness** - No support for time blindness challenges
- **Rigid structures** - Can't adapt to how ADHD brains actually work
- **Lack of dopamine** - No celebration of progress or wins

## Goals

### Primary Goals
1. Support multiple task viewing modes (list, kanban, focus, flow)
2. Enable complex task hierarchies and dependencies without overwhelming UI
3. Provide accurate time estimation and tracking tools
4. Support flexible filtering and search
5. Integrate seamlessly with calendar and other EDC features

### Secondary Goals
1. Bulk operations for efficiency
2. Recurring tasks with smart scheduling
3. Advanced dependency visualization
4. Saved filters for quick context switching
5. Export capabilities for reporting

## User Stories

### Epic: Basic Task Management
- As a user, I can create tasks with title, description, and due date
- As a user, I can set task priority (1-5 scale)
- As a user, I can mark tasks as completed
- As a user, I can edit existing tasks
- As a user, I can delete tasks I no longer need
- As a user, I can add tags to categorize tasks

### Epic: Task Hierarchies
- As a user, I can create subtasks under parent tasks
- As a user, I can view task hierarchies visually
- As a user, I can expand/collapse subtask groups
- As a user, I can convert tasks to subtasks and vice versa
- As a user, I can see completion progress on parent tasks

### Epic: Task Dependencies
- As a user, I can mark that a task depends on another task
- As a user, I can see which tasks are blocking others
- As a user, I can visualize dependency chains
- As a user, I receive warnings about circular dependencies
- As a user, I can see impact analysis when changing tasks with dependencies

### Epic: Time Management
- As a user, I can estimate how long a task will take
- As a user, I can track actual time spent
- As a user, I can see how my estimates compare to actuals
- As a user, I can view time-based analytics
- As a user, I can break tasks into time blocks

### Epic: Multiple Views
- As a user, I can view tasks in list format (default)
- As a user, I can view tasks in kanban board (status columns)
- As a user, I can use focus mode (one task at a time)
- As a user, I can use flow layout (streamlined productivity view)
- As a user, I can switch between views without losing context

### Epic: Filtering & Search
- As a user, I can filter by status (pending, in_progress, completed)
- As a user, I can filter by priority
- As a user, I can filter by tags
- As a user, I can search task titles and descriptions
- As a user, I can save filters for reuse
- As a user, I can use advanced search with multiple criteria

### Epic: Recurring Tasks
- As a user, I can set tasks to recur daily, weekly, or monthly
- As a user, I can customize recurrence rules
- As a user, I can handle dependencies with recurring tasks
- As a user, I can see upcoming occurrences
- As a user, I can skip or modify individual occurrences

### Epic: Bulk Operations
- As a user, I can select multiple tasks
- As a user, I can bulk update priority, status, or tags
- As a user, I can bulk delete tasks
- As a user, I can bulk move tasks to different dates
- As a user, I can export selected tasks

## Functional Requirements

### FR1: Task CRUD Operations
**Priority:** P0 (Critical)

**Create:**
- Required fields: title
- Optional fields: description, due_date, priority, tags, estimated_minutes, parent_task_id, recurrence_rule
- Auto-set: user_id, status (pending), created_at, updated_at
- Generate: UUID id

**Read:**
- Fetch user's tasks with efficient queries
- Support filtering (status, priority, tags, date ranges)
- Support sorting (due date, priority, created date, title)
- Include computed fields (subtask count, dependency count)

**Update:**
- All fields except id, user_id, created_at
- Optimistic updates via TanStack Query
- Real-time sync via Supabase subscriptions

**Delete:**
- Soft delete option (for future)
- Hard delete removes from database
- Cascade delete subtasks (with confirmation)
- Remove associated dependencies

### FR2: Task Hierarchies
**Priority:** P0 (Critical)

**Parent-Child Relationships:**
- `parent_task_id` foreign key to tasks table
- Recursive relationship (tasks can have subtasks with subtasks)
- Maximum depth: 5 levels (UI enforcement)

**Subtask Display:**
- Indented tree view
- Expand/collapse controls
- Progress indicators (X of Y subtasks complete)
- Drag-and-drop to change parent

**Completion Logic:**
- Completing parent suggests completing all subtasks
- Completing all subtasks suggests completing parent
- Visual feedback for partial completion

### FR3: Task Dependencies
**Priority:** P1 (High)

**Dependency Types:**
- "Depends on" (finish-to-start relationship)
- One task can depend on multiple tasks
- One task can block multiple tasks

**Database:**
- `task_dependencies` table with `task_id` and `depends_on_task_id`
- Unique constraint on (task_id, depends_on_task_id)

**Validation:**
- Prevent circular dependencies (cycle detection algorithm)
- Prevent self-dependencies
- Validate before save

**Visualization:**
- Dependency graph view
- Impact analysis (what will be affected)
- Blocked/blocking status indicators

**Smart Features:**
- Auto-suggest next tasks when dependencies complete
- Warn when editing tasks with dependents
- Filter to show only "ready to start" tasks (no incomplete dependencies)

**Implementation:**
- `/lib/tasks/task-dependency-resolver.ts` - Core logic
- `/lib/tasks/task-dependency-cache-manager.ts` - Performance optimization
- `/lib/tasks/task-impact-analysis.ts` - Impact calculations
- `/lib/validation/task-dependency-validation.ts` - Validation rules

### FR4: Time Tracking
**Priority:** P1 (High)

**Estimation:**
- `estimated_minutes` field (integer)
- Input via duration picker (hours + minutes)
- Optional field

**Actual Time:**
- `actual_minutes` field (integer)
- Can be manually entered or tracked with timer
- Optional field

**Analytics:**
- Compare estimated vs actual time
- Identify patterns (consistently over/under estimate)
- Aggregate time by tag, priority, project
- Time-based productivity insights

**Future:**
- Built-in timer with start/stop/pause
- Automatic time tracking via focus detection
- Pomodoro integration

### FR5: Multiple Task Views
**Priority:** P1 (High)

**1. List View (Default):**
- Component: `DesktopTaskLayout.tsx`, `CompactTaskLayout.tsx`
- Grouping: By status, priority, due date, tag
- Sorting: Multiple options
- Density: Compact, comfortable, spacious
- Features: Quick edit, inline complete, drag-to-reorder

**2. Kanban Board:**
- Component: `KanbanBoard.tsx`
- Columns: Pending, In Progress, Completed
- Drag-and-drop between columns
- Card view with priority indicators
- Swimlanes: By priority or tag (future)

**3. Focus Mode:**
- Component: `FocusMode.tsx`
- Shows one task at a time
- Large, distraction-free interface
- Next task auto-suggested
- Timer integration
- Perfect for deep work

**4. Flow Layout:**
- Component: `FocusFlowLayout.tsx`
- Streamlined productivity view
- Minimal chrome
- Keyboard-optimized
- Quick task creation
- Ideal for task processing

**View Persistence:**
- Stored in localStorage per user
- Pane-specific view preference
- Quick-switch controls

### FR6: Filtering & Search
**Priority:** P1 (High)

**Basic Filters:**
```typescript
interface TaskFilters {
  status?: 'pending' | 'in_progress' | 'completed' | 'all';
  priority?: number[];
  tags?: string[];
  dueDateRange?: { start: Date; end: Date };
  hasParent?: boolean; // Show only top-level or only subtasks
  hasDependencies?: boolean;
}
```

**Advanced Search:**
- Component: `AdvancedSearch.tsx`
- Full-text search (title + description)
- Combine multiple filters
- Exclude filters (NOT logic)
- Date range presets (today, this week, overdue)

**Saved Filters:**
- Component: `SavedFilters.tsx`
- Save filter combinations with names
- Quick-access dropdown
- Stored per user in localStorage or database

**Smart Filters:**
- "Ready to start" (no incomplete dependencies)
- "Overdue" (past due date, not completed)
- "High priority incomplete" (priority 4-5, not completed)
- "Orphaned" (subtasks with deleted parents)

**Implementation:**
- `lib/tasks/task-filters.ts` - Filter definitions and logic
- `hooks/tasks/useTaskFilters.ts` - Filter state management

### FR7: Recurring Tasks
**Priority:** P2 (Medium)

**Recurrence Rules:**
Stored as JSONB in `recurrence_rule` field:
```typescript
interface RecurrenceRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number; // Every N days/weeks/months
  daysOfWeek?: number[]; // For weekly (0=Sunday)
  dayOfMonth?: number; // For monthly
  endDate?: Date; // Optional end date
  count?: number; // Or end after N occurrences
}
```

**Next Occurrence:**
- `next_due_date` field calculated and stored
- Automatic creation of next instance when current completed
- Or manual "skip this occurrence" action

**Dependencies with Recurrence:**
- `lib/tasks/recurring-task-dependencies.ts`
- Handle dependencies between recurring instances
- Prevent dependency chains from breaking recurrence

**UI:**
- Recurrence badge on task cards
- Edit recurrence dialog
- View upcoming occurrences
- Modify single instance vs all future

### FR8: Bulk Operations
**Priority:** P2 (Medium)

**Selection:**
- Checkbox on each task card
- "Select all" option
- Shift-click range selection

**Available Operations:**
- Update status
- Update priority
- Add/remove tags
- Change due date
- Delete (with confirmation)
- Export (CSV, JSON)

**Component:**
- `BulkTaskActions.tsx`
- Floating action bar when tasks selected
- Clear selection button
- Undo support (future)

### FR9: Calendar Integration
**Priority:** P1 (High)

**Link to Calendar Events:**
- Tasks with due dates appear on calendar
- Tasks can be converted to calendar events
- Calendar events can create tasks
- Bidirectional sync maintained

**Due Date Management:**
- Drag-and-drop on calendar to change due date
- Visual indicator for tasks on calendar
- Filter calendar to show only tasks

### FR10: Tags System
**Priority:** P1 (High)

**Tag Storage:**
- JSONB field in tasks table
- Array of strings
- Case-insensitive matching

**Tag Management:**
- Autocomplete from existing tags
- Color-coding per tag (future)
- Tag cloud view
- Most-used tags quick-add

**Tag-Based Features:**
- Filter by tag
- Group by tag
- Tag analytics (tasks per tag, completion rate)
- Rename tags globally

## Non-Functional Requirements

### NFR1: Performance
- Task list render: <500ms for 1000 tasks
- Filter application: <200ms
- Dependency graph calculation: <1s for 100 tasks
- Database queries: <100ms (indexed)

### NFR2: Data Integrity
- No orphaned subtasks (cascade delete or prevent)
- No circular dependencies (validation before save)
- Atomic operations for bulk updates
- Optimistic UI with rollback on error

### NFR3: Accessibility
- Keyboard navigation for all task operations
- Screen reader support for task cards
- ARIA labels on all interactive elements
- High contrast mode support
- Focus indicators

### NFR4: Mobile Responsiveness
- Touch-friendly task cards
- Swipe gestures for complete/delete
- Mobile-optimized filters
- Responsive layout (stacks on narrow screens)

## Technical Architecture

### Database Schema

```sql
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  priority INTEGER DEFAULT 1 CHECK (priority BETWEEN 1 AND 5),
  due_date TIMESTAMP WITH TIME ZONE,
  parent_task_id UUID REFERENCES tasks(id),
  status TEXT CHECK (status IN ('pending', 'in_progress', 'completed')) DEFAULT 'pending',
  tags JSONB DEFAULT NULL,
  estimated_minutes INTEGER DEFAULT NULL,
  actual_minutes INTEGER DEFAULT NULL,
  recurrence_rule JSONB DEFAULT NULL,
  next_due_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE task_dependencies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE NOT NULL,
  depends_on_task_id UUID REFERENCES tasks(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(task_id, depends_on_task_id)
);

-- Indexes
CREATE INDEX idx_tasks_user ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(user_id, status);
CREATE INDEX idx_tasks_priority ON tasks(user_id, priority);
CREATE INDEX idx_tasks_due_date ON tasks(user_id, due_date);
CREATE INDEX idx_tasks_parent ON tasks(parent_task_id);
CREATE INDEX idx_tasks_tags ON tasks USING GIN (tags);
CREATE INDEX idx_tasks_next_due_date ON tasks(user_id, next_due_date);
CREATE INDEX idx_task_dependencies_task ON task_dependencies(task_id);
CREATE INDEX idx_task_dependencies_depends ON task_dependencies(depends_on_task_id);
```

### Components

**Main Views:**
- `/components/tasks/TasksView.tsx` - Main orchestrator
- `/components/tasks/TasksContentOrchestrator.tsx` - Pane integration
- `/components/tasks/DesktopTaskLayout.tsx` - Desktop list view
- `/components/tasks/CompactTaskLayout.tsx` - Compact list view
- `/components/tasks/KanbanBoard.tsx` - Kanban view
- `/components/tasks/FocusMode.tsx` - Focus view
- `/components/tasks/FocusFlowLayout.tsx` - Flow view

**Task Cards:**
- `/components/tasks/TaskCard.tsx` - Standard task card
- `/components/tasks/TaskCardCompact.tsx` - Compact variant

**Forms & Modals:**
- `/components/modals/TaskModal.tsx` - Create/edit task
- `/components/tasks/TaskDependencyManager.tsx` - Manage dependencies
- `/components/tasks/RecurrenceRuleEditor.tsx` - Edit recurrence

**Utilities:**
- `/components/tasks/AdvancedSearch.tsx` - Search UI
- `/components/tasks/SavedFilters.tsx` - Saved filters
- `/components/tasks/BulkTaskActions.tsx` - Bulk operations
- `/components/tasks/TaskStats.tsx` - Statistics widget

### Hooks

**Data Fetching:**
- `/hooks/tasks/useTasks.ts` - Main CRUD operations
- `/hooks/tasks/useTaskDependencies.ts` - Dependency management
- `/hooks/tasks/useTaskStats.ts` - Statistics and analytics

**UI State:**
- `/hooks/tasks/useTaskFilters.ts` - Filter state
- `/hooks/tasks/useTaskCard.ts` - Card-level operations
- `/hooks/tasks/useRecurringTaskDependencies.ts` - Recurring logic
- `/hooks/tasks/useSubtaskDependencies.ts` - Subtask logic

### Libraries

**Core:**
- `/lib/tasks/task-dependency-resolver.ts` - Dependency resolution
- `/lib/tasks/task-dependency-cache-manager.ts` - Caching
- `/lib/tasks/task-impact-analysis.ts` - Impact analysis
- `/lib/tasks/subtask-dependency-integration.ts` - Subtask handling
- `/lib/tasks/recurring-task-dependencies.ts` - Recurrence
- `/lib/tasks/task-filters.ts` - Filter logic
- `/lib/tasks/task-grouping.ts` - Grouping logic

**Validation:**
- `/lib/validation/task-dependency-validation.ts` - Validation
- `/lib/validation/task-dependency-errors.ts` - Error definitions

## Success Metrics

### Usage Metrics
- Tasks created per user per week
- Task completion rate
- Average task priority distribution
- Subtask usage percentage
- Dependency usage percentage
- View mode distribution

### Engagement Metrics
- Time spent in task views
- Filter usage frequency
- Bulk operation usage
- Recurring task adoption

### Performance Metrics
- Task load time <500ms
- Filter response time <200ms
- Dependency validation time <100ms
- Zero circular dependency escapes

## Future Enhancements

### v1.1
- Built-in timer for time tracking
- Task templates for common workflows
- Project-based task grouping
- Collaboration (shared tasks)

### v1.2
- Gantt chart view
- Critical path calculation
- Resource allocation
- Advanced analytics dashboard

### v2.0
- AI task prioritization
- Smart due date suggestions
- Voice input for task creation
- Mobile app with offline support

---

## Related Documents

- [Task Management Functional Specification](./02-task-management-functional-spec.md)
- [Master PRD](./00-MASTER-PRD.md)
- [Calendar PRD](./06-calendar-prd.md) - Integration details
