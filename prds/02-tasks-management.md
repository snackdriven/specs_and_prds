# PRD: Tasks Management

## Overview

**Feature Name:** Tasks Management
**Version:** 1.0
**Last Updated:** 2025-11-15
**Status:** Implemented
**Owner:** Product Team

## Executive Summary

The Tasks Management system is a core feature of Daybeam that enables users to create, organize, track, and complete tasks across different contexts and priorities. It provides a flexible, intuitive interface for managing personal and professional to-dos with support for due dates, priorities, statuses, and organizational hierarchies through Spaces and Tags.

## Problem Statement

Users struggle with:
- Keeping track of tasks across multiple life areas (work, personal, health, etc.)
- Prioritizing tasks effectively when everything feels urgent
- Managing task overload and deadline anxiety
- Maintaining visibility into upcoming commitments
- Contextualizing tasks within larger projects or life areas
- Recovering snoozed or deferred tasks
- Understanding what to focus on "right now"

## Goals & Success Metrics

### Goals
1. Provide a frictionless task creation experience (< 10 seconds from intent to saved task)
2. Enable effective task prioritization and filtering
3. Support flexible organization through Spaces and Tags
4. Reduce cognitive load through smart defaults and clear visual hierarchy
5. Minimize task abandonment and increase completion rates

### Success Metrics
- **Task Completion Rate:** % of created tasks marked as completed
- **Daily Active Tasks:** Average number of tasks created per active user per day
- **Time to Complete Task:** Average time from task creation to completion
- **Snooze Recovery Rate:** % of snoozed tasks that are eventually completed
- **Priority Distribution:** Distribution of tasks across priority levels
- **User Engagement:** Daily/weekly active users interacting with tasks
- **Overdue Task Rate:** % of tasks that become overdue

## User Personas

### Primary: The Busy Professional
- **Demographics:** 28-45 years old, full-time knowledge worker
- **Needs:** Separate work and personal tasks, prioritize by deadline, quick capture
- **Pain Points:** Task overload, unclear priorities, missed deadlines
- **Usage Pattern:** Bulk task creation in mornings, frequent status updates throughout day

### Secondary: The Student Organizer
- **Demographics:** 18-28 years old, college/graduate student
- **Needs:** Track assignments, projects, and personal commitments
- **Pain Points:** Procrastination, overwhelm during exam periods
- **Usage Pattern:** Weekly planning sessions, daily reviews

### Tertiary: The Life Optimizer
- **Demographics:** 25-55 years old, productivity enthusiast
- **Needs:** Granular task tracking, detailed organization, analytics
- **Pain Points:** Tool complexity vs. power, migration from other tools
- **Usage Pattern:** Deep organization sessions, frequent refinement

## Functional Requirements

### 1. Task Creation

#### 1.1 Create Task Dialog
**Priority:** P0 (Critical)
- **Input Fields:**
  - Title (required, max 200 characters)
  - Description (optional, max 2000 characters, markdown support)
  - Due Date (optional, date picker)
  - Priority (required, default: medium)
  - Space (optional, dropdown)
  - Tags (optional, multi-select)
- **Validation:**
  - Title cannot be empty
  - Due date cannot be in the past (warning, not blocker)
- **UX:**
  - Modal dialog overlay
  - Auto-focus on title field
  - Tab navigation between fields
  - Keyboard shortcuts (Cmd/Ctrl+Enter to save)
  - Cancel and Save buttons
  - Loading state during save
  - Success/error toast notifications

#### 1.2 Quick Task Creation
**Priority:** P1 (High)
- Inline task creation from task list view
- Minimal fields (title only)
- Press Enter to create, Escape to cancel
- Smart defaults (medium priority, no due date)

### 2. Task Properties

#### 2.1 Status Management
**Priority:** P0 (Critical)
- **Statuses:**
  - `todo` - Not yet started (default)
  - `in_progress` - Currently working on
  - `completed` - Finished
  - `snoozed` - Temporarily hidden
- **Status Transitions:**
  - One-click status change via dropdown
  - Checkbox for todo ↔ completed toggle
  - Snooze action opens date picker for wake date
  - Completed tasks show completion timestamp

#### 2.2 Priority Levels
**Priority:** P0 (Critical)
- **Levels:**
  - `urgent` - Red indicator, topmost in sort order
  - `high` - Orange indicator
  - `medium` - Blue indicator (default)
  - `low` - Gray indicator
- **Visual Indicators:**
  - Color-coded priority badges
  - Border accent on task cards
  - Icon indicators (flag, alert symbols)
- **Sorting:**
  - Primary sort by priority (urgent → low)
  - Secondary sort by due date

#### 2.3 Due Dates
**Priority:** P0 (Critical)
- **Date Picker:**
  - Calendar interface
  - Quick selects (Today, Tomorrow, Next Week)
  - Clear/remove due date option
- **Visual Indicators:**
  - Overdue tasks highlighted in red
  - Due today highlighted in yellow
  - Due soon (within 3 days) highlighted in orange
  - Relative date display ("Due tomorrow", "Due in 3 days")

#### 2.4 Descriptions
**Priority:** P1 (High)
- Multi-line text area
- Markdown support (bold, italic, lists, links)
- Character counter
- Preview mode toggle
- Expandable/collapsible in list view

### 3. Task Organization

#### 3.1 Space Assignment
**Priority:** P1 (High)
- Assign task to one Space
- Dropdown selector with Space colors/icons
- Filter tasks by Space
- "No Space" option (unassigned tasks)
- Quick Space creation from task dialog

#### 3.2 Tag Assignment
**Priority:** P1 (High)
- Multi-select tag picker
- Create new tags inline
- Color-coded tag badges
- Filter tasks by one or more tags
- Tag autocomplete in search

### 4. Task Views & Filtering

#### 4.1 List View
**Priority:** P0 (Critical)
- **Default View:**
  - All active tasks (todo, in_progress)
  - Sorted by priority, then due date
  - Card-based layout with spacing
- **Task Card Elements:**
  - Checkbox (completion toggle)
  - Title (clickable for details)
  - Priority indicator
  - Due date badge
  - Space badge
  - Tag badges
  - Quick actions menu (edit, snooze, delete)

#### 4.2 Filtering
**Priority:** P0 (Critical)
- **Filter by Status:**
  - All tasks
  - Active only (todo + in_progress)
  - Completed only
  - Snoozed only
- **Filter by Priority:**
  - All priorities
  - Urgent only
  - High priority and above
- **Filter by Due Date:**
  - All tasks
  - Overdue
  - Due today
  - Due this week
  - No due date
- **Filter by Space:**
  - All spaces
  - Specific space
  - No space
- **Filter by Tags:**
  - All tags
  - Specific tag(s)
  - No tags

#### 4.3 Sorting
**Priority:** P1 (High)
- Sort by:
  - Priority (default)
  - Due date (earliest first)
  - Created date (newest/oldest)
  - Title (A-Z)
  - Status
- Ascending/descending toggle
- Remember user's last sort preference

#### 4.4 Search
**Priority:** P1 (High)
- Full-text search across title and description
- Real-time search as user types
- Search highlights matching terms
- Combine search with filters
- Search history/recent searches

### 5. Task Actions

#### 5.1 Complete/Uncomplete
**Priority:** P0 (Critical)
- Checkbox toggle on task card
- Instant optimistic update
- Strike-through styling on completed tasks
- Completed timestamp stored
- Optional: confetti animation on completion
- Undo action (5-second window)

#### 5.2 Edit Task
**Priority:** P0 (Critical)
- Click task card to open edit dialog
- All properties editable
- Save/cancel actions
- Validation same as creation
- Update timestamp tracking

#### 5.3 Delete Task
**Priority:** P0 (Critical)
- Delete action in quick actions menu
- Confirmation dialog for destructive action
- Permanent deletion (no trash/archive in v1)
- Success toast with undo option (5-second window)

#### 5.4 Snooze Task
**Priority:** P1 (High)
- Snooze action in quick actions menu
- Date picker for wake date
- Snoozed tasks hidden from default view
- Automatic wake on specified date
- View snoozed tasks in separate filter
- "Wake now" action in snoozed view

#### 5.5 Bulk Actions
**Priority:** P2 (Nice to Have)
- Multi-select checkboxes on task cards
- Bulk complete
- Bulk delete
- Bulk change space
- Bulk add tags
- Bulk change priority

### 6. Task Details View

#### 6.1 Expanded Task View
**Priority:** P1 (High)
- Modal or side panel view
- Display all task properties
- Full description with markdown rendering
- Metadata: created date, updated date, completed date
- Activity log (future: show edit history)
- Related tasks (future: subtasks, dependencies)

## Non-Functional Requirements

### Performance
- Task list render: < 100ms for 50 tasks
- Task creation: < 500ms server round-trip
- Search results: < 200ms response time
- Smooth scrolling for lists with 200+ tasks
- Optimistic updates for instant feedback

### Accessibility
- Full keyboard navigation
- Screen reader support (ARIA labels)
- High contrast mode
- Focus indicators on all interactive elements
- Keyboard shortcuts for common actions

### Scalability
- Support 1000+ tasks per user
- Efficient pagination (load 50 tasks at a time)
- Virtual scrolling for large lists
- Database indexing on user_id, status, priority, due_date

### Data Integrity
- Prevent duplicate task creation
- Atomic status updates
- Transaction support for bulk operations
- Cascade delete on user deletion

### Security
- User data isolation
- XSS prevention in descriptions
- SQL injection prevention
- Rate limiting on task creation

## User Experience

### Information Architecture
```
Tasks View
├── Header
│   ├── Page Title
│   ├── Create Task Button
│   └── View Toggle (List/Board - future)
├── Filters & Search
│   ├── Status Filter
│   ├── Priority Filter
│   ├── Space Filter
│   ├── Tag Filter
│   ├── Date Filter
│   └── Search Input
├── Sort Controls
│   ├── Sort By Dropdown
│   └── Sort Direction Toggle
└── Task List
    ├── Task Card 1
    ├── Task Card 2
    └── ... Task Card N
```

### User Flows

#### Flow 1: Create a New Task
1. User clicks "Create Task" button
2. Modal dialog opens with focus on title field
3. User enters task title (required)
4. User optionally sets due date via date picker
5. User selects priority level (defaults to medium)
6. User optionally assigns to Space
7. User optionally adds tags
8. User clicks "Save Task"
9. Modal closes, success toast appears
10. Task appears in list with correct priority sorting

#### Flow 2: Complete a Task
1. User views task list
2. User clicks checkbox next to task
3. Task updates to completed status (optimistic)
4. Task shows strike-through styling
5. Success toast with "Undo" option appears
6. After 5 seconds, completed task moves to bottom or filters out

#### Flow 3: Filter Tasks by Space and Priority
1. User opens Space filter dropdown
2. User selects "Work" space
3. Task list filters to only work tasks
4. User opens Priority filter dropdown
5. User selects "High priority and above"
6. Task list narrows to high and urgent work tasks
7. User clicks "Clear filters" to reset

#### Flow 4: Snooze an Overwhelming Task
1. User identifies task they can't handle today
2. User clicks quick actions menu (three dots)
3. User selects "Snooze"
4. Date picker opens
5. User selects wake date (e.g., next Monday)
6. Task disappears from active view
7. Snooze confirmation toast appears

### Visual Design

#### Task Card Design
```
┌─────────────────────────────────────────┐
│ ☐ [Priority Badge] Task Title           │
│   Description preview (if exists)...    │
│   📅 Due Tomorrow | 🏷️ Work | #focus    │
│   Created 2 days ago              [...]  │
└─────────────────────────────────────────┘
```

#### Priority Color Scheme
- **Urgent:** Red (#ef4444)
- **High:** Orange (#f97316)
- **Medium:** Blue (#3b82f6)
- **Low:** Gray (#6b7280)

#### Status Indicators
- **Todo:** Empty checkbox
- **In Progress:** Partially filled checkbox with cyan accent
- **Completed:** Filled checkbox with checkmark
- **Snoozed:** Clock icon badge

## Technical Specifications

### Frontend Components
```typescript
// Main Tasks View
<TasksView>
  <TasksHeader>
    <h1>Tasks</h1>
    <CreateTaskButton />
  </TasksHeader>

  <TasksFilters>
    <StatusFilter />
    <PriorityFilter />
    <SpaceFilter />
    <TagFilter />
    <SearchInput />
  </TasksFilters>

  <TasksSortControls>
    <SortByDropdown />
    <SortDirectionToggle />
  </TasksSortControls>

  <TaskList>
    {tasks.map(task => (
      <TaskCard key={task.id} task={task} />
    ))}
  </TaskList>

  <CreateTaskDialog />
</TasksView>
```

### Data Models
```typescript
interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'completed' | 'snoozed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string; // ISO 8601 date
  snooze_until?: string; // ISO 8601 date
  space_id?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

interface TaskTag {
  task_id: string;
  tag_id: string;
}

interface TaskFilters {
  status?: string[];
  priority?: string[];
  space_id?: string;
  tag_ids?: string[];
  due_date_filter?: 'overdue' | 'today' | 'week' | 'none';
  search?: string;
}
```

### API Endpoints
```
POST   /tasks                        Create new task
GET    /users/:user_id/tasks         List tasks with filters
GET    /users/:user_id/today/tasks   Get today's tasks
GET    /tasks/:id                    Get task details
PUT    /tasks/:id                    Update task
DELETE /tasks/:id                    Delete task
POST   /tasks/:id/snooze             Snooze task
POST   /tasks/:id/complete           Mark task as completed
POST   /tasks/:id/uncomplete         Mark task as incomplete
GET    /tasks/:id/activity           Get task activity log (future)
```

### State Management
```typescript
// React Query hooks
const { data: tasks } = useTasks(userId, filters);
const createTask = useCreateTask();
const updateTask = useUpdateTask();
const deleteTask = useDeleteTask();

// Optimistic updates
updateTask.mutate(
  { id, status: 'completed' },
  {
    onMutate: async (updatedTask) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(['tasks']);

      // Snapshot previous value
      const previous = queryClient.getQueryData(['tasks']);

      // Optimistically update
      queryClient.setQueryData(['tasks'], (old) =>
        old.map(t => t.id === id ? { ...t, status: 'completed' } : t)
      );

      return { previous };
    },
    onError: (err, updatedTask, context) => {
      // Rollback on error
      queryClient.setQueryData(['tasks'], context.previous);
    },
  }
);
```

## Dependencies

### Internal
- Spaces system (for task organization)
- Tags system (for task categorization)
- Dashboard (displays task summaries)
- Analytics (task completion metrics)

### External
- React Query (data fetching and caching)
- date-fns (date manipulation and formatting)
- Radix UI Dialog (modals)
- Radix UI Checkbox (task completion)
- Radix UI Select (dropdowns)
- Lucide React (icons)

## Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Task overload (1000+ tasks) causing performance issues | High | Medium | Implement pagination, virtual scrolling, archive old completed tasks |
| Users creating tasks without enough context | Medium | High | Encourage description usage, add templates, smart defaults |
| Accidental task deletion | High | Medium | Add confirmation dialogs, implement undo, add archive instead of delete |
| Priority inflation (everything becomes urgent) | Medium | High | Add priority guidelines, limit urgent tasks, suggest auto-priority |
| Overwhelming filter combinations | Medium | Low | Add filter presets, save custom filters, clear all filters button |

## Future Enhancements

### Phase 2
- Recurring tasks (daily, weekly, monthly patterns)
- Subtasks and task dependencies
- Task templates for common workflows
- Kanban board view
- Task duplication
- Task archiving (soft delete)

### Phase 3
- Task comments and notes
- File attachments
- Task sharing and collaboration
- Task reminders and notifications
- Time tracking per task
- Pomodoro timer integration

### Phase 4
- AI-powered task suggestions
- Smart task prioritization based on patterns
- Natural language task creation ("Remind me to call mom next Tuesday")
- Task automation (IFTTT-style triggers)
- Integration with calendar apps
- Voice task creation

## Open Questions

1. Should completed tasks auto-archive after 30 days?
2. What's the optimal default view: all tasks or just active?
3. Should there be a limit on the number of tags per task?
4. How should we handle tasks with no due date in sort order?
5. Should we add a "doing now" status separate from in_progress?
6. What's the desired behavior for snoozed tasks that wake up - notification or silent?

## Appendix

### A. Task States State Machine
```
     ┌─────────┐
     │  todo   │◄──────┐
     └────┬────┘       │
          │            │
          ▼            │
   ┌────────────┐      │
   │in_progress │      │
   └─────┬──────┘      │
         │             │
         ▼             │
    ┌─────────┐        │
    │completed│        │
    └─────────┘        │
         │             │
         └─────────────┘

    ┌─────────┐
    │ snoozed │───► (wake date) ───► todo
    └─────────┘
```

### B. Keyboard Shortcuts
- `Cmd/Ctrl + K` - Create new task
- `Cmd/Ctrl + F` - Focus search
- `/` - Focus search (Gmail-style)
- `Escape` - Close dialogs/clear search
- `Enter` - Save task in dialog
- `Space` - Toggle task completion (when focused)
- `E` - Edit focused task
- `D` - Delete focused task
- `S` - Snooze focused task

### C. Analytics Events
```
- task_created
- task_completed
- task_uncompleted
- task_deleted
- task_snoozed
- task_edited
- task_filtered
- task_searched
- task_sorted
- bulk_action_performed
```

### D. Error Messages
- "Task title cannot be empty"
- "Failed to create task. Please try again."
- "Failed to update task. Your changes were not saved."
- "Failed to delete task. Please try again."
- "You cannot set a due date in the past"
- "Maximum 10 tags per task"
