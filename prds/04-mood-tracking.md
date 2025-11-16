# PRD: Mood Tracking

## Overview

**Feature Name:** Mood Tracking
**Version:** 1.0
**Last Updated:** 2025-11-15
**Status:** Implemented
**Owner:** Product Team

## Executive Summary

The Mood Tracking system enables users to monitor their emotional wellbeing through simple, regular mood logging with a 1-10 scale. It provides insights into mood patterns, triggers, and trends over time, supporting mental health awareness, therapy journaling, and emotional self-reflection. The system emphasizes quick capture, contextual awareness, and actionable insights.

## Problem Statement

Users struggle with:
- Understanding their emotional patterns and triggers
- Articulating feelings during therapy or self-reflection
- Identifying what impacts their mood (sleep, exercise, social interactions, etc.)
- Detecting early warning signs of depression or anxiety
- Tracking the effectiveness of mental health interventions
- Remembering to check in with their emotions regularly
- Quantifying subjective emotional experiences

## Goals & Success Metrics

### Goals
1. Enable rapid mood logging (< 5 seconds per entry)
2. Reveal meaningful mood patterns and correlations
3. Provide actionable insights for wellbeing improvement
4. Support therapeutic and self-care practices
5. Reduce friction in emotional self-monitoring
6. Create a judgment-free, compassionate tracking experience

### Success Metrics
- **Logging Frequency:** Average mood entries per user per day
- **Consistency:** % of days with at least one mood entry
- **Entry Richness:** % of mood entries with context notes or tags
- **Trend Detection:** % of users viewing mood trends/analytics
- **Retention:** % of users still logging after 30 days
- **Insight Value:** User-reported value from mood insights (surveys)
- **Trigger Identification:** % of users who identify mood patterns

## User Personas

### Primary: The Mental Health Seeker
- **Demographics:** 25-45 years old, therapy participant or self-care focused
- **Needs:** Track mood for therapy discussions, identify triggers, monitor medication effects
- **Pain Points:** Forgetting emotional details between therapy sessions, unclear patterns
- **Usage Pattern:** Multiple daily check-ins, weekly trend reviews before therapy

### Secondary: The Self-Optimizer
- **Demographics:** 20-50 years old, quantified-self enthusiast
- **Needs:** Correlate mood with activities (exercise, sleep, diet, social events)
- **Pain Points:** Scattered data sources, lack of cross-metric insights
- **Usage Pattern:** Scheduled mood checks (morning, afternoon, evening), deep analytics reviews

### Tertiary: The Anxiety Manager
- **Demographics:** 18-60 years old, managing anxiety or depression
- **Needs:** Monitor emotional baseline, detect downward spirals early, track coping strategies
- **Pain Points:** Anxiety about low moods, forgetting what helps
- **Usage Pattern:** Frequent logging during difficult periods, checking trends for reassurance

## Functional Requirements

### 1. Mood Entry Creation

#### 1.1 Quick Mood Capture
**Priority:** P0 (Critical)
- **Scale:** 1-10 numerical scale
  - 1-3: Poor/Low mood (red)
  - 4-6: Neutral/Okay mood (yellow)
  - 7-9: Good/High mood (green)
  - 10: Excellent/Peak mood (cyan glow)
- **Interface:**
  - Large, tappable number buttons (1-10)
  - Visual feedback on hover/selection
  - One-tap to log without additional fields
  - Optional expansion for context
- **Location:**
  - Available on Dashboard (Today View)
  - Dedicated Moods View
  - Quick action from sidebar (future)

#### 1.2 Detailed Mood Entry
**Priority:** P1 (High)
- **Optional Fields:**
  - Context note (max 500 characters)
  - Trigger information (what caused this mood?)
  - Tags (activities, locations, people, events)
  - Timestamp (defaults to now, can be backfilled)
- **Smart Suggestions:**
  - Recent tags for quick selection
  - Common triggers list
  - Mood-specific prompt (e.g., "What's making you feel great?")

#### 1.3 Mood Icons/Emojis
**Priority:** P2 (Nice to Have)
- Visual mood representations alongside numbers
- 1-10 mapped to emoji spectrum: 😢 😟 😐 🙂 😊 😄
- User preference: numbers only, emojis only, or both
- Custom emoji selection (future)

### 2. Mood Display & History

#### 2.1 Mood List View
**Priority:** P0 (Critical)
- **Chronological List:**
  - Most recent entries first
  - Grouped by day ("Today", "Yesterday", date labels)
  - Each entry shows:
    - Mood value with color coding
    - Timestamp (relative or absolute)
    - Context preview (truncated)
    - Tags
    - Edit/delete actions
- **Pagination:**
  - Load 30 days initially
  - "Load more" for older entries
  - Smooth scrolling performance

#### 2.2 Mood Entry Cards
**Priority:** P0 (Critical)
```
┌─────────────────────────────────────────┐
│ [8] 😊    Great mood!                   │
│ 2 hours ago                              │
│ "Had a productive work session and..."  │
│ #work #productive #coffee                │
│                                [Edit] ✕  │
└─────────────────────────────────────────┘
```
- Color-coded mood value
- Optional emoji representation
- Timestamp with relative display
- Context note excerpt
- Tag badges
- Quick actions (edit, delete)

#### 2.3 Calendar View
**Priority:** P2 (Nice to Have)
- Month calendar with mood indicators
- Color-coded days based on average mood
- Multiple entries per day show average or range
- Click day to view all entries
- Visual identification of mood patterns (e.g., low Mondays)

### 3. Mood Analytics & Insights

#### 3.1 Mood Statistics
**Priority:** P1 (High)
- **Current Statistics:**
  - Latest mood value and timestamp
  - 7-day trend (up ↗, down ↘, stable →)
  - 7-day average mood
  - 30-day average mood
  - All-time average mood
- **Trend Indicators:**
  - Visual arrow indicators (↗ ↘ →)
  - Percentage change from previous period
  - Color coding (green for improving, red for declining)

#### 3.2 Mood Charts
**Priority:** P1 (High)
- **Line Chart:**
  - X-axis: Time (daily, weekly, monthly views)
  - Y-axis: Mood value (1-10)
  - Plot all mood entries as data points
  - Trend line overlay
  - Color gradient fill under line
  - Interactive tooltips on hover
- **Bar Chart:**
  - Daily average mood bars
  - Compare weeks or months
  - Highlight outliers (exceptionally high/low days)

#### 3.3 Pattern Recognition
**Priority:** P2 (Nice to Have)
- **Day of Week Analysis:**
  - Average mood by day (Monday through Sunday)
  - Identify "best" and "worst" days
  - Visual bar chart comparison
- **Time of Day Analysis:**
  - Morning vs afternoon vs evening mood
  - Energy patterns throughout day
  - Suggested optimal check-in times
- **Trigger Analysis:**
  - Most common tags associated with high moods
  - Most common tags associated with low moods
  - Correlation insights

#### 3.4 Mood Milestones
**Priority:** P2 (Nice to Have)
- "7 consecutive days above 7"
- "30 days of consistent logging"
- "Longest positive streak"
- "Biggest mood improvement (week over week)"
- Celebration UI for milestones

### 4. Mood Context & Tagging

#### 4.1 Mood Tags
**Priority:** P1 (High)
- **Pre-defined Tag Categories:**
  - Activities: #exercise, #reading, #meditation, #socializing
  - Emotions: #anxious, #grateful, #stressed, #energized
  - Physical: #tired, #sick, #headache, #wellrested
  - Work: #productive, #meeting, #deadline, #achievement
  - Social: #family, #friends, #alone, #date
- **Custom Tags:**
  - User-created tags
  - Tag suggestions based on history
  - Tag autocomplete
- **Tag Analytics:**
  - Average mood when tag is present
  - Tag frequency over time
  - Tag correlations (tags that appear together)

#### 4.2 Context Notes
**Priority:** P1 (High)
- Free-form text field
- Character limit: 500 characters
- Markdown support (bold, italic, lists)
- Search across notes
- Export notes to journal (future integration)

#### 4.3 Triggers & Boosters
**Priority:** P2 (Nice to Have)
- Explicit "What caused this mood?" field
- Separate positive triggers (boosters) and negative triggers
- Build personal trigger library
- Trigger frequency and impact analysis
- Suggested coping strategies for negative triggers

### 5. Mood Entry Management

#### 5.1 Edit Mood Entry
**Priority:** P0 (Critical)
- Click entry to open edit dialog
- Modify mood value, context, tags, timestamp
- Save/cancel actions
- Update confirmation toast
- Preserve original creation timestamp

#### 5.2 Delete Mood Entry
**Priority:** P0 (Critical)
- Delete action in entry card
- Confirmation dialog
- Permanent deletion (no undo after confirmation)
- Success toast notification

#### 5.3 Backfill Moods
**Priority:** P1 (High)
- Create entry for past date/time
- Date/time picker for selection
- Distinguish backfilled entries (subtle indicator)
- Limit backfilling to past 30 days (prevent gaming trends)

### 6. Mood Reminders

#### 6.1 Check-In Prompts
**Priority:** P2 (Nice to Have)
- Customizable reminder times (morning, afternoon, evening)
- Push notifications (web/mobile)
- In-app subtle prompts
- Skip reminder option (don't nag)
- Adaptive frequency (reduce if consistently logging)

## Non-Functional Requirements

### Performance
- Mood entry creation: < 300ms round-trip
- Chart rendering: < 500ms for 90 days of data
- List view: < 100ms for 30 days
- Real-time chart updates on new entry

### Accessibility
- Keyboard navigation for mood scale (1-0 keys)
- Screen reader support for mood values and trends
- High contrast mode for charts
- Color-blind friendly color palette
- ARIA labels for all interactive elements

### Privacy & Security
- Mood data is highly sensitive personal health information
- User data isolation (strict user_id scoping)
- Optional: end-to-end encryption (future)
- Export/delete all mood data (GDPR compliance)
- No sharing features by default (user controls in future)

### Emotional Safety
- Judgment-free language throughout
- Avoid alarming users about low moods
- Provide mental health resources for consistent low moods
- Crisis support information readily available
- Emphasize that app is not a substitute for professional help

### Scalability
- Support 10,000+ mood entries per user (years of data)
- Efficient aggregation queries for statistics
- Indexed queries on user_id and date
- Pagination for large datasets

## User Experience

### Information Architecture
```
Moods View
├── Header
│   ├── Page Title
│   └── Quick Mood Capture
├── Mood Statistics Card
│   ├── Latest Mood
│   ├── 7-Day Trend
│   ├── 7-Day Average
│   └── 30-Day Average
├── Mood Chart
│   ├── Time Range Selector (7d, 30d, 90d, 1y, all)
│   ├── Line Chart
│   └── Chart Controls (zoom, export)
├── Recent Entries
│   ├── Mood Entry Card 1
│   ├── Mood Entry Card 2
│   └── ... Mood Entry Card N
└── View All / Load More

Mood Detail (Edit) Dialog
├── Mood Scale (1-10 selector)
├── Context Note Field
├── Trigger Field
├── Tags Multi-Select
├── Date/Time Picker
└── Save / Cancel Buttons
```

### User Flows

#### Flow 1: Quick Mood Log
1. User opens Dashboard or Moods view
2. Sees quick mood capture interface (1-10 buttons)
3. Clicks current mood value (e.g., 7)
4. Entry saves immediately
5. Success animation plays
6. Chart updates in real-time
7. Statistics recalculate
8. Entry appears in recent list

#### Flow 2: Detailed Mood Entry with Context
1. User clicks mood value (e.g., 3 - feeling low)
2. Expansion panel opens for additional context
3. User types context note: "Feeling stressed about work deadline"
4. User adds tags: #work, #stressed, #anxious
5. User clicks "Save Mood"
6. Entry saves with all context
7. Success toast appears
8. Entry visible in list with full details

#### Flow 3: Weekly Mood Review
1. User opens Moods view
2. Reviews statistics card: 7-day average is 6.2 (down from 7.1)
3. Clicks on mood chart
4. Chart shows dip mid-week
5. User hovers over low point
6. Tooltip shows: "Mood: 4, Wed 3pm, #work #meeting"
7. User recalls stressful meeting
8. User identifies pattern: meetings lower mood
9. User makes note to prepare better for meetings

#### Flow 4: Identify Mood Triggers
1. User navigates to Moods analytics section
2. Reviews "Tags and Mood" chart
3. Sees #exercise correlates with average mood of 8.2
4. Sees #social correlates with average mood of 7.8
5. Sees #deadline correlates with average mood of 4.5
6. User insight: Exercise boosts mood, deadlines lower it
7. User decides to exercise more and plan better for deadlines

### Visual Design

#### Mood Color Scale
- **1-2:** Deep red (#dc2626)
- **3-4:** Red-orange (#f97316)
- **5-6:** Yellow (#eab308)
- **7-8:** Green (#22c55e)
- **9:** Bright green (#10b981)
- **10:** Cyan with glow (#06b6d4 with shadow)

#### Mood Entry Card Styling
- Left border accent in mood color
- Mood value in large bold font
- Emoji representation (if enabled)
- Context text in muted color
- Tags as colored pills
- Subtle hover effect for interactivity

#### Chart Styling
- Gradient fill under line (mood color spectrum)
- Smooth curved lines (not jagged)
- Gridlines for readability
- Interactive tooltips with full entry details
- Responsive to container size

## Technical Specifications

### Frontend Components
```typescript
<MoodsView>
  <MoodsHeader>
    <h1>Mood Tracking</h1>
    <QuickMoodCapture onMoodSaved={handleMoodSaved} />
  </MoodsHeader>

  <MoodStatistics stats={moodStats} />

  <MoodChart
    entries={moodEntries}
    timeRange={timeRange}
    onTimeRangeChange={setTimeRange}
  />

  <RecentMoodEntries>
    {recentEntries.map(entry => (
      <MoodEntryCard
        key={entry.id}
        entry={entry}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    ))}
  </RecentMoodEntries>

  <LoadMoreButton onClick={loadMoreEntries} />
</MoodsView>

<QuickMoodCapture>
  <MoodScale>
    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => (
      <MoodButton
        key={value}
        value={value}
        onClick={() => handleQuickLog(value)}
      />
    ))}
  </MoodScale>

  <ExpandableContext>
    <TextArea placeholder="How are you feeling?" />
    <TagSelector tags={availableTags} />
    <SaveButton />
  </ExpandableContext>
</QuickMoodCapture>
```

### Data Models
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

interface MoodTag {
  mood_id: string;
  tag_id: string;
}

interface MoodStats {
  latest: number | null;
  latest_timestamp: string | null;
  seven_day_average: number;
  seven_day_trend: 'up' | 'down' | 'stable';
  seven_day_change_percent: number;
  thirty_day_average: number;
  all_time_average: number;
  total_entries: number;
  longest_positive_streak: number; // days with mood >= 7
  current_positive_streak: number;
}

interface MoodPattern {
  pattern_type: 'day_of_week' | 'time_of_day' | 'tag_correlation';
  pattern_data: Record<string, number>; // e.g., { "Monday": 6.2, "Tuesday": 7.1, ... }
  insight: string; // human-readable insight
}
```

### API Endpoints
```
POST   /moods                         Create mood entry
GET    /users/:user_id/moods          List mood entries (paginated)
GET    /moods/:id                     Get specific mood entry
PUT    /moods/:id                     Update mood entry
DELETE /moods/:id                     Delete mood entry

GET    /users/:user_id/moods/stats    Get mood statistics
GET    /users/:user_id/moods/chart    Get chart data (date range)
GET    /users/:user_id/moods/patterns Get pattern analysis
GET    /users/:user_id/moods/tags     Get tag correlations
```

### Chart Implementation
```typescript
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={chartData}>
    <XAxis
      dataKey="date"
      tickFormatter={(date) => format(new Date(date), 'MMM d')}
    />
    <YAxis domain={[1, 10]} ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} />
    <Tooltip
      content={({ active, payload }) => {
        if (active && payload?.[0]) {
          const entry = payload[0].payload;
          return (
            <div className="mood-tooltip">
              <p><strong>Mood: {entry.value}</strong></p>
              <p>{format(new Date(entry.timestamp), 'MMM d, h:mm a')}</p>
              {entry.context && <p>{entry.context}</p>}
              {entry.tags && <p>{entry.tags.join(', ')}</p>}
            </div>
          );
        }
        return null;
      }}
    />
    <Line
      type="monotone"
      dataKey="value"
      stroke="#06b6d4"
      strokeWidth={2}
      dot={{ fill: '#06b6d4', r: 4 }}
      activeDot={{ r: 6 }}
    />
  </LineChart>
</ResponsiveContainer>
```

### Trend Calculation
```typescript
function calculateTrend(entries: Mood[]): 'up' | 'down' | 'stable' {
  if (entries.length < 2) return 'stable';

  const now = new Date();
  const sevenDaysAgo = subDays(now, 7);
  const fourteenDaysAgo = subDays(now, 14);

  const recent = entries.filter(e =>
    new Date(e.timestamp) >= sevenDaysAgo
  );
  const previous = entries.filter(e =>
    new Date(e.timestamp) >= fourteenDaysAgo &&
    new Date(e.timestamp) < sevenDaysAgo
  );

  const recentAvg = average(recent.map(e => e.value));
  const previousAvg = average(previous.map(e => e.value));

  const diff = recentAvg - previousAvg;

  if (diff > 0.5) return 'up';
  if (diff < -0.5) return 'down';
  return 'stable';
}
```

## Dependencies

### Internal
- Tags system (mood tagging)
- Dashboard (mood summary display)
- Analytics (mood trend charts)
- Journal (future: link moods to journal entries)

### External
- React Query (data fetching)
- Recharts or Chart.js (data visualization)
- date-fns (date calculations)
- Radix UI (dialogs, tooltips)
- Lucide React (icons)

## Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Users feel judged or shame about low moods | High | Medium | Use compassionate language, avoid red/negative framing, provide context that all moods are valid |
| Consistently low moods indicating mental health crisis | Critical | Low | Display mental health resources, suggest professional help, crisis hotline information |
| Users become obsessive about mood tracking | Medium | Low | Limit check-ins to 5-10 per day, gentle reminders instead of aggressive notifications |
| Chart data overwhelming or confusing | Medium | Medium | Progressive disclosure, simple defaults, advanced analytics optional |
| Privacy concerns about sensitive mood data | High | Medium | Clear privacy policy, data encryption, no sharing by default, easy data export/deletion |
| Mood tracking becomes a chore rather than helpful | High | Medium | Gamification elements, insights that feel valuable, celebrate milestones, allow pausing |

## Future Enhancements

### Phase 2
- Mood reminders and customizable check-in times
- Mood correlations with other data (habits, tasks, weather)
- Mood journaling prompts based on current mood
- Mood-based recommendations (e.g., "Your mood is often higher after exercise")
- Export mood data to CSV or PDF reports

### Phase 3
- Integration with wearables (heart rate variability, sleep data)
- Photo mood journal (attach images to mood entries)
- Voice mood logging
- Therapy session preparation report
- Share mood charts with therapist (with consent)
- Medication tracking integration

### Phase 4
- AI-powered mood predictions and early warning systems
- Mood-based music or activity suggestions
- Community support (anonymous mood sharing)
- Guided mood improvement programs
- Integration with therapy apps (Talkspace, BetterHelp)

## Open Questions

1. Should we limit the number of mood entries per day to prevent obsessive tracking?
2. What's the right balance between encouraging logging and avoiding notification fatigue?
3. Should mood entries be editable indefinitely, or lock after a certain period?
4. How do we handle users logging consistently low moods - intervene or respect autonomy?
5. Should we provide mood range (min-max during day) in addition to point-in-time entries?
6. What's the ideal default time range for the mood chart: 7 days, 30 days, or all time?

## Appendix

### A. Mental Health Resources
The app should provide easy access to:
- National Suicide Prevention Lifeline: 988
- Crisis Text Line: Text HOME to 741741
- NAMI Helpline: 1-800-950-NAMI
- Links to therapy resources (Psychology Today, BetterHelp, etc.)
- Educational content on mood tracking and mental health

### B. Evidence-Based Benefits of Mood Tracking
- **Increased Self-Awareness:** Understanding emotional patterns
- **Therapy Support:** Providing concrete data for therapy sessions
- **Early Intervention:** Detecting downward trends before crisis
- **Treatment Efficacy:** Measuring impact of medication or therapy
- **Trigger Identification:** Recognizing what affects mood positively and negatively

### C. Keyboard Shortcuts
- `1-9, 0` (for 10) - Quick log mood value
- `M` - Focus mood capture
- `Cmd/Ctrl + M` - Open mood entry dialog
- `Escape` - Close dialogs
- `Enter` - Save mood entry

### D. Analytics Events
```
- mood_logged
- mood_logged_with_context
- mood_edited
- mood_deleted
- mood_chart_viewed
- mood_stats_viewed
- mood_pattern_viewed
- mood_milestone_reached
- mood_trend_improved
- mood_trend_declined
- backfill_mood_entry
```

### E. Compassionate Copy Examples
Instead of:
- ❌ "You've had 5 bad days in a row"
- ❌ "Your mood is declining"
- ❌ "Failed to meet your mood goals"

Use:
- ✅ "You've been feeling low lately. That's okay - all feelings are valid."
- ✅ "Your mood has been lower this week. Is there something we can help with?"
- ✅ "You're still showing up and tracking. That takes courage."
