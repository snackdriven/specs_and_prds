# PRD: Dashboard (Today View)

## Overview

**Feature Name:** Dashboard (Today View)
**Version:** 1.0
**Last Updated:** 2025-11-15
**Status:** Implemented
**Owner:** Product Team

## Executive Summary

The Dashboard (Today View) serves as the central hub of the Daybeam application, providing users with a real-time overview of their daily productivity, wellness, and upcoming commitments. It consolidates data from all other features into a single, actionable view that helps users prioritize their day.

## Problem Statement

Users need a centralized location to:
- Quickly assess their daily status across multiple life areas
- Identify urgent items requiring immediate attention
- Capture quick mood and journal entries without navigating away
- View at-a-glance metrics without diving into individual feature areas
- Start their day with clarity and focus

## Goals & Success Metrics

### Goals
1. Provide a comprehensive daily overview in under 3 seconds
2. Enable quick capture of mood and journal entries
3. Surface urgent and time-sensitive information prominently
4. Create a motivating start-of-day experience
5. Reduce navigation overhead for common actions

### Success Metrics
- **Primary:** Daily active usage rate of Dashboard
- **Secondary:** Average session start time on Dashboard vs other views
- **Engagement:** Quick capture usage rate (mood/journal from dashboard)
- **Performance:** Page load time < 2 seconds
- **User Satisfaction:** NPS score for dashboard usability

## User Personas

### Primary: The Organized Professional
- **Demographics:** 25-45 years old, knowledge worker
- **Needs:** Quick daily overview before starting work
- **Pain Points:** Scattered tools, time wasted checking multiple apps
- **Usage Pattern:** Morning check-in, periodic status updates

### Secondary: The Wellness Enthusiast
- **Demographics:** 20-50 years old, health-conscious
- **Needs:** Track mood, habits, and self-reflection
- **Pain Points:** Forgetting to log wellness metrics
- **Usage Pattern:** Multiple daily check-ins for mood and habits

## Functional Requirements

### 1. Summary Cards

#### 1.1 Task Summary Card
**Priority:** P0 (Critical)
- Display total task count across all statuses
- Highlight overdue tasks with warning styling
- Show today's task count
- Show upcoming task count (next 7 days)
- Quick link to full Tasks view
- Visual indicators for high-priority items

#### 1.2 Habit Summary Card
**Priority:** P0 (Critical)
- Display habits completed today vs total active habits
- Show number of active streaks
- Highlight streaks at risk (not completed today for daily habits)
- Show completion percentage for the day
- Quick link to full Habits view
- Visual progress indicators

#### 1.3 Mood Summary Card
**Priority:** P0 (Critical)
- Display latest mood entry value (1-10 scale)
- Show 7-day mood trend (up/down/stable indicator)
- Display time since last mood entry
- Visual mood trend chart (sparkline)
- Quick link to full Moods view

#### 1.4 Countdown Summary Card
**Priority:** P1 (High)
- Display urgent countdowns (within 3 days)
- Show days remaining for each urgent countdown
- Color-coded countdown badges
- Quick link to full Countdowns view
- Expandable list if more than 3 urgent items

### 2. Quick Capture Interfaces

#### 2.1 Quick Mood Capture
**Priority:** P0 (Critical)
- Inline mood selector (1-10 scale)
- Optional context note field
- Optional tag selection
- One-click submission
- Toast confirmation on save
- Immediate update to mood summary card

#### 2.2 Quick Journal Entry
**Priority:** P1 (High)
- Expandable text area for journal content
- Optional title field
- Space and tag selection dropdowns
- Privacy toggle (private/public)
- Save button with loading state
- Toast confirmation on save
- Character count indicator

### 3. Today's Task List

#### 3.1 Task Display
**Priority:** P0 (Critical)
- Show tasks with today's due date
- Show overdue tasks
- Show tasks marked for today (regardless of due date)
- Inline task completion checkbox
- Priority indicators (color-coded)
- Task title and description preview
- Space and tag badges

#### 3.2 Task Interactions
**Priority:** P0 (Critical)
- Check/uncheck to complete/uncomplete tasks
- Click task to view full details
- Quick actions menu (snooze, edit, delete)
- Drag-and-drop reordering
- Filter by space or tag

### 4. Layout & Navigation

#### 4.1 Grid Layout
**Priority:** P0 (Critical)
- Responsive grid system
- 2-column layout on desktop
- Single column on mobile
- Consistent card spacing and alignment
- Smooth scrolling behavior

#### 4.2 Data Refresh
**Priority:** P1 (High)
- Auto-refresh on page focus
- Manual refresh button
- Real-time updates after quick captures
- Optimistic UI updates
- Loading states during data fetch

## Non-Functional Requirements

### Performance
- Initial page load: < 2 seconds
- Time to interactive: < 3 seconds
- API response time: < 500ms per endpoint
- Smooth animations at 60fps

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader friendly
- High contrast mode support
- Focus indicators on all interactive elements

### Scalability
- Support for 100+ tasks without performance degradation
- Support for 50+ active habits
- Support for 1000+ historical mood entries
- Efficient data pagination and caching

### Security
- User data isolation (user_id scoping)
- XSS prevention on user-generated content
- CSRF protection on all mutations
- Secure API authentication

## User Experience

### Information Architecture
```
Dashboard (Today View)
├── Summary Cards Row
│   ├── Tasks Summary
│   ├── Habits Summary
│   ├── Mood Summary
│   └── Countdowns Summary
├── Quick Capture Section
│   ├── Quick Mood Capture
│   └── Quick Journal Entry
└── Today's Tasks Section
    ├── Filter Controls
    ├── Task List
    └── Add New Task Button
```

### User Flows

#### Flow 1: Morning Check-In
1. User opens app → lands on Dashboard
2. Reviews summary cards (tasks, habits, mood, countdowns)
3. Logs morning mood via quick capture
4. Reviews today's task list
5. Marks high-priority tasks for focus
6. Navigates to specific feature area if needed

#### Flow 2: Quick Mood Log
1. User opens Dashboard
2. Clicks mood value (1-10)
3. Optionally adds context note
4. Clicks "Save Mood"
5. Sees confirmation toast
6. Mood summary card updates immediately

#### Flow 3: Task Completion
1. User reviews today's tasks on Dashboard
2. Checks off completed task
3. Task updates to completed state
4. Task summary card updates count
5. Task moves to bottom or filters out

### Visual Design

#### Color Scheme
- **Background:** Dark theme (#0a0a0a to #1a1a1a gradient)
- **Cards:** Semi-transparent dark cards with subtle borders
- **Accents:** Cyan/blue (#06b6d4, #3b82f6)
- **Success:** Green (#22c55e)
- **Warning:** Yellow (#eab308)
- **Error:** Red (#ef4444)

#### Typography
- **Headers:** Bold, large font sizes
- **Body:** Regular weight, readable line height
- **Metrics:** Large, bold numbers for emphasis
- **Labels:** Smaller, muted color for context

#### Components
- Rounded corners (8-12px border radius)
- Subtle shadows and glows
- Smooth hover transitions
- Progress bars with gradient fills
- Icon-text combinations for clarity

## Technical Specifications

### Frontend Components
```typescript
// Main Dashboard Component
<TodayView>
  <SummaryCardsGrid>
    <TaskSummaryCard />
    <HabitSummaryCard />
    <MoodSummaryCard />
    <CountdownSummaryCard />
  </SummaryCardsGrid>

  <QuickCaptureSection>
    <QuickMoodCapture />
    <QuickJournalEntry />
  </QuickCaptureSection>

  <TodayTasksSection>
    <TaskFilters />
    <TaskList tasks={todayTasks} />
    <CreateTaskButton />
  </TodayTasksSection>
</TodayView>
```

### API Endpoints
- `GET /users/:user_id/today/overview` - Fetch dashboard summary
- `GET /users/:user_id/today/tasks` - Fetch today's tasks
- `POST /moods` - Create mood entry
- `POST /journal` - Create journal entry
- `PUT /tasks/:id` - Update task status

### Data Models
```typescript
interface TodayOverview {
  tasks: {
    total: number;
    overdue: number;
    today: number;
    upcoming: number;
  };
  habits: {
    completedToday: number;
    totalActive: number;
    streaksAtRisk: number;
  };
  mood: {
    latest: number | null;
    trend: 'up' | 'down' | 'stable';
    sevenDayAverage: number;
  };
  countdowns: {
    urgent: Countdown[];
    urgentCount: number;
  };
}
```

### State Management
- React Query for server state caching
- Query invalidation on mutations
- Optimistic updates for instant feedback
- 30-second cache for dashboard data

## Dependencies

### Internal
- Tasks Management system
- Habits Tracking system
- Mood Tracking system
- Countdown system
- Journal system
- Spaces and Tags systems

### External
- React Query (data fetching)
- date-fns (date calculations)
- Lucide React (icons)
- Radix UI (base components)
- Tailwind CSS (styling)

## Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Slow dashboard load with large datasets | High | Medium | Implement pagination, data limits, aggressive caching |
| Overwhelming information density | Medium | Low | User-customizable card visibility, collapsible sections |
| Data synchronization issues | High | Low | Optimistic updates, retry logic, error boundaries |
| Mobile performance on older devices | Medium | Medium | Progressive enhancement, conditional rendering |

## Future Enhancements (Out of Scope for v1.0)

### Phase 2
- Customizable dashboard layout (drag-and-drop cards)
- Widget system for additional data visualizations
- Quick habit logging from dashboard
- Task creation inline without dialog

### Phase 3
- Smart suggestions based on patterns
- Daily goal setting and tracking
- Weather integration for mood correlation
- Calendar integration for event countdowns

### Phase 4
- AI-powered daily summaries and insights
- Voice-activated quick captures
- Collaborative features (shared countdowns, family tasks)
- Integration with third-party apps (Google Calendar, Todoist, etc.)

## Open Questions

1. Should the dashboard show past tasks or only focus on present/future?
2. What's the ideal refresh interval for auto-updates?
3. Should summary cards be customizable (show/hide, reorder)?
4. How many urgent countdowns should display before truncating?
5. Should there be a "weekly view" in addition to today view?

## Appendix

### A. Wireframes
*(To be added: Low-fidelity wireframes of dashboard layout)*

### B. User Research
*(To be added: User interview findings and usability test results)*

### C. Analytics Events
```
- dashboard_viewed
- summary_card_clicked
- quick_mood_captured
- quick_journal_created
- task_completed_from_dashboard
- dashboard_refreshed
```

### D. Glossary
- **Summary Card:** A widget displaying aggregated metrics for a feature area
- **Quick Capture:** Inline interface for creating entries without navigation
- **Urgent Countdown:** A countdown with 3 or fewer days remaining
- **Today's Tasks:** Tasks due today or marked for today's focus
- **Streak at Risk:** A habit not yet completed today that would break an active streak
