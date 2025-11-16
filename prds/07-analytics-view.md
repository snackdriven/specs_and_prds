# PRD: Analytics View

## Overview

**Feature Name:** Analytics View
**Version:** 1.0
**Last Updated:** 2025-11-15
**Status:** Implemented
**Owner:** Product Team

## Executive Summary

The Analytics View provides users with comprehensive data visualization and insights across all tracked metrics in Daybeam. It transforms raw data from tasks, habits, moods, journal entries, and countdowns into actionable insights, patterns, and trends. This feature empowers users to make data-driven decisions about their productivity, wellness, and personal development through beautiful, interactive charts and meaningful statistics.

## Problem Statement

Users struggle with:
- Understanding patterns in their productivity and wellness data
- Identifying what factors correlate with better outcomes (mood, productivity, etc.)
- Seeing progress over time across multiple life areas
- Making connections between different tracked metrics
- Justifying time spent tracking if no insights emerge
- Finding motivation from abstract numbers without visual representation
- Answering questions like "Am I actually getting better?" or "What impacts my mood most?"
- Extracting actionable insights from weeks or months of tracking

## Goals & Success Metrics

### Goals
1. Surface meaningful insights from user data across all features
2. Make complex data accessible through clear visualizations
3. Identify correlations between different tracked metrics
4. Motivate continued tracking by demonstrating value
5. Enable data-driven decision making about habits and routines
6. Celebrate progress and achievements

### Success Metrics
- **Analytics Engagement:** % of users who view Analytics page weekly
- **Session Duration:** Time spent on Analytics view (indicates value)
- **Insight Discovery:** % of users who identify patterns or correlations
- **Behavior Change:** % of users who report changing habits based on insights
- **Retention Impact:** Correlation between analytics usage and overall app retention
- **Chart Interactions:** Number of chart hovers, filters, zooms per session
- **Export Usage:** % of users exporting charts or reports

## User Personas

### Primary: The Data-Driven Optimizer
- **Demographics:** 25-45 years old, quantified-self enthusiast
- **Needs:** Deep insights, correlations, trends, data export, evidence-based decisions
- **Pain Points:** Surface-level tracking without insights, scattered data
- **Usage Pattern:** Weekly analytics reviews, A/B testing personal experiments

### Secondary: The Progress Seeker
- **Demographics:** 20-55 years old, goal-oriented, needs motivation
- **Needs:** Visual progress validation, achievement celebration, trend direction
- **Pain Points:** Can't "see" progress, loses motivation without feedback
- **Usage Pattern:** Monthly check-ins, milestone celebrations

### Tertiary: The Curious Explorer
- **Demographics:** 18-65 years old, enjoys self-discovery
- **Needs:** Surprising insights, pattern discovery, "aha moments"
- **Pain Points:** Doesn't know what to look for, overwhelming data
- **Usage Pattern:** Occasional browsing, exploration mode

## Functional Requirements

### 1. Overview Dashboard

#### 1.1 Summary Statistics
**Priority:** P0 (Critical)
- **High-Level Metrics:**
  - Total tasks completed (all-time, this month, this week)
  - Current active habits and average completion rate
  - Average mood (7-day, 30-day, all-time)
  - Journal entries count (this month, all-time, avg word count)
  - Upcoming countdowns and deadlines
- **Comparison Indicators:**
  - vs previous period (↑ 15% from last month)
  - Trend direction (↗ improving, → stable, ↘ declining)
  - Color coding (green = good, red = needs attention)

#### 1.2 Quick Insights
**Priority:** P1 (High)
- **Automated Insights:**
  - "Your mood is highest on Fridays" (day of week analysis)
  - "You complete 2x more tasks when you exercise" (correlation)
  - "Your 28-day habit streak is your longest ever!" (milestone)
  - "You've written 15,000 words this month" (achievement)
  - "You're most productive in the mornings" (time analysis)
- **Insight Cards:**
  - Rotating through 3-5 insights
  - Explanation + supporting data
  - Link to detailed chart
  - Refresh for new insights

### 2. Tasks Analytics

#### 2.1 Task Completion Metrics
**Priority:** P0 (Critical)
- **Statistics:**
  - Completion rate: % of created tasks that are completed
  - Tasks completed over time (line chart: daily, weekly, monthly)
  - Average time to completion (creation date → completed date)
  - Overdue task rate
  - Task velocity (tasks completed per week)
- **Visualizations:**
  - Line chart: tasks completed over time
  - Bar chart: tasks by status (todo, in progress, completed, snoozed)
  - Pie chart: tasks by priority distribution
  - Heatmap: task completion by day of week and time

#### 2.2 Task Patterns
**Priority:** P1 (High)
- **Analysis:**
  - Most productive day of week
  - Most productive time of day (when tasks are completed)
  - Average tasks completed per day
  - Busiest vs quietest weeks
- **Priority Analysis:**
  - Urgent tasks: created vs completed
  - Priority distribution over time
  - High-priority completion rate

#### 2.3 Task Categories
**Priority:** P1 (High)
- **Space Breakdown:**
  - Tasks per space (Work, Personal, Health, etc.)
  - Completion rate by space
  - Space comparison chart
- **Tag Analysis:**
  - Most common tags
  - Completion rate by tag
  - Tag combinations (frequently paired tags)

### 3. Habits Analytics

#### 3.1 Habit Completion Metrics
**Priority:** P0 (Critical)
- **Statistics:**
  - Overall completion rate across all habits
  - Completion trend over time
  - Active habits vs paused/archived
  - Total habit entries logged
  - Current streaks summary
- **Visualizations:**
  - Line chart: daily completion rate (% of targets met)
  - Bar chart: completion by habit
  - Stacked area chart: all habits completion over time
  - Streak timeline (visual streak history)

#### 3.2 Individual Habit Performance
**Priority:** P1 (High)
- **Per-Habit Analytics:**
  - Completion rate over time
  - Best streak vs current streak
  - Most consistent days/times
  - Frequency adherence (daily/weekly/monthly)
- **Habit Comparison:**
  - Compare 2-3 habits side-by-side
  - Identify easiest vs hardest habits
  - Correlation analysis (completing habit A → completing habit B)

#### 3.3 Habit Patterns
**Priority:** P1 (High)
- **Temporal Analysis:**
  - Best day of week for habit completion
  - Best time of day for logging
  - Seasonal variations (future: requires long-term data)
- **Success Factors:**
  - What else was done on high-completion days?
  - Mood correlation with habit completion
  - Environmental factors (future: weather, location)

### 4. Mood Analytics

#### 4.1 Mood Trends
**Priority:** P0 (Critical)
- **Statistics:**
  - Average mood (7-day, 30-day, 90-day, all-time)
  - Mood trend direction and % change
  - Highest and lowest recorded moods
  - Mood volatility (standard deviation)
  - Days above/below average
- **Visualizations:**
  - Line chart: mood over time with trend line
  - Bar chart: average mood by day of week
  - Histogram: mood distribution (how often at each 1-10 value)
  - Moving average overlay (7-day, 30-day)

#### 4.2 Mood Patterns
**Priority:** P1 (High)
- **Temporal Patterns:**
  - Best/worst day of week
  - Best/worst time of day
  - Weekend vs weekday mood
  - Monthly patterns (week 1 vs week 4)
- **Environmental Patterns:**
  - Mood by weather (future: weather API integration)
  - Mood by location (future: location tracking)

#### 4.3 Mood Correlations
**Priority:** P1 (High)
- **Tag Correlation Analysis:**
  - Tags associated with high moods (#exercise avg: 8.2)
  - Tags associated with low moods (#work-stress avg: 4.5)
  - Mood boosters and drainers ranked list
- **Activity Correlation:**
  - Mood on days with completed habits
  - Mood on days with completed tasks
  - Mood on days with journal entries
  - Cross-metric insights

### 5. Journal Analytics

#### 5.1 Writing Statistics
**Priority:** P1 (High)
- **Metrics:**
  - Total entries (all-time, this month, this week)
  - Total word count
  - Average words per entry
  - Writing streak (consecutive days)
  - Most prolific month/week
- **Visualizations:**
  - Bar chart: entries per month
  - Line chart: word count over time
  - Heatmap: journaling frequency (calendar view)

#### 5.2 Writing Patterns
**Priority:** P2 (Nice to Have)
- **Temporal Analysis:**
  - Most common journaling day
  - Most common journaling time
  - Average entry length by day of week
- **Content Analysis:**
  - Most used tags in journal entries
  - Most common words/phrases (word cloud)
  - Sentiment trend over time (future: NLP integration)

### 6. Cross-Metric Insights

#### 6.1 Correlation Matrix
**Priority:** P2 (Nice to Have)
- **Correlations:**
  - Mood vs habit completion rate
  - Mood vs task completion
  - Mood vs journal entry length
  - Task completion vs habit completion
  - Exercise habit vs overall mood
- **Visualization:**
  - Correlation heatmap
  - Scatter plots for strong correlations
  - Strength indicator (-1 to +1)

#### 6.2 Best Day Analysis
**Priority:** P2 (Nice to Have)
- **"Perfect Day" Profile:**
  - Characteristics of days with high mood (>8)
  - What habits were completed?
  - How many tasks completed?
  - Journaling present?
  - Day of week, weather, etc.
- **Actionable Recommendations:**
  - "Your best days include: exercise, completing 3+ tasks, journaling"
  - Suggest replicating best day patterns

### 7. Time-Based Analytics

#### 7.1 Historical Comparison
**Priority:** P1 (High)
- **Period Comparison:**
  - This week vs last week
  - This month vs last month
  - This quarter vs last quarter
  - This year vs last year (future)
- **Year-over-Year:**
  - Same month comparison
  - Seasonal trends
  - Long-term progress

#### 7.2 Time Range Selection
**Priority:** P0 (Critical)
- **Range Options:**
  - Last 7 days
  - Last 30 days
  - Last 90 days
  - Last 6 months
  - Last year
  - All time
  - Custom date range
- **Consistent Across Charts:**
  - Global time range filter
  - Apply to all charts option
  - Per-chart override option

### 8. Export & Sharing

#### 8.1 Data Export
**Priority:** P2 (Nice to Have)
- **Export Formats:**
  - CSV (raw data)
  - PDF (formatted report with charts)
  - PNG/JPG (individual charts)
  - JSON (structured data for analysis)
- **Export Options:**
  - Select metrics to include
  - Date range selection
  - Privacy filtering (exclude private entries)

#### 8.2 Reports
**Priority:** P3 (Future)
- **Pre-built Reports:**
  - Weekly summary report
  - Monthly review report
  - Quarterly progress report
  - Year in review
- **Scheduled Reports:**
  - Email weekly/monthly summaries
  - Automated insights delivery

### 9. Customization

#### 9.1 Chart Preferences
**Priority:** P2 (Nice to Have)
- **User Settings:**
  - Preferred chart types (line vs bar)
  - Color scheme preference
  - Metric visibility (show/hide specific charts)
  - Default time range
- **Layout Customization:**
  - Drag-and-drop chart reordering
  - Grid vs list layout
  - Chart size preferences

## Non-Functional Requirements

### Performance
- Chart rendering: < 500ms for 90 days of data
- Data aggregation: < 1 second for complex calculations
- Interactive chart updates: < 100ms (smooth)
- Lazy loading for below-the-fold charts
- Efficient data queries with proper indexing

### Accessibility
- Screen reader support for chart data (data tables as alternative)
- Keyboard navigation for chart interactions
- High contrast mode for charts
- Color-blind friendly palettes
- Text alternatives for all visual insights

### Data Privacy
- Respect privacy settings (exclude private journal entries)
- No external analytics tracking on user data
- Aggregation only (no raw data exposure in UI unless intentional)

### Scalability
- Support years of historical data
- Efficient aggregation queries
- Pagination for large datasets
- Client-side caching of aggregated data
- Incremental data loading

## User Experience

### Information Architecture
```
Analytics View
├── Header
│   ├── Page Title
│   └── Time Range Selector (Global)
├── Overview Section
│   ├── Summary Statistics Cards
│   │   ├── Tasks Summary
│   │   ├── Habits Summary
│   │   ├── Mood Summary
│   │   └── Journal Summary
│   └── Quick Insights Carousel
├── Tasks Analytics Section
│   ├── Section Header + Expand/Collapse
│   ├── Task Completion Chart (Line)
│   ├── Tasks by Status (Bar)
│   ├── Priority Distribution (Pie)
│   └── Productivity Heatmap
├── Habits Analytics Section
│   ├── Habit Completion Rate (Line)
│   ├── Completion by Habit (Bar)
│   ├── Streaks Timeline
│   └── Best/Worst Days Analysis
├── Mood Analytics Section
│   ├── Mood Trend (Line with moving average)
│   ├── Mood by Day of Week (Bar)
│   ├── Mood Distribution (Histogram)
│   └── Tag Correlations (Ranked list)
├── Journal Analytics Section
│   ├── Entries Over Time (Bar)
│   ├── Word Count Trend (Line)
│   └── Writing Heatmap (Calendar)
├── Cross-Metric Insights Section
│   ├── Correlation Matrix
│   └── Best Day Analysis
└── Export Section
    └── Export Button with Options
```

### User Flows

#### Flow 1: Weekly Progress Review
1. User opens Analytics view on Sunday evening
2. Global time range set to "Last 7 days"
3. User reviews summary statistics
4. Sees insight: "Mood up 12% from last week"
5. User expands Habits section
6. Sees 85% habit completion rate (good!)
7. User expands Mood section
8. Notices mood highest on Friday
9. Checks tasks completed on Friday (5 tasks)
10. User insight: Completing more tasks → better mood
11. User plans to maintain high task completion

#### Flow 2: Discovering Mood Boosters
1. User wants to understand what improves mood
2. User navigates to Analytics
3. User sets time range to "Last 90 days"
4. User scrolls to Mood Analytics section
5. User views "Tag Correlations" chart
6. Sees #exercise correlates with avg mood of 8.3
7. Sees #social correlates with avg mood of 7.9
8. Sees #work-stress correlates with avg mood of 5.2
9. User realizes: exercise and socializing boost mood
10. User commits to prioritizing these activities

#### Flow 3: Habit Optimization
1. User has 5 active habits but struggles with consistency
2. User opens Analytics view
3. User expands Habits Analytics section
4. User views "Completion by Habit" chart
5. Sees "Meditation" at 90% completion (easy!)
6. Sees "Evening reading" at 40% completion (hard)
7. User checks "Best Day" analysis for reading
8. Sees reading completed most on weekends
9. User adjusts reading habit target from daily to weekly
10. User sets realistic expectations based on data

#### Flow 4: Exporting for Therapy
1. User wants to share progress with therapist
2. User navigates to Analytics
3. User sets time range to "Last 30 days"
4. User scrolls to Export section
5. User selects "PDF Report"
6. User checks: Mood, Journal, Tasks (excludes private entries)
7. User clicks "Generate Report"
8. PDF downloads with charts and summary
9. User brings report to therapy session
10. Therapist and user discuss patterns together

### Visual Design

#### Chart Color Palette
- **Primary:** Cyan/blue gradient (#06b6d4 → #3b82f6)
- **Secondary:** Purple/pink gradient (#a855f7 → #ec4899)
- **Success:** Green (#22c55e)
- **Warning:** Yellow (#eab308)
- **Danger:** Red (#ef4444)
- **Neutral:** Gray scale

#### Chart Types
- **Line Charts:** Trends over time (mood, task completion, etc.)
- **Bar Charts:** Categorical comparisons (day of week, by habit)
- **Pie Charts:** Proportions (task status distribution)
- **Heatmaps:** Calendar views, time-of-day patterns
- **Scatter Plots:** Correlations between two metrics
- **Histograms:** Distribution analysis (mood values)

#### Typography
- Chart titles: Bold, 18-20px
- Axis labels: Regular, 12-14px
- Data labels: Regular, 10-12px
- Insight text: Regular, 14-16px

## Technical Specifications

### Frontend Components
```typescript
<AnalyticsView>
  <AnalyticsHeader>
    <h1>Analytics</h1>
    <GlobalTimeRangeSelector
      value={timeRange}
      onChange={setTimeRange}
    />
  </AnalyticsHeader>

  <OverviewSection>
    <SummaryStatsGrid>
      <StatCard metric="tasks" data={tasksSummary} />
      <StatCard metric="habits" data={habitsSummary} />
      <StatCard metric="moods" data={moodsSummary} />
      <StatCard metric="journal" data={journalSummary} />
    </SummaryStatsGrid>

    <QuickInsightsCarousel insights={generatedInsights} />
  </OverviewSection>

  <AnalyticsSection title="Tasks" icon={<CheckIcon />}>
    <LineChart
      data={tasksOverTime}
      title="Tasks Completed Over Time"
      xKey="date"
      yKey="count"
    />
    <BarChart
      data={tasksByStatus}
      title="Tasks by Status"
      xKey="status"
      yKey="count"
    />
    {/* More charts... */}
  </AnalyticsSection>

  <AnalyticsSection title="Habits" icon={<RepeatIcon />}>
    {/* Habit charts */}
  </AnalyticsSection>

  <AnalyticsSection title="Moods" icon={<SmileIcon />}>
    {/* Mood charts */}
  </AnalyticsSection>

  {/* More sections... */}

  <ExportSection>
    <ExportButton onExport={handleExport} />
  </ExportSection>
</AnalyticsView>
```

### Data Models
```typescript
interface AnalyticsTimeRange {
  start: string; // ISO date
  end: string; // ISO date
  preset?: '7d' | '30d' | '90d' | '6m' | '1y' | 'all' | 'custom';
}

interface TaskAnalytics {
  total_completed: number;
  completion_rate: number;
  avg_time_to_completion: number; // days
  overdue_rate: number;
  velocity: number; // tasks per week
  by_status: Record<string, number>;
  by_priority: Record<string, number>;
  by_space: Record<string, number>;
  over_time: { date: string; count: number }[];
  by_day_of_week: Record<string, number>;
}

interface HabitAnalytics {
  total_entries: number;
  overall_completion_rate: number;
  active_habits_count: number;
  current_streaks_total: number;
  by_habit: {
    habit_id: string;
    habit_name: string;
    completion_rate: number;
    current_streak: number;
    best_streak: number;
  }[];
  over_time: { date: string; completion_rate: number }[];
  by_day_of_week: Record<string, number>;
}

interface MoodAnalytics {
  average: number;
  trend: 'up' | 'down' | 'stable';
  trend_percent: number;
  highest: number;
  lowest: number;
  volatility: number; // standard deviation
  over_time: { date: string; value: number }[];
  by_day_of_week: Record<string, number>;
  by_time_of_day: Record<string, number>;
  tag_correlations: {
    tag: string;
    avg_mood: number;
    count: number;
  }[];
  distribution: Record<number, number>; // mood value → count
}

interface JournalAnalytics {
  total_entries: number;
  total_words: number;
  avg_words_per_entry: number;
  current_streak: number;
  longest_streak: number;
  over_time: { date: string; count: number; words: number }[];
  by_day_of_week: Record<string, number>;
  by_time_of_day: Record<string, number>;
  most_used_tags: { tag: string; count: number }[];
}

interface CrossMetricInsight {
  type: 'correlation' | 'pattern' | 'milestone' | 'recommendation';
  title: string;
  description: string;
  supporting_data: any;
  confidence: 'high' | 'medium' | 'low';
  actionable: boolean;
  action?: string;
}
```

### API Endpoints
```
GET /users/:user_id/analytics/summary           Get overview summary
GET /users/:user_id/analytics/tasks             Get task analytics
GET /users/:user_id/analytics/habits            Get habit analytics
GET /users/:user_id/analytics/moods             Get mood analytics
GET /users/:user_id/analytics/journal           Get journal analytics
GET /users/:user_id/analytics/correlations      Get cross-metric correlations
GET /users/:user_id/analytics/insights          Get generated insights

POST /users/:user_id/analytics/export           Export data (returns PDF/CSV/JSON)
```

### Chart Libraries
```typescript
// Using Recharts for React
import { LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={moodOverTime}>
    <XAxis
      dataKey="date"
      tickFormatter={(date) => format(new Date(date), 'MMM d')}
    />
    <YAxis domain={[1, 10]} />
    <Tooltip />
    <Legend />
    <Line
      type="monotone"
      dataKey="value"
      stroke="#06b6d4"
      strokeWidth={2}
      dot={{ r: 3 }}
    />
  </LineChart>
</ResponsiveContainer>
```

### Insight Generation Algorithm
```typescript
function generateInsights(analytics: AllAnalytics): CrossMetricInsight[] {
  const insights: CrossMetricInsight[] = [];

  // Mood improvement insight
  if (analytics.moods.trend === 'up' && analytics.moods.trend_percent > 10) {
    insights.push({
      type: 'pattern',
      title: 'Mood Improving',
      description: `Your mood is up ${analytics.moods.trend_percent}% from last period`,
      supporting_data: { trend: analytics.moods.over_time },
      confidence: 'high',
      actionable: false,
    });
  }

  // Habit-mood correlation
  const exerciseTag = analytics.moods.tag_correlations.find(t => t.tag === 'exercise');
  if (exerciseTag && exerciseTag.avg_mood > analytics.moods.average + 1) {
    insights.push({
      type: 'correlation',
      title: 'Exercise Boosts Your Mood',
      description: `Your mood averages ${exerciseTag.avg_mood.toFixed(1)} on days with exercise, compared to ${analytics.moods.average.toFixed(1)} overall`,
      supporting_data: { tag: exerciseTag },
      confidence: 'high',
      actionable: true,
      action: 'Consider exercising more frequently',
    });
  }

  // Streak milestone
  if (analytics.habits.current_streaks_total > 0) {
    const longestStreak = Math.max(...analytics.habits.by_habit.map(h => h.current_streak));
    if (longestStreak >= 30) {
      insights.push({
        type: 'milestone',
        title: 'Impressive Habit Streak!',
        description: `You have a ${longestStreak}-day streak going!`,
        supporting_data: { streak: longestStreak },
        confidence: 'high',
        actionable: false,
      });
    }
  }

  // More insight generation logic...

  return insights.slice(0, 5); // Return top 5 insights
}
```

## Dependencies

### Internal
- Tasks system (data source)
- Habits system (data source)
- Moods system (data source)
- Journal system (data source)
- Countdowns system (data source)

### External
- React Query (data fetching, caching)
- Recharts or Chart.js (data visualization)
- date-fns (date calculations, formatting)
- jsPDF (PDF generation for exports)
- PapaParse (CSV generation)
- Lodash (data aggregation utilities)

## Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Performance issues with large datasets | High | Medium | Efficient aggregation queries, pagination, caching, lazy loading |
| Overwhelming users with too much data | Medium | High | Progressive disclosure, collapsible sections, guided tours |
| Misleading correlations (causation vs correlation) | Medium | Medium | Clear disclaimers, confidence levels, avoid strong causal language |
| Chart rendering bugs across browsers | Medium | Low | Thorough testing, fallbacks to tables, responsive design |
| Privacy concerns with data export | High | Low | Privacy filters, exclude sensitive data, user controls |

## Future Enhancements

### Phase 2
- AI-powered insights and recommendations
- Predictive analytics (mood forecasting, habit success prediction)
- Goal setting with progress tracking against benchmarks
- Social comparison (opt-in, anonymous aggregated data)
- Advanced filtering and drill-down capabilities

### Phase 3
- Custom dashboards with drag-and-drop widgets
- Automated weekly/monthly email reports
- Integration with third-party data (fitness trackers, calendars)
- Advanced correlations (weather, sleep, location)
- A/B testing framework for personal experiments

### Phase 4
- Machine learning for pattern detection
- Natural language insights ("Explain my data in plain English")
- Voice-activated analytics queries
- Collaborative analytics (therapist dashboards)
- Public anonymized benchmarking

## Open Questions

1. What's the minimum data threshold for showing meaningful analytics (30 days, 90 days)?
2. Should we show analytics even with sparse data, or wait until sufficient data exists?
3. How do we balance complexity (power users) vs simplicity (casual users)?
4. Should insights be AI-generated or rule-based initially?
5. What's the ideal default time range: 30 days or 90 days?
6. Should we support real-time analytics or daily aggregation batches?

## Appendix

### A. Chart Best Practices
- Always include axis labels
- Use consistent color schemes across charts
- Provide interactive tooltips with exact values
- Support zooming and panning for detailed exploration
- Offer alternative text/table views for accessibility
- Responsive design for mobile viewing

### B. Statistical Methods
- **Moving Averages:** Smooth out noise in trend lines (7-day, 30-day)
- **Standard Deviation:** Measure volatility and consistency
- **Correlation Coefficients:** Pearson correlation for linear relationships
- **Trend Lines:** Linear regression for long-term direction
- **Percentiles:** Identify outliers and exceptional days

### C. Analytics Events
```
- analytics_viewed
- chart_interacted (hover, click, zoom)
- time_range_changed
- insight_viewed
- export_generated
- section_expanded
- correlation_discovered (user-reported)
```

### D. Export Report Template
```
Daybeam Analytics Report
User: [Name]
Period: [Start Date] - [End Date]
Generated: [Timestamp]

=== SUMMARY ===
Tasks Completed: X
Habit Completion Rate: Y%
Average Mood: Z/10
Journal Entries: N

=== CHARTS ===
[Chart images embedded]

=== INSIGHTS ===
1. [Insight 1]
2. [Insight 2]
...

=== RAW DATA ===
[CSV tables]
```
