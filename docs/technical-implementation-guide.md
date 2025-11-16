# Technical Implementation Guide

## Overview

This guide provides concrete technical recommendations for implementing the ADHD-optimized personal productivity system. It covers tech stack choices, architectural patterns, database design, API structure, and deployment strategy.

---

## 1. Technology Stack Recommendations

### Frontend

**Framework: React 18+ with TypeScript**

**Rationale:**
- ✅ Large ecosystem (easy to find solutions)
- ✅ Strong TypeScript support (reduces bugs for solo dev)
- ✅ Component reusability (DRY for features)
- ✅ Excellent dev tools (React DevTools)

**State Management: Zustand**

```typescript
// Example store structure
import create from 'zustand';
import { persist } from 'zustand/middleware';

interface DashboardStore {
  // State
  activeSpace: string | null;
  focusMode: boolean;
  todayData: Dashboard | null;
  loading: boolean;

  // Actions
  setActiveSpace: (spaceId: string | null) => void;
  toggleFocusMode: () => void;
  fetchDashboard: (date: Date) => Promise<void>;

  // ADHD-specific
  undoStack: Action[];
  redoStack: Action[];
  undo: () => void;
  redo: () => void;
}

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set, get) => ({
      activeSpace: null,
      focusMode: false,
      todayData: null,
      loading: false,
      undoStack: [],
      redoStack: [],

      setActiveSpace: (spaceId) => set({ activeSpace: spaceId }),

      toggleFocusMode: () => set((state) => ({
        focusMode: !state.focusMode
      })),

      fetchDashboard: async (date) => {
        set({ loading: true });
        const data = await api.getDashboard(date);
        set({ todayData: data, loading: false });
      },

      undo: () => {
        const { undoStack, redoStack } = get();
        if (undoStack.length === 0) return;

        const action = undoStack[undoStack.length - 1];
        action.undo();

        set({
          undoStack: undoStack.slice(0, -1),
          redoStack: [...redoStack, action],
        });
      },

      redo: () => {
        const { redoStack, undoStack } = get();
        if (redoStack.length === 0) return;

        const action = redoStack[redoStack.length - 1];
        action.redo();

        set({
          redoStack: redoStack.slice(0, -1),
          undoStack: [...undoStack, action],
        });
      },
    }),
    {
      name: 'dashboard-storage',
      partialize: (state) => ({
        activeSpace: state.activeSpace,
        focusMode: state.focusMode,
      }),
    }
  )
);
```

**UI Library: shadcn/ui + Tailwind CSS**

**Rationale:**
- ✅ Accessible by default (important for focus users)
- ✅ Customizable (easy to theme per space)
- ✅ No runtime bundle (Tailwind = build-time)
- ✅ Copy-paste components (no dependency hell)

**Rich Text Editor: Tiptap**

```typescript
// Journal editor configuration
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const JournalEditor = () => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    autofocus: true,
    editorProps: {
      attributes: {
        class: 'prose prose-lg focus:outline-none min-h-[300px]',
      },
    },
    onUpdate: ({ editor }) => {
      // Auto-save every 30 seconds (ADHD-friendly)
      debouncedSave(editor.getHTML());
    },
  });

  return <EditorContent editor={editor} />;
};
```

**Date/Time: date-fns**

**Rationale:**
- ✅ Smaller than Moment.js
- ✅ Tree-shakeable (import only what you need)
- ✅ Immutable (no date mutation bugs)

**Charts (Future Analytics): Recharts**

---

### Backend

**Runtime: Node.js 20+ (LTS)**

**Framework: Fastify (Alternative: Express)**

**Rationale:**
- ✅ Fastest Node.js framework (2-3x Express)
- ✅ First-class TypeScript support
- ✅ Schema validation built-in (JSON Schema)
- ✅ Plugin ecosystem (auth, CORS, etc.)

**API Layer: GraphQL (Apollo Server)**

```typescript
// schema.graphql
type Query {
  dashboard(date: Date!): Dashboard!
  tasks(filter: TaskFilter): [Task!]!
  habits: [Habit!]!
  habitMoodAnalytics(habitId: ID!, dateRange: DateRange!): Analytics!
}

type Mutation {
  createTask(input: TaskInput!): Task!
  completeTask(taskId: ID!): Task!
  bulkDeferTasks(taskIds: [ID!]!, deferTo: Date!): [Task!]!

  completeHabit(habitId: ID!, moodData: MoodInput): HabitCompletion!

  createJournalEntry(input: JournalInput!): JournalEntry!

  # ATLAS integration
  syncAtlasTicketToTask(ticketId: ID!): Task!
}

type Subscription {
  taskUpdated(userId: ID!): Task!
  habitCompleted(userId: ID!): HabitCompletion!
  notificationReceived(userId: ID!): Notification!
}

# Core types
type Dashboard {
  date: Date!
  tasks: [Task!]!
  habits: [Habit!]!
  moodPrompt: MoodPrompt
  upcomingMaintenance: [Task!]!
  urgentCountdowns: [Countdown!]!
  calendarEvents: [CalendarEvent!]!
  spotifyNowPlaying: SpotifyTrack
  weather: WeatherData
  atlasStats: AtlasStats
}

type Task {
  id: ID!
  title: String!
  status: TaskStatus!
  priority: Priority!
  dueDate: DateTime
  space: Space
  recurrence: Recurrence
  maintenanceMeta: MaintenanceMeta
  dependencies: [Task!]!
  subtasks: [Task!]!
}
```

**Database: PostgreSQL 16+**

**Rationale:**
- ✅ JSONB support (flexible metadata storage)
- ✅ Excellent performance for complex queries
- ✅ ACID compliance (data integrity)
- ✅ Full-text search (future feature)

**ORM: Prisma**

```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())

  tasks     Task[]
  habits    Habit[]
  journals  JournalEntry[]
  spaces    Space[]
}

model Space {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])

  name      String
  color     String   // Hex color
  icon      String?

  tasks     Task[]
  habits    Habit[]
  journals  JournalEntry[]

  createdAt DateTime @default(now())

  @@index([userId])
}

model Task {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])

  spaceId   String?
  space     Space?   @relation(fields: [spaceId], references: [id])

  title     String
  status    String   @default("not_started")
  priority  String   @default("medium")
  dueDate   DateTime?

  // JSONB for flexibility
  recurrence       Json?  // { type, date_pattern, interval_pattern }
  maintenanceMeta  Json?  // { category, item_name, history: [] }

  // Hierarchy
  parentTaskId String?
  parentTask   Task?   @relation("TaskHierarchy", fields: [parentTaskId], references: [id])
  subtasks     Task[]  @relation("TaskHierarchy")

  // Dependencies
  dependsOn    Task[] @relation("TaskDependencies")
  blockedBy    Task[] @relation("TaskDependencies")

  // Calendar sync
  calendarEvents CalendarEvent[]

  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  completedAt  DateTime?
  deletedAt    DateTime?  // Soft delete

  @@index([userId, status, dueDate])
  @@index([spaceId])
}

model Habit {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])

  spaceId   String?
  space     Space?   @relation(fields: [spaceId], references: [id])

  title     String
  frequency String   // "daily", "weekly", "custom"
  customFrequency Json?  // { days: [1,3,5] }

  // ATLAS integration
  atlasSync Json?  // { enabled, auto_complete_on_session, min_test_cases }

  completions HabitCompletion[]

  createdAt DateTime @default(now())

  @@index([userId])
}

model HabitCompletion {
  id        String   @id @default(uuid())
  habitId   String
  habit     Habit    @relation(fields: [habitId], references: [id])

  completedAt DateTime @default(now())

  // Optional mood capture
  moodSnapshot Json?  // { energy, feeling, notes }

  @@index([habitId, completedAt])
}

model MoodLog {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])

  energyLevel     Int      // 1-10
  emotionalState  String   // "anxious", "focused", etc.
  notes           String?

  loggedAt     DateTime @default(now())
  triggeredBy  String?  // "habit_completion", "manual", "journal_entry"

  @@index([userId, loggedAt])
}

model JournalEntry {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])

  spaceId   String?
  space     Space?   @relation(fields: [spaceId], references: [id])

  content      String   // Rich text HTML
  templateUsed String?

  // Rich metadata
  moodSnapshot   Json?  // { energy, feeling }
  spotifyCapture Json?  // { track_name, artist, uri }

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId, createdAt])
}

model CalendarEvent {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])

  googleEventId String? @unique  // For sync tracking

  title     String
  startTime DateTime
  endTime   DateTime?
  allDay    Boolean  @default(false)

  // Optional link to task
  linkedTaskId String?
  linkedTask   Task?   @relation(fields: [linkedTaskId], references: [id])

  syncedAt  DateTime @default(now())

  @@index([userId, startTime])
}

model Countdown {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])

  spaceId   String?
  space     Space?   @relation(fields: [spaceId], references: [id])

  title       String
  targetDate  DateTime
  urgencyLevel String  @default("medium")

  // Specialized types
  countdownType String?  // "concert", "vacation", etc.
  concertMeta   Json?    // { venue, ticket_status, artists }

  createdAt DateTime @default(now())

  @@index([userId, targetDate])
}

// ATLAS Workspace (separate schema)
model AtlasTicket {
  id        String   @id @default(uuid())
  userId    String

  jiraKey   String   @unique
  title     String
  severity  String

  predictedScenarios Json?  // AI-generated test scenarios

  // Bridge to main app
  workspaceBridge WorkspaceBridge?

  createdAt DateTime @default(now())
}

model WorkspaceBridge {
  id        String   @id @default(uuid())

  mainTaskId    String
  mainTask      Task   @relation(fields: [mainTaskId], references: [id])

  atlasTicketId String @unique
  atlasTicket   AtlasTicket @relation(fields: [atlasTicketId], references: [id])

  syncDirection String  // "atlas_to_main" | "bidirectional"
  lastSynced    DateTime @default(now())

  @@unique([mainTaskId, atlasTicketId])
}
```

---

### External Integrations

**Google Calendar API**

```typescript
// services/google-calendar.service.ts
import { google } from 'googleapis';

export class GoogleCalendarService {
  private calendar: any;

  constructor(private oauth2Client: any) {
    this.calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  }

  async syncEvents(since: Date): Promise<CalendarEvent[]> {
    const response = await this.calendar.events.list({
      calendarId: 'primary',
      timeMin: since.toISOString(),
      maxResults: 100,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return response.data.items.map(this.mapGoogleEventToCalendarEvent);
  }

  async createEvent(event: CalendarEvent): Promise<string> {
    const response = await this.calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: event.title,
        start: { dateTime: event.startTime },
        end: { dateTime: event.endTime },
        description: `Task ID: ${event.linkedTaskId}`,
      },
    });

    return response.data.id;
  }

  async updateEvent(eventId: string, updates: Partial<CalendarEvent>): Promise<void> {
    await this.calendar.events.patch({
      calendarId: 'primary',
      eventId,
      requestBody: {
        summary: updates.title,
        start: updates.startTime ? { dateTime: updates.startTime } : undefined,
        end: updates.endTime ? { dateTime: updates.endTime } : undefined,
      },
    });
  }

  async deleteEvent(eventId: string): Promise<void> {
    await this.calendar.events.delete({
      calendarId: 'primary',
      eventId,
    });
  }

  // Bidirectional sync with webhooks
  async setupWebhook(callbackUrl: string): Promise<void> {
    await this.calendar.events.watch({
      calendarId: 'primary',
      requestBody: {
        id: `webhook-${Date.now()}`,
        type: 'web_hook',
        address: callbackUrl,
      },
    });
  }
}
```

**Spotify API**

```typescript
// services/spotify.service.ts
import SpotifyWebApi from 'spotify-web-api-node';

export class SpotifyService {
  private spotify: SpotifyWebApi;

  constructor(accessToken: string, refreshToken: string) {
    this.spotify = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      accessToken,
      refreshToken,
    });
  }

  async getCurrentlyPlaying(): Promise<SpotifyTrack | null> {
    try {
      const response = await this.spotify.getMyCurrentPlayingTrack();

      if (!response.body || !response.body.item) {
        return null;
      }

      const track = response.body.item as SpotifyApi.TrackObjectFull;

      return {
        trackName: track.name,
        artist: track.artists.map(a => a.name).join(', '),
        album: track.album.name,
        spotifyUri: track.uri,
        albumArt: track.album.images[0]?.url,
        capturedAt: new Date(),
      };
    } catch (error) {
      // Token expired - refresh and retry
      if (error.statusCode === 401) {
        await this.refreshAccessToken();
        return this.getCurrentlyPlaying();
      }

      return null;  // Graceful failure
    }
  }

  private async refreshAccessToken(): Promise<void> {
    const data = await this.spotify.refreshAccessToken();
    this.spotify.setAccessToken(data.body.access_token);

    // Store new token in database
    await this.updateUserSpotifyToken(data.body.access_token);
  }
}
```

**Weather API (OpenWeather)**

```typescript
// services/weather.service.ts
import axios from 'axios';

export class WeatherService {
  private apiKey: string;
  private baseUrl = 'https://api.openweathermap.org/data/2.5';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getCurrentWeather(location: string): Promise<WeatherData> {
    const response = await axios.get(`${this.baseUrl}/weather`, {
      params: {
        q: location,
        appid: this.apiKey,
        units: 'imperial',  // Fahrenheit
      },
    });

    return {
      temperature: response.data.main.temp,
      feelsLike: response.data.main.feels_like,
      condition: response.data.weather[0].main,
      description: response.data.weather[0].description,
      icon: `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`,
    };
  }
}
```

---

## 2. Background Jobs & Automation

**Job Queue: BullMQ (Redis-backed)**

```typescript
// jobs/automation.jobs.ts
import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';

const connection = new Redis(process.env.REDIS_URL);

// Define job queues
export const automationQueue = new Queue('automation', { connection });
export const analyticsQueue = new Queue('analytics', { connection });

// Worker: Overdue task alerts
const overdueTaskWorker = new Worker(
  'automation',
  async (job) => {
    const { userId } = job.data;

    const overdueTasks = await prisma.task.findMany({
      where: {
        userId,
        status: { not: 'completed' },
        dueDate: { lt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
      },
    });

    if (overdueTasks.length > 0) {
      await createNotification({
        userId,
        priority: 'CRITICAL',
        message: `You have ${overdueTasks.length} overdue tasks`,
        actions: [
          { label: 'Review Tasks', url: '/tasks?filter=overdue' },
        ],
      });
    }
  },
  { connection }
);

// Schedule jobs
automationQueue.add(
  'check-overdue-tasks',
  { userId: 'user-id' },
  { repeat: { pattern: '*/15 8-22 * * *' } }  // Every 15 min, 8am-10pm
);
```

**Cron Jobs (if not using BullMQ):**

```typescript
// jobs/cron-scheduler.ts
import cron from 'node-cron';

// Daily at 8:00 PM - Habit streak risk alerts
cron.schedule('0 20 * * *', async () => {
  const users = await prisma.user.findMany();

  for (const user of users) {
    await checkHabitStreakRisk(user.id);
  }
});

// Daily at 6:00 AM - Maintenance interval alerts
cron.schedule('0 6 * * *', async () => {
  const users = await prisma.user.findMany();

  for (const user of users) {
    await checkMaintenanceIntervals(user.id);
  }
});

// Daily at 2:00 AM - Analytics computation
cron.schedule('0 2 * * *', async () => {
  await computeHabitMoodCorrelations();
  await computeTaskProductivityMetrics();
});
```

---

## 3. Real-Time Features

**GraphQL Subscriptions (WebSocket)**

```typescript
// server.ts
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { makeExecutableSchema } from '@graphql-tools/schema';

const schema = makeExecutableSchema({ typeDefs, resolvers });

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});

useServer(
  {
    schema,
    context: async (ctx) => {
      // Get user from auth token
      const token = ctx.connectionParams?.authorization;
      const user = await verifyToken(token);
      return { user };
    },
  },
  wsServer
);

// Resolvers with subscriptions
const resolvers = {
  Subscription: {
    taskUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(['TASK_UPDATED']),
        (payload, variables) => {
          return payload.taskUpdated.userId === variables.userId;
        }
      ),
    },

    habitCompleted: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(['HABIT_COMPLETED']),
        (payload, variables) => {
          return payload.habitCompleted.userId === variables.userId;
        }
      ),
    },

    notificationReceived: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(['NOTIFICATION']),
        (payload, variables) => {
          return payload.notificationReceived.userId === variables.userId;
        }
      ),
    },
  },
};

// Client-side usage
import { useSubscription } from '@apollo/client';

const TASK_UPDATED_SUBSCRIPTION = gql`
  subscription TaskUpdated($userId: ID!) {
    taskUpdated(userId: $userId) {
      id
      title
      status
      updatedAt
    }
  }
`;

const TaskList = () => {
  const { data } = useSubscription(TASK_UPDATED_SUBSCRIPTION, {
    variables: { userId: currentUser.id },
  });

  useEffect(() => {
    if (data?.taskUpdated) {
      // Update UI optimistically
      updateTaskInCache(data.taskUpdated);

      // Show toast notification
      toast.success(`Task "${data.taskUpdated.title}" updated`);
    }
  }, [data]);
};
```

---

## 4. Undo/Redo Implementation

**Action Pattern with Command Objects**

```typescript
// lib/undo-manager.ts
interface Action {
  type: string;
  timestamp: Date;
  undo: () => Promise<void>;
  redo: () => Promise<void>;
  metadata?: any;
}

class UndoManager {
  private undoStack: Action[] = [];
  private redoStack: Action[] = [];
  private maxStackSize = 50;

  async executeAction(action: Action): Promise<void> {
    await action.redo();

    this.undoStack.push(action);
    this.redoStack = [];  // Clear redo stack on new action

    // Prune stack if too large
    if (this.undoStack.length > this.maxStackSize) {
      this.undoStack.shift();
    }

    // Persist to database
    await this.persistStack();
  }

  async undo(): Promise<void> {
    if (this.undoStack.length === 0) {
      throw new Error('Nothing to undo');
    }

    const action = this.undoStack.pop()!;
    await action.undo();

    this.redoStack.push(action);
    await this.persistStack();
  }

  async redo(): Promise<void> {
    if (this.redoStack.length === 0) {
      throw new Error('Nothing to redo');
    }

    const action = this.redoStack.pop()!;
    await action.redo();

    this.undoStack.push(action);
    await this.persistStack();
  }

  private async persistStack(): Promise<void> {
    // Store in database + localStorage for redundancy
    await prisma.userSessionState.upsert({
      where: { userId: currentUser.id },
      update: {
        undoStack: JSON.stringify(this.undoStack.map(serializeAction)),
        redoStack: JSON.stringify(this.redoStack.map(serializeAction)),
      },
      create: {
        userId: currentUser.id,
        undoStack: JSON.stringify(this.undoStack.map(serializeAction)),
        redoStack: JSON.stringify(this.redoStack.map(serializeAction)),
      },
    });
  }
}

// Example: Bulk delete tasks
const bulkDeleteAction: Action = {
  type: 'BULK_DELETE_TASKS',
  timestamp: new Date(),
  metadata: { taskIds: ['id1', 'id2', 'id3'] },

  redo: async () => {
    await prisma.task.updateMany({
      where: { id: { in: bulkDeleteAction.metadata.taskIds } },
      data: { deletedAt: new Date() },
    });
  },

  undo: async () => {
    await prisma.task.updateMany({
      where: { id: { in: bulkDeleteAction.metadata.taskIds } },
      data: { deletedAt: null },
    });
  },
};

await undoManager.executeAction(bulkDeleteAction);
```

---

## 5. Performance Optimization

### Database Indexing Strategy

```sql
-- Critical indexes for dashboard query
CREATE INDEX idx_tasks_user_status_due ON tasks(user_id, status, due_date);
CREATE INDEX idx_tasks_space ON tasks(space_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_habits_user ON habits(user_id);
CREATE INDEX idx_habit_completions ON habit_completions(habit_id, completed_at DESC);
CREATE INDEX idx_calendar_events_user_start ON calendar_events(user_id, start_time);

-- JSONB indexes for maintenance queries
CREATE INDEX idx_tasks_maintenance ON tasks USING GIN ((recurrence->'interval_pattern'));

-- Full-text search (future feature)
CREATE INDEX idx_tasks_title_fts ON tasks USING GIN (to_tsvector('english', title));
```

### Caching Strategy

```typescript
// lib/cache.ts
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export class CacheService {
  private defaultTTL = 300;  // 5 minutes

  async get<T>(key: string): Promise<T | null> {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async set(key: string, value: any, ttl = this.defaultTTL): Promise<void> {
    await redis.set(key, JSON.stringify(value), 'EX', ttl);
  }

  async invalidate(pattern: string): Promise<void> {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }
}

// Usage in resolver
const getDashboard = async (userId: string, date: Date) => {
  const cacheKey = `dashboard:${userId}:${date.toISOString().split('T')[0]}`;

  // Check cache
  let dashboard = await cacheService.get<Dashboard>(cacheKey);

  if (!dashboard) {
    // Fetch from database
    dashboard = await fetchDashboardData(userId, date);

    // Cache for 5 minutes
    await cacheService.set(cacheKey, dashboard);
  }

  return dashboard;
};

// Invalidate cache on mutations
const completeTask = async (taskId: string) => {
  const task = await prisma.task.update({
    where: { id: taskId },
    data: { status: 'completed', completedAt: new Date() },
  });

  // Invalidate dashboard cache
  await cacheService.invalidate(`dashboard:${task.userId}:*`);

  return task;
};
```

### Query Optimization (DataLoader Pattern)

```typescript
// lib/dataloaders.ts
import DataLoader from 'dataloader';

export const createLoaders = () => ({
  spaceLoader: new DataLoader<string, Space>(async (spaceIds) => {
    const spaces = await prisma.space.findMany({
      where: { id: { in: [...spaceIds] } },
    });

    const spaceMap = new Map(spaces.map(s => [s.id, s]));
    return spaceIds.map(id => spaceMap.get(id)!);
  }),

  userLoader: new DataLoader<string, User>(async (userIds) => {
    const users = await prisma.user.findMany({
      where: { id: { in: [...userIds] } },
    });

    const userMap = new Map(users.map(u => [u.id, u]));
    return userIds.map(id => userMap.get(id)!);
  }),
});

// Usage in resolver
const resolvers = {
  Task: {
    space: (task, _, { loaders }) => {
      return task.spaceId ? loaders.spaceLoader.load(task.spaceId) : null;
    },
  },
};
```

---

## 6. Testing Strategy

### Unit Tests (Vitest)

```typescript
// __tests__/services/habit.service.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { HabitService } from '../services/habit.service';

describe('HabitService', () => {
  let habitService: HabitService;

  beforeEach(() => {
    habitService = new HabitService(mockPrisma);
  });

  it('should calculate correct streak length', async () => {
    const habit = { id: '1', frequency: 'daily' };
    const completions = [
      { completedAt: new Date('2025-11-16') },
      { completedAt: new Date('2025-11-15') },
      { completedAt: new Date('2025-11-14') },
    ];

    const streak = await habitService.calculateStreak(habit, completions);
    expect(streak).toBe(3);
  });

  it('should detect broken streak', async () => {
    const habit = { id: '1', frequency: 'daily' };
    const completions = [
      { completedAt: new Date('2025-11-16') },
      { completedAt: new Date('2025-11-14') },  // Gap!
    ];

    const streak = await habitService.calculateStreak(habit, completions);
    expect(streak).toBe(1);  // Only today counts
  });
});
```

### Integration Tests (Playwright)

```typescript
// e2e/dashboard.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard');
    await page.waitForSelector('[data-testid="dashboard"]');
  });

  test('displays overdue tasks', async ({ page }) => {
    // Create overdue task via API
    await createTask({
      title: 'Overdue task',
      dueDate: new Date('2025-11-10'),
      status: 'not_started',
    });

    // Check dashboard
    await page.reload();
    await expect(page.getByText('⚠️ You have 1 overdue task')).toBeVisible();
  });

  test('completes habit and prompts for mood', async ({ page }) => {
    await page.getByTestId('habit-workout').click();
    await page.getByRole('button', { name: 'Complete' }).click();

    // Should show mood prompt
    await expect(page.getByText('Log your mood?')).toBeVisible();
  });

  test('undo bulk task deletion', async ({ page }) => {
    // Select multiple tasks
    await page.getByTestId('task-1').check();
    await page.getByTestId('task-2').check();

    // Delete
    await page.getByRole('button', { name: 'Delete' }).click();
    await page.getByRole('button', { name: 'Confirm' }).click();

    // Undo
    await page.keyboard.press('Control+Z');

    // Tasks should reappear
    await expect(page.getByTestId('task-1')).toBeVisible();
    await expect(page.getByTestId('task-2')).toBeVisible();
  });
});
```

---

## 7. Deployment

### Option A: Vercel (Recommended for Solo Dev)

**Why Vercel:**
- ✅ Zero-config deployment
- ✅ Automatic HTTPS
- ✅ Edge network (fast globally)
- ✅ Free tier generous for single user

**Setup:**

```bash
# vercel.json
{
  "builds": [
    { "src": "server/index.ts", "use": "@vercel/node" },
    { "src": "client/package.json", "use": "@vercel/static-build" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "server/index.ts" },
    { "src": "/(.*)", "dest": "client/dist/$1" }
  ],
  "env": {
    "DATABASE_URL": "@database-url",
    "SPOTIFY_CLIENT_ID": "@spotify-client-id",
    "GOOGLE_CLIENT_ID": "@google-client-id"
  }
}
```

**Database: Supabase (Managed PostgreSQL)**

```bash
# .env.production
DATABASE_URL="postgresql://user:pass@db.supabase.co:5432/prod"
REDIS_URL="redis://user:pass@redis.upstash.com:6379"
```

---

### Option B: Self-Hosted (VPS)

**Docker Compose Setup:**

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@db:5432/productivity
      REDIS_URL: redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:16-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: productivity

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

---

## 8. Environment Variables

```bash
# .env.example

# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/productivity_dev"

# Redis (for caching & job queue)
REDIS_URL="redis://localhost:6379"

# Google OAuth & Calendar
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
GOOGLE_REDIRECT_URI="http://localhost:3000/auth/google/callback"

# Spotify
SPOTIFY_CLIENT_ID="your-spotify-client-id"
SPOTIFY_CLIENT_SECRET="your-spotify-client-secret"

# OpenWeather API
OPENWEATHER_API_KEY="your-api-key"

# JIRA (for ATLAS)
JIRA_API_TOKEN="your-jira-token"
JIRA_DOMAIN="your-company.atlassian.net"

# JWT Secret (for auth)
JWT_SECRET="your-random-secret-key"

# App Config
NODE_ENV="development"
PORT="3000"
```

---

## 9. Security Considerations

### Authentication (JWT + OAuth)

```typescript
// lib/auth.ts
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export async function verifyGoogleToken(token: string): Promise<User> {
  const ticket = await googleClient.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  // Find or create user
  const user = await prisma.user.upsert({
    where: { email: payload.email },
    update: { name: payload.name },
    create: {
      email: payload.email,
      name: payload.name,
    },
  });

  return user;
}

export function generateJWT(user: User): string {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}
```

### Rate Limiting

```typescript
// middleware/rate-limit.ts
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,  // 100 requests per window
  message: 'Too many requests, please try again later.',
});

// Apply to API routes
app.use('/api/', apiLimiter);
```

---

## 10. Monitoring & Observability

### Logging (Pino)

```typescript
// lib/logger.ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});

// Usage
logger.info({ userId, taskId }, 'Task completed');
logger.error({ error, context }, 'Failed to sync calendar');
```

### Error Tracking (Sentry)

```typescript
// lib/sentry.ts
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

// Error handler middleware
app.use(Sentry.Handlers.errorHandler());
```

---

## Conclusion

This technical implementation guide provides a complete blueprint for building the ADHD-optimized productivity system with:

- ✅ Modern, performant tech stack (React + Fastify + Prisma + PostgreSQL)
- ✅ GraphQL API for efficient cross-feature queries
- ✅ Real-time updates via WebSocket subscriptions
- ✅ Background jobs for automations
- ✅ Robust undo/redo system
- ✅ External integrations (Google, Spotify, Weather)
- ✅ Performance optimizations (caching, DataLoader)
- ✅ Comprehensive testing strategy
- ✅ Production-ready deployment options

**Ready to build!** 🚀
