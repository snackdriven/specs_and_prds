# PRD: Tags System

## Overview

**Feature Name:** Tags System
**Version:** 1.0
**Last Updated:** 2025-11-15
**Status:** Implemented
**Owner:** Product Team

## Executive Summary

The Tags system provides a flexible, lightweight organizational layer that complements Spaces by enabling cross-cutting categorization across tasks, habits, moods, and journal entries. While Spaces represent broad life contexts (Work, Personal), Tags represent specific attributes, themes, or characteristics (#urgent, #deep-work, #exercise, #grateful). Tags enable powerful filtering, correlation analysis, and pattern discovery that single-dimension organization cannot provide.

## Problem Statement

Users struggle with:
- Categorizing items across multiple dimensions (a task can be work-related AND urgent AND creative)
- Finding items that share common themes across different Spaces
- Tracking mood triggers and boosters (what activities correlate with good/bad moods?)
- Identifying patterns that cut across traditional organizational boundaries
- Managing items with fluid, overlapping characteristics
- Searching for related items that don't fit neatly into one Space
- Understanding cross-cutting themes in their life (e.g., all #social activities, all #learning moments)

## Goals & Success Metrics

### Goals
1. Enable multi-dimensional categorization beyond Spaces
2. Support flexible, ad-hoc organization that evolves with user needs
3. Enable powerful pattern discovery and correlation analysis
4. Make finding related items across contexts easy
5. Provide insight into recurring themes and activities
6. Maintain simplicity and avoid tag chaos

### Success Metrics
- **Tag Adoption:** % of users who create at least one tag
- **Tag Usage:** % of items (tasks, habits, moods, journals) with tags
- **Multi-Tag Items:** % of items with 2+ tags
- **Tag Filtering:** Frequency of tag-based filtering
- **Tag Insights:** % of users who view tag-based analytics
- **Active Tags:** Average number of actively used tags per user
- **Tag Consistency:** Reuse rate of existing tags vs. creating new ones

## User Personas

### Primary: The Pattern Seeker
- **Demographics:** 25-45 years old, analytically minded
- **Needs:** Discover correlations, understand what impacts mood/productivity
- **Pain Points:** Can't see patterns, data feels scattered
- **Usage Pattern:** Consistent tagging, frequent tag-based filtering and analytics

### Secondary: The Flexible Organizer
- **Demographics:** 20-50 years old, non-hierarchical thinker
- **Needs:** Categorize items in multiple ways simultaneously
- **Pain Points:** Rigid folder structures, forced single-category assignment
- **Usage Pattern:** Creates tags organically, applies multiple tags per item

### Tertiary: The Searcher
- **Demographics:** 25-60 years old, values quick retrieval
- **Needs:** Find all items related to a theme or topic
- **Pain Points:** Poor search, can't filter by attributes
- **Usage Pattern:** Occasional tagging, frequent tag-based searching

## Functional Requirements

### 1. Tag Creation

#### 1.1 Create Tag Interface
**Priority:** P0 (Critical)
- **Creation Methods:**
  - Inline creation while creating/editing items
  - Dedicated Tags management page
  - Quick create from tag dropdown
- **Input Fields:**
  - Name (required, max 30 characters)
  - Color (optional, from predefined palette)
  - Description (optional, max 100 characters - future)
- **Validation:**
  - Name cannot be empty
  - Name must be unique per user (case-insensitive)
  - Auto-lowercase or preserve case (decision needed)
  - Remove special characters except hyphens and underscores
  - Prepend # automatically or let user decide

#### 1.2 Tag Autocomplete
**Priority:** P1 (High)
- **Smart Suggestions:**
  - As user types, show matching existing tags
  - Sort by: usage frequency, recent usage, alphabetical
  - Highlight matching portion
  - Press Enter to select suggestion or create new
- **Recent Tags:**
  - Show recently used tags first
  - Encourage tag reuse
- **Popular Tags:**
  - Show most frequently used tags
  - Help discover existing relevant tags

#### 1.3 Tag Templates
**Priority:** P2 (Nice to Have)
- **Pre-defined Tag Sets:**
  - **Productivity:** #urgent, #important, #deep-work, #quick-win, #focus
  - **Emotions:** #grateful, #anxious, #energized, #stressed, #calm, #excited
  - **Activities:** #exercise, #reading, #socializing, #learning, #creative
  - **Work:** #meeting, #client-work, #admin, #planning, #review
  - **Personal:** #self-care, #family, #friends, #hobbies
- **One-Click Import:**
  - Import entire tag set
  - Customize after import

### 2. Tag Assignment

#### 2.1 Multi-Select Tag Picker
**Priority:** P0 (Critical)
- **Interface:**
  - Multi-select dropdown or chip input
  - Type to search/filter
  - Click to select/deselect
  - Show selected tags as removable chips
  - No limit on number of tags (but warn if > 10 - future)
- **Visual Feedback:**
  - Selected tags highlighted
  - Color-coded tag chips
  - Clear "remove" action per tag

#### 2.2 Assign Tags to Tasks
**Priority:** P0 (Critical)
- Tag picker in Create/Edit Task dialog
- Inline tag editing from task card (future)
- Bulk tag assignment to multiple tasks (future)

#### 2.3 Assign Tags to Habits
**Priority:** P0 (Critical)
- Tag picker in Create/Edit Habit dialog
- Tags help categorize habit types (#health, #productivity, #social)

#### 2.4 Assign Tags to Moods
**Priority:** P0 (Critical)
- Tag picker in mood entry dialog
- Tags represent triggers, activities, or emotions
- Critical for mood correlation analysis
- Quick tags for common mood triggers

#### 2.5 Assign Tags to Journal Entries
**Priority:** P0 (Critical)
- Tag picker in Create/Edit Journal dialog
- Tags represent themes, topics, or content categories
- Useful for finding related entries later

### 3. Tag Display

#### 3.1 Tag Badges
**Priority:** P0 (Critical)
- **Visual Design:**
  - Pill-shaped badges
  - Tag color as background (or default gray)
  - # symbol prefix (optional, configurable)
  - Compact size, readable text
  - Subtle hover effect
- **Placement:**
  - On task cards
  - On habit cards
  - On mood entry cards
  - On journal entry cards
  - In filter chips

#### 3.2 Tag Cloud (Tags View)
**Priority:** P2 (Nice to Have)
- Visual representation of all user's tags
- Size based on usage frequency
- Color-coded
- Clickable to filter by tag
- Hoverable to see usage count

#### 3.3 Tag List View
**Priority:** P0 (Critical)
- **Dedicated Tags Page:**
  - List or grid of all tags
  - Each tag shows:
    - Name and color
    - Usage count (X tasks, Y habits, Z moods, N journals)
    - Total usage count
    - Quick actions (view items, edit, delete, merge)
- **Sorting:**
  - By usage count (most used first)
  - Alphabetical (A-Z, Z-A)
  - By creation date
  - By color

### 4. Tag Filtering

#### 4.1 Single Tag Filter
**Priority:** P0 (Critical)
- **Filter Dropdown:**
  - "All Tags" option
  - List of user's tags
  - Color indicator per tag
  - Usage count next to tag name
- **Quick Filter:**
  - Click tag badge to filter by that tag
  - Active filter shown as chip
  - Clear filter button

#### 4.2 Multi-Tag Filter
**Priority:** P1 (High)
- **Select Multiple Tags:**
  - Multi-select dropdown
  - Chip-based filter UI
  - AND logic: show items with ALL selected tags
  - OR logic toggle: show items with ANY selected tag (future)
- **Advanced Filtering:**
  - Include tags (must have)
  - Exclude tags (must not have)
  - Tag combinations

#### 4.3 Cross-Feature Tag Filtering
**Priority:** P0 (Critical)
- Consistent tag filtering across:
  - Tasks view
  - Habits view
  - Moods view
  - Journal view
  - Analytics view
- Persist last used tag filter (per view)

### 5. Tag Management

#### 5.1 Edit Tag
**Priority:** P0 (Critical)
- Click tag in Tags view to edit
- Editable properties:
  - Name (updates everywhere)
  - Color
  - Description (future)
- Save/cancel actions
- Changes propagate to all items

#### 5.2 Delete Tag
**Priority:** P0 (Critical)
- Delete action in tag menu
- **Confirmation Dialog:**
  - Show usage count
  - Warning: "This will remove the tag from X items"
  - Checkbox: "I understand items will not be deleted"
- **Deletion Behavior:**
  - Tag removed from all associated items
  - Items remain (not deleted)
  - Deletion is permanent (no undo - future: archive)

#### 5.3 Merge Tags
**Priority:** P2 (Nice to Have)
- Merge duplicate or similar tags
- Example: #exercise + #workout → #exercise
- Select source tag and target tag
- All items with source tag updated to target tag
- Source tag deleted
- Useful for cleaning up tag proliferation

#### 5.4 Rename Tag
**Priority:** P1 (High)
- Rename tag across all items
- Warning if new name matches existing tag (suggest merge)
- Propagates immediately

### 6. Tag Analytics

#### 6.1 Tag Usage Statistics
**Priority:** P1 (High)
- **Per-Tag Metrics:**
  - Total items tagged
  - Breakdown by entity type (tasks, habits, moods, journals)
  - First used date, last used date
  - Usage trend over time
- **Overall Tag Metrics:**
  - Total tags created
  - Average tags per item
  - Most used tags (top 10)
  - Least used tags (candidates for deletion)
  - Orphaned tags (no items)

#### 6.2 Tag Correlations (Mood Focus)
**Priority:** P1 (High)
- **Mood-Tag Correlations:**
  - Average mood when tag is present
  - Tags associated with high moods (#exercise avg: 8.2)
  - Tags associated with low moods (#work-stress avg: 4.5)
  - Mood boosters vs. drainers ranked list
- **Visualization:**
  - Bar chart: tags ranked by avg mood
  - Scatter plot: tag frequency vs. avg mood
  - Color coding: green (boosters), red (drainers)

#### 6.3 Tag Co-Occurrence
**Priority:** P2 (Nice to Have)
- **Tag Combinations:**
  - Which tags frequently appear together?
  - Example: #meeting often paired with #work-stress
  - Network graph visualization (future)
  - Insight: "80% of #creative tasks also tagged #flow"

#### 6.4 Tag Trends
**Priority:** P2 (Nice to Have)
- **Temporal Analysis:**
  - Tag usage over time
  - Seasonal tag patterns
  - Emerging tags (new and growing usage)
  - Declining tags (used less over time)

### 7. Tag Search

#### 7.1 Search by Tag
**Priority:** P0 (Critical)
- **Unified Search:**
  - Search across all items by tag
  - Type tag name to filter
  - Real-time results
  - Multi-tag search (AND/OR logic)
- **Tag Autocomplete in Search:**
  - # prefix triggers tag suggestions
  - Type #ex → suggests #exercise, #excited, etc.

### 8. Tag Suggestions

#### 8.1 Smart Tag Suggestions
**Priority:** P2 (Nice to Have)
- **Context-Based Suggestions:**
  - Based on item content (NLP - future)
  - Based on Space (Work space → suggest #meeting, #client-work)
  - Based on similar items (tasks with similar titles)
  - Based on user's past tagging patterns
- **Acceptance:**
  - Click suggested tag to apply
  - Dismiss suggestion
  - Learn from user behavior

## Non-Functional Requirements

### Performance
- Tag autocomplete: < 50ms response
- Tag filtering: < 100ms for 1000+ items
- Tag badge rendering: performant with 10+ tags per item
- Tag analytics calculation: < 1 second for 1000+ tags

### Accessibility
- Keyboard navigation for tag selection
- Screen reader support for tags
- Color-blind friendly (don't rely on color alone)
- High contrast mode

### Scalability
- Support 500+ tags per user
- Support 10+ tags per item
- Efficient many-to-many relationship queries
- Indexed joins for performance

### Data Integrity
- Prevent duplicate tag names (case-insensitive)
- Handle tag deletion gracefully (remove associations)
- Consistent tag references across entities
- Transaction support for tag merges

### UX Guidelines
- Encourage tag reuse over proliferation
- Suggest tag cleanup periodically
- Warn when creating similar tag names
- Limit displayed tags to 5-7 per item (show "+" for more)

## User Experience

### Information Architecture
```
Tags View
├── Header
│   ├── Page Title
│   ├── Create Tag Button
│   └── View Toggle (List / Cloud)
├── Tag List/Cloud
│   ├── Tag Card 1
│   │   ├── #tagname + Color
│   │   ├── Usage Count
│   │   ├── Item Breakdown
│   │   └── Actions (View Items, Edit, Delete, Merge)
│   ├── Tag Card 2
│   └── ... Tag Card N
└── Tag Analytics Section
    ├── Most Used Tags
    ├── Tag-Mood Correlations
    └── Tag Trends

Tag Multi-Select Component
├── Input Field (type to search)
├── Dropdown Suggestions
│   ├── Recent Tags
│   ├── Popular Tags
│   └── Matching Tags
└── Selected Tags (chips)
    └── Remove Button per Chip
```

### User Flows

#### Flow 1: Create and Use First Tag
1. User creates a task: "Finish project proposal"
2. User opens tag picker in create task dialog
3. User types "urgent"
4. System shows: "Create new tag: #urgent"
5. User clicks to create tag
6. Tag created and assigned to task
7. Task saved with #urgent tag
8. Tag badge appears on task card
9. User can now filter all tasks by #urgent

#### Flow 2: Discover Mood Boosters via Tags
1. User has been tracking mood for 30 days
2. User consistently tags moods: #exercise, #social, #work-stress
3. User navigates to Tags view
4. User opens Tag Analytics section
5. User sees "Tag-Mood Correlations" chart
6. Chart shows:
   - #exercise: avg mood 8.3 (booster!)
   - #social: avg mood 7.8 (booster)
   - #work-stress: avg mood 4.9 (drainer)
7. User insight: "Exercise dramatically improves my mood"
8. User commits to exercising more frequently

#### Flow 3: Filter Tasks by Multiple Tags
1. User wants to find all urgent work tasks
2. User navigates to Tasks view
3. User opens tag filter
4. User selects #urgent
5. User also selects #work
6. Task list filters to show only tasks with BOTH tags
7. User sees 5 urgent work tasks
8. User prioritizes these for the day

#### Flow 4: Clean Up Duplicate Tags
1. User has tags: #workout, #exercise, #gym
2. User realizes these are duplicates
3. User navigates to Tags view
4. User selects #workout
5. User clicks "Merge"
6. User selects target tag: #exercise
7. System merges: all #workout items → #exercise
8. #workout tag deleted
9. Tag list cleaner, more organized

### Visual Design

#### Tag Color Palette
- Red (#ef4444)
- Orange (#f97316)
- Yellow (#eab308)
- Green (#22c55e)
- Teal (#14b8a6)
- Cyan (#06b6d4)
- Blue (#3b82f6)
- Purple (#a855f7)
- Pink (#ec4899)
- Gray (#6b7280) - default

#### Tag Badge Design
```
┌──────────┐
│ #urgent  │  ← Red background, white text
└──────────┘

┌───────────┐
│ #exercise │  ← Green background, white text
└───────────┘

Multiple tags:
[#urgent] [#work] [#deep-work] [+2 more]
```

#### Tag Card Design
```
┌─────────────────────────────────────────┐
│ #exercise                                │
│ Used 47 times                             │
│ 12 habits • 25 moods • 10 journal entries│
│ Avg mood: 8.3 (mood booster!)            │
│                                          │
│        [View Items] [Edit] [Delete]      │
└─────────────────────────────────────────┘
```

## Technical Specifications

### Frontend Components
```typescript
<TagsView>
  <TagsHeader>
    <h1>Tags</h1>
    <CreateTagButton />
    <ViewToggle value={view} onChange={setView} /> {/* List or Cloud */}
  </TagsHeader>

  {view === 'list' && (
    <TagsList>
      {tags.map(tag => (
        <TagCard
          key={tag.id}
          tag={tag}
          onView={() => filterByTag(tag.id)}
          onEdit={() => editTag(tag.id)}
          onDelete={() => deleteTag(tag.id)}
        />
      ))}
    </TagsList>
  )}

  {view === 'cloud' && (
    <TagCloud tags={tags} onTagClick={filterByTag} />
  )}

  <TagAnalytics tags={tags} />
</TagsView>

<TagMultiSelect
  selectedTags={selectedTags}
  onChange={setSelectedTags}
  onCreate={createNewTag}
>
  <TagInput
    placeholder="Type to search or create tags..."
    onSearch={handleSearch}
  />

  <TagDropdown>
    {filteredTags.map(tag => (
      <TagOption
        key={tag.id}
        tag={tag}
        selected={selectedTags.includes(tag.id)}
        onClick={() => toggleTag(tag.id)}
      />
    ))}
  </TagDropdown>

  <SelectedTags>
    {selectedTags.map(tagId => (
      <TagChip
        key={tagId}
        tag={getTag(tagId)}
        onRemove={() => removeTag(tagId)}
      />
    ))}
  </SelectedTags>
</TagMultiSelect>

<TagBadge tag={tag} onClick={() => filterByTag(tag.id)}>
  #{tag.name}
</TagBadge>
```

### Data Models
```typescript
interface Tag {
  id: string;
  user_id: string;
  name: string; // e.g., "urgent" (without # prefix in DB)
  color?: string; // hex color
  description?: string;
  created_at: string;
  updated_at: string;
}

interface TagWithUsage extends Tag {
  task_count: number;
  habit_count: number;
  mood_count: number;
  journal_count: number;
  total_usage: number;
  avg_mood?: number; // if tagged on moods
  last_used_at: string;
}

// Junction tables for many-to-many relationships
interface TaskTag {
  task_id: string;
  tag_id: string;
}

interface HabitTag {
  habit_id: string;
  tag_id: string;
}

interface MoodTag {
  mood_id: string;
  tag_id: string;
}

interface JournalTag {
  journal_entry_id: string;
  tag_id: string;
}
```

### API Endpoints
```
POST   /tags                             Create tag
GET    /users/:user_id/tags              List user's tags with usage stats
GET    /tags/:id                         Get tag details
PUT    /tags/:id                         Update tag (name, color, description)
DELETE /tags/:id                         Delete tag (remove all associations)
POST   /tags/merge                       Merge two tags

GET    /tags/:id/tasks                   Get tasks with tag
GET    /tags/:id/habits                  Get habits with tag
GET    /tags/:id/moods                   Get moods with tag
GET    /tags/:id/journal                 Get journal entries with tag

GET    /users/:user_id/tags/analytics    Get tag analytics (usage, correlations)
GET    /users/:user_id/tags/suggestions  Get tag suggestions for context
```

### Database Schema
```sql
-- Tags table
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(30) NOT NULL,
  color VARCHAR(7), -- hex color
  description VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, LOWER(name)) -- case-insensitive unique
);

-- Junction tables (many-to-many relationships)
CREATE TABLE task_tags (
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, tag_id)
);

CREATE TABLE habit_tags (
  habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (habit_id, tag_id)
);

CREATE TABLE mood_tags (
  mood_id UUID NOT NULL REFERENCES moods(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (mood_id, tag_id)
);

CREATE TABLE journal_tags (
  journal_entry_id UUID NOT NULL REFERENCES journal_entries(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (journal_entry_id, tag_id)
);

-- Indexes for performance
CREATE INDEX idx_tags_user_name ON tags(user_id, name);
CREATE INDEX idx_task_tags_tag ON task_tags(tag_id);
CREATE INDEX idx_habit_tags_tag ON habit_tags(tag_id);
CREATE INDEX idx_mood_tags_tag ON mood_tags(tag_id);
CREATE INDEX idx_journal_tags_tag ON journal_tags(tag_id);
```

### Tag Merge Logic
```typescript
async function mergeTags(sourceTagId: string, targetTagId: string, userId: string) {
  const transaction = await db.beginTransaction();

  try {
    // Update all task_tags
    await db.query(`
      INSERT INTO task_tags (task_id, tag_id)
      SELECT task_id, $1 FROM task_tags WHERE tag_id = $2
      ON CONFLICT DO NOTHING
    `, [targetTagId, sourceTagId]);
    await db.query('DELETE FROM task_tags WHERE tag_id = $1', [sourceTagId]);

    // Update all habit_tags
    await db.query(`
      INSERT INTO habit_tags (habit_id, tag_id)
      SELECT habit_id, $1 FROM habit_tags WHERE tag_id = $2
      ON CONFLICT DO NOTHING
    `, [targetTagId, sourceTagId]);
    await db.query('DELETE FROM habit_tags WHERE tag_id = $1', [sourceTagId]);

    // Update all mood_tags
    await db.query(`
      INSERT INTO mood_tags (mood_id, tag_id)
      SELECT mood_id, $1 FROM mood_tags WHERE tag_id = $2
      ON CONFLICT DO NOTHING
    `, [targetTagId, sourceTagId]);
    await db.query('DELETE FROM mood_tags WHERE tag_id = $1', [sourceTagId]);

    // Update all journal_tags
    await db.query(`
      INSERT INTO journal_tags (journal_entry_id, tag_id)
      SELECT journal_entry_id, $1 FROM journal_tags WHERE tag_id = $2
      ON CONFLICT DO NOTHING
    `, [targetTagId, sourceTagId]);
    await db.query('DELETE FROM journal_tags WHERE tag_id = $1', [sourceTagId]);

    // Delete source tag
    await db.query('DELETE FROM tags WHERE id = $1 AND user_id = $2', [sourceTagId, userId]);

    await transaction.commit();
    return { success: true };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
```

### Mood-Tag Correlation Calculation
```typescript
async function calculateTagMoodCorrelations(userId: string) {
  const query = `
    SELECT
      t.id,
      t.name,
      t.color,
      COUNT(m.id) as mood_count,
      AVG(m.value) as avg_mood,
      STDDEV(m.value) as mood_stddev
    FROM tags t
    INNER JOIN mood_tags mt ON t.id = mt.tag_id
    INNER JOIN moods m ON mt.mood_id = m.id
    WHERE t.user_id = $1
    GROUP BY t.id, t.name, t.color
    HAVING COUNT(m.id) >= 3  -- minimum 3 moods for meaningful correlation
    ORDER BY avg_mood DESC
  `;

  const result = await db.query(query, [userId]);

  return result.rows.map(row => ({
    tag_id: row.id,
    tag_name: row.name,
    tag_color: row.color,
    mood_count: parseInt(row.mood_count),
    avg_mood: parseFloat(row.avg_mood).toFixed(1),
    mood_volatility: parseFloat(row.mood_stddev || 0).toFixed(2),
    impact: row.avg_mood > 7 ? 'booster' : row.avg_mood < 5 ? 'drainer' : 'neutral',
  }));
}
```

## Dependencies

### Internal
- Tasks system (tag assignment)
- Habits system (tag assignment)
- Moods system (tag assignment, critical for correlations)
- Journal system (tag assignment)
- Analytics (tag-based insights)

### External
- React Query (data fetching)
- Radix UI (multi-select, dialogs)
- Lucide React (icons)

## Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Tag proliferation (too many similar tags) | Medium | High | Tag suggestions, merge tool, periodic cleanup prompts, educate on reuse |
| Confusion between tags and spaces | Medium | Medium | Clear documentation, different visual styling, use case examples |
| Performance with many tags per item | Low | Low | Limit displayed tags (show "+X more"), efficient queries, indexing |
| Inconsistent tagging (same concept, different words) | Medium | Medium | Tag suggestions, autocomplete, merge tool, case-insensitive matching |
| Tag deletion anxiety | Medium | Low | Clear confirmation, show affected items, suggest merge instead |

## Future Enhancements

### Phase 2
- Tag hierarchies (parent-child tags)
- Tag synonyms (#exercise = #workout)
- Automated tagging based on content (NLP)
- Tag-based notifications ("Remind me about #urgent items")
- Shared tags (collaborative tagging)

### Phase 3
- Tag templates and bundles
- Smart tag suggestions based on AI
- Tag-based workflows and automations
- Tag marketplace (public tag sets)
- Tag performance metrics (ROI of tagging)

### Phase 4
- Natural language tagging ("tag this with my usual tags")
- Voice-activated tagging
- Image/emoji tags
- Cross-user tag analytics (aggregated, anonymous)
- Tag-based communities and discovery

## Open Questions

1. Should tag names include the # prefix in the database or only in display?
2. What's the maximum recommended number of tags per item before warning?
3. Should we support tag hierarchies (parent-child) in v1?
4. How do we handle case sensitivity - force lowercase, preserve case, or case-insensitive matching?
5. Should there be a limit on total tags per user (e.g., 200 tags max)?
6. What's the ideal tag autocomplete behavior - strict matching or fuzzy search?

## Appendix

### A. Tag Naming Best Practices
**Guidelines for Users:**
- Keep tags short and simple (#exercise not #going-to-the-gym)
- Use single words when possible (#urgent, #work, #health)
- Use hyphens for multi-word concepts (#deep-work, #work-stress)
- Be consistent with pluralization (#task not #tasks and #task)
- Avoid redundant tags (if you have #work space, don't need #work tag in those items)
- Reuse existing tags before creating new ones

**Common Tag Categories:**
- **Priority/Urgency:** #urgent, #important, #low-priority, #someday
- **Work Types:** #meeting, #email, #deep-work, #admin, #creative
- **Energy Levels:** #high-energy, #low-energy, #quick-win, #focus-required
- **Moods/Emotions:** #grateful, #anxious, #excited, #stressed, #calm, #happy
- **Activities:** #exercise, #reading, #socializing, #cooking, #learning
- **Life Areas:** #health, #finance, #relationships, #career, #hobbies

### B. Keyboard Shortcuts
- `#` - Start tag input (quick tag mode)
- `Tab` - Accept tag suggestion
- `Enter` - Add tag to selection
- `Backspace` - Remove last selected tag
- `Escape` - Close tag picker
- `Arrow keys` - Navigate tag suggestions

### C. Analytics Events
```
- tag_created
- tag_assigned
- tag_removed
- tag_edited
- tag_deleted
- tag_merged
- tag_filtered
- tag_correlation_viewed
- tag_suggested
- tag_autocomplete_used
```

### D. Tag vs. Space Decision Guide
**When to use Spaces:**
- Broad life contexts (Work, Personal, Health)
- Mutually exclusive categories (items belong to ONE space)
- High-level organization
- Limited number (3-7 spaces ideal)

**When to use Tags:**
- Attributes or characteristics (#urgent, #creative)
- Cross-cutting themes (#learning appears in Work and Personal)
- Multiple tags per item (a task can be #urgent AND #deep-work AND #client-facing)
- Flexible, evolving organization
- Many tags OK (20-50 tags is normal)

**Examples:**
- Task: "Prepare presentation for client meeting"
  - Space: Work
  - Tags: #presentation, #client-work, #urgent, #creative
- Habit: "30 min morning meditation"
  - Space: Personal
  - Tags: #meditation, #morning-routine, #mental-health
- Mood: 8/10 - "Feeling great after workout"
  - Space: N/A (moods don't need spaces)
  - Tags: #exercise, #energized, #endorphins
