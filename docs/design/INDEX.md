# Feature Design Specifications - Index

This directory contains detailed technical specifications for all EDC features.

## Overview

All specifications follow the same structure:
1. Complete Feature Specification (UI, workflows, edge cases)
2. Database Schema (PostgreSQL, copy-paste ready)
3. API Endpoints (REST with request/response examples)
4. Integration Points (how features connect)
5. Implementation Priority (MVP → V2 → V3)
6. Technical Considerations (performance, caching, error handling)

## Features

### 1. Calendar System
**File:** `features/calendar/specification.md`
**Estimated Effort:** 120 hours (~3 weeks)

**Key Features:**
- Full calendar with Month/Week/Day/Agenda views
- Google Calendar bidirectional sync with OAuth
- Task deadline integration (due dates → calendar events)
- Drag & drop rescheduling
- Quick add with natural language parsing
- Recurring events support

**MVP Priority:**
- Phase 1: Basic calendar + views (60h)
- Phase 2: Google sync (30h)
- Phase 3: Advanced features (20h)
- Phase 4: Polish (10h)

**Technical Stack:**
- React + FullCalendar or react-big-calendar
- Google Calendar API with OAuth 2.0
- chrono-node for natural language parsing
- PostgreSQL with JSONB for recurrence rules

---

### 2. Spotify Integration
**File:** `features/spotify/specification.md`
**Estimated Effort:** 38 hours (~1 week)

**Key Features:**
- Now Playing widget with album art
- Auto-capture song in journal entries
- Recently played history
- Playback controls (V2)
- Mood correlation analytics (V3)

**MVP Priority:**
- Phase 1: OAuth + Now Playing widget (20h)
- Phase 2: Enhanced display (10h)
- Phase 3: Playback controls (8h)
- Phase 4: Analytics (20h, V3+)

**Technical Stack:**
- Spotify Web API with OAuth 2.0
- Polling (30s) for MVP, SSE for V2
- PostgreSQL JSONB for journal metadata
- Rate limiting: No documented limits for personal use

---

### 3. Weather Integration
**File:** `features/weather/specification.md`
**Estimated Effort:** 24 hours (~3 days)

**Key Features:**
- Current conditions + 4-day forecast
- IP-based location detection
- Context-aware suggestions ("Great day for outdoor tasks")
- Weather-mood correlation (V2)
- Task filtering by indoor/outdoor (V2)

**MVP Priority:**
- Phase 1: Current weather + forecast (16h)
- Phase 2: Smart suggestions (8h)
- Phase 3: Task integration (10h, V2)
- Phase 4: Mood correlation (12h, V2)

**Technical Stack:**
- Tomorrow.io API (500 calls/day free tier)
- ipapi.co for geolocation (free, no auth)
- Aggressive caching (3-hour expiry)
- PostgreSQL for weather cache

**Rate Limits:**
- 500 API calls/day
- 25 calls/hour
- 3 calls/minute
- **Mitigation:** Cache for 3 hours, update every 3 hours

---

### 4. Countdowns & Concerts
**File:** `features/countdowns/specification.md`
**Estimated Effort:** 64 hours (~8 days)

**Key Features:**
- Countdown tracking with urgency tiers (Critical/Urgent/Soon/Normal)
- Concert tracking with 6-stage ticket workflow
- Venue management with drive time calculation
- Calendar integration
- Auto-archive expired countdowns

**Urgency Tiers:**
- Expired: Past due (gray)
- Critical: <3 days (red)
- Urgent: 3-7 days (orange)
- Soon: 7-14 days (amber)
- Normal: >14 days (blue)

**Concert Workflow:**
1. Interested
2. Looking for tickets
3. Tickets purchased
4. Ready to attend
5. Attended
6. Missed

**MVP Priority:**
- Phase 1: Basic countdowns (24h)
- Phase 2: Concerts (20h)
- Phase 3: Advanced features (12h)
- Phase 4: Polish (8h)

**Technical Stack:**
- PostgreSQL with table-per-type inheritance
- Real-time countdown updates (every minute)
- Notification queue for reminders
- Google Maps API for drive time (V2)

---

### 5. Spaces System
**File:** `features/spaces/specification.md`
**Estimated Effort:** 26 hours (~3 days)

**Key Features:**
- Organizational contexts (Work, Personal, Health, etc.)
- All items belong to exactly one space
- Global space filter affecting entire app
- Space analytics (task completion, productivity)
- Cannot delete space with items

**Default Spaces:**
- Personal (default)
- Work

**MVP Priority:**
- Phase 1: Basic spaces + filtering (16h)
- Phase 2: Enhanced features (10h)
- Phase 3: Advanced (12h, V2)

**Technical Stack:**
- PostgreSQL with foreign keys + triggers
- Unique constraint on default space
- Materialized view for analytics
- URL-based filtering for shareable links

**ATLAS Integration:**
- ATLAS is separate from spaces (not a space)
- Can create EDC task from JIRA ticket → assign to space
- JIRA tickets don't have spaceId

---

## Implementation Summary

### Total Effort Estimates

| Feature | MVP | V2 | V3+ | Total |
|---------|-----|----|----|-------|
| Calendar | 120h | 30h | 20h | 170h |
| Spotify | 20h | 10h | 20h | 50h |
| Weather | 16h | 22h | - | 38h |
| Countdowns | 44h | 20h | - | 64h |
| Spaces | 16h | 10h | - | 26h |
| **Total** | **216h** | **92h** | **40h** | **348h** |

**MVP Timeline:** ~27 working days (216 hours ÷ 8 hours/day)
**Full Implementation:** ~43 working days (348 hours ÷ 8 hours/day)

### Recommended Build Order

**Sprint 1 (Week 1-2): Foundation**
1. Spaces system (3 days) - Core infrastructure
2. Basic countdowns (3 days) - Simple feature to validate patterns
3. Weather integration (2 days) - External API practice

**Sprint 2 (Week 3-5): Calendar**
1. Basic calendar UI + CRUD (2 weeks)
2. Google Calendar sync (1 week)

**Sprint 3 (Week 6-7): Enhancements**
1. Spotify integration (1 week)
2. Concert tracking (1 week)

**Sprint 4 (Week 8+): Polish & V2 Features**
- Advanced calendar features
- Mood correlation analytics
- Performance optimization

---

## Database Schema Files

All CREATE TABLE statements are copy-paste ready from:
- `features/calendar/specification.md` → Calendar + Google sync tables
- `features/spotify/specification.md` → Spotify tokens + playback history
- `features/weather/specification.md` → Weather cache + forecast + preferences
- `features/countdowns/specification.md` → Countdowns + concerts + venues
- `features/spaces/specification.md` → Spaces + analytics materialized view

---

## API Documentation

All endpoints documented with:
- Request method + path
- Request body schema
- Response codes + body
- Error handling examples

See individual specification files for complete API reference.

---

## Integration Map

```
┌─────────────────────────────────────────────────┐
│                   DASHBOARD                     │
│  ┌─────────────────────────────────────────┐   │
│  │ Space Filter: [All Spaces ▾]            │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌──────────┬──────────┬──────────┬─────────┐  │
│  │ Weather  │ Spotify  │ Tasks    │ Calendar│  │
│  │ Widget   │ Widget   │          │         │  │
│  └──────────┴──────────┴──────────┴─────────┘  │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ Countdowns & Concerts                   │   │
│  │ • The National - 2 DAYS (CRITICAL)      │   │
│  │ • Wedding - 85 DAYS (NORMAL)            │   │
│  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘

INTEGRATIONS:
• Tasks → Calendar (due dates → events)
• Countdowns → Calendar (target dates → events)
• Spotify → Journal (auto-capture now playing)
• Weather → Tasks (indoor/outdoor filtering, V2)
• Weather → Mood (correlation analytics, V2)
• Spaces → Everything (all items belong to space)
```

---

## Technical Stack Summary

**Frontend:**
- React 18+
- TypeScript
- FullCalendar or react-big-calendar
- date-fns for date handling
- chrono-node for natural language parsing

**Backend:**
- Node.js + Express
- PostgreSQL 14+
- JSONB for flexible data (recurrence, metadata)
- Materialized views for analytics

**External APIs:**
- Google Calendar API (OAuth 2.0)
- Spotify Web API (OAuth 2.0)
- Tomorrow.io Weather API (API key)
- Google Maps Distance Matrix API (V2)

**Infrastructure:**
- Cron jobs for:
  - Weather updates (every 3 hours)
  - Countdown notifications (every 15 min)
  - Analytics refresh (daily)
  - Expired countdown archival (daily)

---

## Next Steps

1. **Review all specifications** - Ensure alignment with product vision
2. **Prioritize features** - Confirm MVP scope
3. **Set up database** - Run schema migrations
4. **Implement in order** - Follow recommended build order
5. **Test integrations** - Verify all connections work
6. **Iterate to V2** - Add advanced features based on usage

---

**Last Updated:** 2025-04-15
**Author:** Backend API Developer Agent
**For:** EDC Desktop Web App (Solo ADHD User)
