# JIRA Filter Wrapper - SPARC (Specification & Product Requirements)

**Feature Area:** JIRA Filter Visualization & Management
**Version:** 1.0
**Last Updated:** 2025-01-22
**Status:** In Development
**Type:** Single-User JIRA Filter Interface

---

## Overview

A modern, single-user JIRA filter wrapper that pulls in JIRA filters and displays them in multiple view modes. Designed for personal use to visualize and manage JIRA filters with a clean, distraction-free interface.

## Problem Statement

JIRA's native interface can be overwhelming and lacks flexible visualization options. Users need:

- **Multiple view modes** - Different ways to visualize the same filter data
- **Clean interface** - Modern UI without JIRA's cluttered interface
- **Quick access** - Fast loading and navigation
- **Personal customization** - Save favorite filters and views
- **No sharing complexity** - Single-user focused, no collaboration overhead

## Goals

### Primary Goals
1. Connect to JIRA Cloud and retrieve user's saved filters
2. Display filter results in multiple view modes (list, board, timeline, table)
3. Provide fast, responsive interface for viewing tickets
4. Support custom JQL queries
5. Maintain single-user, local-first architecture

### Secondary Goals
1. Cache filter results locally
2. Support multiple JIRA instances
3. Quick filter switching
4. Ticket detail views
5. Export capabilities

## User Stories

### Epic: JIRA Connection
- As a user, I can connect to my JIRA instance
- As a user, I can authenticate with API token
- As a user, I can see connection status
- As a user, I can disconnect and reconnect

### Epic: Filter Management
- As a user, I can view all my saved JIRA filters
- As a user, I can select a filter to view its results
- As a user, I can create custom JQL queries
- As a user, I can save favorite filters locally
- As a user, I can refresh filter results

### Epic: Multiple View Modes
- As a user, I can view tickets in a list view
- As a user, I can view tickets in a board view (by status)
- As a user, I can view tickets in a table view (sortable columns)
- As a user, I can view tickets in a timeline view (by date)
- As a user, I can switch between views quickly

### Epic: Ticket Details
- As a user, I can click a ticket to see full details
- As a user, I can see ticket description, comments, and history
- As a user, I can open ticket in JIRA (external link)
- As a user, I can see ticket metadata (assignee, priority, labels, etc.)

## Functional Requirements

### FR1: JIRA Authentication
**Priority:** P0 (Critical)

**Authentication Methods:**
- API Token (email + token)
- OAuth (future)

**Connection Management:**
```typescript
interface JiraConnection {
  instanceUrl: string;
  email: string;
  apiToken: string; // Stored securely in localStorage
  connected: boolean;
  lastConnected: Date;
}
```

**Features:**
- Save connection credentials (encrypted in localStorage)
- Test connection on setup
- Connection status indicator
- Reconnect functionality
- Support multiple instances (switch between)

### FR2: Filter Retrieval
**Priority:** P0 (Critical)

**Filter Structure:**
```typescript
interface JiraFilter {
  id: string;
  name: string;
  jql: string;
  owner: string;
  description?: string;
  favorite: boolean;
  sharePermissions?: any;
}
```

**Operations:**
- Fetch all user's saved filters from JIRA
- Fetch filter by ID
- Execute JQL query to get tickets
- Cache filter results locally
- Refresh filter results on demand

**API Endpoints:**
- `GET /rest/api/3/filter/search` - Get user's filters
- `GET /rest/api/3/filter/{id}` - Get specific filter
- `GET /rest/api/3/search?jql={jql}` - Execute JQL query

### FR3: Multiple View Modes
**Priority:** P0 (Critical)

**View Mode 1: List View**
- Simple list of tickets
- Show: Key, Summary, Status, Assignee, Priority
- Click to expand details
- Sortable by any column
- Filterable/searchable

**View Mode 2: Board View**
- Kanban-style board
- Columns by status (To Do, In Progress, Done, etc.)
- Drag-and-drop between columns (read-only, visual only)
- Show ticket cards with key, summary, assignee
- Color-coded by priority

**View Mode 3: Table View**
- Full table with all ticket fields
- Sortable columns
- Resizable columns
- Column visibility toggle
- Export to CSV

**View Mode 4: Timeline View**
- Grouped by date (created, updated, due date)
- Visual timeline representation
- Show ticket key, summary, status
- Filter by date range

**View Mode 5: Compact View**
- Minimal information density
- Quick scanning
- Show only essential fields
- High information density

### FR4: Ticket Display
**Priority:** P1 (High)

**Ticket Structure:**
```typescript
interface JiraTicket {
  key: string;
  summary: string;
  description?: string;
  status: string;
  priority: string;
  assignee?: string;
  reporter: string;
  issueType: string;
  project: string;
  labels: string[];
  components: string[];
  created: Date;
  updated: Date;
  dueDate?: Date;
  resolution?: string;
  url: string; // Link to JIRA
}
```

**Ticket Detail View:**
- Full ticket information
- Description (rendered HTML)
- Comments (if available)
- Change history (if available)
- Metadata display
- Link to open in JIRA

### FR5: Local Caching
**Priority:** P1 (High)

**Cache Strategy:**
- Cache filter results in localStorage
- Cache timestamp for each filter
- Configurable cache TTL (default: 5 minutes)
- Manual refresh option
- Cache invalidation on filter change

**Storage:**
```typescript
interface CachedFilter {
  filterId: string;
  tickets: JiraTicket[];
  cachedAt: Date;
  expiresAt: Date;
}
```

### FR6: Custom JQL Queries
**Priority:** P1 (High)

**Features:**
- JQL query input field
- Query validation
- Save custom queries locally
- Query history
- Pre-built query templates
- Syntax highlighting (future)

## Technical Specifications

### Technology Stack

**Frontend:**
- React 18+ with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Query for data fetching and caching
- LocalStorage for persistence

**JIRA Integration:**
- JIRA REST API v3
- Basic Auth (email + API token)
- JQL query execution
- Rate limiting handling

**UI Components:**
- Radix UI or Headless UI for accessible components
- Lucide React for icons
- Date-fns for date handling
- React DnD or @dnd-kit for board view drag-and-drop

### Component Architecture

```
src/
├── components/
│   ├── jira/
│   │   ├── ConnectionSetup.tsx
│   │   ├── ConnectionStatus.tsx
│   │   ├── FilterList.tsx
│   │   ├── FilterSelector.tsx
│   │   └── TicketCard.tsx
│   ├── views/
│   │   ├── ListView.tsx
│   │   ├── BoardView.tsx
│   │   ├── TableView.tsx
│   │   ├── TimelineView.tsx
│   │   └── CompactView.tsx
│   ├── ticket/
│   │   ├── TicketDetail.tsx
│   │   └── TicketMetadata.tsx
│   └── layout/
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── ViewToggle.tsx
├── hooks/
│   ├── useJira.ts
│   ├── useFilters.ts
│   ├── useTickets.ts
│   └── useLocalStorage.ts
├── lib/
│   ├── jira.ts
│   ├── storage.ts
│   └── utils.ts
└── types/
    └── index.ts
```

### Data Models

**JIRA Connection:**
```typescript
interface JiraConnection {
  id: string;
  instanceUrl: string;
  email: string;
  apiToken: string; // Encrypted
  name?: string; // User-friendly name
  connected: boolean;
  lastConnected: Date;
  createdAt: Date;
}
```

**Filter:**
```typescript
interface JiraFilter {
  id: string;
  name: string;
  jql: string;
  description?: string;
  owner: string;
  favorite: boolean;
  viewMode?: ViewMode; // Preferred view mode
  cached?: boolean;
}
```

**Ticket:**
```typescript
interface JiraTicket {
  key: string;
  id: string;
  summary: string;
  description?: string;
  status: {
    id: string;
    name: string;
    category: string; // 'todo' | 'inprogress' | 'done'
  };
  priority: {
    id: string;
    name: string;
    iconUrl?: string;
  };
  assignee?: {
    accountId: string;
    displayName: string;
    avatarUrl?: string;
  };
  reporter: {
    accountId: string;
    displayName: string;
    avatarUrl?: string;
  };
  issueType: {
    id: string;
    name: string;
    iconUrl?: string;
  };
  project: {
    id: string;
    key: string;
    name: string;
  };
  labels: string[];
  components: Array<{ id: string; name: string }>;
  created: Date;
  updated: Date;
  dueDate?: Date;
  resolution?: string;
  url: string;
}
```

## User Experience

### Design Principles

1. **Single User Focus**
   - No sharing buttons
   - No collaboration features
   - Personal preferences only

2. **Fast & Responsive**
   - Quick filter switching
   - Instant view mode changes
   - Optimistic UI updates
   - Loading states

3. **Modern Aesthetics**
   - Contemporary color palette
   - Smooth animations
   - Responsive design
   - Dark mode support

4. **Keyboard Navigation**
   - Full keyboard support
   - Quick shortcuts
   - Tab navigation
   - Focus indicators

### User Flows

**Connecting to JIRA:**
1. Enter JIRA instance URL
2. Enter email and API token
3. Test connection
4. Save connection
5. View available filters

**Viewing Filter Results:**
1. Select filter from list
2. Choose view mode
3. View tickets
4. Click ticket for details
5. Switch view modes as needed

**Custom Query:**
1. Click "New Query"
2. Enter JQL
3. Execute query
4. View results
5. Optionally save query locally

## Success Metrics

### Functional Metrics
- ✅ Users can connect to JIRA
- ✅ Users can view their filters
- ✅ Users can switch between view modes
- ✅ Tickets load and display correctly
- ✅ Data persists in localStorage

### Performance Metrics
- Filter list loads in < 2 seconds
- Ticket results load in < 3 seconds
- View mode switching is instant (< 100ms)
- Smooth 60fps animations

## Future Enhancements

### v1.1
- Multiple JIRA instance support
- Advanced filtering within results
- Column customization
- Export to CSV/Excel

### v1.2
- OAuth authentication
- Real-time updates (polling)
- Ticket comments display
- Change history visualization

### v2.0
- Custom view modes
- Saved view configurations
- Dashboard with multiple filters
- Analytics and reporting

## Implementation Checklist

- [ ] Set up React + TypeScript + Vite project
- [ ] Configure Tailwind CSS
- [ ] Set up JIRA API client
- [ ] Implement authentication flow
- [ ] Build filter retrieval
- [ ] Create view mode components
- [ ] Implement ticket display
- [ ] Add local caching
- [ ] Build connection management
- [ ] Add keyboard navigation
- [ ] Implement smooth animations
- [ ] Add dark mode support
- [ ] Write documentation

## Open Questions

1. Should we support JIRA Server or only Cloud?
2. How long should cache TTL be?
3. Should we support write operations (future)?
4. What's the maximum number of tickets to display?
5. Should we paginate or load all at once?

---

## Related Documents

- [Design Decisions](../livejournal-clone/DESIGN_DECISIONS.md) - Shared design principles
- [JIRA Integration PRD](./01-jira-integration.md) - Reference for JIRA patterns

---

**Last Updated:** 2025-01-22
**Status:** Specification Complete, Implementation In Progress

