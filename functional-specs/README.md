# Daybeam Functional Specifications

## Overview

This directory contains detailed Functional Specifications for implementing all features in the Daybeam application. These documents are technical implementation guides complementing the Product Requirements Documents (PRDs).

**Related Documentation:** [PRDs](../prds/)

---

## Purpose

Functional specifications provide:
1. **Exact API contracts** - Request/response schemas, endpoints, status codes
2. **Database schemas** - Tables, columns, indexes, constraints, relationships
3. **Component specifications** - Props, state, implementation details
4. **Business logic** - Algorithms, calculations, validation rules
5. **Test specifications** - Unit, integration, and E2E test cases
6. **Error handling** - Error codes, messages, recovery strategies
7. **Performance requirements** - Benchmarks, optimization strategies

---

## Document Structure

Each functional spec follows this structure:
1. **Technical Overview** - System context, tech stack, performance requirements
2. **API Specifications** - Detailed endpoint documentation
3. **Database Schema** - Table definitions, indexes, queries
4. **Frontend Components** - Component hierarchy, props, implementation
5. **Business Logic** - Algorithms, calculations, validations
6. **State Management** - React Query setup, cache invalidation
7. **Error Handling** - Error boundaries, API errors, user feedback
8. **Performance Optimization** - Code splitting, memoization, virtualization
9. **Testing Specifications** - Unit, integration, performance tests
10. **Accessibility** - ARIA labels, keyboard navigation, screen readers
11. **Implementation Checklist** - Step-by-step tasks
12. **Deployment Steps** - Build, deploy, verify procedures

---

## Technology Stack

### Frontend
```json
{
  "react": "19.1.1",
  "typescript": "5.9.2",
  "vite": "6.3.5",
  "react-router-dom": "7.8.2",
  "@tanstack/react-query": "5.86.0",
  "tailwindcss": "4.1.12",
  "lucide-react": "0.484.0",
  "date-fns": "4.1.0",
  "radix-ui": "various"
}
```

### Backend
```json
{
  "encore.dev": "latest",
  "typescript": "5.9.2",
  "postgresql": "15+",
  "bun": "latest"
}
```

---

## API Architecture

### Base URL
- **Development:** `http://localhost:4000`
- **Production:** `https://api.daybeam.app` (example)

### Authentication
All API endpoints require authentication via bearer token:
```typescript
headers: {
  'Authorization': 'Bearer <token>',
  'Content-Type': 'application/json'
}
```

### Standard Response Format
```typescript
// Success Response
{
  data: T,
  meta?: {
    total?: number,
    page?: number,
    pageSize?: number
  }
}

// Error Response
{
  error: {
    code: string,
    message: string,
    details?: any
  }
}
```

### HTTP Status Codes
- `200 OK` - Successful GET, PUT, PATCH
- `201 Created` - Successful POST
- `204 No Content` - Successful DELETE
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing/invalid auth
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Validation error
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error
- `503 Service Unavailable` - Temporary unavailability

---

## Database Architecture

### Schema Overview

```sql
-- Core entities
users
tasks
habits
habit_entries
moods
journal_entries
countdowns
spaces
tags

-- Many-to-many relationships
task_tags
habit_tags
mood_tags
journal_tags
```

### Naming Conventions
- **Tables:** lowercase, plural (e.g., `tasks`, `journal_entries`)
- **Columns:** snake_case (e.g., `user_id`, `created_at`)
- **Primary Keys:** `id` (UUID)
- **Foreign Keys:** `<table>_id` (e.g., `user_id`, `space_id`)
- **Timestamps:** `created_at`, `updated_at` (automatically managed)

### Standard Columns
All tables include:
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
created_at TIMESTAMP DEFAULT NOW(),
updated_at TIMESTAMP DEFAULT NOW()
```

### Indexing Strategy
- Primary key index (automatic)
- Foreign key indexes for joins
- Composite indexes for common queries
- Partial indexes for filtered queries

Example:
```sql
CREATE INDEX idx_tasks_user_status ON tasks(user_id, status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date) WHERE status != 'completed';
```

---

## Frontend Architecture

### Component Structure

```
frontend/
├── components/
│   ├── TodayView.tsx           # Dashboard
│   ├── TasksView.tsx           # Tasks management
│   ├── HabitsView.tsx          # Habits tracking
│   ├── MoodsView.tsx           # Mood tracking
│   ├── JournalView.tsx         # Journal entries
│   ├── CountdownsView.tsx      # Countdowns
│   ├── AnalyticsView.tsx       # Analytics
│   ├── SpacesView.tsx          # Spaces management
│   ├── TagsView.tsx            # Tags management
│   ├── Sidebar.tsx             # Navigation
│   └── ui/                     # Reusable UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       └── ... (Radix UI based)
├── contexts/
│   └── UserContext.tsx         # User authentication
├── lib/
│   └── utils.ts                # Helper functions
├── App.tsx                     # Root router
├── main.tsx                    # Entry point
└── client.ts                   # Generated API client
```

### State Management Pattern

Using **TanStack React Query** for server state:

```typescript
// Query Hook Pattern
const { data, isLoading, error } = useQuery({
  queryKey: ['entity', id],
  queryFn: () => client.getEntity({ id }),
  staleTime: 30000, // 30 seconds
  cacheTime: 300000, // 5 minutes
});

// Mutation Hook Pattern
const mutation = useMutation({
  mutationFn: client.createEntity,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['entities'] });
  },
});
```

### Query Key Structure

Hierarchical query keys for efficient invalidation:

```typescript
['dashboard', 'overview', userId]
['dashboard', 'tasks', userId]
['tasks', userId, filters]
['tasks', 'detail', taskId]
['habits', userId]
['habits', 'entries', habitId, dateRange]
['moods', userId, dateRange]
['journal', userId, filters]
['countdowns', userId]
['analytics', userId, timeRange]
['spaces', userId]
['tags', userId]
```

---

## API Endpoints Summary

### Dashboard
```
GET    /users/:user_id/today/overview       # Dashboard summary
GET    /users/:user_id/today/tasks          # Today's tasks
```

### Tasks
```
POST   /tasks                                # Create task
GET    /users/:user_id/tasks                 # List tasks
GET    /tasks/:id                            # Get task
PUT    /tasks/:id                            # Update task
DELETE /tasks/:id                            # Delete task
PUT    /tasks/:id/status                     # Update status
POST   /tasks/:id/snooze                     # Snooze task
```

### Habits
```
POST   /habits                               # Create habit
GET    /users/:user_id/habits                # List habits
GET    /habits/:id                           # Get habit
PUT    /habits/:id                           # Update habit
DELETE /habits/:id                           # Delete habit
POST   /habit-entries                        # Log completion
GET    /habits/:id/entries                   # Get entries
GET    /habits/:id/stats                     # Get statistics
```

### Moods
```
POST   /moods                                # Log mood
GET    /users/:user_id/moods                 # List moods
GET    /moods/:id                            # Get mood
PUT    /moods/:id                            # Update mood
DELETE /moods/:id                            # Delete mood
GET    /users/:user_id/moods/stats           # Get statistics
GET    /users/:user_id/moods/trends          # Get trends
```

### Journal
```
POST   /journal                              # Create entry
GET    /users/:user_id/journal               # List entries
GET    /journal/:id                          # Get entry
PUT    /journal/:id                          # Update entry
DELETE /journal/:id                          # Delete entry
GET    /users/:user_id/journal/search        # Search entries
GET    /users/:user_id/journal/stats         # Get statistics
```

### Countdowns
```
POST   /countdowns                           # Create countdown
GET    /users/:user_id/countdowns            # List countdowns
GET    /countdowns/:id                       # Get countdown
PUT    /countdowns/:id                       # Update countdown
DELETE /countdowns/:id                       # Delete countdown
```

### Analytics
```
GET    /users/:user_id/analytics/summary     # Overview
GET    /users/:user_id/analytics/tasks       # Task analytics
GET    /users/:user_id/analytics/habits      # Habit analytics
GET    /users/:user_id/analytics/moods       # Mood analytics
GET    /users/:user_id/analytics/journal     # Journal analytics
GET    /users/:user_id/analytics/correlations # Cross-metric
POST   /users/:user_id/analytics/export      # Export data
```

### Spaces
```
POST   /spaces                               # Create space
GET    /users/:user_id/spaces                # List spaces
GET    /spaces/:id                           # Get space
PUT    /spaces/:id                           # Update space
DELETE /spaces/:id                           # Delete space
GET    /spaces/:id/items                     # Get all items in space
```

### Tags
```
POST   /tags                                 # Create tag
GET    /users/:user_id/tags                  # List tags
GET    /tags/:id                             # Get tag
PUT    /tags/:id                             # Update tag
DELETE /tags/:id                             # Delete tag
POST   /tags/merge                           # Merge tags
GET    /users/:user_id/tags/analytics        # Tag analytics
```

---

## Common Data Models

### Task
```typescript
interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'completed' | 'snoozed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string; // YYYY-MM-DD
  snooze_until?: string; // YYYY-MM-DD
  space_id?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}
```

### Habit
```typescript
interface Habit {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  target: number; // times per period
  status: 'active' | 'paused' | 'archived';
  space_id?: string;
  created_at: string;
  updated_at: string;
}

interface HabitEntry {
  id: string;
  habit_id: string;
  date: string; // YYYY-MM-DD
  count: number;
  note?: string;
  created_at: string;
}
```

### Mood
```typescript
interface Mood {
  id: string;
  user_id: string;
  value: number; // 1-10
  context?: string;
  trigger?: string;
  timestamp: string; // ISO 8601
  created_at: string;
  updated_at: string;
}
```

### Journal Entry
```typescript
interface JournalEntry {
  id: string;
  user_id: string;
  title?: string;
  content: string; // HTML or Markdown
  privacy: 'private' | 'public';
  word_count: number;
  space_id?: string;
  is_favorite: boolean;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}
```

### Countdown
```typescript
interface Countdown {
  id: string;
  user_id: string;
  event_name: string;
  event_date: string; // YYYY-MM-DD
  description?: string;
  color: string;
  is_active: boolean;
  is_completed: boolean;
  space_id?: string;
  created_at: string;
  updated_at: string;
}
```

### Space
```typescript
interface Space {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  color: string; // hex
  icon: string; // Lucide icon name
  created_at: string;
  updated_at: string;
}
```

### Tag
```typescript
interface Tag {
  id: string;
  user_id: string;
  name: string;
  color?: string; // hex
  description?: string;
  created_at: string;
  updated_at: string;
}
```

---

## Validation Rules

### Common Validations

**UUID Validation:**
```typescript
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isValidUUID(value: string): boolean {
  return UUID_REGEX.test(value);
}
```

**Date Validation:**
```typescript
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function isValidDate(value: string): boolean {
  if (!DATE_REGEX.test(value)) return false;
  const date = new Date(value);
  return date instanceof Date && !isNaN(date.getTime());
}
```

**String Length:**
```typescript
function validateStringLength(
  value: string,
  min: number,
  max: number
): ValidationResult {
  const length = value.trim().length;
  if (length < min) {
    return { valid: false, error: `Minimum length is ${min}` };
  }
  if (length > max) {
    return { valid: false, error: `Maximum length is ${max}` };
  }
  return { valid: true };
}
```

### Entity-Specific Validations

**Task:**
- title: 1-200 characters
- description: 0-2000 characters
- status: enum validation
- priority: enum validation
- due_date: valid date format

**Habit:**
- name: 1-100 characters
- target: 1-100
- frequency: enum validation

**Mood:**
- value: integer 1-10
- context: 0-500 characters

**Journal:**
- title: 0-200 characters
- content: 1-100000 characters
- privacy: enum validation

---

## Error Handling Standards

### Error Response Format
```typescript
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
    timestamp: string;
  };
}
```

### Common Error Codes
```typescript
const ERROR_CODES = {
  // Authentication & Authorization
  UNAUTHORIZED: 'auth/unauthorized',
  FORBIDDEN: 'auth/forbidden',
  TOKEN_EXPIRED: 'auth/token-expired',

  // Validation
  INVALID_INPUT: 'validation/invalid-input',
  MISSING_REQUIRED: 'validation/missing-required',
  INVALID_FORMAT: 'validation/invalid-format',

  // Resources
  NOT_FOUND: 'resource/not-found',
  ALREADY_EXISTS: 'resource/already-exists',
  CONFLICT: 'resource/conflict',

  // Rate Limiting
  RATE_LIMIT_EXCEEDED: 'rate-limit/exceeded',

  // Server
  INTERNAL_ERROR: 'server/internal-error',
  SERVICE_UNAVAILABLE: 'server/unavailable',
  DATABASE_ERROR: 'server/database-error',
};
```

### Frontend Error Handling

```typescript
// Error boundary for component errors
<ErrorBoundary fallback={<ErrorFallback />}>
  <Component />
</ErrorBoundary>

// API error handling with React Query
const { data, error } = useQuery({
  queryKey: ['tasks'],
  queryFn: fetchTasks,
  retry: (failureCount, error) => {
    // Don't retry on 4xx errors
    if (error.status >= 400 && error.status < 500) {
      return false;
    }
    return failureCount < 3;
  },
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
});

// Display errors to user
if (error) {
  toast.error(error.message || 'Something went wrong');
}
```

---

## Performance Optimization Strategies

### Backend
1. **Database Indexing** - Strategic indexes on frequently queried columns
2. **Query Optimization** - Use EXPLAIN ANALYZE, avoid N+1 queries
3. **Connection Pooling** - Reuse database connections
4. **Caching** - Redis for frequently accessed data (future)
5. **Pagination** - Limit result sets, use cursor pagination

### Frontend
1. **Code Splitting** - Lazy load routes and heavy components
2. **Memoization** - React.memo, useMemo, useCallback
3. **Virtual Scrolling** - For long lists (100+ items)
4. **Image Optimization** - Lazy loading, WebP format, responsive images
5. **Bundle Size** - Tree shaking, analyze with vite-bundle-visualizer

### React Query Optimization
```typescript
// Prefetch data on hover
const prefetchTask = (taskId: string) => {
  queryClient.prefetchQuery({
    queryKey: ['tasks', 'detail', taskId],
    queryFn: () => client.getTask({ id: taskId }),
  });
};

<TaskCard
  onMouseEnter={() => prefetchTask(task.id)}
  onClick={() => navigate(`/tasks/${task.id}`)}
/>
```

---

## Testing Strategy

### Unit Tests (90%+ coverage target)
- All utility functions
- All validation functions
- All business logic functions
- React component rendering
- React hooks

### Integration Tests
- API endpoint flows
- Component interactions
- Form submissions
- Navigation flows

### End-to-End Tests
- Critical user journeys
- Task creation → completion
- Habit tracking flow
- Mood logging flow
- Journal entry creation

### Performance Tests
- Page load times
- API response times
- Database query performance
- Frontend rendering performance

### Test Tools
- **Unit:** Vitest, React Testing Library
- **Integration:** Vitest, MSW (Mock Service Worker)
- **E2E:** Playwright or Cypress
- **Performance:** Lighthouse, WebPageTest

---

## Deployment Pipeline

### Development
```bash
# Backend
cd backend
encore run

# Frontend
cd frontend
bun run dev
```

### Staging
```bash
# Backend
encore deploy --env staging

# Frontend
bun run build
# Deploy to staging environment
```

### Production
```bash
# Backend
encore deploy --env production

# Frontend
bun run build
# Deploy to CDN/hosting
```

### Post-Deployment Checklist
- [ ] Verify all API endpoints respond
- [ ] Check database migrations applied
- [ ] Test critical user flows
- [ ] Verify monitoring/logging active
- [ ] Check error rates
- [ ] Performance monitoring
- [ ] Security scan

---

## Monitoring & Observability

### Metrics to Track
- API response times (p50, p95, p99)
- Error rates by endpoint
- Database query performance
- Frontend page load times
- User engagement metrics
- Query cache hit rates

### Logging
```typescript
// Structured logging format
{
  timestamp: '2025-11-15T10:30:00Z',
  level: 'info' | 'warn' | 'error',
  service: 'api' | 'frontend',
  message: 'Description',
  context: {
    userId: 'user-123',
    endpoint: '/tasks',
    duration: 150,
  },
  error: { // if applicable
    message: 'Error message',
    stack: 'Stack trace',
  }
}
```

### Alerts
- API error rate > 5%
- P95 response time > 1s
- Database connection pool exhausted
- Memory usage > 80%
- Disk usage > 80%

---

## Security Considerations

### Authentication
- JWT tokens with expiration
- Refresh token rotation
- Secure token storage (httpOnly cookies)

### Authorization
- User-scoped data access
- Role-based access control (future)
- API endpoint permissions

### Data Protection
- HTTPS everywhere
- Input sanitization
- SQL injection prevention (parameterized queries)
- XSS prevention (DOMPurify for user content)
- CSRF protection

### Privacy
- Data encryption at rest (database)
- Data encryption in transit (TLS)
- User data export capability
- User data deletion capability
- Privacy-first mood/journal data handling

---

## Accessibility Standards

Target: **WCAG 2.1 AA compliance**

### Requirements
- Semantic HTML
- ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader compatibility
- Color contrast ratios (4.5:1 minimum)
- Focus indicators
- Skip links for navigation
- Alt text for images

### Testing Tools
- axe DevTools
- WAVE browser extension
- Screen reader testing (NVDA, VoiceOver)
- Keyboard-only navigation testing

---

## Documentation Standards

### Code Comments
```typescript
/**
 * Calculates the current streak for a habit.
 *
 * @param habit - The habit to calculate streak for
 * @param entries - All habit entries, sorted by date (newest first)
 * @returns Streak information including current and best streaks
 *
 * @example
 * const streak = calculateStreak(habit, entries);
 * // { current: 7, best: 15, startDate: '2025-11-08' }
 */
function calculateStreak(habit: Habit, entries: HabitEntry[]): StreakInfo {
  // Implementation
}
```

### API Documentation
- OpenAPI/Swagger specs
- Request/response examples
- Error response examples
- Authentication requirements
- Rate limiting info

---

## Additional Functional Specs

For detailed implementation guides for each feature:

1. **[Dashboard Functional Spec](./01-dashboard-functional-spec.md)** ✅
2. **Tasks Functional Spec** (To be created)
3. **Habits Functional Spec** (To be created)
4. **Moods Functional Spec** (To be created)
5. **Journal Functional Spec** (To be created)
6. **Countdowns Functional Spec** (To be created)
7. **Analytics Functional Spec** (To be created)
8. **Spaces Functional Spec** (To be created)
9. **Tags Functional Spec** (To be created)

---

## Quick Reference

### Common Commands
```bash
# Development
bun run dev              # Start frontend dev server
encore run               # Start backend dev server

# Testing
bun test                 # Run frontend tests
bun test:coverage        # Run tests with coverage
encore test              # Run backend tests

# Building
bun run build            # Build frontend
encore build             # Build backend

# Deployment
encore deploy            # Deploy backend
# Frontend deployment varies by hosting

# Database
encore db shell          # Access database shell
encore db migrate        # Run migrations
```

### Environment Variables
```bash
# Backend (.env)
DATABASE_URL=postgresql://...
JWT_SECRET=...
API_URL=http://localhost:4000

# Frontend (.env)
VITE_API_URL=http://localhost:4000
```

---

## Contributing

When implementing features:
1. Read the corresponding PRD for context
2. Follow this functional spec for technical details
3. Write tests first (TDD recommended)
4. Implement feature with proper error handling
5. Add accessibility features
6. Update documentation
7. Submit PR with tests passing

---

## Support & Questions

For technical questions or clarifications on functional specifications:
- Review the corresponding PRD for context
- Check the implementation checklist
- Refer to code examples in this document
- Open an issue in the repository

---

**Last Updated:** 2025-11-15
**Version:** 1.0
**Status:** Active Development

---

**End of Functional Specifications Index**
