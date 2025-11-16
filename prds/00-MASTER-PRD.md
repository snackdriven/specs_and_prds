# Executive Dysfunction Center (EDC) - Master Product Requirements Document

**Version:** 1.0
**Last Updated:** 2025-11-15
**Status:** Living Document

---

## Executive Summary

The Executive Dysfunction Center (EDC) is a comprehensive productivity and mental wellness application specifically designed for individuals with ADHD and executive dysfunction challenges. Unlike generic productivity tools, EDC provides a neurodivergent-first interface that reduces cognitive load while maximizing flexibility and personalization.

## Product Vision

**Mission Statement:**
Empower neurodivergent individuals to manage their daily lives effectively through adaptive, ADHD-friendly tools that work with their brain, not against it.

**Core Philosophy:**
- **Flexibility Over Rigidity:** Multiple ways to view and interact with the same data
- **Progressive Disclosure:** Show what's needed, hide complexity until requested
- **Dopamine Design:** Celebration animations, streaks, and visual rewards
- **Context Awareness:** Smart defaults based on user behavior and patterns
- **Cross-Feature Integration:** Everything connects to everything else naturally

## Target Users

### Primary Persona: Sarah - Adult with ADHD
- **Age:** 28-45
- **Occupation:** Knowledge worker, creative professional, or entrepreneur
- **Challenges:**
  - Difficulty prioritizing tasks and estimating time
  - Forgetting habits and losing streaks
  - Overwhelmed by traditional productivity tools
  - Needs multiple views/perspectives on the same information
  - Benefits from visual cues and color coding
- **Goals:**
  - Complete important tasks consistently
  - Build sustainable habits
  - Track mental health patterns
  - Feel accomplished, not overwhelmed

### Secondary Persona: Alex - Neurodivergent Student
- **Age:** 18-25
- **Challenges:**
  - Balancing school, work, and social commitments
  - Tracking mood in relation to productivity
  - Managing multiple projects with dependencies
- **Goals:**
  - Stay on top of deadlines
  - Build healthy routines
  - Understand productivity patterns

## Product Principles

### 1. ADHD-First Design
Every interface decision prioritizes neurodivergent cognition:
- **Visual Hierarchy:** Spacing and typography over harsh colors
- **Cognitive Load Reduction:** Collapsible sections, progressive disclosure
- **Contextual Loading:** "Loading tasks..." vs generic "Loading..."
- **Recognition Over Recall:** Visual cues, color coding, icons

### 2. Multi-Modal Information Access
The same information accessible through multiple interfaces:
- Calendar view, list view, kanban board for tasks
- Daily/weekly/monthly views for habits
- Timeline, pattern analysis, mood graphs
- Agenda, day, week, month for calendar

### 3. Dopamine-Driven Engagement
Celebrate small wins to maintain motivation:
- Streak tracking with celebration animations
- Progress bars and completion percentages
- Achievement milestones
- Visual rewards (confetti, colors, animations)

### 4. Seamless Integration
Features connect naturally:
- Tasks link to calendar events
- Habits tracked in mood context
- Journal entries reference mood and tasks
- Countdowns connect to concerts, events, tasks
- Everything cross-references everything

### 5. Customization Without Complexity
Power users get depth, casual users get simplicity:
- Sensible defaults for immediate use
- Progressive customization options
- Theme system with 18+ themes
- Per-pane theme preferences
- Alternate naming for panes

## Product Architecture

### Core System: Multi-Pane Workspace

**Concept:** Andy Matuschak-style sliding pane interface
**Purpose:** Allow multiple contexts simultaneously visible without overwhelming cognitive load

**Key Features:**
- 16 pane types (tasks, calendar, habits, mood, journal, etc.)
- Drag-and-drop reordering
- Resizable panels (200-800px width)
- "Spine" minimization mode (32px width)
- Fullscreen/maximize mode
- Per-pane color themes
- Persistent configuration per user

**Technical Implementation:**
- `components/panes/PaneSystem.tsx` - Main orchestrator
- `components/panes/UnifiedSortablePane.tsx` - Individual panes
- `components/panes/content/` - 36+ content orchestrators
- localStorage persistence with user-specific keys
- TanStack Query for data synchronization

### Database Architecture

**Backend:** Supabase (PostgreSQL + Auth + Real-time)

**Security Model:** Row Level Security (RLS)
- All tables enforce user data isolation
- Policies based on `auth.uid() = user_id`
- No cross-user data leakage possible

**Schema Overview:**
- **23 Core Tables** covering all features
- **JSONB Fields** for flexible data (tags, preferences, context)
- **Composite Indexes** for performance (user_id + status, user_id + date)
- **Custom Types** for domain modeling (countdown_urgency, concert_status)

### Technology Stack

**Frontend:**
- React 18 + TypeScript 5.9 (strict mode)
- Vite (build tool)
- Tailwind CSS + Radix UI
- Framer Motion (animations)
- TanStack Query v5 (data fetching)

**State Management:**
- Server state: TanStack Query
- Client state: React Context
- UI state: localStorage (user-specific)
- Real-time: Supabase subscriptions

**Development:**
- Biome (linting + formatting)
- Playwright (E2E testing)
- TypeScript strict mode
- Cognitive complexity limits (≤15)

## Core Feature Areas

### 1. Task Management
**Purpose:** Comprehensive task tracking with dependencies, priorities, and hierarchies

**Key Capabilities:**
- Subtasks and parent-child hierarchies
- Task dependencies with cycle detection
- Priority levels (1-5)
- Time estimation and tracking
- Recurring tasks
- Tags and filtering
- Bulk operations
- Multiple views (list, kanban, focus mode)

**Database:** `tasks`, `task_dependencies`

### 2. Habit Tracking
**Purpose:** Build sustainable habits with streak tracking and analytics

**Key Capabilities:**
- Daily/weekly/custom frequency
- Automatic streak calculation
- Completion history
- Progress visualization
- Habit analytics
- Calendar integration

**Database:** `habits`, `habit_completions`

### 3. Mood Logging
**Purpose:** Track emotional patterns for mental health awareness

**Key Capabilities:**
- 1-10 customizable mood scale
- Energy level tracking (1-5)
- Stress level tracking (1-5)
- Contextual notes
- Pattern analysis
- Time-series visualization
- Integration with journal and tasks

**Database:** `mood_options`, `mood_entries`

### 4. Journal
**Purpose:** Reflective writing with templates and prompts

**Key Capabilities:**
- Template-based journaling
- Custom prompt system
- Mood context integration
- Word count tracking
- Public/private templates
- Calendar integration

**Database:** `journal_templates`, `journal_entries`

### 5. Calendar & Events
**Purpose:** Unified calendar with Google Calendar sync

**Key Capabilities:**
- Multiple views (day, week, month, agenda, 3-day, 2-week, workweek)
- Google Calendar bi-directional sync
- Task/habit/concert integration
- Recurring events
- Conflict resolution
- Event drag-and-drop
- CSV import

**Database:** `calendar_events`, `google_calendar_sync_settings`

### 6. Countdowns
**Purpose:** Track time until important events

**Key Capabilities:**
- Urgency levels (normal/soon/urgent/critical/expired)
- Progress visualization
- Linked to events, tasks, concerts
- Real-time updates
- Color customization

**Database:** `countdowns`

### 7. Concert Tracking
**Purpose:** Multi-stage concert planning and tracking

**Key Capabilities:**
- 9 status stages (would_need_tickets → ready_and_waiting)
- Venue management with drive times
- Supporting acts
- Calendar integration
- Notes and timing

**Database:** `concerts`, `venues`

### 8. RSS Feeds
**Purpose:** News and content aggregation

**Key Capabilities:**
- Multiple feed support
- Category organization
- Item caching
- Time filtering
- Custom preferences

**Database:** `rss_feeds`, `rss_items`, `rss_categories`, `rss_settings`

### 9. Dashboard
**Purpose:** At-a-glance overview of all activities

**Key Capabilities:**
- Personalized greeting
- Today's tasks preview
- Habit streak preview
- Mood logging widget
- Countdown widgets
- Quick notes
- Customizable layout

**Database:** `user_notes` + aggregated from all features

### 10. Settings & Integrations
**Purpose:** User preferences and external service connections

**Key Capabilities:**
- Profile customization
- Theme selection (18+ themes)
- Font and accessibility settings
- Google Calendar sync configuration
- Spotify integration
- Google Sheets integration
- Weather API integration
- Mood option customization

**Database:** `profiles`, `user_pane_settings`, `google_calendar_sync_settings`, `spotify_tokens`, `google_sheets_auth_tokens`

## Theme System

**Purpose:** Comprehensive theming with cognitive load optimization

**Themes Available:**
- System themes (light/dark)
- Named themes: Autumn, Bridge, Corporate, Cosmic Nebula, Cyberpunk, Glassmorphism, High Contrast, Kawaii, Mint, MySpace, Mystic Twilight, Sunrise, Sunset Glow, Terminal
- Custom themes
- Per-pane theme overrides

**Technical Implementation:**
- CSS custom properties
- Theme registry system
- Performance-optimized with lazy loading
- Accessibility compliance
- Modal-aware theme detection

**Files:**
- `lib/themes/` - 18+ theme definition files
- `lib/themes/design-tokens.ts` - Design system
- `lib/themes/registry.ts` - Theme configuration

## Integration Strategy

### Google Calendar
- **Type:** Bi-directional sync
- **Features:** OAuth 2.0, conflict resolution, multiple calendars
- **Sync Modes:** to-google, from-google, both
- **Frequency:** Configurable interval (default 15 minutes)

### Spotify
- **Type:** Read-only playback display
- **Features:** Now playing, playback controls, token management

### Google Sheets
- **Type:** Read-only data import
- **Features:** OAuth, data caching, table/widget display

### Weather (Tomorrow.io)
- **Type:** API integration
- **Features:** Current weather, forecasts, preference storage

## Data Export & Analytics

**Export Capabilities:**
- CSV export for all data types
- PDF generation for reports
- JSON backup/restore

**Analytics:**
- Task completion trends
- Habit streak visualizations
- Mood pattern analysis
- Cross-feature insights
- Time tracking reports

## Performance & Quality

### Performance Targets
- Initial load: <2 seconds
- Route transitions: <300ms
- Data mutations: <500ms
- Real-time updates: <1 second latency

### Code Quality Standards
- TypeScript strict mode
- Biome linting (cognitive complexity ≤15)
- 90%+ test coverage goal
- Accessibility compliance (WCAG 2.1 AA)
- Progressive Web App capabilities

### Development Protocol
**CRITICAL:** Always run `npm run qa:full` before commits
- TypeScript type checking
- Biome linting with auto-fixes
- Task completion validation
- Build verification

## Security & Privacy

### Authentication
- Supabase Auth (email/password)
- OAuth integrations (Google, Spotify)
- Secure credential storage system
- Token refresh management

### Data Protection
- Row Level Security (RLS) on all tables
- User data isolation
- Secure credential storage (`~/.edc-credentials/`)
- Environment variable separation (.env.local vs secure storage)

### Privacy
- No cross-user data access
- Optional analytics
- Data export capabilities
- User-controlled integrations

## Success Metrics

### User Engagement
- Daily active users (DAU)
- Weekly active users (WAU)
- Average session duration
- Panes per session
- Feature adoption rates

### Feature Usage
- Tasks created/completed per day
- Habit completion rate
- Mood log frequency
- Journal entries per week
- Calendar events synced

### User Satisfaction
- Task completion improvement
- Habit streak length
- User retention rate
- Feature satisfaction scores
- Net Promoter Score (NPS)

### Technical Health
- Error rate <0.1%
- Page load time <2s
- API response time <500ms
- Uptime >99.9%

## Roadmap Considerations

### Potential Future Features
- Mobile app (React Native)
- Collaborative spaces for shared tasks
- AI-powered task prioritization
- Voice input for quick capture
- Pomodoro timer integration
- Advanced analytics dashboard
- API for third-party integrations
- Export to external calendars (iCal)
- Medication tracking
- Sleep tracking integration

### Technical Debt
- Migrate remaining class components to hooks
- Consolidate duplicate utility functions
- Improve test coverage to 90%+
- Performance optimization for large datasets (1000+ tasks)
- Accessibility audit and improvements

## Documentation Strategy

### User Documentation
- Getting started guide
- Feature-specific tutorials
- Video walkthroughs
- FAQ and troubleshooting

### Developer Documentation
- Architecture overview (this document)
- API documentation
- Component patterns
- Database schema reference
- Testing guidelines
- Contribution guide

## Conclusion

EDC represents a comprehensive, ADHD-first approach to productivity and mental wellness. By combining flexible multi-pane workspace, deep feature integration, and neurodivergent-friendly design, EDC provides a unique solution that works with how ADHD brains actually function.

The architecture prioritizes maintainability, accessibility, and user customization while maintaining high performance and security standards. Every design decision supports the core mission: empowering neurodivergent individuals to thrive.

---

## Related Documents

- [Pane System PRD](./01-pane-system-prd.md)
- [Task Management PRD](./02-task-management-prd.md)
- [Habit Tracking PRD](./03-habit-tracking-prd.md)
- [Mood Logging PRD](./04-mood-logging-prd.md)
- [Journal PRD](./05-journal-prd.md)
- [Calendar PRD](./06-calendar-prd.md)
- [Countdowns PRD](./07-countdowns-prd.md)
- [Concerts PRD](./08-concerts-prd.md)
- [RSS Feeds PRD](./09-rss-feeds-prd.md)
- [Dashboard PRD](./10-dashboard-prd.md)
- [Settings & Integrations PRD](./11-settings-integrations-prd.md)
- [Theme System PRD](./12-theme-system-prd.md)
