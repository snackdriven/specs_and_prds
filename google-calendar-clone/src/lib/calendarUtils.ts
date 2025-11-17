import { GoogleCalendar } from '../types';
import { DEFAULT_CALENDAR_COLOR } from './constants';

/**
 * Gets the background color for a calendar by its ID.
 * @param calendarId - The ID of the calendar
 * @param calendars - Array of all calendars
 * @returns The background color hex code
 */
export function getCalendarColor(calendarId: string, calendars: GoogleCalendar[]): string {
  const calendar = calendars.find((c) => c.id === calendarId);
  return calendar?.backgroundColor || DEFAULT_CALENDAR_COLOR;
}

