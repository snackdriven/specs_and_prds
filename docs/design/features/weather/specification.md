# Weather Integration - Technical Specification

## 1. Complete Feature Specification

### 1.1 API Setup (Tomorrow.io)

#### A. API Plan & Limits

**Tomorrow.io Free Tier:**
- 500 API calls/day
- 25 calls/hour
- 3 calls/minute

**Recommended Strategy:**
- Update every 3 hours (8 calls/day)
- Cache aggressively
- Fetch on-demand when user views dashboard

**API Key Setup:**
```typescript
// Environment variable
TOMORROW_IO_API_KEY=your_api_key_here

// API base URL
const TOMORROW_IO_BASE = 'https://api.tomorrow.io/v4'
```

#### B. Location Detection

**MVP: IP-based geolocation**
```typescript
// Using ipapi.co (free, no auth required)
async function getUserLocation(): Promise<Location> {
  const response = await fetch('https://ipapi.co/json/')
  const data = await response.json()

  return {
    latitude: data.latitude,
    longitude: data.longitude,
    city: data.city,
    region: data.region,
    country: data.country_name
  }
}

// Store in user settings
interface UserSettings {
  location: {
    latitude: number
    longitude: number
    city: string
    detectionMethod: 'ip' | 'manual' | 'gps' // GPS for V2
  }
}
```

**V2: Manual entry**
```
Settings > Weather
┌────────────────────────────────────┐
│ Location                           │
│ ○ Auto-detect (IP-based)          │
│ ● Manual                           │
│   [New York, NY      ▾]           │
│                                    │
│ Detected: New York, NY             │
│ (40.7128, -74.0060)               │
└────────────────────────────────────┘
```

**V3: GPS (requires HTTPS + permission)**

#### C. Update Frequency

**Tiered approach based on user activity:**

```typescript
enum UpdateStrategy {
  ACTIVE = 'active',     // Every 1 hour when app is open
  IDLE = 'idle',        // Every 3 hours when app is open but idle
  BACKGROUND = 'background' // Every 6 hours via cron job
}

// Update logic
async function scheduleWeatherUpdate() {
  const lastUpdate = await db.weatherCache.getLastUpdate()
  const hoursSinceUpdate = (Date.now() - lastUpdate) / (1000 * 60 * 60)

  const userActivity = getUserActivityLevel() // 'active' | 'idle'
  const threshold = userActivity === 'active' ? 1 : 3

  if (hoursSinceUpdate >= threshold) {
    await fetchAndCacheWeather()
  }
}
```

**Cron job (backend):**
```typescript
// Every 3 hours, update weather for all users
cron.schedule('0 */3 * * *', async () => {
  const users = await db.users.findMany({ weatherEnabled: true })

  for (const user of users) {
    await fetchAndCacheWeather(user.id)
  }
})
```

---

### 1.2 Dashboard Display

#### A. Widget Size & Placement

**Option 1: Header Corner (Compact)**
```
┌────────────────────────────────────────────┐
│ Dashboard              ☀️ 72°F  ︙  [Alerts]│
└────────────────────────────────────────────┘
```

**Option 2: Dedicated Widget (Recommended)**
```
┌─────────────────────────────────┐
│ Weather - New York, NY          │
├─────────────────────────────────┤
│  ☀️ Sunny                       │
│  72°F (Feels like 74°F)        │
│  H: 78° L: 65°                 │
│                                 │
│  💧 15% chance of rain         │
│  💨 Wind: 8 mph NE             │
│  ☀️ UV Index: 6 (High)         │
│                                 │
│  TODAY  THU   FRI   SAT         │
│  ☀️78°  ⛅72°  🌧️65°  ☀️80°   │
└─────────────────────────────────┘
```

**Option 3: Minimal (Status Bar)**
```
[Dashboard] [Tasks] [Calendar] [Journal]    ☀️ 72° · NYC
```

**Recommended: Option 2 (Dedicated Widget)**
- Most informative
- Supports forecast
- Room for context-aware suggestions

#### B. Data Displayed

**Current Conditions:**
- Temperature (actual)
- "Feels like" temperature (wind chill/heat index)
- Weather description ("Sunny", "Partly Cloudy", "Rainy")
- Icon (based on weather code)
- High/Low for today

**Additional Details (expandable):**
- Precipitation chance (%)
- Humidity (%)
- Wind speed & direction
- UV index (0-11 scale with label)
- Visibility (miles)
- Air quality index (AQI) - V2

**Forecast:**
- Next 4 days
- High/Low temps
- Weather icon
- Precipitation chance

#### C. Weather Icons

**Icon Mapping:**
```typescript
const WEATHER_ICONS = {
  1000: '☀️',  // Clear/Sunny
  1100: '🌤️',  // Mostly Clear
  1101: '⛅',  // Partly Cloudy
  1102: '☁️',  // Mostly Cloudy
  1001: '☁️',  // Cloudy
  2000: '🌫️',  // Fog
  4000: '🌧️',  // Drizzle
  4001: '🌧️',  // Rain
  4200: '🌧️',  // Light Rain
  4201: '⛈️',  // Heavy Rain
  5000: '❄️',  // Snow
  5001: '❄️',  // Flurries
  5100: '🌨️',  // Light Snow
  5101: '🌨️',  // Heavy Snow
  6000: '🌨️',  // Freezing Drizzle
  6001: '🌨️',  // Freezing Rain
  7000: '🧊',  // Ice Pellets
  8000: '⛈️',  // Thunderstorm
}

function getWeatherIcon(code: number): string {
  return WEATHER_ICONS[code] || '❓'
}
```

---

### 1.3 Smart Features

#### A. Context-Aware Suggestions

**Daily Dashboard Message:**

```typescript
interface WeatherSuggestion {
  message: string
  type: 'info' | 'warning' | 'tip'
  actions?: Array<{
    label: string
    actionType: 'filter_tasks' | 'show_indoor' | 'reschedule'
  }>
}

function generateWeatherSuggestion(weather: Weather): WeatherSuggestion {
  const { temp, description, precipProbability } = weather

  // Rainy day
  if (precipProbability > 70) {
    return {
      message: "It's raining - great day to focus on indoor tasks",
      type: 'info',
      actions: [
        { label: 'Show Indoor Tasks', actionType: 'filter_tasks' }
      ]
    }
  }

  // Beautiful weather
  if (temp >= 65 && temp <= 80 && description.includes('Clear')) {
    return {
      message: "Beautiful day! Perfect for outdoor chores or a walk",
      type: 'tip',
      actions: [
        { label: 'Show Outdoor Tasks', actionType: 'filter_tasks' }
      ]
    }
  }

  // Extreme heat
  if (temp > 90) {
    return {
      message: "Hot day - stay hydrated and avoid outdoor tasks during peak hours",
      type: 'warning'
    }
  }

  // Cold morning
  if (temp < 40) {
    return {
      message: "Cold morning - don't forget a jacket!",
      type: 'tip'
    }
  }

  // Default
  return {
    message: `${description} today`,
    type: 'info'
  }
}
```

**Display in Dashboard:**
```
┌─────────────────────────────────────────┐
│ ☀️ Beautiful day! Perfect for outdoor  │
│    chores or a walk                     │
│    [Show Outdoor Tasks]                 │
└─────────────────────────────────────────┘
```

#### B. Mood Correlation (V2)

**Track weather conditions when logging mood:**

```sql
-- Add weather snapshot to mood logs
ALTER TABLE mood_logs
ADD COLUMN weather_snapshot JSONB;

-- Example data:
{
  "temp": 72,
  "feelsLike": 74,
  "description": "Sunny",
  "precipProbability": 10,
  "uvIndex": 6,
  "humidity": 45
}

-- Analysis query (V2):
SELECT
  CASE
    WHEN weather_snapshot->>'description' ILIKE '%sunny%' THEN 'Sunny'
    WHEN weather_snapshot->>'description' ILIKE '%rain%' THEN 'Rainy'
    WHEN weather_snapshot->>'description' ILIKE '%cloud%' THEN 'Cloudy'
    ELSE 'Other'
  END as weather_type,
  AVG(mood_score) as avg_mood,
  COUNT(*) as entry_count
FROM mood_logs
WHERE weather_snapshot IS NOT NULL
GROUP BY weather_type
ORDER BY avg_mood DESC;
```

**Insights UI (V2):**
```
┌────────────────────────────────────────┐
│ Weather & Mood Insights                │
├────────────────────────────────────────┤
│ Your average mood by weather:          │
│ ☀️  Sunny:  7.8/10 (45 logs)           │
│ ⛅ Cloudy:  6.5/10 (32 logs)           │
│ 🌧️ Rainy:   5.2/10 (18 logs)          │
│                                        │
│ You tend to feel better on sunny days │
└────────────────────────────────────────┘
```

#### C. Task Filtering (V2)

**Tag tasks as indoor/outdoor:**

```sql
-- Add location field to tasks
ALTER TABLE tasks
ADD COLUMN location_type TEXT CHECK (location_type IN ('indoor', 'outdoor', 'either'));

CREATE INDEX idx_tasks_location_type ON tasks(location_type);
```

**Smart filtering:**
```typescript
// Show indoor tasks when raining
async function getWeatherAwareTasks(userId: string) {
  const weather = await getCurrentWeather(userId)
  const tasks = await db.tasks.findMany({ userId, completed: false })

  if (weather.precipProbability > 70) {
    // Prioritize indoor tasks
    return tasks
      .sort((a, b) => {
        if (a.locationType === 'indoor' && b.locationType !== 'indoor') return -1
        if (a.locationType !== 'indoor' && b.locationType === 'indoor') return 1
        return 0
      })
  }

  return tasks
}
```

**UI:**
```
┌────────────────────────────────────────┐
│ 🌧️ It's raining - showing indoor tasks│
│                                        │
│ ☐ Review documents                     │
│ ☐ Organize desk                        │
│ ☐ Plan next week                       │
│                                        │
│ [Show All Tasks]                       │
└────────────────────────────────────────┘
```

---

### 1.4 Data Model

```sql
-- Weather cache (single row per user)
CREATE TABLE weather_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,

  -- Location
  latitude NUMERIC(9, 6) NOT NULL,
  longitude NUMERIC(9, 6) NOT NULL,
  city TEXT,
  region TEXT,
  country TEXT,

  -- Current conditions
  temperature NUMERIC(5, 2) NOT NULL,
  feels_like NUMERIC(5, 2),
  description TEXT NOT NULL,
  weather_code INTEGER NOT NULL, -- Tomorrow.io weather code
  icon TEXT, -- Emoji or icon identifier

  -- Precipitation
  precip_probability INTEGER, -- 0-100
  precip_type TEXT, -- 'rain', 'snow', 'ice', 'none'

  -- Wind
  wind_speed NUMERIC(5, 2),
  wind_direction INTEGER, -- 0-360 degrees
  wind_direction_label TEXT, -- 'N', 'NE', 'E', etc.

  -- Other conditions
  humidity INTEGER, -- 0-100
  uv_index INTEGER, -- 0-11
  visibility NUMERIC(5, 2), -- miles
  cloud_cover INTEGER, -- 0-100

  -- Daily high/low
  temp_high NUMERIC(5, 2),
  temp_low NUMERIC(5, 2),

  -- Metadata
  fetched_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL, -- Cache for 3 hours
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_weather_cache_user_id ON weather_cache(user_id);
CREATE INDEX idx_weather_cache_expires_at ON weather_cache(expires_at);

-- Weather forecast (next 4 days)
CREATE TABLE weather_forecast (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  forecast_date DATE NOT NULL,
  temp_high NUMERIC(5, 2),
  temp_low NUMERIC(5, 2),
  description TEXT,
  weather_code INTEGER,
  icon TEXT,
  precip_probability INTEGER,

  fetched_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, forecast_date)
);

CREATE INDEX idx_weather_forecast_user_date ON weather_forecast(user_id, forecast_date);

-- User weather preferences
CREATE TABLE user_weather_preferences (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,

  -- Display settings
  show_widget BOOLEAN DEFAULT TRUE,
  temperature_unit TEXT DEFAULT 'fahrenheit' CHECK (temperature_unit IN ('fahrenheit', 'celsius')),
  wind_speed_unit TEXT DEFAULT 'mph' CHECK (wind_speed_unit IN ('mph', 'kmh', 'ms')),

  -- Location settings
  location_method TEXT DEFAULT 'ip' CHECK (location_method IN ('ip', 'manual', 'gps')),
  manual_latitude NUMERIC(9, 6),
  manual_longitude NUMERIC(9, 6),
  manual_city TEXT,

  -- Smart features
  enable_suggestions BOOLEAN DEFAULT TRUE,
  enable_task_filtering BOOLEAN DEFAULT FALSE, -- V2

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Historical weather data (for mood correlation, V2)
CREATE TABLE weather_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  recorded_at TIMESTAMPTZ NOT NULL,
  temperature NUMERIC(5, 2),
  description TEXT,
  weather_code INTEGER,
  precip_probability INTEGER,
  humidity INTEGER,
  uv_index INTEGER,

  -- Link to mood/journal entries
  mood_log_id UUID REFERENCES mood_logs(id) ON DELETE SET NULL,
  journal_entry_id UUID REFERENCES journal_entries(id) ON DELETE SET NULL,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_weather_history_user_id ON weather_history(user_id);
CREATE INDEX idx_weather_history_recorded_at ON weather_history(recorded_at);
CREATE INDEX idx_weather_history_mood_log ON weather_history(mood_log_id) WHERE mood_log_id IS NOT NULL;

-- Trigger to clean up expired cache
CREATE OR REPLACE FUNCTION cleanup_expired_weather_cache()
RETURNS void AS $$
BEGIN
  DELETE FROM weather_cache
  WHERE expires_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- Cleanup expired forecasts
CREATE OR REPLACE FUNCTION cleanup_old_weather_forecast()
RETURNS void AS $$
BEGIN
  DELETE FROM weather_forecast
  WHERE forecast_date < CURRENT_DATE - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- Scheduled cleanup (add to cron)
-- SELECT cleanup_expired_weather_cache();
-- SELECT cleanup_old_weather_forecast();
```

---

## 2. API Endpoints

```typescript
// Weather data
GET    /api/weather/current           // Current conditions
GET    /api/weather/forecast          // 4-day forecast
POST   /api/weather/refresh           // Force refresh (respects rate limits)

// Settings
GET    /api/weather/preferences
PATCH  /api/weather/preferences
POST   /api/weather/location/detect   // Re-detect location

// Smart features
GET    /api/weather/suggestion        // Context-aware suggestion
GET    /api/weather/insights/mood     // Weather-mood correlation (V2)
```

### Example: Get Current Weather

```http
GET /api/weather/current

Response 200:
{
  "location": {
    "city": "New York",
    "region": "New York",
    "country": "United States",
    "coordinates": {
      "latitude": 40.7128,
      "longitude": -74.0060
    }
  },
  "current": {
    "temperature": 72,
    "feelsLike": 74,
    "description": "Sunny",
    "icon": "☀️",
    "weatherCode": 1000,
    "high": 78,
    "low": 65,
    "precipProbability": 10,
    "humidity": 45,
    "windSpeed": 8,
    "windDirection": "NE",
    "uvIndex": 6,
    "uvIndexLabel": "High",
    "visibility": 10
  },
  "suggestion": {
    "message": "Beautiful day! Perfect for outdoor chores or a walk",
    "type": "tip",
    "actions": [
      { "label": "Show Outdoor Tasks", "actionType": "filter_tasks" }
    ]
  },
  "metadata": {
    "fetchedAt": "2025-04-15T14:00:00Z",
    "expiresAt": "2025-04-15T17:00:00Z"
  }
}
```

### Example: Get Forecast

```http
GET /api/weather/forecast

Response 200:
{
  "forecast": [
    {
      "date": "2025-04-15",
      "dayOfWeek": "Monday",
      "high": 78,
      "low": 65,
      "description": "Sunny",
      "icon": "☀️",
      "precipProbability": 10
    },
    {
      "date": "2025-04-16",
      "dayOfWeek": "Tuesday",
      "high": 72,
      "low": 60,
      "description": "Partly Cloudy",
      "icon": "⛅",
      "precipProbability": 20
    },
    {
      "date": "2025-04-17",
      "dayOfWeek": "Wednesday",
      "high": 65,
      "low": 55,
      "description": "Rain",
      "icon": "🌧️",
      "precipProbability": 80
    },
    {
      "date": "2025-04-18",
      "dayOfWeek": "Thursday",
      "high": 80,
      "low": 68,
      "description": "Sunny",
      "icon": "☀️",
      "precipProbability": 5
    }
  ]
}
```

### Example: Update Preferences

```http
PATCH /api/weather/preferences
Content-Type: application/json

{
  "temperatureUnit": "celsius",
  "showWidget": true,
  "enableSuggestions": true,
  "locationMethod": "manual",
  "manualCity": "San Francisco, CA",
  "manualLatitude": 37.7749,
  "manualLongitude": -122.4194
}

Response 200:
{
  "preferences": {
    "temperatureUnit": "celsius",
    "windSpeedUnit": "mph",
    "showWidget": true,
    "locationMethod": "manual",
    "manualCity": "San Francisco, CA",
    "enableSuggestions": true,
    "enableTaskFiltering": false
  }
}
```

---

## 3. Integration Points

### 3.1 Dashboard
- Weather widget with current conditions + forecast
- Context-aware suggestions
- Quick view of high/low temps

### 3.2 Task System (V2)
- Filter tasks by indoor/outdoor based on weather
- Suggest task prioritization (indoor tasks when raining)
- Weather-based reminders ("Good weather for outdoor chores")

### 3.3 Mood Tracking (V2)
- Capture weather snapshot when logging mood
- Correlate weather patterns with mood trends
- Display insights ("You're happier on sunny days")

### 3.4 Journal System (V2)
- Auto-capture weather in journal metadata
- Display weather icon next to journal entries
- Search journals by weather conditions

### 3.5 Calendar Integration (V3)
- Display weather forecast on calendar days
- Suggest rescheduling outdoor events if rain forecasted
- Color-code calendar days by weather

---

## 4. Implementation Priority

### Phase 1: MVP (Week 1)
**Est. 16 hours**

- [ ] Tomorrow.io API integration - 4h
- [ ] IP-based location detection - 2h
- [ ] Database schema + cache - 2h
- [ ] Current weather widget UI - 4h
- [ ] Forecast display (4 days) - 2h
- [ ] Settings page (units, toggle widget) - 2h

**MVP Deliverables:**
✅ Display current weather on dashboard
✅ Show 4-day forecast
✅ Auto-detect location
✅ Cache weather data
✅ Basic settings (units, show/hide)

### Phase 2: Smart Features (Week 2)
**Est. 8 hours**

- [ ] Context-aware suggestions - 4h
- [ ] Weather icons - 1h
- [ ] UV index warnings - 1h
- [ ] Extreme weather alerts - 2h

### Phase 3: Task Integration (V2)
**Est. 10 hours**

- [ ] Indoor/outdoor task tagging - 3h
- [ ] Weather-based task filtering - 3h
- [ ] Smart task suggestions - 4h

### Phase 4: Mood Correlation (V2)
**Est. 12 hours**

- [ ] Capture weather in mood logs - 2h
- [ ] Weather history tracking - 2h
- [ ] Analytics queries - 4h
- [ ] Insights UI - 4h

**Defer to V3+:**
- Manual location entry
- GPS location
- Air quality index (AQI)
- Weather alerts (tornado, hurricane, etc.)
- Calendar integration
- Historical weather data export

---

## 5. Technical Considerations

### 5.1 API Rate Limits

**Tomorrow.io Free Tier:**
- 500 calls/day
- 25 calls/hour
- 3 calls/minute

**Mitigation:**
```typescript
class WeatherAPIRateLimiter {
  private callLog: number[] = []

  async checkRateLimit(): Promise<boolean> {
    const now = Date.now()

    // Remove calls older than 1 minute
    this.callLog = this.callLog.filter(timestamp => now - timestamp < 60000)

    if (this.callLog.length >= 3) {
      // Hit minute limit
      return false
    }

    // Check hour limit (simplified - track in DB for multi-instance)
    const hourlyCount = await db.weatherAPILogs.count({
      where: {
        created_at: { gte: new Date(now - 3600000) }
      }
    })

    if (hourlyCount >= 25) {
      return false
    }

    // Check daily limit
    const dailyCount = await db.weatherAPILogs.count({
      where: {
        created_at: { gte: new Date(now - 86400000) }
      }
    })

    if (dailyCount >= 500) {
      return false
    }

    // Rate limit OK
    this.callLog.push(now)
    await db.weatherAPILogs.create({ created_at: new Date() })
    return true
  }
}
```

### 5.2 Caching Strategy

**Aggressive caching to reduce API calls:**

```typescript
async function getWeather(userId: string): Promise<Weather> {
  // Check cache first
  const cached = await db.weatherCache.findOne({ userId })

  if (cached && cached.expiresAt > new Date()) {
    return cached
  }

  // Check rate limits
  const canFetch = await rateLimiter.checkRateLimit()
  if (!canFetch) {
    // Return stale cache if available
    if (cached) {
      console.warn('Rate limit hit, returning stale cache')
      return cached
    }
    throw new Error('Weather API rate limit exceeded and no cache available')
  }

  // Fetch fresh data
  const location = await getUserLocation(userId)
  const weather = await fetchFromTomorrowIO(location)

  // Cache for 3 hours
  await db.weatherCache.upsert({
    userId,
    ...weather,
    fetchedAt: new Date(),
    expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000)
  })

  return weather
}
```

### 5.3 Error Handling

```typescript
async function fetchFromTomorrowIO(location: Location): Promise<Weather> {
  const url = `${TOMORROW_IO_BASE}/weather/realtime?location=${location.latitude},${location.longitude}&apikey=${TOMORROW_IO_API_KEY}`

  try {
    const response = await fetch(url)

    if (response.status === 429) {
      // Rate limited
      throw new Error('RATE_LIMIT_EXCEEDED')
    }

    if (response.status === 401) {
      // Invalid API key
      console.error('Tomorrow.io API key invalid')
      throw new Error('INVALID_API_KEY')
    }

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`)
    }

    const data = await response.json()
    return parseWeatherData(data)

  } catch (error) {
    if (error.message === 'RATE_LIMIT_EXCEEDED') {
      // Return cached data or default
      const cached = await db.weatherCache.findOne({ userId })
      if (cached) {
        console.warn('Returning stale weather cache due to rate limit')
        return cached
      }
    }

    // Log error and return default weather
    console.error('Weather fetch failed:', error)
    await notifyAdmin({
      type: 'weather_api_error',
      error: error.message
    })

    // Return default/unknown weather
    return {
      temperature: null,
      description: 'Weather data unavailable',
      icon: '❓'
    }
  }
}
```

### 5.4 Performance Optimizations

**1. Lazy load weather widget:**
```typescript
// Don't fetch weather until user scrolls to widget
const WeatherWidget = lazy(() => import('./WeatherWidget'))

<Suspense fallback={<WeatherSkeleton />}>
  <WeatherWidget />
</Suspense>
```

**2. Background refresh:**
```typescript
// Refresh weather in background, don't block UI
useEffect(() => {
  const refreshWeather = async () => {
    const cached = await getWeatherFromCache()
    setWeather(cached) // Show cached immediately

    // Fetch fresh data in background
    fetchWeatherInBackground().then(fresh => {
      setWeather(fresh)
    })
  }

  refreshWeather()
}, [])
```

**3. Debounce location changes:**
```typescript
// Don't refetch weather on every location change
const debouncedLocationUpdate = debounce(async (newLocation) => {
  await updateUserLocation(newLocation)
  await refreshWeather()
}, 2000)
```

### 5.5 Fallback Data

**If API fails, use sensible defaults:**

```typescript
const WEATHER_FALLBACK = {
  temperature: null,
  description: 'Weather data unavailable',
  icon: '❓',
  suggestion: {
    message: 'Weather data unavailable - check your internet connection',
    type: 'info'
  }
}

// Or use last known good data
async function getWeatherWithFallback(userId: string): Promise<Weather> {
  try {
    return await getWeather(userId)
  } catch (error) {
    const lastKnown = await db.weatherCache.findOne({
      userId,
      orderBy: { fetchedAt: 'desc' }
    })

    if (lastKnown) {
      return {
        ...lastKnown,
        suggestion: {
          message: 'Showing last known weather data',
          type: 'warning'
        }
      }
    }

    return WEATHER_FALLBACK
  }
}
```

---

## Summary

**MVP Focus:**
1. Current weather display ✅
2. 4-day forecast ✅
3. IP-based location ✅
4. Cache for 3 hours ✅
5. Context-aware suggestions ✅

**Technical Stack:**
- Tomorrow.io API (free tier, 500 calls/day)
- ipapi.co for geolocation (free, no auth)
- PostgreSQL for caching
- Aggressive caching (3-hour expiry)

**Total Estimated Effort:** 24 hours (~3 days)

**Key Considerations:**
- API rate limits (500/day) - cache aggressively
- Fallback to stale cache if rate limited
- IP-based location (MVP), manual + GPS (V2)
- Mood correlation (V2 - requires data collection)

**Files:**
- `C:/Users/bette/Desktop/specs_and_prds/docs/design/features/weather/specification.md`
