# PRD: RSS Feed Reader

## Product Overview

A Google Reader-style RSS feed aggregator built into EDC, allowing users to follow blogs, news sites, and content creators without leaving the app. Features smart reading modes, star/archive functionality, and category organization.

## Problem Statement

Users with ADHD face challenges with content consumption:
- **App Switching**: Constantly switching between apps breaks focus
- **Overwhelm**: Too many unread items causes anxiety
- **Lost Content**: Forgetting which articles to read
- **No Curation**: All content treated equally regardless of importance
- **Fragmented Workflow**: News reading separate from task/calendar workflow

## Core Features

### 1. Feed Management

**User Stories**:
- As a user, I want to subscribe to RSS/Atom feeds
- As a user, I want to organize feeds into categories
- As a user, I want to edit feed names/URLs
- As a user, I want to unsubscribe from feeds

**Feed Fields**:
- `url`: Feed URL (RSS/Atom)
- `title`: Feed display name
- `description`: Feed description
- `category_id`: Optional category
- `icon_url`: Feed/site favicon
- `last_fetched`: Last successful fetch timestamp
- `fetch_frequency`: How often to check for new items
- `is_active`: Enabled/disabled status

### 2. Feed Item Display

**User Stories**:
- As a user, I want to see feed items in chronological order
- As a user, I want unread count per feed
- As a user, I want to see article titles, summaries, timestamps
- As a user, I want to see article source feed

**Item Fields**:
- `feed_id`: Foreign key to feed
- `title`: Article title
- `content`: Article content (HTML or plain text)
- `summary`: Short excerpt
- `link`: Original URL
- `published_at`: Publication timestamp
- `author`: Article author
- `is_read`: Read/unread status
- `is_starred`: Starred for later
- `is_archived`: Archived status

### 3. View Modes (Google Reader Style)

**User Stories**:
- As a user, I want to view all items
- As a user, I want to view only unread items
- As a user, I want to view starred items
- As a user, I want to view by category

**View Modes**:
```typescript
type RssViewMode = 'all' | 'unread' | 'starred' | 'category'
```

**Mode Behaviors**:
- **All**: Show all items (read + unread)
- **Unread**: Show only unread items
- **Starred**: Show only starred items (read or unread)
- **Category**: Show items from specific category

### 4. List Types

**User Stories**:
- As a user, I want expanded view (full article preview)
- As a user, I want list view (titles only)
- As a user, I want magazine view (visual cards)

**List Types**:
```typescript
type RssListType = 'expanded' | 'list' | 'magazine'
```

**Expanded View**:
- Full article content inline
- Images displayed
- Long-form reading

**List View**:
- Title + one-line summary
- Compact, fast scanning
- Click to expand

**Magazine View**:
- Card-based layout
- Featured images
- Visual browsing

### 5. Reading Actions

**User Stories**:
- As a user, I want to mark items as read
- As a user, I want to star items for later
- As a user, I want to archive items
- As a user, I want to open original URL

**Actions**:
- **Mark Read**: Toggle read status
- **Star**: Add to starred collection
- **Archive**: Remove from main view but keep for search
- **Open Original**: Open article in new tab
- **Mark All Read**: Batch operation per feed or category

### 6. Auto-Mark as Read

**User Stories**:
- As a user, I want items marked read when I scroll past
- As a user, I want items marked read when I click
- As a user, I want to disable auto-mark if I prefer manual

**Options**:
- **On Scroll**: Mark read when scrolled past 50% of item
- **On Click**: Mark read when item clicked/expanded
- **Manual Only**: Never auto-mark, require explicit action
- **After N Seconds**: Mark read after viewing for N seconds

### 7. Category Organization

**User Stories**:
- As a user, I want to create categories (Tech, News, Blogs, etc.)
- As a user, I want to assign feeds to categories
- As a user, I want to see unread count per category
- As a user, I want to collapse/expand categories

**Category Features**:
- Hierarchical organization (categories, not tags)
- Drag-drop feeds between categories
- Color-coding per category
- Unread count badges

### 8. Feed Discovery (Future)

**User Stories**:
- As a user, I want to discover popular feeds
- As a user, I want feed recommendations
- As a user, I want to search for feeds by topic

## User Workflows

### Workflow 1: Subscribing to a Feed
1. User clicks "+ Add Feed" in RSS pane
2. User enters feed URL: "https://example.com/rss"
3. System fetches and validates feed
4. System shows preview: "Example Blog (25 items)"
5. User selects category: "Tech"
6. User clicks "Subscribe"
7. Feed appears in sidebar under "Tech" category
8. All items initially marked unread

### Workflow 2: Reading Through Unread Items
1. User opens RSS pane
2. User clicks "Unread" view mode
3. Feed sidebar shows unread count per feed
4. User clicks feed: "TechCrunch (12 unread)"
5. 12 items appear in main area
6. User scrolls through items
7. Items automatically mark as read when scrolled past
8. Unread count decrements in real-time
9. User reaches bottom, sees "All caught up!"

### Workflow 3: Starring for Later
1. User reading article: "Interesting JavaScript technique"
2. User clicks star icon on article
3. Article saved to "Starred" view
4. User later opens "Starred" view
5. Sees all starred articles across all feeds
6. User reads article, clicks star again to unstar

## Technical Architecture

### Database Schema
```sql
CREATE TABLE rss_feeds (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  url TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES rss_categories(id),
  icon_url TEXT,
  last_fetched TIMESTAMP WITH TIME ZONE,
  fetch_frequency INTEGER DEFAULT 60, -- minutes
  is_active BOOLEAN DEFAULT TRUE
)

CREATE TABLE rss_items (
  id UUID PRIMARY KEY,
  feed_id UUID REFERENCES rss_feeds(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  summary TEXT,
  link TEXT NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE,
  author TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  is_starred BOOLEAN DEFAULT FALSE,
  is_archived BOOLEAN DEFAULT FALSE
)

CREATE TABLE rss_categories (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6366f1',
  order_index INTEGER DEFAULT 0
)
```

### Key Hooks
- `useRssFeeds()`: Feed CRUD with item counts
- `useRssItems()`: Item fetching with filtering
- `useRssFeedParser()`: Feed parsing/validation

### Component Hierarchy
```
RssContentOrchestrator
├── RssFeedList (sidebar)
│   ├── CategorySection[]
│   │   └── FeedItem[] (with unread count)
│   └── ViewModeSelector
├── RssViewControls (list type, sorting, mark all read)
├── RssItemList (main content)
│   ├── RssItemCard[] (list items)
│   │   └── RssItemCardRenderer (item display)
│   └── EmptyState ("All caught up!")
└── AddFeedModal (subscription form)
```

## ADHD-Friendly Design

### 1. Unread Count Visibility
- Always show unread count
- Provides sense of progress
- Dopamine hit when reaching zero

### 2. Auto-Mark as Read
- Reduces manual overhead
- Feels effortless
- Customizable for user preference

### 3. Star for Later
- Quickly defer interesting items
- Reduces anxiety about missing content
- Simple one-click action

### 4. Multiple View Modes
- Adapt to current attention level
- Expanded for deep reading
- List for quick scanning
- Magazine for visual browsing

### 5. "All Caught Up" Feedback
- Clear completion state
- Reduces compulsive checking
- Positive reinforcement

## Performance Considerations

- **Feed Fetching**: Background job (not real-time) to avoid blocking UI
- **Item Caching**: Cache parsed feed items
- **Pagination**: Load 50 items at a time, infinite scroll
- **Image Lazy Loading**: Load images only when scrolled into view

## Future Enhancements

1. **Full-Text Search**: Search all articles
2. **Export**: Export starred articles to PDF/EPUB
3. **Pocket Integration**: Send to Pocket for later
4. **Newsletter Support**: Email newsletter → RSS feed conversion
5. **Podcast Support**: Audio podcast RSS feeds
6. **YouTube Channels**: Subscribe to YouTube via RSS
7. **Reddit Subreddits**: Subscribe to subreddits
8. **Twitter Lists**: Twitter list RSS feeds
9. **Reading Stats**: Track reading time, articles read
10. **AI Summaries**: Auto-generate article summaries

## Success Criteria

1. ✅ Feed subscription working (RSS + Atom)
2. ✅ Item display in all view modes
3. ✅ Mark read/unread functional
4. ✅ Star/unstar functional
5. ✅ Category organization working
6. ✅ Unread counts accurate
7. ✅ Auto-mark as read (optional)
8. ✅ Mobile-responsive design

## References

- File: `components/panes/content/RssContentOrchestrator.tsx`
- File: `components/rss/RssFeedList.tsx`
- File: `components/rss/RssItemCardRenderer.tsx`
- File: `components/rss/RssViewControls.tsx`
- Hook: `hooks/rss/useRssFeeds.ts`
- Types: `types/rss.ts`
