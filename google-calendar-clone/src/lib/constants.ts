// Constants for the Google Calendar Clone application

export const MIN_EVENT_HEIGHT_MINUTES = 30;
export const SYNC_BUFFER_DAYS = 7;
export const EVENT_TITLE_MAX_LENGTH = 200;
export const EVENT_DESCRIPTION_MAX_LENGTH = 5000;
export const EVENT_LOCATION_MAX_LENGTH = 200;
export const DEFAULT_CALENDAR_COLOR = '#4285f4';

// Google Calendar API rate limits
export const GOOGLE_API_MAX_REQUESTS = 1000;
export const GOOGLE_API_WINDOW_MS = 100000; // 100 seconds

// Retry configuration
export const MAX_RETRIES = 3;
export const RETRY_DELAY_BASE_MS = 1000; // Base delay for exponential backoff

// Token refresh buffer (refresh 1 minute before expiry)
export const TOKEN_REFRESH_BUFFER_MS = 60000;

