# PRD: Analytics & Dashboard

## Document Information
- **Version**: 1.0
- **Last Updated**: 2025-11-15
- **Owner**: ATLAS Development Team
- **Status**: Active

## Executive Summary

The Analytics & Dashboard module serves as the central hub of ATLAS, providing at-a-glance insights, real-time statistics, trend visualizations, and quick access to all key features. It transforms raw testing data into actionable insights that drive continuous improvement.

## Problem Statement

Users need better visibility into their testing activities:
- **Scattered Information**: Data spread across multiple pages, hard to get overview
- **No Trend Visibility**: Can't see improvement or decline over time
- **Reactive Not Proactive**: Discover issues late instead of early warnings
- **No Actionable Insights**: Raw numbers without context or recommendations
- **Information Overload**: Too much data, not enough meaning

## Goals & Objectives

### Primary Goals
1. Provide comprehensive testing overview on single dashboard
2. Visualize trends and patterns over time
3. Surface actionable insights and recommendations
4. Enable quick navigation to key features
5. Support data-driven decision making

### Success Metrics
- **Adoption**: 90% of sessions start from dashboard
- **Engagement**: Average 3+ dashboard views per session
- **Insight Action Rate**: 60% of insights lead to user action
- **Load Performance**: Dashboard loads in < 2 seconds
- **User Satisfaction**: 85% find dashboard helpful (survey)

## User Stories

### Epic: Dashboard Overview
- **US-096**: As a user, I want a central dashboard so I can see everything at a glance
- **US-097**: As a user, I want quick stats so I can track daily/weekly progress
- **US-098**: As a user, I want to see my current streak and level so I'm motivated
- **US-099**: As a user, I want quick access to common actions so I can navigate efficiently

### Epic: Trend Visualization
- **US-100**: As a user, I want charts showing my testing activity so I can see patterns
- **US-101**: As a user, I want to see accuracy trends so I know if I'm improving
- **US-102**: As a user, I want time-based views (day/week/month) so I can zoom in/out
- **US-103**: As a user, I want to compare current vs historical performance so I can measure progress

### Epic: Insights & Recommendations
- **US-104**: As a user, I want AI-generated insights so I discover patterns I'd miss
- **US-105**: As a user, I want actionable recommendations so I know what to improve
- **US-106**: As a user, I want priority-ranked insights so I focus on what matters most
- **US-107**: As a user, I want to dismiss irrelevant insights so I see only what's useful

### Epic: Component Analytics
- **US-108**: As a tester, I want to see testing breakdown by component so I know my focus areas
- **US-109**: As a tester, I want component-specific metrics so I can identify weak spots
- **US-110**: As a tester, I want component expertise tracking so I can see my strengths
- **US-111**: As a tester, I want component recommendations so I know where to upskill

### Epic: Widgets & Customization
- **US-112**: As a user, I want customizable dashboard widgets so I see what matters to me
- **US-113**: As a user, I want to rearrange widgets so I prioritize my view
- **US-114**: As a user, I want to hide/show widgets so I reduce clutter
- **US-115**: As a user, I want dashboard layout to persist so I don't reconfigure each time

## Functional Requirements

### FR-701: Dashboard Layout
- **Priority**: P0 (Critical)
- **Description**: Main dashboard page with organized widget grid
- **Acceptance Criteria**:
  - Responsive grid layout (3 columns desktop, 1 column mobile)
  - Widget types:
    - Quick Stats (tickets today, this week, current streak)
    - Activity Chart (tickets per day, last 7/30 days)
    - XP Progress (level, XP, next level)
    - Recent Tickets (last 5 completed)
    - Achievements (recent unlocks, progress)
    - Daily Challenge (current challenge progress)
    - Pattern Insights (top patterns used)
    - Coach Message (latest message)
    - JIRA Sync Status (last sync, next sync)
  - Quick actions: Start Testing, Sync JIRA, View Patterns
  - Load time < 2 seconds
  - Auto-refresh: every 30 seconds (when active)

### FR-702: Quick Stats Widget
- **Priority**: P0 (Critical)
- **Description**: At-a-glance key metrics
- **Acceptance Criteria**:
  - Metrics displayed:
    - Tickets tested today (count)
    - Tickets tested this week (count)
    - Time spent today (hours:minutes)
    - Current streak (days with fire emoji 🔥)
    - Current level (Level X + icon)
    - XP earned this week
  - Comparison indicators:
    - vs yesterday (↑↓ +/- %)
    - vs last week average (↑↓ +/- %)
  - Color coding: Green (improvement), Red (decline), Gray (stable)
  - Clicking metric navigates to detailed view

### FR-703: Activity Chart
- **Priority**: P0 (Critical)
- **Description**: Visual chart of testing activity over time
- **Acceptance Criteria**:
  - Chart type: Bar chart or line chart
  - Data: Tickets tested per day
  - Time ranges: 7 days, 30 days, 90 days (tabs)
  - Y-axis: Ticket count
  - X-axis: Date
  - Hover: Show exact count for each day
  - Today highlighted (different color)
  - Average line overlay (dotted)
  - Click bar: Show tickets for that day

### FR-704: XP Progress Widget
- **Priority**: P1 (High)
- **Description**: Gamification progress display
- **Acceptance Criteria**:
  - Current level with icon/badge
  - XP progress bar (current XP / next level XP)
  - XP needed for next level
  - XP earned this week
  - Level history (levels gained this month)
  - Click: Navigate to full stats page

### FR-705: Recent Activity Feed
- **Priority**: P1 (High)
- **Description**: Recent tickets tested
- **Acceptance Criteria**:
  - Last 5 completed tickets
  - Display: ticket key, summary (truncated), completion time, outcome
  - Icons: ✅ Passed, ❌ Failed, ⏸️ Blocked
  - Relative time: "2 hours ago", "Yesterday"
  - Click ticket: Navigate to ticket details
  - "View All" link to full history

### FR-706: Achievement Progress Widget
- **Priority**: P1 (High)
- **Description**: Achievements earned and in-progress
- **Acceptance Criteria**:
  - Recently unlocked (last 3)
  - In-progress achievements (next 3 closest to completion)
  - Progress bars for in-progress
  - Achievement icons (color for earned, grayscale for locked)
  - Click: Navigate to achievements page
  - Celebration animation on new unlock

### FR-707: Daily Challenge Widget
- **Priority**: P2 (Medium)
- **Description**: Today's challenge progress
- **Acceptance Criteria**:
  - Challenge name and description
  - Progress: "2/3 tickets completed"
  - Progress bar
  - Time remaining: "6 hours left"
  - Reward: "+50 XP"
  - Accept/Dismiss buttons
  - Completion celebration when done

### FR-708: Pattern Insights Widget
- **Priority**: P2 (Medium)
- **Description**: Top patterns used and recommended
- **Acceptance Criteria**:
  - Top 3 patterns used this week
  - Pattern name, usage count, success rate
  - Trending indicator: ↑ (increasing use), ↓ (decreasing)
  - Recommended patterns (unused but relevant)
  - Click: Navigate to pattern details

### FR-709: Component Analytics View
- **Priority**: P1 (High)
- **Description**: Detailed component-level analytics
- **Acceptance Criteria**:
  - Breakdown by 5 components (MHIS, Workflow, Letters, Permissions, TARS)
  - Per component:
    - Ticket count (total, this week)
    - Average time per ticket
    - Accuracy rate (%)
    - Most used patterns
    - Expertise level (Novice/Intermediate/Expert)
  - Visual: Pie chart of ticket distribution
  - Visual: Bar chart of time by component
  - Filter: Time range (week/month/all time)

### FR-710: Trend Analysis
- **Priority**: P1 (High)
- **Description**: Historical trend analysis with insights
- **Acceptance Criteria**:
  - Metrics tracked over time:
    - Tickets per week (last 12 weeks)
    - Average time per ticket (last 12 weeks)
    - Prediction accuracy (last 12 weeks)
    - XP earned per week (last 12 weeks)
  - Trend detection:
    - Increasing, Decreasing, Stable
    - Rate of change (% per week)
  - Insights generation:
    - "Testing speed improved 15% in last month"
    - "MHIS accuracy trending down (-8% this month)"
    - "Prediction usage up 25% since last month"
  - Visual: Line charts with trendlines

### FR-711: Insight Engine
- **Priority**: P1 (High)
- **Description**: AI-generated actionable insights
- **Acceptance Criteria**:
  - Insight categories:
    - Performance (speed, accuracy)
    - Patterns (usage, effectiveness)
    - Productivity (sessions, time management)
    - Learning (improvement areas)
    - Achievements (upcoming milestones)
  - Insight structure:
    - Observation (what data shows)
    - Context (why it matters)
    - Recommendation (what to do)
    - Priority (high/medium/low)
  - Max 5 insights shown at once (top priority)
  - Dismissible with reason (not relevant, already addressed, etc.)
  - Refresh: Weekly (every Monday)

### FR-712: Comparative Analytics
- **Priority**: P2 (Medium)
- **Description**: Compare performance across time periods
- **Acceptance Criteria**:
  - Comparison views:
    - This week vs last week
    - This month vs last month
    - This quarter vs last quarter
  - Metrics compared:
    - Tickets tested
    - Time spent
    - Accuracy rate
    - XP earned
  - Visual: Side-by-side bars
  - Percentage change indicators
  - Insights: "Testing productivity up 12% this week"

### FR-713: Export Analytics
- **Priority**: P2 (Medium)
- **Description**: Export analytics data
- **Acceptance Criteria**:
  - Export formats: CSV, JSON
  - Export options:
    - Quick stats (current period)
    - Full history (all time)
    - Custom date range
  - Data included:
    - Session history
    - Ticket completion data
    - XP and achievement history
    - Pattern usage
  - File naming: `atlas-analytics-{date}.csv`

### FR-714: JIRA Sync Status Widget
- **Priority**: P1 (High)
- **Description**: Display JIRA synchronization status
- **Acceptance Criteria**:
  - Last sync timestamp
  - Next scheduled sync
  - Sync status: Idle / Running / Success / Failed
  - If running: Progress bar
  - If failed: Error message and retry button
  - Manual sync button
  - Ticket count: Local vs JIRA

### FR-715: Quick Actions Panel
- **Priority**: P1 (High)
- **Description**: Fast access to common actions
- **Acceptance Criteria**:
  - Actions:
    - Start Testing (navigate to My Work)
    - Analyze Ticket (open ticket lookup)
    - View Patterns (navigate to patterns)
    - Sync JIRA (trigger manual sync)
    - View Stats (navigate to full stats)
  - Button style: Large, icon + text
  - Keyboard shortcuts (optional)
  - Most-used actions highlighted

## Non-Functional Requirements

### Performance
- **NFR-701**: Dashboard loads in < 2 seconds
- **NFR-702**: Charts render in < 500ms
- **NFR-703**: Analytics calculations < 1 second
- **NFR-704**: Auto-refresh doesn't block UI (async)

### Usability
- **NFR-705**: Mobile-responsive (works on tablets/phones)
- **NFR-706**: Clear visual hierarchy (most important info prominent)
- **NFR-707**: Accessible (WCAG 2.1 AA compliance)
- **NFR-708**: Consistent with overall ATLAS design

### Accuracy
- **NFR-709**: All displayed metrics accurate to source data (0% error)
- **NFR-710**: Trend calculations mathematically correct
- **NFR-711**: Charts update in real-time (30-second refresh)

### Scalability
- **NFR-712**: Dashboard performs well with 50,000+ tickets
- **NFR-713**: Charts handle 365+ data points
- **NFR-714**: Insight generation scales with data volume

## Technical Architecture

### Dashboard Data Flow

```
Dashboard Page Load
    ↓
Fetch data in parallel:
  ├─→ QuickStatsService.get_stats(period='today')
  ├─→ SessionRepository.get_recent(limit=5)
  ├─→ UserRepository.get_profile(user_id)
  ├─→ AchievementRepository.get_progress()
  ├─→ ChallengeRepository.get_today_challenge()
  ├─→ PatternService.get_top_patterns(period='week')
  └─→ JiraSyncService.get_status()
    ↓
Aggregate results
    ↓
Render widgets
    ↓
Start auto-refresh timer (30s)
```

### Analytics Calculation

```python
class AnalyticsService:
    def calculate_quick_stats(self, user_id, period='week'):
        sessions = SessionRepository.get_by_period(user_id, period)

        stats = {
            'tickets_completed': len(sessions),
            'total_time_minutes': sum(s.duration for s in sessions),
            'avg_time_per_ticket': mean(s.duration for s in sessions),
            'accuracy_rate': calculate_accuracy(sessions),
            'xp_earned': sum(s.xp_awarded for s in sessions),
            'streak': UserRepository.get_streak(user_id),
            'level': UserRepository.get_level(user_id)
        }

        # Comparison to previous period
        prev_sessions = SessionRepository.get_by_period(
            user_id,
            period,
            offset=1  # Previous week/month
        )

        stats['comparison'] = {
            'tickets_change': len(sessions) - len(prev_sessions),
            'time_change_pct': calculate_change_pct(
                stats['total_time_minutes'],
                sum(s.duration for s in prev_sessions)
            )
        }

        return stats
```

### Insight Generation Algorithm

```python
class InsightEngine:
    def generate_insights(self, user_id):
        insights = []

        # Performance insights
        speed_trend = calculate_trend(user_id, metric='avg_duration')
        if speed_trend['direction'] == 'improving' and speed_trend['rate'] > 0.10:
            insights.append({
                'category': 'performance',
                'priority': 'high',
                'observation': f"Testing speed improved {speed_trend['rate']*100:.0f}% this month",
                'context': "You're completing tickets faster while maintaining accuracy",
                'recommendation': "Consider taking on more complex tickets to leverage your speed",
                'action': 'view_component_analytics'
            })

        # Pattern insights
        unused_patterns = PatternService.get_unused_relevant_patterns(user_id)
        if len(unused_patterns) >= 3:
            insights.append({
                'category': 'patterns',
                'priority': 'medium',
                'observation': f"{len(unused_patterns)} relevant patterns haven't been used",
                'context': "These patterns match your recent tickets and could save time",
                'recommendation': "Review these patterns before your next testing session",
                'action': 'view_patterns'
            })

        # Expertise gaps
        component_expertise = ComponentAnalytics.get_expertise_gaps(user_id)
        weak_component = min(component_expertise, key=lambda x: x.accuracy)
        if weak_component.accuracy < 0.75:
            insights.append({
                'category': 'learning',
                'priority': 'high',
                'observation': f"{weak_component.name} accuracy is {weak_component.accuracy*100:.0f}%",
                'context': "Below your average accuracy of 85%",
                'recommendation': f"Review {weak_component.name} documentation and past tickets",
                'action': f'view_component:{weak_component.name}'
            })

        # Sort by priority and return top 5
        return sorted(insights, key=lambda x: PRIORITY_RANK[x['priority']])[:5]
```

## Data Models

### Dashboard Widget Configuration
```json
{
    "user_id": 1,
    "layout": [
        {
            "widget_id": "quick_stats",
            "position": 1,
            "size": "medium",
            "visible": true
        },
        {
            "widget_id": "activity_chart",
            "position": 2,
            "size": "large",
            "visible": true,
            "settings": {
                "time_range": "30days",
                "chart_type": "bar"
            }
        }
    ]
}
```

### Insight Object
```json
{
    "insight_id": "INS-2024-11-15-001",
    "category": "performance",
    "priority": "high",
    "observation": "Testing speed improved 15% this month",
    "context": "You're completing tickets faster while maintaining accuracy",
    "recommendation": "Consider taking on more complex tickets to leverage your speed",
    "action": "view_component_analytics",
    "action_url": "/analytics/components",
    "generated_at": "2025-11-15T09:00:00Z",
    "dismissed": false,
    "user_feedback": null
}
```

## UI Components

### Dashboard Layout
```
┌────────────────────────────────────────────────────────────┐
│  ATLAS Dashboard                         🔄 Last sync: 2h ago │
├────────────────────────────────────────────────────────────┤
│  Quick Stats                                               │
│  3 tickets today | 23 this week | 🔥 5 streak | Level 8    │
├────────────────────────────────────────────────────────────┤
│  Activity Chart (Last 7 Days)        [7d] [30d] [90d]     │
│                                                            │
│  Tickets  8                              ┌─┐               │
│           6                           ┌─┐│ │               │
│           4              ┌─┐       ┌─┐│ ││ │               │
│           2           ┌─┐│ │    ┌─┐│ ││ ││ │               │
│           0  ─────────┴─┴┴─┴────┴─┴┴─┴┴─┴┴─┘               │
│              Mon Tue Wed Thu Fri Sat Sun                   │
├──────────────────────────┬─────────────────────────────────┤
│  XP Progress             │  Daily Challenge                │
│  Level 8 🏆              │  Speed Demon 🏃                 │
│  [█████████░] 230/300    │  Complete 3 tickets fast        │
│  70 XP to Level 9        │  Progress: 2/3 ✅✅⬜            │
│                          │  Reward: +50 XP                 │
├──────────────────────────┼─────────────────────────────────┤
│  Recent Tickets          │  Achievements                   │
│  ✅ WRKA-1234 (12m ago)  │  🏆 Week Warrior (5/7)          │
│  ✅ WRKA-1230 (1h ago)   │  🏆 MHIS Master (22/25)         │
│  ✅ WRKA-1225 (3h ago)   │  🏆 Century Club (UNLOCKED!)    │
├──────────────────────────┴─────────────────────────────────┤
│  Insights & Recommendations                                │
│  📈 Testing speed improved 15% this month! Great work!     │
│  💡 3 relevant patterns unused - review before next test   │
│  🎯 WRKA has 5 new tickets assigned to you                 │
├────────────────────────────────────────────────────────────┤
│  Quick Actions                                             │
│  [▶️ Start Testing] [🔍 Analyze Ticket] [📊 View Patterns] │
└────────────────────────────────────────────────────────────┘
```

## Out of Scope

- **Real-Time Collaboration Dashboards**: Single-user, no team dashboards
- **Predictive Forecasting**: No "you'll complete 120 tickets next month" predictions
- **External Integrations**: No Google Analytics, Tableau, etc. integrations
- **Custom Report Builder**: Pre-built views only, no drag-and-drop report designer
- **Alerting System**: No email/SMS alerts for thresholds

## Implementation Phases

### Phase 1: Basic Dashboard (Week 1)
- Dashboard page layout
- Quick stats widget
- Recent activity feed
- Quick actions panel

### Phase 2: Charts & Visualizations (Week 2)
- Activity chart (tickets over time)
- XP progress widget
- Component breakdown pie chart

### Phase 3: Advanced Analytics (Week 3)
- Trend analysis
- Component analytics view
- Comparative analytics

### Phase 4: Insights & Intelligence (Week 4)
- Insight engine
- Pattern insights
- Actionable recommendations

## Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Dashboard slow with large datasets | High | Medium | Pagination, lazy loading, caching, database indexing |
| Too much information overwhelms users | Medium | High | Progressive disclosure, customizable widgets, defaults |
| Insights not actionable | Medium | Medium | User feedback, A/B testing, iterative refinement |
| Chart library performance issues | Medium | Low | Evaluate libraries (Chart.js, D3), optimize rendering |

## Acceptance Criteria

### Definition of Done
- [ ] All functional requirements implemented
- [ ] Dashboard loads in < 2 seconds
- [ ] All charts render correctly
- [ ] Insight engine generates relevant insights
- [ ] Mobile-responsive design
- [ ] Unit test coverage > 80%
- [ ] User testing shows 85%+ satisfaction
- [ ] Documentation complete

## Appendices

### A. Chart Library Options
- **Chart.js**: Simple, performant, good for basic charts
- **D3.js**: Powerful, flexible, steeper learning curve
- **Recharts**: React-friendly, good defaults (if using React)

### B. Widget Types Reference
1. Quick Stats - Numeric KPIs
2. Activity Chart - Time series
3. XP Progress - Progress bar
4. Recent Activity - List
5. Achievements - Progress grid
6. Daily Challenge - Card
7. Pattern Insights - List with metrics
8. Coach Message - Card
9. JIRA Sync Status - Status indicator

### C. Related Documentation
- [Architecture Overview](/docs/development/architecture/architecture-overview.md)
- [Frontend Implementation](/docs/frontend-implementation.md)
- [API Documentation](/docs/api-documentation.md)
