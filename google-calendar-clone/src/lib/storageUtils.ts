/**
 * Safe localStorage utilities with error handling.
 */

/**
 * Safely sets an item in localStorage with error handling.
 * @param key - The storage key
 * @param value - The value to store
 * @throws Error if storage fails (quota exceeded, etc.)
 */
export function safeSetItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    if (error instanceof DOMException) {
      if (error.name === 'QuotaExceededError') {
        throw new Error('Storage quota exceeded. Please clear some space.');
      }
      if (error.name === 'SecurityError') {
        throw new Error('Storage access denied. Please check your browser settings.');
      }
    }
    console.error('Failed to save to localStorage:', error);
    throw new Error('Failed to save data. Please try again.');
  }
}

/**
 * Safely gets an item from localStorage.
 * @param key - The storage key
 * @returns The stored value or null if not found
 */
export function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error('Failed to read from localStorage:', error);
    return null;
  }
}

/**
 * Safely removes an item from localStorage.
 * @param key - The storage key
 */
export function safeRemoveItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to remove from localStorage:', error);
  }
}

