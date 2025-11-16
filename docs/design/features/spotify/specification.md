# Spotify Integration - Technical Specification

## 1. Complete Feature Specification

### 1.1 Spotify OAuth & Authentication

#### A. OAuth Flow

**Step-by-Step Process:**

```typescript
// Step 1: User clicks "Connect Spotify" in Settings
// Frontend redirects to Spotify authorization:

const SPOTIFY_SCOPES = [
  'user-read-currently-playing',  // See what's playing now
  'user-read-playback-state',     // Get full playback state
  'user-read-recently-played',    // Historical data
  'user-top-read',                // Top artists/tracks (for mood correlation V2)
  'user-modify-playback-state'    // Play/pause controls (V2)
]

const authUrl = `https://accounts.spotify.com/authorize?
  client_id=${SPOTIFY_CLIENT_ID}
  &response_type=code
  &redirect_uri=${APP_URL}/auth/spotify/callback
  &scope=${SPOTIFY_SCOPES.join(' ')}
  &show_dialog=false`

// Step 2: User authorizes, Spotify redirects to callback
// GET /auth/spotify/callback?code=AUTH_CODE

// Step 3: Backend exchanges code for tokens
POST https://accounts.spotify.com/api/token
Headers: {
  'Content-Type': 'application/x-www-form-urlencoded',
  'Authorization': 'Basic ' + base64(SPOTIFY_CLIENT_ID:SPOTIFY_CLIENT_SECRET)
}
Body: {
  grant_type: 'authorization_code',
  code: 'AUTH_CODE',
  redirect_uri: APP_URL + '/auth/spotify/callback'
}

// Response:
{
  "access_token": "BQD...",
  "token_type": "Bearer",
  "expires_in": 3600, // 1 hour
  "refresh_token": "AQD...",
  "scope": "user-read-currently-playing ..."
}

// Step 4: Store tokens in database
await db.spotifyTokens.upsert({
  userId: currentUser.id,
  accessToken: tokens.access_token,
  refreshToken: tokens.refresh_token,
  expiresAt: Date.now() + (tokens.expires_in * 1000),
  scopes: tokens.scope.split(' ')
})

// Step 5: Fetch current playback and display widget
// Step 6: Redirect to dashboard showing "Now Playing" widget
```

#### B. Token Storage & Refresh

```typescript
interface SpotifyTokens {
  userId: string
  accessToken: string
  refreshToken: string
  expiresAt: number // Unix timestamp
  scopes: string[]
}

async function getValidSpotifyToken(userId: string): Promise<string> {
  const tokens = await db.spotifyTokens.findOne({ userId })

  if (!tokens) {
    throw new Error('Spotify not connected')
  }

  // Token still valid
  if (tokens.expiresAt > Date.now() + 60000) { // 1 min buffer
    return tokens.accessToken
  }

  // Token expired, refresh it
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + base64(SPOTIFY_CLIENT_ID:SPOTIFY_CLIENT_SECRET)
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: tokens.refreshToken
    })
  })

  const newTokens = await response.json()

  await db.spotifyTokens.update({ userId }, {
    accessToken: newTokens.access_token,
    expiresAt: Date.now() + (newTokens.expires_in * 1000),
    // Refresh token stays the same (Spotify doesn't rotate it)
  })

  return newTokens.access_token
}
```

---

### 1.2 Now Playing Widget

#### A. Placement & Size

**Dashboard Header (Right Side):**

```
┌──────────────────────────────────────────────────────────┐
│ Dashboard                                    🎵 Now Playing│
│                                            [Album Art 48px]│
│                                            The National    │
│                                            "Bloodbuzz Ohio"│
└──────────────────────────────────────────────────────────┘
```

**Full Widget (Expanded State):**

```
┌─────────────────────────────────────────┐
│  🎵 Now Playing                    [×]   │
├─────────────────────────────────────────┤
│  ┌──────┐                               │
│  │      │  The National                 │
│  │ [img]│  "Bloodbuzz Ohio"             │
│  │ 80px │  High Violet (2010)           │
│  └──────┘                               │
│                                         │
│  ━━━━●━━━━━━━━━━━  2:34 / 4:42        │
│                                         │
│  [⏮] [▶️] [⏭]                          │
│                                         │
│  [Add to Journal Entry]                 │
└─────────────────────────────────────────┘
```

**Compact Widget (Default):**

```
┌────────────────────────────────┐
│ 🎵 ┌───┐ The National          │
│    │img│ "Bloodbuzz Ohio"      │
│    └───┘ [︙]                  │
└────────────────────────────────┘
      32px  Click menu for controls
```

**Widget States:**

1. **Playing** - Green pulsing icon, show artist/track
2. **Paused** - Gray icon, show last played
3. **Nothing Playing** - Show "Not listening" or hide (user preference)
4. **Disconnected** - Show "Connect Spotify" button
5. **Error** - Show "Reconnect Spotify"

#### B. Update Frequency

**Hybrid approach:**

1. **Polling (MVP)** - Every 30 seconds
   ```typescript
   useEffect(() => {
     const interval = setInterval(async () => {
       const nowPlaying = await fetchNowPlaying()
       setCurrentTrack(nowPlaying)
     }, 30000) // 30 seconds

     return () => clearInterval(interval)
   }, [])
   ```

2. **WebSocket (V2)** - Real-time updates
   - Spotify doesn't provide webhooks
   - Use server-sent events (SSE) for real-time push
   - Backend polls Spotify every 10s, pushes to frontend via SSE

#### C. Click Behavior

**Compact Widget:**
- Click → Expand to full widget
- Right-click / menu icon → Quick actions
  - Add to journal
  - Copy song info
  - Open in Spotify
  - Hide widget

**Full Widget:**
- Click album art → Open in Spotify app/web
- Click track name → Copy to clipboard
- Click "Add to Journal" → Insert into active journal entry

---

### 1.3 Playback Controls

**MVP: Display Only**
- Show what's playing
- Show progress bar (read-only)
- No play/pause/skip buttons

**V2: Full Controls**
```typescript
interface PlaybackControls {
  play(): Promise<void>
  pause(): Promise<void>
  skipNext(): Promise<void>
  skipPrevious(): Promise<void>
  seek(positionMs: number): Promise<void>
  setVolume(percent: number): Promise<void>
}

// Example: Play/Pause
async function togglePlayback() {
  const token = await getValidSpotifyToken(userId)
  const state = await getCurrentPlayback(token)

  if (state.is_playing) {
    await fetch('https://api.spotify.com/v1/me/player/pause', {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    })
  } else {
    await fetch('https://api.spotify.com/v1/me/player/play', {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    })
  }
}
```

---

### 1.4 Journal Integration

#### A. Auto-Capture

**When user opens journal editor:**

```typescript
// Journal entry creation screen
async function createJournalEntry() {
  const nowPlaying = await fetchNowPlaying()

  // Pre-populate journal metadata
  const entry = {
    content: '',
    mood: null,
    timestamp: new Date(),
    metadata: {
      spotifyTrack: nowPlaying ? {
        trackId: nowPlaying.item.id,
        trackName: nowPlaying.item.name,
        artistName: nowPlaying.item.artists[0].name,
        albumName: nowPlaying.item.album.name,
        albumArt: nowPlaying.item.album.images[0].url,
        capturedAt: new Date()
      } : null
    }
  }

  return entry
}
```

**User Experience:**

```
┌────────────────────────────────────────┐
│ New Journal Entry - April 15, 2025     │
├────────────────────────────────────────┤
│                                        │
│ 🎵 Listening to: "Bloodbuzz Ohio"     │
│    by The National                     │
│    [×] Remove                          │
│                                        │
│ How are you feeling?                   │
│ [😊 😐 😔 😡]                          │
│                                        │
│ Write your thoughts...                 │
│ [_______________________________]      │
│ [_______________________________]      │
│                                        │
│         [Cancel]  [Save Entry]         │
└────────────────────────────────────────┘
```

#### B. Manual Capture

**"Add Current Song" button in journal editor:**

```typescript
// While editing existing journal entry
async function addCurrentSongToEntry(entryId: string) {
  const nowPlaying = await fetchNowPlaying()

  if (!nowPlaying) {
    showToast('No song playing', 'warning')
    return
  }

  await db.journalEntries.update(entryId, {
    'metadata.spotifyTrack': {
      trackId: nowPlaying.item.id,
      trackName: nowPlaying.item.name,
      artistName: nowPlaying.item.artists[0].name,
      albumName: nowPlaying.item.album.name,
      albumArt: nowPlaying.item.album.images[0].url,
      capturedAt: new Date()
    }
  })

  showToast('Song added to entry ✓')
}
```

#### C. Display in Journal

**Viewing journal entry with Spotify data:**

```
┌────────────────────────────────────────┐
│ Journal Entry - April 15, 2025 2:30 PM│
├────────────────────────────────────────┤
│ Mood: 😊 Happy                         │
│                                        │
│ 🎵 Listening to: "Bloodbuzz Ohio"     │
│    ┌────┐                              │
│    │img │ The National                 │
│    └────┘ High Violet (2010)           │
│          [🔗 Open in Spotify]          │
│                                        │
│ Today was a really productive day...   │
│                                        │
└────────────────────────────────────────┘
```

#### D. Historical Display

**Journal timeline view:**

```sql
SELECT
  je.id,
  je.content,
  je.mood,
  je.created_at,
  je.metadata->>'spotifyTrack' AS track_data
FROM journal_entries je
WHERE user_id = $1
ORDER BY created_at DESC;
```

**UI:**
```
┌────────────────────────────────────────┐
│ Journal Entries                        │
├────────────────────────────────────────┤
│ April 15, 2025 - 😊 Happy              │
│ 🎵 The National - "Bloodbuzz Ohio"    │
│ Today was a really productive day...   │
│                                        │
│ April 14, 2025 - 😐 Neutral           │
│ 🎵 Bon Iver - "Holocene"              │
│ Feeling okay, just going through...    │
│                                        │
│ April 13, 2025 - 😔 Sad               │
│ (No music captured)                    │
│ Rough day at work...                   │
└────────────────────────────────────────┘
```

---

### 1.5 Mood Correlation (V2)

**Defer to V2, but design for future:**

```sql
-- Analytics query
SELECT
  je.mood,
  st.genre,
  st.valence, -- Spotify's "happiness" metric (0-1)
  st.energy,  -- Spotify's energy metric (0-1)
  COUNT(*) as entry_count,
  AVG(CAST(je.mood AS INTEGER)) as avg_mood
FROM journal_entries je
CROSS JOIN LATERAL (
  SELECT
    genre,
    valence,
    energy
  FROM spotify_tracks
  WHERE id = je.metadata->>'spotifyTrack'->>'trackId'
) st
GROUP BY je.mood, st.genre, st.valence, st.energy;
```

**Insights UI:**
```
┌────────────────────────────────────────┐
│ Music & Mood Insights                  │
├────────────────────────────────────────┤
│ You're happier when listening to:      │
│ • Indie Rock (avg mood: 7.5/10)        │
│ • Folk (avg mood: 7.2/10)              │
│                                        │
│ Lower mood with:                       │
│ • Electronic (avg mood: 5.8/10)        │
│ • Hip-Hop (avg mood: 6.1/10)           │
│                                        │
│ Top artists when feeling good:         │
│ 1. The National (12 entries)           │
│ 2. Bon Iver (9 entries)                │
│ 3. Fleet Foxes (7 entries)             │
└────────────────────────────────────────┘
```

**Feature requires:**
- Spotify Audio Features API
- Machine learning for pattern detection
- Large dataset (100+ journal entries)
- **Defer to V2+**

---

### 1.6 Data Model

```sql
-- Spotify OAuth tokens
CREATE TABLE spotify_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,

  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  scopes TEXT[] NOT NULL,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_spotify_tokens_user_id ON spotify_tokens(user_id);

-- Playback history (for caching and analytics)
CREATE TABLE spotify_playback_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Track info
  track_id TEXT NOT NULL, -- Spotify track ID
  track_name TEXT NOT NULL,
  artist_name TEXT NOT NULL,
  album_name TEXT NOT NULL,
  album_art_url TEXT,
  duration_ms INTEGER,

  -- Playback context
  played_at TIMESTAMPTZ NOT NULL,
  context_type TEXT, -- 'playlist', 'album', 'artist', 'collection'
  context_uri TEXT,  -- spotify:playlist:xxxxx

  -- Audio features (V2 - for mood correlation)
  valence NUMERIC(3,2), -- 0-1
  energy NUMERIC(3,2),  -- 0-1
  tempo NUMERIC(6,2),
  genre TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_playback_history_user_id ON spotify_playback_history(user_id);
CREATE INDEX idx_playback_history_played_at ON spotify_playback_history(played_at);
CREATE INDEX idx_playback_history_track_id ON spotify_playback_history(track_id);

-- Current playback cache (single row per user)
CREATE TABLE spotify_current_playback (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,

  track_id TEXT,
  track_name TEXT,
  artist_name TEXT,
  album_name TEXT,
  album_art_url TEXT,
  duration_ms INTEGER,
  progress_ms INTEGER,
  is_playing BOOLEAN,

  last_updated_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add Spotify data to journal entries (JSONB metadata)
ALTER TABLE journal_entries
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Example metadata structure:
-- {
--   "spotifyTrack": {
--     "trackId": "spotify:track:xxxxx",
--     "trackName": "Bloodbuzz Ohio",
--     "artistName": "The National",
--     "albumName": "High Violet",
--     "albumArt": "https://...",
--     "capturedAt": "2025-04-15T14:30:00Z"
--   }
-- }

CREATE INDEX idx_journal_metadata_spotify ON journal_entries
  USING gin((metadata->'spotifyTrack'));

-- Trigger to save playback to history
CREATE OR REPLACE FUNCTION save_playback_to_history()
RETURNS TRIGGER AS $$
BEGIN
  -- Only insert if track changed (not just progress update)
  IF OLD.track_id IS DISTINCT FROM NEW.track_id THEN
    INSERT INTO spotify_playback_history (
      user_id,
      track_id,
      track_name,
      artist_name,
      album_name,
      album_art_url,
      duration_ms,
      played_at
    ) VALUES (
      NEW.user_id,
      NEW.track_id,
      NEW.track_name,
      NEW.artist_name,
      NEW.album_name,
      NEW.album_art_url,
      NEW.duration_ms,
      NOW()
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER spotify_playback_history_trigger
  AFTER UPDATE ON spotify_current_playback
  FOR EACH ROW
  EXECUTE FUNCTION save_playback_to_history();
```

---

## 2. API Endpoints

```typescript
// Spotify connection
POST   /api/spotify/connect          // Start OAuth flow
GET    /api/spotify/callback?code=...// OAuth callback
DELETE /api/spotify/disconnect       // Revoke access
GET    /api/spotify/status           // Connection status

// Now playing
GET    /api/spotify/now-playing      // Current track
GET    /api/spotify/recently-played  // Last 20 tracks

// Playback control (V2)
POST   /api/spotify/play
POST   /api/spotify/pause
POST   /api/spotify/skip-next
POST   /api/spotify/skip-previous
POST   /api/spotify/seek?position=120000

// Journal integration
POST   /api/journal/entries/:id/add-current-song
GET    /api/journal/entries/:id/spotify-data

// Analytics (V2)
GET    /api/spotify/insights/mood-correlation
GET    /api/spotify/insights/top-artists?timeframe=month
```

### Example: Get Now Playing

```http
GET /api/spotify/now-playing

Response 200:
{
  "isPlaying": true,
  "track": {
    "id": "spotify:track:4gMgiXfqyzZLMhsksGmbQV",
    "name": "Bloodbuzz Ohio",
    "artist": "The National",
    "album": "High Violet",
    "albumArt": "https://i.scdn.co/image/ab67616d0000b273...",
    "duration": 282000,  // 4:42 in ms
    "progress": 154000,  // 2:34 in ms
    "uri": "spotify:track:4gMgiXfqyzZLMhsksGmbQV"
  },
  "context": {
    "type": "playlist",
    "name": "Indie Rock Essentials",
    "uri": "spotify:playlist:xxxxx"
  }
}

Response 204 (Nothing playing):
(empty body)

Response 401 (Not connected):
{
  "error": "spotify_not_connected",
  "message": "Please connect your Spotify account",
  "connectUrl": "/settings/integrations"
}
```

### Example: Add Song to Journal

```http
POST /api/journal/entries/entry_abc123/add-current-song

Response 200:
{
  "entry": {
    "id": "entry_abc123",
    "content": "Today was productive...",
    "mood": 8,
    "metadata": {
      "spotifyTrack": {
        "trackId": "spotify:track:4gMgiXfqyzZLMhsksGmbQV",
        "trackName": "Bloodbuzz Ohio",
        "artistName": "The National",
        "albumName": "High Violet",
        "albumArt": "https://...",
        "capturedAt": "2025-04-15T14:30:00Z"
      }
    }
  }
}
```

---

## 3. Integration Points

### 3.1 Journal System
- **Auto-capture** when creating entry
- **Manual add** current song to existing entry
- **Display** album art + track info in journal view
- **Search** journals by song/artist

### 3.2 Dashboard
- **Widget** showing now playing
- **Quick action** to add to journal from dashboard

### 3.3 Mood Tracking (V2)
- **Correlation** between music genre/features and mood
- **Insights** page showing patterns
- **Recommendations** based on desired mood

### 3.4 Spaces System
- Spotify widget visibility per space
- "Work" space = hide Spotify widget option
- "Personal" space = always show widget

---

## 4. Implementation Priority

### Phase 1: MVP (Week 1)
**Est. 20 hours**

- [ ] Spotify OAuth flow - 4h
- [ ] Token storage & refresh - 2h
- [ ] Now Playing API integration - 3h
- [ ] Compact widget UI - 4h
- [ ] Database schema - 2h
- [ ] Journal auto-capture - 3h
- [ ] Settings page (connect/disconnect) - 2h

**MVP Deliverables:**
✅ Connect Spotify account
✅ Display now playing in dashboard
✅ Auto-capture song when creating journal entry
✅ Display song in journal view

### Phase 2: Enhanced Display (Week 2)
**Est. 10 hours**

- [ ] Full widget with album art - 3h
- [ ] Progress bar (read-only) - 2h
- [ ] Recently played list - 2h
- [ ] Manual "Add current song" button - 2h
- [ ] Playback history tracking - 1h

### Phase 3: Controls (V3)
**Est. 8 hours**

- [ ] Play/pause buttons - 2h
- [ ] Skip track - 2h
- [ ] Volume control - 2h
- [ ] Seek in track - 2h

### Phase 4: Analytics (V3+)
**Est. 20 hours**

- [ ] Fetch audio features from Spotify - 4h
- [ ] Mood correlation analysis - 8h
- [ ] Insights page - 6h
- [ ] Recommendations engine - 2h

**Defer to V2+:**
- Full playback controls
- Mood correlation insights
- Top artists/tracks analytics
- Playlist creation from journal moods

---

## 5. Technical Considerations

### 5.1 API Rate Limits

**Spotify API:**
- No documented rate limits for personal use
- Best practice: Max 1 request per second per user
- Current playback: Poll every 30 seconds max

**Mitigation:**
- Cache current playback in database
- Use SSE for real-time updates (backend polls, frontend subscribes)
- Don't poll when tab is inactive

```typescript
// Respect browser visibility
useEffect(() => {
  const handleVisibilityChange = () => {
    if (document.hidden) {
      clearInterval(pollingInterval)
    } else {
      startPolling()
    }
  }

  document.addEventListener('visibilitychange', handleVisibilityChange)
  return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
}, [])
```

### 5.2 Caching Strategy

```typescript
// Cache current playback for 30 seconds
class SpotifyCache {
  private cache: Map<string, { data: any, expiresAt: number }> = new Map()

  async getCurrentPlayback(userId: string): Promise<SpotifyPlayback | null> {
    const cached = this.cache.get(`playback:${userId}`)

    if (cached && cached.expiresAt > Date.now()) {
      return cached.data
    }

    // Fetch fresh data
    const token = await getValidSpotifyToken(userId)
    const response = await fetch('https://api.spotify.com/v1/me/player', {
      headers: { 'Authorization': `Bearer ${token}` }
    })

    if (response.status === 204) {
      return null // Nothing playing
    }

    const data = await response.json()

    // Cache for 30 seconds
    this.cache.set(`playback:${userId}`, {
      data,
      expiresAt: Date.now() + 30000
    })

    // Update database
    await db.spotifyCurrentPlayback.upsert({
      userId,
      trackId: data.item.id,
      trackName: data.item.name,
      artistName: data.item.artists[0].name,
      albumName: data.item.album.name,
      albumArtUrl: data.item.album.images[0].url,
      durationMs: data.item.duration_ms,
      progressMs: data.progress_ms,
      isPlaying: data.is_playing,
      lastUpdatedAt: new Date()
    })

    return data
  }
}
```

### 5.3 Error Handling

```typescript
async function fetchNowPlaying(): Promise<SpotifyPlayback | null> {
  try {
    const token = await getValidSpotifyToken(userId)
    const response = await fetch('https://api.spotify.com/v1/me/player', {
      headers: { 'Authorization': `Bearer ${token}` }
    })

    if (response.status === 204) {
      // Nothing playing - normal state
      return null
    }

    if (response.status === 401) {
      // Token invalid - require re-auth
      await notifyUser({
        type: 'warning',
        message: 'Spotify connection expired. Please reconnect.',
        action: 'Reconnect',
        actionUrl: '/settings/integrations'
      })
      await db.spotifyTokens.update({ userId }, { expiresAt: 0 })
      return null
    }

    if (response.status === 429) {
      // Rate limited (rare for single user)
      const retryAfter = response.headers.get('Retry-After')
      console.warn(`Spotify rate limited, retry after ${retryAfter}s`)
      return null
    }

    return await response.json()

  } catch (error) {
    console.error('Spotify API error:', error)
    // Don't show error to user for transient failures
    return null
  }
}
```

### 5.4 Performance Optimizations

**1. Lazy load album art:**
```typescript
<img
  src={track.albumArt}
  loading="lazy"
  alt={track.albumName}
  onError={(e) => {
    e.currentTarget.src = '/images/default-album.png'
  }}
/>
```

**2. Debounce widget updates:**
```typescript
const debouncedUpdate = useMemo(
  () => debounce((track) => setCurrentTrack(track), 1000),
  []
)
```

**3. Server-Sent Events for real-time:**
```typescript
// Backend (V2)
app.get('/api/spotify/stream', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  const userId = req.user.id

  // Poll Spotify every 10s and push to client
  const interval = setInterval(async () => {
    const nowPlaying = await fetchNowPlaying(userId)
    res.write(`data: ${JSON.stringify(nowPlaying)}\n\n`)
  }, 10000)

  req.on('close', () => {
    clearInterval(interval)
  })
})

// Frontend (V2)
useEffect(() => {
  const eventSource = new EventSource('/api/spotify/stream')

  eventSource.onmessage = (event) => {
    const nowPlaying = JSON.parse(event.data)
    setCurrentTrack(nowPlaying)
  }

  return () => eventSource.close()
}, [])
```

### 5.5 Privacy Considerations

**Data stored locally:**
- Tokens (encrypted at rest)
- Playback history (user can delete)
- Current playback cache (ephemeral)

**Data NOT stored:**
- User's full Spotify library
- Playlist contents
- Listening habits beyond what's captured in journal

**User controls:**
```
Settings > Integrations > Spotify
┌────────────────────────────────────┐
│ ☑ Show Now Playing widget          │
│ ☑ Auto-capture song in journal     │
│ ☑ Track playback history           │
│                                    │
│ [Clear Playback History]           │
│ [Disconnect Spotify]               │
└────────────────────────────────────┘
```

---

## Summary

**MVP Focus:**
1. OAuth connection ✅
2. Display now playing ✅
3. Auto-capture in journal ✅
4. Compact widget ✅

**Technical Stack:**
- Spotify Web API
- Polling (30s) for MVP, SSE for V2
- PostgreSQL for token storage
- JSONB for journal metadata

**Total Estimated Effort:** 38 hours (~1 week)

**Key Files:**
- `C:/Users/bette/Desktop/specs_and_prds/docs/design/features/spotify/specification.md`
