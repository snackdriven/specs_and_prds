import { GOOGLE_API_MAX_REQUESTS, GOOGLE_API_WINDOW_MS } from './constants';

/**
 * Rate limiter for Google Calendar API calls.
 * Ensures we don't exceed the API rate limits (1000 requests per 100 seconds).
 */
export class RateLimiter {
  private requests: number[] = [];
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests = GOOGLE_API_MAX_REQUESTS, windowMs = GOOGLE_API_WINDOW_MS) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  /**
   * Checks if a request can be made, and waits if necessary.
   * @returns Promise that resolves when the request can proceed
   */
  async checkLimit(): Promise<void> {
    const now = Date.now();
    // Remove requests outside the time window
    this.requests = this.requests.filter((time) => now - time < this.windowMs);

    // If we're at the limit, wait until the oldest request expires
    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0];
      const waitTime = this.windowMs - (now - oldestRequest);
      if (waitTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        return this.checkLimit(); // Recursively check again
      }
    }

    // Record this request
    this.requests.push(now);
  }

  /**
   * Resets the rate limiter (useful for testing or manual resets).
   */
  reset(): void {
    this.requests = [];
  }
}

// Singleton instance
export const calendarRateLimiter = new RateLimiter();

