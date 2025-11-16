# Functional Specification: Dashboard (Today View)

## Document Information

**Feature:** Dashboard (Today View)
**Version:** 1.0
**Last Updated:** 2025-11-15
**Status:** Implementation Ready
**Related PRD:** [01-dashboard-today-view.md](../prds/01-dashboard-today-view.md)

---

## 1. Technical Overview

### 1.1 System Context

The Dashboard serves as the main entry point and aggregation layer for all Daybeam features. It fetches data from multiple backend services and presents a unified view.

### 1.2 Technology Stack

- **Frontend Framework:** React 19.1.1 + TypeScript 5.9.2
- **State Management:** TanStack React Query 5.86.0
- **Styling:** Tailwind CSS 4.1.12
- **Icons:** Lucide React 0.484.0
- **Date Utilities:** date-fns 4.1.0
- **Backend:** Encore.dev REST API

### 1.3 Performance Requirements

| Metric | Target | Critical Threshold |
|--------|--------|-------------------|
| Initial Load | < 2s | < 3s |
| Time to Interactive | < 3s | < 5s |
| API Response | < 500ms | < 1s |
| Render Time | < 100ms | < 200ms |

---

## 2. API Specifications

### 2.1 Get Dashboard Overview

**Endpoint:** `GET /users/:user_id/today/overview`

**Request:**
```typescript
interface GetDashboardOverviewRequest {
  user_id: string; // UUID
}
```

**Response:**
```typescript
interface DashboardOverview {
  tasks: {
    total: number;
    overdue: number;
    today: number;
    upcoming: number; // next 7 days
  };
  habits: {
    completedToday: number;
    totalActive: number;
    streaksAtRisk: number;
    completionRate: number; // 0-100
  };
  mood: {
    latest: number | null; // 1-10
    latestTimestamp: string | null; // ISO 8601
    trend: 'up' | 'down' | 'stable';
    sevenDayAverage: number;
  };
  countdowns: {
    urgent: Countdown[]; // <= 3 days
    urgentCount: number;
  };
}

interface Countdown {
  id: string;
  event_name: string;
  event_date: string; // YYYY-MM-DD
  days_remaining: number;
  color: string;
}
```

**Status Codes:**
- `200 OK` - Success
- `401 Unauthorized` - Invalid authentication
- `403 Forbidden` - Access denied
- `404 Not Found` - User not found
- `500 Internal Server Error` - Server error

**Caching:**
- Client cache: 30 seconds (stale-while-revalidate)
- No server-side caching (real-time data)

**Implementation:**
```typescript
// backend/core/today.ts
import { api } from "encore.dev/api";

interface TodayOverviewResponse {
  tasks: TasksSummary;
  habits: HabitsSummary;
  mood: MoodSummary;
  countdowns: CountdownsSummary;
}

export const getTodayOverview = api(
  { expose: true, method: "GET", path: "/users/:user_id/today/overview" },
  async ({ user_id }: { user_id: string }): Promise<TodayOverviewResponse> => {
    // Parallel fetch for performance
    const [tasks, habits, mood, countdowns] = await Promise.all([
      getTasksSummary(user_id),
      getHabitsSummary(user_id),
      getMoodSummary(user_id),
      getCountdownsSummary(user_id),
    ]);

    return { tasks, habits, mood, countdowns };
  }
);

async function getTasksSummary(user_id: string): Promise<TasksSummary> {
  const now = new Date();
  const today = startOfDay(now);
  const sevenDaysLater = addDays(today, 7);

  const result = await db.query(`
    SELECT
      COUNT(*) FILTER (WHERE status IN ('todo', 'in_progress')) as total,
      COUNT(*) FILTER (WHERE status IN ('todo', 'in_progress') AND due_date < $1) as overdue,
      COUNT(*) FILTER (WHERE status IN ('todo', 'in_progress') AND due_date = $1) as today,
      COUNT(*) FILTER (WHERE status IN ('todo', 'in_progress') AND due_date > $1 AND due_date <= $2) as upcoming
    FROM tasks
    WHERE user_id = $3
  `, [today, sevenDaysLater, user_id]);

  return {
    total: parseInt(result.rows[0].total),
    overdue: parseInt(result.rows[0].overdue),
    today: parseInt(result.rows[0].today),
    upcoming: parseInt(result.rows[0].upcoming),
  };
}
```

### 2.2 Get Today's Tasks

**Endpoint:** `GET /users/:user_id/today/tasks`

**Request:**
```typescript
interface GetTodayTasksRequest {
  user_id: string;
  status?: 'todo' | 'in_progress' | 'completed'; // optional filter
}
```

**Response:**
```typescript
interface TodayTasksResponse {
  tasks: Task[];
  total: number;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'completed' | 'snoozed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string; // YYYY-MM-DD
  space?: {
    id: string;
    name: string;
    color: string;
    icon: string;
  };
  tags: {
    id: string;
    name: string;
    color?: string;
  }[];
  created_at: string;
  updated_at: string;
}
```

**Query Logic:**
- Include tasks with due_date = today
- Include overdue tasks (due_date < today, status != completed)
- Exclude snoozed tasks
- Sort by: priority (urgent → low), then due_date (oldest first)

**Implementation:**
```typescript
export const getTodayTasks = api(
  { expose: true, method: "GET", path: "/users/:user_id/today/tasks" },
  async ({ user_id }: { user_id: string }): Promise<TodayTasksResponse> => {
    const today = startOfDay(new Date());

    const query = `
      SELECT
        t.*,
        s.id as space_id,
        s.name as space_name,
        s.color as space_color,
        s.icon as space_icon,
        COALESCE(
          json_agg(
            json_build_object('id', tag.id, 'name', tag.name, 'color', tag.color)
          ) FILTER (WHERE tag.id IS NOT NULL),
          '[]'
        ) as tags
      FROM tasks t
      LEFT JOIN spaces s ON t.space_id = s.id
      LEFT JOIN task_tags tt ON t.id = tt.task_id
      LEFT JOIN tags tag ON tt.tag_id = tag.id
      WHERE t.user_id = $1
        AND t.status IN ('todo', 'in_progress')
        AND (
          t.due_date = $2
          OR (t.due_date < $2 AND t.status != 'completed')
        )
      GROUP BY t.id, s.id, s.name, s.color, s.icon
      ORDER BY
        CASE t.priority
          WHEN 'urgent' THEN 1
          WHEN 'high' THEN 2
          WHEN 'medium' THEN 3
          WHEN 'low' THEN 4
        END,
        t.due_date ASC NULLS LAST,
        t.created_at DESC
    `;

    const result = await db.query(query, [user_id, today]);

    const tasks = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      status: row.status,
      priority: row.priority,
      due_date: row.due_date,
      space: row.space_id ? {
        id: row.space_id,
        name: row.space_name,
        color: row.space_color,
        icon: row.space_icon,
      } : undefined,
      tags: row.tags,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }));

    return {
      tasks,
      total: tasks.length,
    };
  }
);
```

---

## 3. Frontend Component Specification

### 3.1 Component Hierarchy

```
<TodayView>
  ├── <DashboardHeader />
  ├── <SummaryCardsGrid>
  │   ├── <TasksSummaryCard />
  │   ├── <HabitsSummaryCard />
  │   ├── <MoodSummaryCard />
  │   └── <CountdownsSummaryCard />
  ├── <QuickCaptureSection>
  │   ├── <QuickMoodCapture />
  │   └── <QuickJournalEntry />
  └── <TodayTasksSection>
      ├── <TaskFilters />
      ├── <TaskList />
      └── <CreateTaskButton />
```

### 3.2 TodayView Component

**File:** `frontend/components/TodayView.tsx`

**Props:**
```typescript
interface TodayViewProps {
  userId: string;
}
```

**State Management:**
```typescript
// React Query hooks
const { data: overview, isLoading: overviewLoading, error: overviewError } = useQuery({
  queryKey: ['dashboard', 'overview', userId],
  queryFn: () => client.getTodayOverview({ user_id: userId }),
  staleTime: 30000, // 30 seconds
  refetchOnWindowFocus: true,
});

const { data: todayTasks, isLoading: tasksLoading } = useQuery({
  queryKey: ['dashboard', 'tasks', userId],
  queryFn: () => client.getTodayTasks({ user_id: userId }),
  staleTime: 30000,
});
```

**Implementation:**
```typescript
import { useQuery } from '@tanstack/react-query';
import { client } from '../client';

export function TodayView({ userId }: TodayViewProps) {
  const { data: overview, isLoading: overviewLoading } = useQuery({
    queryKey: ['dashboard', 'overview', userId],
    queryFn: () => client.getTodayOverview({ user_id: userId }),
    staleTime: 30000,
  });

  const { data: todayTasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['dashboard', 'tasks', userId],
    queryFn: () => client.getTodayTasks({ user_id: userId }),
    staleTime: 30000,
  });

  if (overviewLoading || tasksLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <DashboardHeader />

      {/* Summary Cards */}
      <SummaryCardsGrid>
        <TasksSummaryCard data={overview?.tasks} />
        <HabitsSummaryCard data={overview?.habits} />
        <MoodSummaryCard data={overview?.mood} />
        <CountdownsSummaryCard data={overview?.countdowns} />
      </SummaryCardsGrid>

      {/* Quick Capture */}
      <QuickCaptureSection>
        <QuickMoodCapture userId={userId} />
        <QuickJournalEntry userId={userId} />
      </QuickCaptureSection>

      {/* Today's Tasks */}
      <TodayTasksSection tasks={todayTasks?.tasks || []} />
    </div>
  );
}
```

### 3.3 TasksSummaryCard Component

**Props:**
```typescript
interface TasksSummaryCardProps {
  data?: {
    total: number;
    overdue: number;
    today: number;
    upcoming: number;
  };
}
```

**Implementation:**
```typescript
import { CheckSquare, AlertCircle, Calendar } from 'lucide-react';
import { Card } from './ui/card';

export function TasksSummaryCard({ data }: TasksSummaryCardProps) {
  if (!data) return <Card className="h-40 animate-pulse" />;

  return (
    <Card className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Tasks</h3>
        <CheckSquare className="w-5 h-5 text-blue-400" />
      </div>

      <div className="space-y-3">
        {/* Overdue - Warning */}
        {data.overdue > 0 && (
          <div className="flex items-center justify-between text-red-400">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>Overdue</span>
            </div>
            <span className="font-bold">{data.overdue}</span>
          </div>
        )}

        {/* Today */}
        <div className="flex items-center justify-between text-yellow-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Due Today</span>
          </div>
          <span className="font-bold">{data.today}</span>
        </div>

        {/* Upcoming */}
        <div className="flex items-center justify-between text-slate-400">
          <span>Upcoming</span>
          <span>{data.upcoming}</span>
        </div>

        {/* Total Active */}
        <div className="pt-2 border-t border-slate-700">
          <div className="flex items-center justify-between text-slate-300">
            <span>Total Active</span>
            <span className="font-semibold">{data.total}</span>
          </div>
        </div>
      </div>

      {/* Quick Action */}
      <button
        onClick={() => window.location.href = '/tasks'}
        className="mt-4 w-full text-center text-sm text-blue-400 hover:text-blue-300 transition-colors"
      >
        View All Tasks →
      </button>
    </Card>
  );
}
```

### 3.4 QuickMoodCapture Component

**Props:**
```typescript
interface QuickMoodCaptureProps {
  userId: string;
  onSuccess?: () => void;
}
```

**State:**
```typescript
const [selectedMood, setSelectedMood] = useState<number | null>(null);
const [context, setContext] = useState('');
const [showContext, setShowContext] = useState(false);
```

**Implementation:**
```typescript
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '../client';
import { toast } from './ui/toast';

export function QuickMoodCapture({ userId, onSuccess }: QuickMoodCaptureProps) {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [context, setContext] = useState('');
  const [showContext, setShowContext] = useState(false);

  const queryClient = useQueryClient();

  const createMoodMutation = useMutation({
    mutationFn: (data: { value: number; context?: string }) =>
      client.createMood({
        user_id: userId,
        value: data.value,
        context: data.context,
        timestamp: new Date().toISOString(),
      }),
    onSuccess: () => {
      // Invalidate dashboard queries
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'overview', userId] });
      queryClient.invalidateQueries({ queryKey: ['moods', userId] });

      toast.success('Mood logged successfully');

      // Reset form
      setSelectedMood(null);
      setContext('');
      setShowContext(false);

      onSuccess?.();
    },
    onError: (error) => {
      toast.error('Failed to log mood');
      console.error('Mood creation error:', error);
    },
  });

  const handleMoodSelect = (mood: number) => {
    setSelectedMood(mood);
    // Auto-submit if no context needed
    if (!showContext) {
      createMoodMutation.mutate({ value: mood });
    }
  };

  const handleSubmitWithContext = () => {
    if (selectedMood) {
      createMoodMutation.mutate({
        value: selectedMood,
        context: context.trim() || undefined,
      });
    }
  };

  const getMoodColor = (mood: number) => {
    if (mood <= 3) return 'bg-red-500 hover:bg-red-600';
    if (mood <= 6) return 'bg-yellow-500 hover:bg-yellow-600';
    if (mood <= 9) return 'bg-green-500 hover:bg-green-600';
    return 'bg-cyan-500 hover:bg-cyan-600';
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-4">How are you feeling?</h3>

      {/* Mood Scale 1-10 */}
      <div className="grid grid-cols-10 gap-2 mb-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((mood) => (
          <button
            key={mood}
            onClick={() => handleMoodSelect(mood)}
            disabled={createMoodMutation.isPending}
            className={`
              aspect-square rounded-lg font-bold text-white transition-all
              ${getMoodColor(mood)}
              ${selectedMood === mood ? 'ring-2 ring-white scale-110' : ''}
              ${createMoodMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {mood}
          </button>
        ))}
      </div>

      {/* Optional Context */}
      {showContext ? (
        <div className="space-y-3">
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="What's influencing your mood? (optional)"
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            rows={2}
            maxLength={500}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSubmitWithContext}
              disabled={!selectedMood || createMoodMutation.isPending}
              className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {createMoodMutation.isPending ? 'Saving...' : 'Save Mood'}
            </button>
            <button
              onClick={() => setShowContext(false)}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowContext(true)}
          className="w-full text-sm text-slate-400 hover:text-slate-300 transition-colors"
        >
          + Add context
        </button>
      )}
    </div>
  );
}
```

---

## 4. Data Flow & State Management

### 4.1 Query Invalidation Strategy

When data changes in one view, related queries must be invalidated:

```typescript
// After creating a task
queryClient.invalidateQueries({ queryKey: ['dashboard', 'overview'] });
queryClient.invalidateQueries({ queryKey: ['dashboard', 'tasks'] });
queryClient.invalidateQueries({ queryKey: ['tasks'] });

// After completing a task
queryClient.invalidateQueries({ queryKey: ['dashboard', 'overview'] });
queryClient.invalidateQueries({ queryKey: ['dashboard', 'tasks'] });

// After logging a habit
queryClient.invalidateQueries({ queryKey: ['dashboard', 'overview'] });
queryClient.invalidateQueries({ queryKey: ['habits'] });

// After logging a mood
queryClient.invalidateQueries({ queryKey: ['dashboard', 'overview'] });
queryClient.invalidateQueries({ queryKey: ['moods'] });
```

### 4.2 Optimistic Updates

For better UX, implement optimistic updates for quick actions:

```typescript
const completeTaskMutation = useMutation({
  mutationFn: (taskId: string) => client.updateTask({ id: taskId, status: 'completed' }),
  onMutate: async (taskId) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['dashboard', 'tasks'] });

    // Snapshot previous value
    const previousTasks = queryClient.getQueryData(['dashboard', 'tasks']);

    // Optimistically update
    queryClient.setQueryData(['dashboard', 'tasks'], (old: any) => ({
      ...old,
      tasks: old.tasks.map((t: Task) =>
        t.id === taskId ? { ...t, status: 'completed' } : t
      ),
    }));

    return { previousTasks };
  },
  onError: (err, taskId, context) => {
    // Rollback on error
    queryClient.setQueryData(['dashboard', 'tasks'], context?.previousTasks);
    toast.error('Failed to complete task');
  },
  onSettled: () => {
    // Refetch to sync
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  },
});
```

---

## 5. Error Handling

### 5.1 API Error Handling

```typescript
function TodayView({ userId }: TodayViewProps) {
  const { data, error, isLoading } = useQuery({
    queryKey: ['dashboard', 'overview', userId],
    queryFn: () => client.getTodayOverview({ user_id: userId }),
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  if (error) {
    return (
      <ErrorState
        title="Failed to load dashboard"
        message="We couldn't load your dashboard data. Please try again."
        onRetry={() => queryClient.refetchQueries({ queryKey: ['dashboard'] })}
      />
    );
  }

  // ... rest of component
}
```

### 5.2 Error Boundaries

```typescript
// frontend/components/ErrorBoundary.tsx
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Dashboard Error:', error, errorInfo);
    // Send to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-500 mb-2">
              Something went wrong
            </h2>
            <p className="text-slate-400 mb-4">
              {this.state.error?.message}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage
<ErrorBoundary>
  <TodayView userId={userId} />
</ErrorBoundary>
```

---

## 6. Performance Optimization

### 6.1 Code Splitting

```typescript
// Lazy load dashboard components
import { lazy, Suspense } from 'react';

const TodayView = lazy(() => import('./components/TodayView'));
const DashboardSkeleton = () => <div>Loading...</div>;

// In App.tsx
<Suspense fallback={<DashboardSkeleton />}>
  <TodayView userId={userId} />
</Suspense>
```

### 6.2 Memoization

```typescript
import { useMemo } from 'react';

function SummaryCardsGrid({ overview }) {
  // Memoize expensive calculations
  const summaryStats = useMemo(() => ({
    totalTasks: overview.tasks.total,
    completionRate: calculateCompletionRate(overview.habits),
    moodTrend: calculateMoodTrend(overview.mood),
  }), [overview]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <TasksSummaryCard data={overview.tasks} />
      <HabitsSummaryCard data={overview.habits} />
      <MoodSummaryCard data={overview.mood} />
      <CountdownsSummaryCard data={overview.countdowns} />
    </div>
  );
}
```

### 6.3 Virtual Scrolling (for long task lists)

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

function TaskList({ tasks }: { tasks: Task[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: tasks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80, // estimated row height
    overscan: 5,
  });

  return (
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const task = tasks[virtualRow.index];
          return (
            <div
              key={task.id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <TaskCard task={task} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

---

## 7. Testing Specifications

### 7.1 Unit Tests

```typescript
// TodayView.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TodayView } from './TodayView';
import { client } from '../client';

jest.mock('../client');

describe('TodayView', () => {
  const mockUserId = 'user-123';
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
  });

  it('should render loading state initially', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <TodayView userId={mockUserId} />
      </QueryClientProvider>
    );

    expect(screen.getByTestId('dashboard-skeleton')).toBeInTheDocument();
  });

  it('should render dashboard with overview data', async () => {
    const mockOverview = {
      tasks: { total: 10, overdue: 2, today: 3, upcoming: 5 },
      habits: { completedToday: 4, totalActive: 5, streaksAtRisk: 1, completionRate: 80 },
      mood: { latest: 7, latestTimestamp: '2025-11-15T10:00:00Z', trend: 'up', sevenDayAverage: 6.5 },
      countdowns: { urgent: [], urgentCount: 0 },
    };

    (client.getTodayOverview as jest.Mock).mockResolvedValue(mockOverview);

    render(
      <QueryClientProvider client={queryClient}>
        <TodayView userId={mockUserId} />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('10')).toBeInTheDocument(); // Total tasks
      expect(screen.getByText('2')).toBeInTheDocument(); // Overdue tasks
      expect(screen.getByText('80%')).toBeInTheDocument(); // Habit completion rate
    });
  });

  it('should handle API errors gracefully', async () => {
    (client.getTodayOverview as jest.Mock).mockRejectedValue(new Error('API Error'));

    render(
      <QueryClientProvider client={queryClient}>
        <TodayView userId={mockUserId} />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Failed to load dashboard/i)).toBeInTheDocument();
    });
  });
});
```

### 7.2 Integration Tests

```typescript
// Dashboard.integration.test.tsx
describe('Dashboard Integration', () => {
  it('should create mood and update dashboard', async () => {
    const { user } = render(<App />);

    // Navigate to dashboard
    await user.click(screen.getByText('Today'));

    // Click mood value
    await user.click(screen.getByText('8'));

    // Verify toast notification
    expect(await screen.findByText('Mood logged successfully')).toBeInTheDocument();

    // Verify dashboard updated
    await waitFor(() => {
      expect(screen.getByText('Latest: 8/10')).toBeInTheDocument();
    });
  });
});
```

### 7.3 Performance Tests

```typescript
// Performance.test.tsx
describe('Dashboard Performance', () => {
  it('should load dashboard in under 2 seconds', async () => {
    const startTime = performance.now();

    render(
      <QueryClientProvider client={queryClient}>
        <TodayView userId="user-123" />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('dashboard-skeleton')).not.toBeInTheDocument();
    });

    const endTime = performance.now();
    const loadTime = endTime - startTime;

    expect(loadTime).toBeLessThan(2000);
  });
});
```

---

## 8. Validation Rules

### 8.1 Input Validation

**Mood Value:**
```typescript
function validateMoodValue(value: number): ValidationResult {
  if (!Number.isInteger(value)) {
    return { valid: false, error: 'Mood must be an integer' };
  }
  if (value < 1 || value > 10) {
    return { valid: false, error: 'Mood must be between 1 and 10' };
  }
  return { valid: true };
}
```

**User ID:**
```typescript
function validateUserId(userId: string): ValidationResult {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(userId)) {
    return { valid: false, error: 'Invalid user ID format' };
  }
  return { valid: true };
}
```

---

## 9. Accessibility Requirements

### 9.1 ARIA Labels

```typescript
<div role="main" aria-label="Dashboard">
  <section aria-labelledby="summary-heading">
    <h2 id="summary-heading" className="sr-only">Daily Summary</h2>
    {/* Summary cards */}
  </section>

  <section aria-labelledby="quick-capture-heading">
    <h2 id="quick-capture-heading" className="sr-only">Quick Capture</h2>
    {/* Quick capture forms */}
  </section>

  <section aria-labelledby="tasks-heading">
    <h2 id="tasks-heading">Today's Tasks</h2>
    {/* Task list */}
  </section>
</div>
```

### 9.2 Keyboard Navigation

```typescript
function QuickMoodCapture() {
  const handleKeyDown = (e: React.KeyboardEvent, mood: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleMoodSelect(mood);
    }
  };

  return (
    <div>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((mood) => (
        <button
          key={mood}
          onClick={() => handleMoodSelect(mood)}
          onKeyDown={(e) => handleKeyDown(e, mood)}
          aria-label={`Mood level ${mood} out of 10`}
          tabIndex={0}
        >
          {mood}
        </button>
      ))}
    </div>
  );
}
```

---

## 10. Implementation Checklist

### Backend
- [ ] Implement `GET /users/:user_id/today/overview` endpoint
- [ ] Implement `GET /users/:user_id/today/tasks` endpoint
- [ ] Add database indexes for performance
- [ ] Implement query caching strategy
- [ ] Add error handling and logging
- [ ] Write unit tests for API endpoints
- [ ] Add API documentation (Swagger/OpenAPI)

### Frontend
- [ ] Create `TodayView` component
- [ ] Create summary card components (Tasks, Habits, Mood, Countdowns)
- [ ] Create `QuickMoodCapture` component
- [ ] Create `QuickJournalEntry` component
- [ ] Create `TodayTasksSection` component
- [ ] Implement React Query hooks
- [ ] Add optimistic updates
- [ ] Implement error boundaries
- [ ] Add loading skeletons
- [ ] Write unit tests for components
- [ ] Write integration tests
- [ ] Add accessibility features (ARIA labels, keyboard navigation)
- [ ] Test performance (load time, render time)

### QA
- [ ] Manual testing on desktop (Chrome, Firefox, Safari)
- [ ] Manual testing on mobile (iOS, Android)
- [ ] Test error scenarios (network errors, API failures)
- [ ] Test accessibility with screen reader
- [ ] Performance testing (load times, responsiveness)
- [ ] Security testing (authentication, authorization)

---

## 11. Deployment Steps

1. **Backend Deployment:**
   ```bash
   cd backend
   encore deploy
   ```

2. **Frontend Build:**
   ```bash
   cd frontend
   bun run build
   ```

3. **Verify Deployment:**
   - Check API health endpoint
   - Verify database migrations
   - Test API endpoints with curl/Postman
   - Verify frontend loads correctly

4. **Monitoring:**
   - Set up error tracking (Sentry, etc.)
   - Monitor API response times
   - Track query performance
   - Monitor user engagement metrics

---

## 12. Future Enhancements

### Phase 2
- Real-time updates with WebSockets
- Customizable dashboard layout (drag-and-drop cards)
- Dashboard widgets system
- Offline support with service workers
- Push notifications for urgent items

### Phase 3
- AI-powered daily summaries
- Smart suggestions based on patterns
- Voice-activated quick captures
- Dashboard themes and customization
- Export dashboard data as PDF/image

---

**End of Functional Specification**
