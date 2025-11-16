# RSS Feeds - Product Requirements Document

**Feature Area:** RSS Feed Reader & Content Aggregation
**Version:** 1.0
**Last Updated:** 2025-11-15
**Status:** Implemented

---

## Overview

The RSS Feeds system provides content aggregation from favorite websites and blogs, allowing users to stay informed without the distraction of social media. Designed for focused content consumption aligned with ADHD-friendly information management.

## Problem Statement

Information consumption challenges:
- **Social media overwhelm** - Algorithm-driven feeds are distracting
- **Missing updates** - Important content lost in noise
- **Context switching** - Visiting multiple sites daily
- **Time blindness** - Hours lost scrolling feeds
- **Information anxiety** - Fear of missing important content

## Goals

1. Aggregate content from multiple sources
2. Present clean, distraction-free reading experience
3. Support categorization and filtering
4. Enable time-based filtering (today, this week, etc.)
5. Respect user attention and time

## User Stories

- As a user, I can add RSS feeds from websites
- As a user, I can organize feeds into categories
- As a user, I can view all items chronologically
- As a user, I can filter items by time period
- As a user, I can mark items as read
- As a user, I can favorite items for later
- As a user, I can search feed items
- As a user, I can refresh feeds manually or automatically

## Functional Requirements

### Data Models

```typescript
interface RssFeed {
  id: string;
  user_id: string;
  url: string;
  title: string;
  description?: string;
  category_id?: string;
  last_fetched_at?: Date;
  fetch_interval_minutes?: number; // Default 60
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

interface RssFeedItem {
  id: string;
  feed_id: string;
  title: string;
  link: string;
  description?: string;
  pub_date: Date;
  author?: string;
  content?: string; // Full content if available
  read: boolean;
  favorited: boolean;
  created_at: Date;
}

interface RssCategory {
  id: string;
  user_id: string;
  name: string;
  color?: string;
  order: number;
  created_at: Date;
  updated_at: Date;
}

interface RssSettings {
  user_id: string;
  auto_refresh_enabled: boolean;
  auto_refresh_interval_minutes: number;
  items_per_page: number;
  default_time_filter: string; // 'all', 'today', 'week', 'month'
}
```

### Feed Management

**Add Feed:**
- Enter RSS/Atom URL
- Auto-detect feed if given website URL
- Fetch initial items
- Assign to category (optional)

**Refresh Feed:**
- Manual refresh button
- Auto-refresh on interval
- Background job for all feeds
- Show last updated timestamp

**Delete Feed:**
- Remove feed
- Option to keep or delete items

### Item Display

**List View:**
- Component: `RssItemCard.tsx`
- Chronological order (newest first)
- Show title, source, pub date, excerpt
- Click to expand or open in new tab
- Mark read on click (optional)

**Feed List:**
- Component: `RssFeedList.tsx`
- Show all subscribed feeds
- Unread count per feed
- Click to filter to that feed

**Controls:**
- Component: `RssViewControls.tsx`
- Time filter dropdown
- Category filter
- Search box
- Refresh button
- Mark all as read

### Categories

**Category Management:**
- Create categories
- Assign feeds to categories
- Color-code categories
- Filter by category

### Time Filtering

**Presets:**
- All items
- Today
- This week
- This month
- Custom date range

**Implementation:**
Filter items by `pub_date` on client or server

### Reading Experience

**Item Card:**
- Title (linked to original)
- Source feed name
- Publication date (relative: "2 hours ago")
- Excerpt or full content
- Actions: Read/unread, favorite, share

**Expanded View:**
- Full content (if available)
- Or iframe to original (respecting CORS)
- Or open in new tab

## Database Schema

```sql
CREATE TABLE rss_feeds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES rss_categories(id),
  last_fetched_at TIMESTAMP WITH TIME ZONE,
  fetch_interval_minutes INTEGER DEFAULT 60,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE rss_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  feed_id UUID REFERENCES rss_feeds(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  link TEXT NOT NULL,
  description TEXT,
  pub_date TIMESTAMP WITH TIME ZONE,
  author TEXT,
  content TEXT,
  read BOOLEAN DEFAULT FALSE,
  favorited BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(feed_id, link)
);

CREATE TABLE rss_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  color TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE rss_settings (
  user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
  auto_refresh_enabled BOOLEAN DEFAULT TRUE,
  auto_refresh_interval_minutes INTEGER DEFAULT 60,
  items_per_page INTEGER DEFAULT 50,
  default_time_filter TEXT DEFAULT 'week',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_rss_feeds_user ON rss_feeds(user_id);
CREATE INDEX idx_rss_items_feed ON rss_items(feed_id);
CREATE INDEX idx_rss_items_pub_date ON rss_items(feed_id, pub_date DESC);
CREATE INDEX idx_rss_items_read ON rss_items(feed_id, read);
CREATE INDEX idx_rss_categories_user ON rss_categories(user_id);
```

## Components

**Main Views:**
- `/components/rss/RssFeedList.tsx`
- `/components/rss/RssItemCard.tsx`
- `/components/rss/RssViewControls.tsx`

**Modals:**
- Add feed modal
- Category management modal

## Hooks

- `/hooks/rss/useRssFeeds.ts`
- `/hooks/rss/useRssItems.ts`

## Success Metrics

- Feeds per user
- Items read per day
- Time filter usage
- Category organization adoption

---

## Related Documents

- [Master PRD](./00-MASTER-PRD.md)
- [Dashboard PRD](./10-dashboard-prd.md)
