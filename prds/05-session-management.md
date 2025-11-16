# PRD: Testing Session Management

## Document Information
- **Version**: 1.0
- **Last Updated**: 2025-11-15
- **Owner**: ATLAS Development Team
- **Status**: Active

## Executive Summary

The Testing Session Management module tracks testing sessions from start to finish, measuring time spent, test steps completed, breaks taken, and session outcomes. This data powers time estimates, productivity analytics, and continuous improvement of the prediction engine.

## Problem Statement

Testers need better time tracking and session management because:
- **Unknown Time Spent**: Don't know how long testing actually takes
- **Interrupted Sessions**: Breaks and interruptions make time tracking inaccurate
- **No Historical Data**: Can't improve estimates without actual time data
- **Lost Context**: Forgetting what was done when returning from breaks
- **Incomplete Sessions**: Starting tests but not finishing, losing valuable data

## Goals & Objectives

### Primary Goals
1. Track testing sessions with accurate start/end times
2. Measure time spent including break tracking
3. Record test steps completed during session
4. Link sessions to predictions for accuracy measurement
5. Provide session analytics for productivity insights

### Success Metrics
- **Session Completion Rate**: 90% of started sessions are completed
- **Time Accuracy**: Session duration within ±5% of actual time
- **Break Detection**: Automatic break detection with 95% accuracy
- **Data Completeness**: 100% of sessions have required data (duration, steps completed)
- **User Adoption**: 80% of ticket testing includes session tracking

## User Stories

### Epic: Session Lifecycle
- **US-046**: As a tester, I want to start a testing session when I begin work on a ticket so my time is tracked
- **US-047**: As a tester, I want to pause sessions when I take breaks so my actual testing time is accurate
- **US-048**: As a tester, I want to end sessions when done so my completion is recorded
- **US-049**: As a tester, I want to see my active session status so I know what I'm working on

### Epic: Time Tracking
- **US-050**: As a tester, I want automatic time tracking so I don't have to manually log hours
- **US-051**: As a tester, I want break time excluded from testing time so estimates are accurate
- **US-052**: As a tester, I want to see elapsed time during testing so I can pace myself
- **US-053**: As a tester, I want session duration to feed back into time estimates so they improve

### Epic: Session Analytics
- **US-054**: As a tester, I want to see my session history so I can review my productivity
- **US-055**: As a tester, I want to compare session time vs estimated time so I can improve planning
- **US-056**: As a tester, I want to see my average session length so I can schedule better
- **US-057**: As a tester, I want to identify my most productive times so I can optimize my schedule

### Epic: Prediction Integration
- **US-058**: As a user, I want sessions linked to predictions so accuracy can be measured
- **US-059**: As a user, I want actual time to update prediction estimates so they get more accurate
- **US-060**: As a user, I want to rate prediction usefulness during sessions so feedback is captured

## Functional Requirements

### FR-401: Start Testing Session
- **Priority**: P0 (Critical)
- **Description**: Begin a new testing session for a ticket
- **Acceptance Criteria**:
  - API: `POST /api/atlas/session/start`
  - Required params: `jira_ticket_id`
  - Optional params: `prediction_id` (if using predictions)
  - Record start timestamp (UTC)
  - Set status = 'active'
  - Check for existing active sessions (max 1 active per user)
  - Return session_id and start confirmation
  - UI: "Start Testing" button on ticket detail page

### FR-402: End Testing Session
- **Priority**: P0 (Critical)
- **Description**: Complete and close a testing session
- **Acceptance Criteria**:
  - API: `POST /api/atlas/session/end`
  - Required params: `session_id`
  - Optional params: `steps_completed`, `outcome` (passed/failed/blocked)
  - Record end timestamp (UTC)
  - Calculate duration: `end_time - start_time - break_time`
  - Set status = 'completed'
  - Update user stats (tickets tested, time spent)
  - Award XP if gamification enabled
  - Return session summary

### FR-403: Pause/Resume Session
- **Priority**: P1 (High)
- **Description**: Pause session for breaks, resume when returning
- **Acceptance Criteria**:
  - API: `POST /api/atlas/session/pause`
  - API: `POST /api/atlas/session/resume`
  - Record pause start time
  - Record resume time
  - Calculate break duration: `resume_time - pause_time`
  - Accumulate total break time
  - Support multiple pauses per session
  - UI: "Take Break" / "Resume Testing" buttons
  - Show pause duration in real-time

### FR-404: Automatic Break Detection
- **Priority**: P2 (Medium)
- **Description**: Auto-detect breaks based on inactivity
- **Acceptance Criteria**:
  - Detect inactivity threshold: 5 minutes
  - Auto-pause session after 5 minutes of inactivity
  - Prompt user on return: "You were away for 23 minutes. Count as break?"
  - User can confirm or edit break duration
  - Track inactivity using browser events (mousemove, keydown, focus)
  - Handle overnight sessions (auto-end after 12 hours)

### FR-405: Session Progress Tracking
- **Priority**: P1 (High)
- **Description**: Track progress during active sessions
- **Acceptance Criteria**:
  - Display elapsed time (real-time)
  - Display estimated remaining time
  - Show test steps completed vs total
  - Progress bar: % complete
  - Update every second (client-side)
  - Show time compared to estimate (on track / over time)

### FR-406: Session Data Recording
- **Priority**: P0 (Critical)
- **Description**: Store all session data for analytics
- **Acceptance Criteria**:
  - Fields recorded:
    - session_id, jira_ticket_id, prediction_id
    - started_at, ended_at, duration_minutes
    - break_count, break_time_minutes
    - steps_completed, steps_total
    - status (active/paused/completed/abandoned)
    - outcome (passed/failed/blocked/incomplete)
  - Store in `testing_sessions` table
  - Link to ticket and prediction via foreign keys
  - Never delete sessions (keep historical data)
  - Support session notes (optional text field)

### FR-407: Session History & Review
- **Priority**: P2 (Medium)
- **Description**: View past testing sessions
- **Acceptance Criteria**:
  - API: `GET /api/atlas/sessions?user_id=X&period=week`
  - Filter by: date range, status, ticket, outcome
  - Sort by: start time, duration, ticket
  - Pagination: 20 sessions per page
  - Display: ticket, start/end times, duration, outcome
  - Click to view detailed session record
  - Export to CSV

### FR-408: Session Analytics
- **Priority**: P1 (High)
- **Description**: Calculate session-based metrics
- **Acceptance Criteria**:
  - Average session duration (overall, per component)
  - Total sessions this week/month
  - Completion rate: completed / started
  - Average breaks per session
  - Most productive time of day (based on session speed)
  - Longest session, shortest session
  - Sessions with vs without predictions (comparison)

### FR-409: Prediction Accuracy Tracking
- **Priority**: P1 (High)
- **Description**: Measure prediction accuracy using session data
- **Acceptance Criteria**:
  - Compare estimated time vs actual session duration
  - Calculate accuracy: `1 - abs(estimated - actual) / estimated`
  - Track per prediction, per pattern, per component
  - Aggregate accuracy metrics
  - Feed back into prediction improvement
  - Display accuracy trend over time

### FR-410: Session Reminders & Auto-End
- **Priority**: P2 (Medium)
- **Description**: Prevent forgotten sessions
- **Acceptance Criteria**:
  - Reminder after 3 hours: "You've been testing for 3 hours. Take a break?"
  - Auto-end after 12 hours (assume session abandoned)
  - Prompt to end session when switching tickets
  - Notification if session left active overnight
  - Option to backdate end time

## Non-Functional Requirements

### Performance
- **NFR-401**: Session start/end operations < 200ms
- **NFR-402**: Real-time timer updates every 1 second (client-side)
- **NFR-403**: Session analytics calculation < 1 second
- **NFR-404**: Support 1000+ concurrent sessions (scalability)

### Reliability
- **NFR-405**: 0% data loss on session end
- **NFR-406**: Persist session state every 30 seconds (auto-save)
- **NFR-407**: Recover active sessions after browser crash
- **NFR-408**: Handle clock changes gracefully (DST, timezone)

### Usability
- **NFR-409**: Session controls always visible during testing
- **NFR-410**: One-click start/pause/end actions
- **NFR-411**: Clear visual feedback on session state
- **NFR-412**: Mobile-friendly session controls

### Data Integrity
- **NFR-413**: No overlapping sessions per user
- **NFR-414**: Session timestamps in UTC (consistent)
- **NFR-415**: Duration calculations accurate to the second
- **NFR-416**: Break time never exceeds session duration

## Technical Architecture

### Session State Machine

```
          [start]
             ↓
         ┌─────────┐
      ┌─→│ ACTIVE  │←─┐
      │  └────┬────┘  │
[resume]     │     [pause]
      │      ↓        │
      │  ┌─────────┐ │
      └──│ PAUSED  │─┘
         └────┬────┘
              │ [end]
              ↓
         ┌──────────┐
         │COMPLETED │
         └──────────┘
              ↑
              │ [auto-end after 12h]
         ┌──────────┐
         │ABANDONED │
         └──────────┘
```

### Session Lifecycle

```python
class Session:
    def start(self, ticket_id, prediction_id=None):
        session = {
            'id': generate_id(),
            'jira_ticket_id': ticket_id,
            'prediction_id': prediction_id,
            'started_at': utcnow(),
            'status': 'active',
            'break_periods': []
        }
        SessionRepository.create(session)
        return session

    def pause(self, session_id):
        session = SessionRepository.get(session_id)
        session['status'] = 'paused'
        session['break_periods'].append({
            'start': utcnow()
        })
        SessionRepository.update(session)

    def resume(self, session_id):
        session = SessionRepository.get(session_id)
        session['status'] = 'active'
        last_break = session['break_periods'][-1]
        last_break['end'] = utcnow()
        last_break['duration'] = (last_break['end'] - last_break['start']).seconds / 60
        SessionRepository.update(session)

    def end(self, session_id, steps_completed, outcome):
        session = SessionRepository.get(session_id)
        session['ended_at'] = utcnow()
        session['status'] = 'completed'
        session['steps_completed'] = steps_completed
        session['outcome'] = outcome

        # Calculate durations
        total_time = (session['ended_at'] - session['started_at']).seconds / 60
        break_time = sum(b['duration'] for b in session['break_periods'])
        session['duration_minutes'] = total_time - break_time
        session['break_time_minutes'] = break_time

        SessionRepository.update(session)

        # Update user stats
        UserStatsService.record_session_completion(session)

        # Update prediction accuracy
        if session['prediction_id']:
            PredictionService.record_actual_time(
                session['prediction_id'],
                session['duration_minutes']
            )

        return session
```

### Break Detection Algorithm

```python
class InactivityDetector:
    def __init__(self):
        self.last_activity = utcnow()
        self.inactivity_threshold = 5 * 60  # 5 minutes in seconds

    def on_activity(self):
        # Called on mousemove, keydown, click, scroll
        now = utcnow()
        inactive_seconds = (now - self.last_activity).seconds

        if inactive_seconds > self.inactivity_threshold:
            # User was inactive - prompt for break
            return {
                'break_detected': True,
                'inactive_minutes': inactive_seconds / 60,
                'suggested_break_start': self.last_activity,
                'suggested_break_end': now
            }

        self.last_activity = now
        return {'break_detected': False}
```

## Data Models

### testing_sessions Table
```sql
CREATE TABLE testing_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    jira_ticket_id INTEGER NOT NULL,
    prediction_id INTEGER,
    user_id INTEGER NOT NULL,
    started_at TIMESTAMP NOT NULL,
    ended_at TIMESTAMP,
    duration_minutes INTEGER,              -- Actual testing time (excludes breaks)
    break_count INTEGER DEFAULT 0,
    break_time_minutes INTEGER DEFAULT 0,
    steps_completed INTEGER DEFAULT 0,
    steps_total INTEGER,
    status TEXT NOT NULL,                  -- 'active', 'paused', 'completed', 'abandoned'
    outcome TEXT,                          -- 'passed', 'failed', 'blocked', 'incomplete'
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (jira_ticket_id) REFERENCES jira_tickets(id),
    FOREIGN KEY (prediction_id) REFERENCES predictions(id),
    FOREIGN KEY (user_id) REFERENCES user_profiles(id)
);

CREATE INDEX idx_sessions_status ON testing_sessions(status);
CREATE INDEX idx_sessions_user_started ON testing_sessions(user_id, started_at);
CREATE INDEX idx_sessions_ticket ON testing_sessions(jira_ticket_id);
```

### Session Response JSON
```json
{
    "session_id": 123,
    "jira_ticket_key": "WRKA-1234",
    "prediction_id": 456,
    "started_at": "2025-11-15T09:00:00Z",
    "ended_at": "2025-11-15T10:30:00Z",
    "duration_minutes": 75,
    "break_periods": [
        {
            "start": "2025-11-15T09:45:00Z",
            "end": "2025-11-15T10:00:00Z",
            "duration_minutes": 15
        }
    ],
    "break_time_minutes": 15,
    "steps_completed": 12,
    "steps_total": 15,
    "status": "completed",
    "outcome": "passed",
    "estimated_time_minutes": 60,
    "variance_minutes": 15,          // Actual - Estimated
    "variance_percent": 25,           // Over estimate by 25%
    "notes": "Found edge case with null values"
}
```

## UI Components

### Session Control Panel
```
┌─────────────────────────────────────┐
│  Testing WRKA-1234                  │
│  ⏱️  45:23 elapsed (Est: 60 min)    │
│  📊 8/12 steps completed (67%)      │
├─────────────────────────────────────┤
│  [⏸️  Take Break]  [✅ End Session] │
└─────────────────────────────────────┘
```

### Session History
```
┌──────────────────────────────────────────────┐
│  Your Testing Sessions (This Week)           │
├──────────────────────────────────────────────┤
│  WRKA-1234 | 2025-11-14 | 45 min | ✅ Passed │
│  WRKA-1230 | 2025-11-14 | 62 min | ✅ Passed │
│  WRKA-1225 | 2025-11-13 | 38 min | ✅ Passed │
│  WMB-5678  | 2025-11-13 | 90 min | ❌ Failed │
├──────────────────────────────────────────────┤
│  Total: 4 sessions | 235 minutes             │
│  Avg: 59 min/session                         │
│  Completion Rate: 100%                       │
└──────────────────────────────────────────────┘
```

## Session Analytics

### Key Metrics
1. **Completion Rate**: `completed_sessions / started_sessions`
2. **Average Duration**: `sum(durations) / count(sessions)`
3. **Break Frequency**: `avg(breaks_per_session)`
4. **Time Variance**: `avg(actual - estimated)`
5. **Productivity Score**: Based on sessions/day, duration, completion rate

### Analytics Queries
```sql
-- Average session duration by component
SELECT
    j.components,
    AVG(s.duration_minutes) as avg_duration,
    COUNT(*) as session_count
FROM testing_sessions s
JOIN jira_tickets j ON s.jira_ticket_id = j.id
WHERE s.status = 'completed'
GROUP BY j.components;

-- Completion rate by time of day
SELECT
    STRFTIME('%H', started_at) as hour,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) * 100.0 / COUNT(*) as completion_rate
FROM testing_sessions
GROUP BY hour
ORDER BY completion_rate DESC;

-- Prediction accuracy
SELECT
    p.id,
    p.confidence_score,
    AVG(s.duration_minutes) as actual_avg,
    p.estimated_time as predicted,
    ABS(AVG(s.duration_minutes) - p.estimated_time) as error
FROM predictions p
JOIN testing_sessions s ON p.id = s.prediction_id
WHERE s.status = 'completed'
GROUP BY p.id;
```

## Out of Scope

- **Team Sessions**: Collaborative testing not supported (single-user)
- **Screen Recording**: No session recording or screenshots
- **Automatic Test Execution**: Manual testing only, no automated test runs
- **Time Billing**: Not intended for client billing or payroll
- **Calendar Blocking**: No calendar integration for time blocking

## Implementation Phases

### Phase 1: Basic Session Tracking (Week 1)
- testing_sessions table
- SessionRepository CRUD
- Start/end session API
- Basic UI controls

### Phase 2: Pause/Resume & Breaks (Week 2)
- Pause/resume functionality
- Break tracking
- Inactivity detection
- Break UI

### Phase 3: Analytics & Reporting (Week 3)
- Session analytics calculations
- Session history view
- Analytics dashboard
- Export functionality

### Phase 4: Advanced Features (Week 4)
- Prediction accuracy tracking
- Auto-end and reminders
- Productivity insights
- Integration with gamification

## Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Forgotten active sessions | Medium | High | Auto-end after 12h, reminder notifications |
| Inaccurate break detection | Low | Medium | User can edit break times, set custom thresholds |
| Clock sync issues (DST) | Low | Low | Use UTC consistently, validate timestamps |
| Session data loss on crash | High | Low | Auto-save every 30s, persist to localStorage |
| Privacy concerns (time tracking) | Medium | Low | Single-user app, data stays local, clear documentation |

## Acceptance Criteria

### Definition of Done
- [ ] All functional requirements implemented
- [ ] Session start/end < 200ms response time
- [ ] 0% data loss in session recording
- [ ] Auto-save working reliably
- [ ] Unit test coverage > 85%
- [ ] Integration tests pass
- [ ] UI/UX review approved
- [ ] Documentation complete

## Appendices

### A. API Endpoints
```
POST /api/atlas/session/start        # Start session
POST /api/atlas/session/end          # End session
POST /api/atlas/session/pause        # Pause session
POST /api/atlas/session/resume       # Resume session
GET  /api/atlas/sessions             # Get session history
GET  /api/atlas/sessions/:id         # Get session details
GET  /api/atlas/sessions/analytics   # Get analytics
```

### B. Related Documentation
- [Architecture Overview](/docs/development/architecture/architecture-overview.md)
- [Session Management Implementation](/docs/session-management.md)
