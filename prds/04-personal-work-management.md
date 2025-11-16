# PRD: Personal Work Management

## Document Information
- **Version**: 1.0
- **Last Updated**: 2025-11-15
- **Owner**: ATLAS Development Team
- **Status**: Active

## Executive Summary

The Personal Work Management module provides a personalized view of the user's assigned JIRA tickets, tracking personal testing history, maintaining personal notes, and offering customized insights based on individual work patterns and preferences.

## Problem Statement

Testers need a personalized workspace that:
- Shows only their assigned tickets, not the entire project backlog
- Tracks their individual testing history and patterns
- Allows private notes on tickets without cluttering JIRA
- Provides personalized statistics and insights
- Adapts to their individual testing style and speed
- Works both online (live JIRA) and offline (cached data)

## Goals & Objectives

### Primary Goals
1. Provide a personalized view of assigned JIRA tickets
2. Enable personal note-taking on tickets
3. Track individual testing history and patterns
4. Generate personalized statistics and insights
5. Support offline work with cached data

### Success Metrics
- **My Work Accuracy**: 100% of user's assigned tickets displayed
- **Note Adoption**: 60% of tickets have personal notes
- **Personalization Value**: 70% of users find personalized stats useful
- **Offline Capability**: 100% functionality when JIRA offline (with cache)
- **Response Time**: < 1 second to load My Work page

## User Stories

### Epic: My Work View
- **US-031**: As a tester, I want to see only my assigned tickets so I can focus on my work
- **US-032**: As a tester, I want to filter by status (In Progress, Done) so I can organize my queue
- **US-033**: As a tester, I want to see ticket priority so I can work on critical items first
- **US-034**: As a tester, I want to toggle between live JIRA and cached data so I can work offline

### Epic: Personal Notes
- **US-035**: As a tester, I want to add private notes to tickets so I can remember context
- **US-036**: As a tester, I want to rate ticket difficulty so I can track challenging areas
- **US-037**: As a tester, I want to see my notes displayed with tickets so I have quick reference
- **US-038**: As a tester, I want to search my notes so I can find past insights

### Epic: Personal Statistics
- **US-039**: As a tester, I want to see my testing statistics so I can track my productivity
- **US-040**: As a tester, I want to see my most tested components so I can identify expertise areas
- **US-041**: As a tester, I want to compare my stats to my historical average so I can see improvement
- **US-042**: As a tester, I want to see my testing patterns so I can optimize my workflow

### Epic: Personalized Insights
- **US-043**: As a tester, I want personalized time estimates based on my speed so estimates are accurate for me
- **US-044**: As a tester, I want recommendations based on my past work so they're relevant to my style
- **US-045**: As a tester, I want to see which patterns I use most so I can refine them

## Functional Requirements

### FR-301: My Work Ticket List
- **Priority**: P0 (Critical)
- **Description**: Display user's assigned JIRA tickets
- **Acceptance Criteria**:
  - Show tickets where `assignee = current_user`
  - Support both projects (WRKA, WMB)
  - Display fields: key, summary, status, priority, updated_at
  - Default sort: priority DESC, updated_at DESC
  - Toggle between live JIRA and cached data
  - Refresh indicator when fetching live data
  - Graceful fallback to cache if JIRA unavailable

### FR-302: Status & Priority Filtering
- **Priority**: P1 (High)
- **Description**: Filter tickets by status and priority
- **Acceptance Criteria**:
  - Status filters: All, To Do, In Progress, Done, Blocked
  - Priority filters: All, Critical, High, Medium, Low
  - Multi-select filters (OR logic)
  - Filter state persists in session
  - Update counts when filters applied
  - Clear all filters button

### FR-303: Live vs Cached Data Toggle
- **Priority**: P1 (High)
- **Description**: Switch between real-time JIRA and local cache
- **Acceptance Criteria**:
  - Toggle switch: "Live Mode" (default: OFF)
  - Live mode: Fetch from JIRA MCP Service
  - Cached mode: Fetch from local database
  - Show data source indicator (Live/Cached)
  - Show last sync timestamp
  - Auto-fallback to cache if live fails
  - Manual refresh button

### FR-304: Personal Note Creation
- **Priority**: P0 (Critical)
- **Description**: Add private notes to tickets
- **Acceptance Criteria**:
  - Note text field (max 2000 characters)
  - Markdown support for formatting
  - Auto-save on blur or 5-second idle
  - Show last updated timestamp
  - Version history (optional)
  - Notes stored in `ticket_notes` table
  - Notes private to user (not synced to JIRA)

### FR-305: Difficulty Rating
- **Priority**: P1 (High)
- **Description**: Rate ticket difficulty for personal tracking
- **Acceptance Criteria**:
  - 1-5 star rating system
  - 1 = Very Easy, 5 = Very Hard
  - Click to rate, click again to change
  - Show average difficulty by component
  - Filter tickets by difficulty
  - Use in personalized time estimates

### FR-306: Personal Testing History
- **Priority**: P1 (High)
- **Description**: Track user's testing history
- **Acceptance Criteria**:
  - Query tickets where assignee = user
  - Filter by date range (last week, month, all time)
  - Show completion dates
  - Display test sessions per ticket
  - Show predictions used and accuracy
  - Export history as CSV

### FR-307: Personal Statistics Dashboard
- **Priority**: P1 (High)
- **Description**: Display personalized testing statistics
- **Acceptance Criteria**:
  - Metrics displayed:
    - Total tickets tested (lifetime)
    - Tickets this week/month
    - Average time per ticket
    - Most tested component
    - Prediction usage rate
    - Prediction acceptance rate
    - Current streak (consecutive days)
    - Favorite coach personality
  - Comparison to historical average
  - Trend indicators (↑↓)
  - Refresh in real-time

### FR-308: Component Expertise Tracking
- **Priority**: P2 (Medium)
- **Description**: Identify user's component expertise
- **Acceptance Criteria**:
  - Count tickets tested per component
  - Calculate average time per component
  - Calculate success rate per component
  - Display expertise levels: Novice (<10), Intermediate (10-25), Expert (>25)
  - Recommend tickets matching expertise
  - Suggest training for weak areas

### FR-309: Personalized Time Estimates
- **Priority**: P1 (High)
- **Description**: Adjust time estimates based on user's speed
- **Acceptance Criteria**:
  - Track actual time per ticket (from sessions)
  - Calculate user's speed factor vs average
  - Adjust predictions: `base_estimate * user_speed_factor`
  - Learn over time (more data = more accurate)
  - Separate speed factor per component
  - Min 10 tickets before personalizing

### FR-310: Quick Stats Widget
- **Priority**: P2 (Medium)
- **Description**: Dashboard widget with at-a-glance stats
- **Acceptance Criteria**:
  - Display on dashboard and my work pages
  - Metrics: tickets today, time today, current streak
  - Visual indicators (progress bars, icons)
  - Click to expand full stats
  - Real-time updates
  - Configurable metrics (user preference)

## Non-Functional Requirements

### Performance
- **NFR-301**: Load My Work page in < 1 second
- **NFR-302**: Personal stats calculation < 500ms
- **NFR-303**: Note auto-save < 200ms
- **NFR-304**: Support up to 10,000 personal tickets

### Usability
- **NFR-305**: Intuitive UI matching JIRA's UX patterns
- **NFR-306**: Mobile-responsive design
- **NFR-307**: Keyboard shortcuts for common actions
- **NFR-308**: Accessibility: WCAG 2.1 Level AA compliance

### Privacy
- **NFR-309**: Personal notes never synced to JIRA
- **NFR-310**: Notes encrypted at rest (optional)
- **NFR-311**: User data isolated (single-user app)

### Reliability
- **NFR-312**: 100% functionality in offline mode (with cache)
- **NFR-313**: No data loss on note auto-save
- **NFR-314**: Graceful handling of JIRA API failures

## Technical Architecture

### Data Flow

```
My Work Page
    ↓
PersonalWorkService.get_my_work(live=True/False)
    ↓
if live:
    JiraMCPService.get_assigned_tickets(user)
        ↓
    Cache tickets in local DB
else:
    TicketRepository.get_by_assignee(user)
    ↓
PersonalWorkService.enrich_with_notes(tickets)
    ↓
ticket_notes table (LEFT JOIN)
    ↓
Return enriched tickets
```

### Personal Statistics Calculation

```python
def calculate_personal_stats(user_id, period='week'):
    # Get user's tickets in period
    tickets = TicketRepository.get_by_assignee_and_period(user_id, period)

    # Get user's sessions
    sessions = SessionRepository.get_by_user_and_period(user_id, period)

    stats = {
        'total_tickets': len(tickets),
        'total_time_minutes': sum(s.duration_minutes for s in sessions),
        'avg_time_per_ticket': total_time / total_tickets,

        'components': count_by_component(tickets),
        'most_tested_component': max(components, key=lambda x: x.count),

        'predictions_used': count_predictions_used(sessions),
        'predictions_accepted': count_predictions_accepted(sessions),
        'prediction_acceptance_rate': accepted / used,

        'current_streak': calculate_streak(sessions),
        'longest_streak': get_longest_streak(user_id),

        'difficulty_ratings': get_avg_difficulty_by_component(user_id)
    }

    # Compare to historical average
    historical = calculate_personal_stats(user_id, period='all')
    stats['comparison'] = {
        'tickets_vs_avg': stats['total_tickets'] / (historical['total_tickets'] / weeks_active),
        'time_vs_avg': stats['avg_time_per_ticket'] / historical['avg_time_per_ticket']
    }

    return stats
```

## Data Models

### ticket_notes Table
```sql
CREATE TABLE ticket_notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    jira_ticket_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    note TEXT,                       -- Markdown supported
    difficulty_rating INTEGER,       -- 1-5
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(jira_ticket_id, user_id),
    FOREIGN KEY (jira_ticket_id) REFERENCES jira_tickets(id),
    FOREIGN KEY (user_id) REFERENCES user_profiles(id)
);
```

### Personal Stats JSON Response
```json
{
    "user": "Kayla Gilbert",
    "period": "week",
    "stats": {
        "total_tickets": 23,
        "total_time_minutes": 1140,
        "avg_time_per_ticket": 49.6,
        "components": {
            "MHIS": {"count": 12, "avg_time": 45},
            "Workflow": {"count": 8, "avg_time": 55},
            "Permissions": {"count": 3, "avg_time": 40}
        },
        "most_tested_component": "MHIS",
        "predictions_used": 18,
        "predictions_accepted": 15,
        "prediction_acceptance_rate": 0.83,
        "current_streak": 5,
        "longest_streak": 14,
        "xp_earned": 230,
        "level": 8
    },
    "comparison": {
        "tickets_vs_avg": 1.15,      // 15% above average
        "time_vs_avg": 0.92,         // 8% faster than average
        "trend": "improving"
    },
    "insights": [
        "You're testing 15% more tickets than your average!",
        "Your MHIS expertise is growing - average time decreased by 10%",
        "5-day streak - keep it going!"
    ]
}
```

## UI Components

### My Work Page Layout
```
┌─────────────────────────────────────────────────┐
│  My Work                              Live Mode ⚡│
├─────────────────────────────────────────────────┤
│  Filters:  [All Statuses ▼] [All Priorities ▼]  │
│           [Clear Filters]                        │
├─────────────────────────────────────────────────┤
│  Quick Stats: 3 today | 23 this week | 5 streak │
├─────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────┐  │
│  │ WRKA-1234  [High]  In Progress            │  │
│  │ Update MHIS form validation               │  │
│  │                                            │  │
│  │ My Notes: [Click to add notes...]         │  │
│  │ Difficulty: ⭐⭐⭐☆☆                         │  │
│  │                                            │  │
│  │ [Analyze] [View in JIRA]                  │  │
│  └───────────────────────────────────────────┘  │
│                                                  │
│  [Load More...]                                  │
└─────────────────────────────────────────────────┘
```

### Personal Stats Widget
```
┌─────────────────────────────┐
│  Your Stats (This Week)     │
├─────────────────────────────┤
│  📊 23 tickets  (+15% ↑)    │
│  ⏱️  19 hours   (-8% ↓)     │
│  🎯 83% accuracy             │
│  🔥 5 day streak             │
│  ⭐ Level 8 (230 XP)         │
├─────────────────────────────┤
│  Top Component: MHIS (12)   │
│  [View Full Stats →]         │
└─────────────────────────────┘
```

## Personalization Features

### 1. Speed Factor Calculation
```python
def calculate_speed_factor(user_id):
    # Get user's average time per ticket
    user_avg = SessionRepository.get_avg_duration(user_id)

    # Get global average time per ticket
    global_avg = SessionRepository.get_avg_duration(all_users=True)

    # Speed factor: user_avg / global_avg
    # < 1.0 = faster than average
    # > 1.0 = slower than average
    speed_factor = user_avg / global_avg

    return speed_factor
```

### 2. Component-Specific Speed
```python
def calculate_component_speed(user_id, component):
    user_component_avg = SessionRepository.get_avg_duration(
        user_id=user_id,
        component=component
    )

    global_component_avg = SessionRepository.get_avg_duration(
        component=component
    )

    return user_component_avg / global_component_avg
```

### 3. Personalized Recommendations
```python
def get_personalized_recommendations(user_id, ticket):
    # Get user's component expertise
    expertise = get_component_expertise(user_id)

    # Get user's preferred patterns
    preferred_patterns = get_most_used_patterns(user_id, limit=5)

    # Adjust prediction weights
    if ticket.component in expertise['expert_components']:
        # User is expert - suggest advanced scenarios
        predictions = PredictionService.predict(
            ticket,
            difficulty_level='advanced'
        )
    else:
        # User is learning - suggest foundational scenarios
        predictions = PredictionService.predict(
            ticket,
            difficulty_level='beginner'
        )

    # Boost preferred patterns
    for pred in predictions:
        if pred.pattern_id in preferred_patterns:
            pred.confidence += 5  # Slight boost

    return predictions
```

## Out of Scope

- **Multi-User Collaboration**: Single-user app, no shared notes or collaboration
- **JIRA Write Operations**: Cannot update JIRA from ATLAS
- **Calendar Integration**: No Outlook/Google Calendar sync
- **Email Notifications**: No email alerts for assigned tickets
- **Mobile App**: Web-only, no native mobile app

## Implementation Phases

### Phase 1: Basic My Work (Week 1)
- PersonalWorkService implementation
- My Work API endpoints
- My Work page UI
- Live/cached toggle

### Phase 2: Personal Notes (Week 2)
- ticket_notes table
- Note CRUD operations
- Note UI components
- Auto-save functionality

### Phase 3: Personal Statistics (Week 3)
- Stats calculation algorithms
- Stats API endpoints
- Stats dashboard UI
- Quick stats widget

### Phase 4: Personalization (Week 4)
- Speed factor calculation
- Component expertise tracking
- Personalized recommendations
- Insights generation

## Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Notes not saved due to crashes | High | Low | Auto-save every 5 seconds, local storage backup |
| Inaccurate personalization with low data | Medium | High | Require minimum 10 tickets before personalizing |
| Offline mode out of sync | Medium | Medium | Show last sync time, manual refresh button |
| Privacy concerns with notes | High | Low | Clear documentation, optional encryption |

## Acceptance Criteria

### Definition of Done
- [ ] All functional requirements implemented
- [ ] My Work page loads in < 1 second
- [ ] Personal notes save reliably (0 data loss)
- [ ] Stats accurate to within 1%
- [ ] Unit test coverage > 80%
- [ ] UI/UX review approved
- [ ] Documentation complete
- [ ] Code review approved

## Appendices

### A. API Endpoints
```
GET  /api/atlas/personal/my-work?live=true
GET  /api/atlas/personal/my-stats?period=week
GET  /api/atlas/personal/my-patterns
GET  /api/atlas/personal/my-recent?limit=10
GET  /api/atlas/personal/ticket/:id/notes
POST /api/atlas/personal/ticket/:id/notes
GET  /api/atlas/personal/quick-stats
```

### B. Related Documentation
- [Personal Features Spec](/docs/personal-features-spec.md)
- [Personal Features Implementation](/docs/personal-features-implementation.md)
