import { useEffect, useCallback } from 'react';
import { useCalendarStore } from '../store/calendarStore';
import { useAuthStore } from '../store/authStore';
import { GoogleCalendarAPI } from '../lib/googleCalendarApi';
import { CalendarEvent, GoogleCalendar } from '../types';
import { formatISO } from 'date-fns';
import { calendarRateLimiter } from '../lib/rateLimiter';
import { startOfDay, endOfDay, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addWeeks } from 'date-fns';

// This will be initialized from App
let calendarAPI: GoogleCalendarAPI | null = null;

export function setCalendarAPI(api: GoogleCalendarAPI) {
  calendarAPI = api;
}

export function useGoogleCalendar() {
  const {
    calendars,
    setCalendars,
    events,
    setEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    currentDate,
    view,
    syncState,
    setSyncToken,
    getSyncToken,
    setLoading,
    setError,
  } = useCalendarStore();

  const { accessToken, isAuthenticated, isTokenExpired, refreshAccessToken } = useAuthStore();

  /**
   * Ensures the access token is valid before making API calls.
   * Refreshes the token if it's expired or about to expire.
   */
  const ensureValidToken = useCallback(async (): Promise<string | null> => {
    if (!accessToken || !isAuthenticated) {
      return null;
    }

    if (isTokenExpired()) {
      try {
        await refreshAccessToken();
        const newToken = useAuthStore.getState().accessToken;
        return newToken;
      } catch (error) {
        console.error('Failed to refresh token:', error);
        setError('Authentication expired. Please sign in again.');
        return null;
      }
    }

    return accessToken;
  }, [accessToken, isAuthenticated, isTokenExpired, refreshAccessToken, setError]);

  const syncCalendars = useCallback(async () => {
    if (!calendarAPI || !isAuthenticated) return;

    const token = await ensureValidToken();
    if (!token) return;

    try {
      setLoading(true);
      setError(null);
      
      // Apply rate limiting
      await calendarRateLimiter.checkLimit();
      
      calendarAPI.setAccessToken(token);
      const calendarList = await calendarAPI.getCalendarList();
      
      const formattedCalendars: GoogleCalendar[] = calendarList.map(cal => ({
        id: cal.id,
        summary: cal.summary,
        description: cal.description,
        backgroundColor: cal.backgroundColor,
        foregroundColor: cal.foregroundColor,
        selected: calendars.find(c => c.id === cal.id)?.selected ?? cal.id === 'primary',
      }));

      setCalendars(formattedCalendars);
    } catch (error: any) {
      console.error('Error syncing calendars:', error);
      
      if (error.status === 401) {
        setError('Authentication expired. Please sign in again.');
      } else if (error.status === 403) {
        setError('Calendar access denied. Please reconnect your Google account.');
      } else if (error.status >= 500) {
        setError('Google Calendar service unavailable. Please try again later.');
      } else {
        setError(`Failed to sync calendars: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, calendars, setCalendars, setLoading, setError, ensureValidToken]);

  const getDateRange = useCallback(() => {
    let timeMin: Date;
    let timeMax: Date;

    switch (view) {
      case 'day':
        timeMin = startOfDay(currentDate);
        timeMax = endOfDay(currentDate);
        break;
      case '3days':
        timeMin = startOfDay(currentDate);
        timeMax = endOfDay(addDays(currentDate, 2));
        break;
      case 'workweek':
        timeMin = startOfWeek(currentDate, { weekStartsOn: 1 });
        timeMax = endOfWeek(addDays(startOfWeek(currentDate, { weekStartsOn: 1 }), 4), { weekStartsOn: 1 });
        break;
      case 'week':
        timeMin = startOfWeek(currentDate, { weekStartsOn: 1 });
        timeMax = endOfWeek(currentDate, { weekStartsOn: 1 });
        break;
      case '2weeks':
        timeMin = startOfWeek(currentDate, { weekStartsOn: 1 });
        timeMax = endOfWeek(addWeeks(currentDate, 1), { weekStartsOn: 1 });
        break;
      case 'month':
        timeMin = startOfMonth(currentDate);
        timeMax = endOfMonth(currentDate);
        break;
      default:
        timeMin = startOfWeek(currentDate, { weekStartsOn: 1 });
        timeMax = endOfWeek(currentDate, { weekStartsOn: 1 });
    }

    // Expand range to ensure we get all relevant events
    timeMin = addDays(timeMin, -7);
    timeMax = addDays(timeMax, 7);

    return { timeMin, timeMax };
  }, [view, currentDate]);

  const syncEvents = useCallback(async (fullSync = false) => {
    if (!calendarAPI || !isAuthenticated) return;

    const token = await ensureValidToken();
    if (!token) return;

    try {
      setLoading(true);
      setError(null);
      
      // Apply rate limiting
      await calendarRateLimiter.checkLimit();
      
      calendarAPI.setAccessToken(token);

      const { timeMin, timeMax } = getDateRange();
      const timeMinStr = formatISO(timeMin);
      const timeMaxStr = formatISO(timeMax);

      const selectedCalendars = calendars.filter(cal => cal.selected);
      const allEvents: CalendarEvent[] = [];

      for (const calendar of selectedCalendars) {
        try {
          // Apply rate limiting for each calendar
          await calendarRateLimiter.checkLimit();
          
          const syncToken = fullSync ? undefined : getSyncToken(calendar.id);
          const result = await calendarAPI.getEvents(
            calendar.id,
            timeMinStr,
            timeMaxStr,
            syncToken
          );

          if (result.nextSyncToken) {
            setSyncToken(calendar.id, result.nextSyncToken);
          }

          const calendarEvents: CalendarEvent[] = result.events
            .filter(e => e.id)
            .map(e => ({
              id: e.id!,
              calendarId: calendar.id,
              summary: e.summary || 'Untitled Event',
              description: e.description,
              start: e.start || {},
              end: e.end || {},
              location: e.location,
              attendees: e.attendees,
              recurringEventId: e.recurringEventId,
              colorId: e.colorId,
              created: e.created,
              updated: e.updated,
              htmlLink: e.htmlLink,
            }));

          allEvents.push(...calendarEvents);
        } catch (error: any) {
          // Handle sync token expiry - do full sync
          if (error.status === 410) {
            try {
              await calendarRateLimiter.checkLimit();
              const result = await calendarAPI.getEvents(
                calendar.id,
                timeMinStr,
                timeMaxStr
              );

              if (result.nextSyncToken) {
                setSyncToken(calendar.id, result.nextSyncToken);
              }

              const calendarEvents: CalendarEvent[] = result.events
                .filter(e => e.id)
                .map(e => ({
                  id: e.id!,
                  calendarId: calendar.id,
                  summary: e.summary || 'Untitled Event',
                  description: e.description,
                  start: e.start || {},
                  end: e.end || {},
                  location: e.location,
                  attendees: e.attendees,
                  recurringEventId: e.recurringEventId,
                  colorId: e.colorId,
                  created: e.created,
                  updated: e.updated,
                  htmlLink: e.htmlLink,
                }));

              allEvents.push(...calendarEvents);
            } catch (retryError: any) {
              console.error(`Error syncing events for calendar ${calendar.id}:`, retryError);
              // Continue with other calendars
            }
          } else {
            console.error(`Error syncing events for calendar ${calendar.id}:`, error);
            // Continue with other calendars
          }
        }
      }

      setEvents(allEvents);
    } catch (error: any) {
      console.error('Error syncing events:', error);
      
      if (error.status === 401) {
        setError('Authentication expired. Please sign in again.');
      } else if (error.status === 403) {
        setError('Calendar access denied. Please reconnect your Google account.');
      } else if (error.status === 429) {
        setError('Rate limit exceeded. Please wait a moment and try again.');
      } else if (error.status >= 500) {
        setError('Google Calendar service unavailable. Please try again later.');
      } else {
        setError(`Failed to sync events: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, calendars, view, currentDate, getSyncToken, setSyncToken, setEvents, setLoading, setError, getDateRange, ensureValidToken]);

  const createEvent = useCallback(async (calendarId: string, event: CalendarEvent): Promise<CalendarEvent | null> => {
    if (!calendarAPI || !isAuthenticated) return null;

    const token = await ensureValidToken();
    if (!token) return null;

    try {
      setLoading(true);
      setError(null);
      
      await calendarRateLimiter.checkLimit();
      calendarAPI.setAccessToken(token);

      const googleEvent = await calendarAPI.createEvent(calendarId, {
        summary: event.summary,
        description: event.description,
        start: event.start,
        end: event.end,
        location: event.location,
        attendees: event.attendees,
        colorId: event.colorId,
      });

      const newEvent: CalendarEvent = {
        id: googleEvent.id!,
        calendarId,
        summary: googleEvent.summary || 'Untitled Event',
        description: googleEvent.description,
        start: googleEvent.start || {},
        end: googleEvent.end || {},
        location: googleEvent.location,
        attendees: googleEvent.attendees,
        recurringEventId: googleEvent.recurringEventId,
        colorId: googleEvent.colorId,
        created: googleEvent.created,
        updated: googleEvent.updated,
        htmlLink: googleEvent.htmlLink,
      };

      addEvent(newEvent);
      // Trigger a sync to get the latest state
      await syncEvents(true);
      return newEvent;
    } catch (error: any) {
      console.error('Error creating event:', error);
      
      if (error.status === 401) {
        setError('Authentication expired. Please sign in again.');
      } else if (error.status === 403) {
        setError('Calendar access denied. Please reconnect your Google account.');
      } else if (error.status === 429) {
        setError('Rate limit exceeded. Please wait a moment and try again.');
      } else {
        setError(`Failed to create event: ${error.message || 'Unknown error'}`);
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, addEvent, syncEvents, setLoading, setError, ensureValidToken]);

  const updateEventCallback = useCallback(async (event: CalendarEvent): Promise<CalendarEvent | null> => {
    if (!calendarAPI || !isAuthenticated) return null;

    const token = await ensureValidToken();
    if (!token) return null;

    try {
      setLoading(true);
      setError(null);
      
      await calendarRateLimiter.checkLimit();
      calendarAPI.setAccessToken(token);

      const googleEvent = await calendarAPI.updateEvent(event.calendarId, event.id, {
        summary: event.summary,
        description: event.description,
        start: event.start,
        end: event.end,
        location: event.location,
        attendees: event.attendees,
        colorId: event.colorId,
      });

      const updatedEvent: CalendarEvent = {
        ...event,
        summary: googleEvent.summary || 'Untitled Event',
        description: googleEvent.description,
        start: googleEvent.start || {},
        end: googleEvent.end || {},
        location: googleEvent.location,
        attendees: googleEvent.attendees,
        recurringEventId: googleEvent.recurringEventId,
        colorId: googleEvent.colorId,
        updated: googleEvent.updated,
      };

      updateEvent(updatedEvent);
      // Trigger a sync to get the latest state
      await syncEvents(true);
      return updatedEvent;
    } catch (error: any) {
      console.error('Error updating event:', error);
      
      if (error.status === 401) {
        setError('Authentication expired. Please sign in again.');
      } else if (error.status === 403) {
        setError('Calendar access denied. Please reconnect your Google account.');
      } else if (error.status === 429) {
        setError('Rate limit exceeded. Please wait a moment and try again.');
      } else {
        setError(`Failed to update event: ${error.message || 'Unknown error'}`);
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, updateEvent, syncEvents, setLoading, setError, ensureValidToken]);

  const deleteEventCallback = useCallback(async (event: CalendarEvent): Promise<void> => {
    if (!calendarAPI || !isAuthenticated) return;

    const token = await ensureValidToken();
    if (!token) return;

    try {
      setLoading(true);
      setError(null);
      
      await calendarRateLimiter.checkLimit();
      calendarAPI.setAccessToken(token);

      await calendarAPI.deleteEvent(event.calendarId, event.id);
      deleteEvent(event.id);
      // Trigger a sync to get the latest state
      await syncEvents(true);
    } catch (error: any) {
      console.error('Error deleting event:', error);
      
      if (error.status === 401) {
        setError('Authentication expired. Please sign in again.');
      } else if (error.status === 403) {
        setError('Calendar access denied. Please reconnect your Google account.');
      } else if (error.status === 429) {
        setError('Rate limit exceeded. Please wait a moment and try again.');
      } else {
        setError(`Failed to delete event: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, deleteEvent, syncEvents, setLoading, setError, ensureValidToken]);

  // Auto-sync when authenticated and calendars change
  useEffect(() => {
    if (isAuthenticated && calendars.length > 0) {
      syncEvents();
    }
  }, [isAuthenticated, calendars, view, currentDate, syncEvents]);

  return {
    syncCalendars,
    syncEvents,
    createEvent,
    updateEvent: updateEventCallback,
    deleteEvent: deleteEventCallback,
    calendars,
    events,
  };
}

