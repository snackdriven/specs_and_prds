/**
 * Base storage utility patterns for localStorage.
 * 
 * Common patterns for handling localStorage across projects:
 * - Error handling
 * - Quota exceeded handling
 * - Date serialization/deserialization helpers
 * - Export/import utilities
 * 
 * Each project should extend these patterns with their specific data types.
 */

/**
 * Helper to safely parse JSON from localStorage with error handling
 */
export function safeParseJSON<T>(value: string | null, defaultValue: T): T {
  if (!value) return defaultValue;
  
  try {
    return JSON.parse(value);
  } catch (error) {
    console.error('Error parsing JSON from storage:', error);
    return defaultValue;
  }
}

/**
 * Helper to safely save to localStorage with quota error handling
 */
export function safeSaveToStorage(key: string, value: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error: any) {
    console.error('Error saving to storage:', error);
    
    if (error.name === 'QuotaExceededError' || error.code === 22) {
      throw new Error('Storage quota exceeded. Please clear some data.');
    }
    
    throw error;
  }
}

/**
 * Helper to restore Date objects from stored JSON
 * Recursively converts date strings back to Date objects for a given object
 */
export function restoreDates<T>(data: any, dateFields: string[]): T {
  if (!data || typeof data !== 'object') return data;
  
  const restored = Array.isArray(data) ? [...data] : { ...data };
  
  dateFields.forEach(field => {
    if (restored[field]) {
      if (Array.isArray(restored[field])) {
        restored[field] = restored[field].map((item: any) => {
          if (typeof item === 'string' && !isNaN(Date.parse(item))) {
            return new Date(item);
          }
          if (typeof item === 'object' && item !== null) {
            return restoreDates(item, dateFields);
          }
          return item;
        });
      } else if (typeof restored[field] === 'string' && !isNaN(Date.parse(restored[field]))) {
        restored[field] = new Date(restored[field]);
      } else if (typeof restored[field] === 'object' && restored[field] !== null) {
        restored[field] = restoreDates(restored[field], dateFields);
      }
    }
  });
  
  return restored as T;
}

/**
 * Base pattern for export data functionality
 * Projects should wrap this with their specific AppData type
 */
export function exportData(data: any): string {
  return JSON.stringify(data, null, 2);
}

/**
 * Base pattern for import data functionality
 * Projects should wrap this with their specific AppData type and validation
 */
export function importData<T>(jsonString: string, loadFn: () => T): T {
  try {
    const data = JSON.parse(jsonString);
    // Projects should add their own validation here
    // For now, just save raw and reload
    return data;
  } catch (error) {
    console.error('Error importing data:', error);
    throw new Error('Invalid data format');
  }
}

