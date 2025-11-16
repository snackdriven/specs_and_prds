# Feature Design Specifications - Executive Summary

## What Was Delivered

Complete technical specifications for 5 major EDC features, ready for implementation.

---

## 1. Calendar System (120 hours MVP)

### What It Does
Full-featured calendar with Google Calendar sync, task integration, and multiple view modes.

### Key Decisions Made

**Calendar Views:**
- Month (default), Week, Day, Agenda
- ❌ Excluded: 3-day, Workweek, Year (unnecessary complexity)

**Google Calendar Sync:**
- **Default mode:** Bidirectional (both ways)
- **OAuth flow:** Fully documented with code examples
- **Sync frequency:** Real-time push to Google, 15-min polling from Google
- **Conflict resolution:** Last-write-wins with user notification
- **MVP:** Single calendar only (multiple calendars in V2)

**Task Integration:**
- Task with due date → Auto-create calendar event
- Visual distinction: Orange prefix "⏰" for task events
- Bidirectional updates (move event → updates task)
- **Default time:** 9:00 AM if no time specified

**Event Creation:**
- Quick add: Natural language ("Dentist tomorrow at 2pm")
- Full form: All fields with recurrence support
- Drag & drop: Reschedule by dragging events

**Recurring Events:**
- Simplified UI: Daily, Weekly, Monthly, Yearly, Custom
- RRULE format stored in JSONB
- Materialized view generates instances

### Database Schema
Complete SQL provided:
- `calendar_events` table with JSONB recurrence
- `google_calendar_sync` table for OAuth tokens
- `calendar_event_reminders` table
- Materialized view for recurring instances
- 8 indexes for performance

### Files Created
- `C:/Users/bette/Desktop/specs_and_prds/docs/design/features/calendar/specification.md`

---

## 2. Spotify Integration (38 hours total, 20h MVP)

### What It Does
"Now Playing" widget with journal integration and playback history.

### Key Decisions Made

**Authentication:**
- OAuth 2.0 flow fully documented
- Scopes: currently-playing, playback-state, recently-played
- Token refresh strategy included

**Now Playing Widget:**
- **Placement:** Dashboard header (right side)
- **Size:** Compact (32px album art) with expand option
- **Update frequency:** Poll every 30 seconds (MVP), SSE in V2
- **No music state:** Show "Not listening" or hide (user preference)

**Journal Integration:**
- **Auto-capture:** When opening journal, auto-add current song
- **Manual capture:** "Add current song" button in editor
- **Display:** Album art + track info in journal view
- **Storage:** JSONB metadata in journal_entries table

**Controls:**
- **MVP:** Display only (no play/pause)
- **V2:** Full controls (play, pause, skip, volume)

**Mood Correlation (V3):**
- Track genre, valence, energy metrics
- Correlate with mood logs
- Insights: "You're happier listening to indie rock"
- Requires 100+ entries for meaningful data

### Database Schema
- `spotify_tokens` table for OAuth
- `spotify_playback_history` table for tracking
- `spotify_current_playback` cache table
- Trigger to auto-log playback changes

### Files Created
- `C:/Users/bette/Desktop/specs_and_prds/docs/design/features/spotify/specification.md`

---

## 3. Weather Integration (24 hours total, 16h MVP)

### What It Does
Weather widget with forecasts and context-aware task suggestions.

### Key Decisions Made

**API Choice:**
- **Tomorrow.io** free tier (500 calls/day)
- Cache aggressively (3-hour expiry)
- Update every 3 hours via cron

**Location:**
- **MVP:** IP-based (ipapi.co, free, no auth)
- **V2:** Manual city entry
- **V3:** GPS with permissions

**Dashboard Widget:**
- **Dedicated widget** (not compact header)
- Shows: Current temp, feels like, high/low, 4-day forecast
- Additional: Precipitation %, humidity, wind, UV index

**Smart Features:**
- **Context suggestions:** "Rainy day - great for indoor tasks"
- **Weather-aware filtering (V2):** Show indoor tasks when raining
- **Mood correlation (V2):** Track weather in mood logs, show insights

**Data Displayed:**
- Current: Temp, feels like, description, icon
- Forecast: Next 4 days (high/low, icon, precip %)
- Details: Humidity, wind, UV index, visibility

### Rate Limits & Mitigation
- 500 calls/day, 25/hour, 3/minute
- **Solution:** Cache 3 hours, update every 3 hours = 8 calls/day
- Fallback to stale cache if rate limited

### Database Schema
- `weather_cache` table (single row per user)
- `weather_forecast` table (4 days)
- `user_weather_preferences` table
- `weather_history` table for mood correlation (V2)

### Files Created
- `C:/Users/bette/Desktop/specs_and_prds/docs/design/features/weather/specification.md`

---

## 4. Countdowns & Concerts (64 hours total, 44h MVP)

### What It Does
Track upcoming events with urgency levels; specialized concert tracking with ticket workflow.

### Key Decisions Made

**Countdown Fields:**
- Title, target date/time, description, color, icon
- Links to calendar event and/or task
- Belongs to space

**Urgency Tiers:**
- **Expired:** Past due → Gray
- **Critical:** <3 days → Red
- **Urgent:** 3-7 days → Orange
- **Soon:** 7-14 days → Amber
- **Normal:** >14 days → Blue

**Auto-Archive:**
- Archive expired countdowns automatically
- User setting: Archive X days after passing (default: 0)
- Optional: Delete archived countdowns after Y days

**Display Formats:**
- Simple: "12 days"
- Detailed: "12 days, 5 hours, 23 min"
- Date-focused: "Until April 15, 2025"
- Ring: Progress ring with % elapsed

**Concert Tracking:**
- Extends countdown with venue, artist, ticket info
- **Simplified 6-stage workflow:**
  1. Interested
  2. Looking for tickets
  3. Tickets purchased
  4. Ready to attend
  5. Attended
  6. Missed

**Concert-Specific Fields:**
- Venue (name, address, lat/long)
- Artist + supporting acts
- Ticket status, price, confirmation, link
- Travel time (manual in MVP, Google Maps API in V2)
- Departure time (auto-calculated)
- Parking info, notes

**Calendar Integration:**
- Countdown → Auto-create calendar event
- Concert → Calendar event with venue address, reminders
- Reminders: 1 hour before, when to leave, day before

**Data Model:**
- **Table-per-type inheritance:**
  - `countdowns` table (base)
  - `concerts` table (extends countdowns via foreign key)
  - `venues` table (reusable)

### Database Schema
- `countdowns` table with type discrimination
- `concerts` table (references countdowns.id)
- `venues` table (normalized)
- `countdown_notifications` queue
- Triggers for auto-archive

### Files Created
- `C:/Users/bette/Desktop/specs_and_prds/docs/design/features/countdowns/specification.md`

---

## 5. Spaces System (26 hours total, 16h MVP)

### What It Does
Organizational contexts (Work, Personal, Health) for all items with filtering.

### Key Decisions Made

**Space Creation:**
- **Hybrid approach:** 2 default spaces + unlimited custom
- **Default spaces:** Personal (default), Work
- **Fields:** Name (required), description, color, icon, sort order
- **One default:** Only one space can be default for new items

**Space Assignment:**
- **Single space:** Items belong to exactly ONE space
- **Cannot change:** Can change space anytime (no restrictions)
- **Bulk operations:** Select multiple items → Move to space
- **Cannot delete:** Cannot delete space with items (must move/delete first)

**Filtering:**
- **Global filter:** Top-level dropdown affects entire app
- **URL-based:** Filter reflected in URL (/dashboard?space=work)
- **Persisted:** Remember last selected space in localStorage
- **Per-pane (V2):** Each pane can have independent filter

**Space Analytics:**
- Task stats (pending, completed, overdue)
- Habit stats (total, avg streak)
- Event stats (upcoming)
- Productivity rate (completion %)
- Materialized view for performance

**ATLAS Integration:**
- **ATLAS is NOT a space** - it's a separate workspace
- JIRA tickets don't have spaceId
- Can create EDC task from JIRA ticket → assign to space
- Work space doesn't automatically include JIRA tickets (too complex for MVP)

**Space Defaults (V2):**
- Different defaults per space
- Task priority, duration
- Habit frequency
- Event duration

**Space Themes (V2+):**
- Dark/light theme per space
- Too complex for ADHD user, defer to V2+

### Database Schema
- `spaces` table with unique default constraint
- Add `space_id` to all entity tables (tasks, habits, etc.)
- `space_defaults` table (V2)
- `space_analytics` materialized view
- Triggers:
  - Prevent deletion with items
  - Ensure one default space
  - Update timestamps

### Files Created
- `C:/Users/bette/Desktop/specs_and_prds/docs/design/features/spaces/specification.md`

---

## Implementation Roadmap

### Total Effort

| Phase | Hours | Days (8h/day) |
|-------|-------|---------------|
| MVP | 216h | 27 days |
| V2 | 92h | 11.5 days |
| V3+ | 40h | 5 days |
| **Total** | **348h** | **43.5 days** |

### Recommended Build Order

**Sprint 1 (Week 1-2): Foundation**
1. **Spaces** (3 days) - Core infrastructure, all items depend on it
2. **Countdowns** (3 days) - Simple feature to validate patterns
3. **Weather** (2 days) - Practice with external APIs

**Sprint 2 (Week 3-5): Calendar**
1. **Basic Calendar** (2 weeks) - UI, CRUD, views
2. **Google Sync** (1 week) - OAuth, bidirectional sync

**Sprint 3 (Week 6-7): Enhancements**
1. **Spotify** (1 week) - Now Playing, journal integration
2. **Concerts** (1 week) - Extend countdowns, ticket workflow

**Sprint 4 (Week 8+): V2 Features**
- Advanced calendar (recurring events, templates)
- Mood correlation (Weather, Spotify)
- Performance optimization

---

## Technical Stack

### Frontend
- React 18+ with TypeScript
- FullCalendar or react-big-calendar
- date-fns for date handling
- chrono-node for natural language parsing

### Backend
- Node.js + Express
- PostgreSQL 14+ with JSONB
- Cron jobs for scheduled tasks

### External APIs
- **Google Calendar API** - OAuth 2.0, bidirectional sync
- **Spotify Web API** - OAuth 2.0, now playing
- **Tomorrow.io Weather API** - API key, 500 calls/day
- **Google Maps Distance Matrix API** (V2) - Drive time

---

## Database Overview

### Total Tables: 22

**Core:**
- spaces (5 columns)
- space_defaults (7 columns) - V2

**Calendar:**
- calendar_events (18 columns)
- google_calendar_sync (10 columns)
- calendar_event_reminders (4 columns)

**Spotify:**
- spotify_tokens (7 columns)
- spotify_playback_history (13 columns)
- spotify_current_playback (10 columns)

**Weather:**
- weather_cache (20 columns)
- weather_forecast (9 columns)
- user_weather_preferences (10 columns)
- weather_history (10 columns) - V2

**Countdowns:**
- countdowns (17 columns)
- concerts (17 columns)
- venues (12 columns)
- countdown_notifications (7 columns)

**Analytics:**
- space_analytics (materialized view)
- calendar_event_instances (materialized view)

### Total Indexes: 35+
All indexed for performance on user_id, foreign keys, and common query patterns.

---

## API Endpoints

### Total Endpoints: 60+

**Spaces:** 6 endpoints
**Calendar:** 12 endpoints
**Spotify:** 8 endpoints
**Weather:** 8 endpoints
**Countdowns:** 12 endpoints
**Concerts:** 6 endpoints
**Venues:** 3 endpoints

All documented with:
- Request/response schemas
- Error handling
- Example payloads

---

## Key Technical Decisions

### 1. Single Space Assignment
**Decision:** Items belong to exactly ONE space
**Rationale:** Simpler for ADHD user, avoids analysis paralysis
**Alternative considered:** Multiple spaces per item (too complex)

### 2. Table-Per-Type Inheritance (Concerts)
**Decision:** Concerts extend countdowns via foreign key
**Rationale:** Code reuse, clean separation, easy to query
**Alternative considered:** Single table with nullable fields (messy)

### 3. ATLAS Separation
**Decision:** ATLAS is NOT a space
**Rationale:** Work integration is different from personal organization
**Alternative considered:** ATLAS as "Work" space (mixing concerns)

### 4. Aggressive Weather Caching
**Decision:** Cache 3 hours, update every 3 hours
**Rationale:** 500 API calls/day limit, weather doesn't change much
**Alternative considered:** Hourly updates (would hit rate limit)

### 5. Calendar Sync: Polling vs Webhooks
**Decision:** 15-min polling for MVP, webhooks in V2
**Rationale:** Webhooks require domain verification (setup complexity)
**Alternative considered:** Webhooks from day 1 (over-engineering)

### 6. Spotify Update Frequency
**Decision:** Poll every 30 seconds
**Rationale:** Balance between freshness and API load
**Alternative considered:** Real-time SSE (premature optimization)

---

## What's Different from Original Specs

### Clarifications Made

1. **Calendar Views:** Excluded 3-day, workweek, year views (low utility)
2. **Concert Workflow:** Simplified from 9 stages to 6 (more manageable)
3. **Space Filtering:** Global only for MVP (per-pane in V2)
4. **Spotify Controls:** Display-only for MVP (controls in V2)
5. **Weather Location:** IP-based for MVP (manual/GPS in V2)

### New Features Added

1. **Auto-Archive:** Countdowns auto-archive after passing
2. **Smart Suggestions:** Weather-aware task recommendations
3. **Progress Ring:** Alternative countdown display format
4. **Departure Time:** Auto-calculate for concerts
5. **Space Analytics:** Productivity metrics per space

---

## Files Delivered

All files in: `C:/Users/bette/Desktop/specs_and_prds/docs/design/`

1. **INDEX.md** - Complete overview and integration map
2. **SUMMARY.md** - This file (executive summary)
3. **features/calendar/specification.md** (15,000 words)
4. **features/spotify/specification.md** (8,000 words)
5. **features/weather/specification.md** (6,000 words)
6. **features/countdowns/specification.md** (9,000 words)
7. **features/spaces/specification.md** (7,000 words)

**Total:** ~45,000 words of technical documentation

---

## Next Steps for Development

### 1. Review & Approve
- Review all specifications
- Confirm MVP scope aligns with goals
- Approve technical decisions

### 2. Setup Infrastructure
- Create PostgreSQL database
- Set up development environment
- Configure external API accounts (Google, Spotify, Tomorrow.io)

### 3. Begin Implementation
- Follow recommended build order (Spaces → Countdowns → Weather → Calendar → Spotify)
- Copy-paste SQL schemas from specifications
- Use API endpoint documentation for backend routes

### 4. Test Integrations
- Verify space filtering works across all entities
- Test task → calendar event sync
- Test Google Calendar bidirectional sync
- Test Spotify journal integration

### 5. Iterate to V2
- Collect usage data
- Prioritize V2 features based on real needs
- Add mood correlation analytics

---

## Questions Answered

### Calendar

**Q:** Which calendar views?
**A:** Month (default), Week, Day, Agenda. Excluded: 3-day, workweek, year.

**Q:** Google Calendar sync mode?
**A:** Bidirectional by default. User can choose push-only or pull-only.

**Q:** How often to sync?
**A:** Real-time to Google, 15-min polling from Google, manual sync button.

**Q:** What if event edited in both places?
**A:** Last-write-wins with user notification.

**Q:** Task deadline → calendar event?
**A:** Yes, auto-create. Default 9 AM if no time specified. Updates bidirectional.

### Spotify

**Q:** Where to place widget?
**A:** Dashboard header (right side), compact by default.

**Q:** How often to update?
**A:** Poll every 30 seconds (MVP), SSE in V2.

**Q:** Auto-capture in journal?
**A:** Yes, when opening journal editor. Also manual "Add current song" button.

**Q:** Playback controls?
**A:** Display-only for MVP, full controls in V2.

### Weather

**Q:** Which weather API?
**A:** Tomorrow.io (500 calls/day free).

**Q:** How to get location?
**A:** IP-based for MVP, manual entry in V2, GPS in V3.

**Q:** How often to update?
**A:** Every 3 hours (8 calls/day), cache for 3 hours.

**Q:** Smart features?
**A:** Context-aware suggestions ("Rainy day - indoor tasks"). Mood correlation in V2.

### Countdowns

**Q:** Urgency levels?
**A:** 5 tiers: Expired, Critical (<3d), Urgent (3-7d), Soon (7-14d), Normal (>14d).

**Q:** Concert workflow stages?
**A:** 6 stages: Interested → Looking → Purchased → Ready → Attended/Missed.

**Q:** Auto-archive?
**A:** Yes, configurable. Archive X days after passing, delete after Y days.

**Q:** Drive time calculation?
**A:** Manual entry for MVP, Google Maps API in V2.

### Spaces

**Q:** Pre-defined or custom?
**A:** Hybrid. 2 defaults (Personal, Work) + unlimited custom.

**Q:** How many spaces per item?
**A:** Exactly one. No multi-space assignment.

**Q:** Global or per-pane filter?
**A:** Global for MVP (affects all views), per-pane in V2.

**Q:** ATLAS integration?
**A:** ATLAS is separate from spaces. Can create EDC task from JIRA → assign to space.

---

## Success Criteria

**MVP is complete when:**
- ✅ All 5 features implemented (216 hours)
- ✅ All database schemas deployed
- ✅ All API endpoints functional
- ✅ External APIs integrated (Google, Spotify, Tomorrow.io)
- ✅ Space filtering works across all entities
- ✅ Calendar syncs bidirectionally with Google
- ✅ Task deadlines appear on calendar
- ✅ Spotify shows now playing and captures in journal
- ✅ Weather displays with 4-day forecast
- ✅ Countdowns track urgency and create calendar events
- ✅ Concerts track ticket workflow

**Ready for V2 when:**
- User has 2+ weeks of real usage
- Have data for mood correlation
- Performance bottlenecks identified
- User feedback collected

---

**Prepared by:** Backend API Developer Agent
**Date:** 2025-04-15
**For:** EDC Desktop Web App (Solo ADHD User)
