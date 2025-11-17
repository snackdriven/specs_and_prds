import { useState, useEffect } from 'react';
import { CalendarEvent } from '../types';
import { useCalendarStore } from '../store/calendarStore';
import { useGoogleCalendar } from '../hooks/useGoogleCalendar';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { formatISO, parseISO, isAfter } from 'date-fns';
import {
  EVENT_TITLE_MAX_LENGTH,
  EVENT_DESCRIPTION_MAX_LENGTH,
  EVENT_LOCATION_MAX_LENGTH,
} from '../lib/constants';

interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
  event?: CalendarEvent | null;
  startDate?: Date;
  endDate?: Date;
}

interface FormErrors {
  summary?: string;
  startDateTime?: string;
  endDateTime?: string;
  description?: string;
  location?: string;
}

export function EventForm({ isOpen, onClose, event, startDate, endDate }: EventFormProps) {
  const { calendars } = useCalendarStore();
  const { createEvent, updateEvent } = useGoogleCalendar();
  const { isLoading } = useCalendarStore();

  const [formData, setFormData] = useState({
    summary: '',
    description: '',
    location: '',
    calendarId: calendars.find((c) => c.selected)?.id || calendars[0]?.id || 'primary',
    startDateTime: '',
    endDateTime: '',
    allDay: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (event) {
      const start = event.start.dateTime
        ? parseISO(event.start.dateTime)
        : event.start.date
        ? parseISO(event.start.date)
        : new Date();
      const end = event.end?.dateTime
        ? parseISO(event.end.dateTime)
        : event.end?.date
        ? parseISO(event.end.date)
        : new Date();

      setFormData({
        summary: event.summary || '',
        description: event.description || '',
        location: event.location || '',
        calendarId: event.calendarId,
        startDateTime: event.start.dateTime ? formatISO(start, { representation: 'complete' }) : '',
        endDateTime: event.end?.dateTime ? formatISO(end, { representation: 'complete' }) : '',
        allDay: !!event.start.date,
      });
      setErrors({});
    } else if (startDate && endDate) {
      setFormData((prev) => ({
        ...prev,
        startDateTime: formatISO(startDate, { representation: 'complete' }),
        endDateTime: formatISO(endDate, { representation: 'complete' }),
      }));
      setErrors({});
    } else {
      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
      setFormData({
        summary: '',
        description: '',
        location: '',
        calendarId: calendars.find((c) => c.selected)?.id || calendars[0]?.id || 'primary',
        startDateTime: formatISO(now, { representation: 'complete' }),
        endDateTime: formatISO(oneHourLater, { representation: 'complete' }),
        allDay: false,
      });
      setErrors({});
    }
  }, [event, startDate, endDate, calendars]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate title
    if (!formData.summary || formData.summary.trim().length === 0) {
      newErrors.summary = 'Event title is required';
    } else if (formData.summary.length > EVENT_TITLE_MAX_LENGTH) {
      newErrors.summary = `Title must be ${EVENT_TITLE_MAX_LENGTH} characters or less`;
    }

    // Validate description
    if (formData.description && formData.description.length > EVENT_DESCRIPTION_MAX_LENGTH) {
      newErrors.description = `Description must be ${EVENT_DESCRIPTION_MAX_LENGTH} characters or less`;
    }

    // Validate location
    if (formData.location && formData.location.length > EVENT_LOCATION_MAX_LENGTH) {
      newErrors.location = `Location must be ${EVENT_LOCATION_MAX_LENGTH} characters or less`;
    }

    // Validate dates
    if (!formData.startDateTime) {
      newErrors.startDateTime = 'Start date is required';
    } else if (!formData.endDateTime) {
      newErrors.endDateTime = 'End date is required';
    } else {
      const startDate = parseISO(formData.startDateTime);
      const endDate = parseISO(formData.endDateTime);

      if (isAfter(startDate, endDate)) {
        newErrors.endDateTime = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Sanitize input (trim whitespace)
    const calendarEvent: CalendarEvent = {
      id: event?.id || '',
      calendarId: formData.calendarId,
      summary: formData.summary.trim(),
      description: formData.description?.trim() || undefined,
      location: formData.location?.trim() || undefined,
      start: formData.allDay
        ? {
            date: formatISO(parseISO(formData.startDateTime), { representation: 'date' }),
          }
        : {
            dateTime: formData.startDateTime,
          },
      end: formData.allDay
        ? {
            date: formatISO(parseISO(formData.endDateTime), { representation: 'date' }),
          }
        : {
            dateTime: formData.endDateTime,
          },
    };

    try {
      if (event) {
        await updateEvent(calendarEvent);
      } else {
        await createEvent(formData.calendarId, calendarEvent);
      }
      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
      // Error is already handled in the hook
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={event ? 'Edit Event' : 'New Event'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="summary" className="block text-sm font-medium mb-1">
            Title *
          </label>
          <input
            id="summary"
            type="text"
            required
            value={formData.summary}
            onChange={(e) => {
              setFormData({ ...formData, summary: e.target.value });
              if (errors.summary) {
                setErrors({ ...errors, summary: undefined });
              }
            }}
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            aria-invalid={!!errors.summary}
            aria-describedby={errors.summary ? 'summary-error' : undefined}
          />
          {errors.summary && (
            <p id="summary-error" className="text-sm text-destructive mt-1">
              {errors.summary}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="calendarId" className="block text-sm font-medium mb-1">
            Calendar *
          </label>
          <select
            id="calendarId"
            required
            value={formData.calendarId}
            onChange={(e) => setFormData({ ...formData, calendarId: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {calendars.map((cal) => (
              <option key={cal.id} value={cal.id}>
                {cal.summary}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.allDay}
              onChange={(e) => setFormData({ ...formData, allDay: e.target.checked })}
              className="w-4 h-4 rounded border-border"
            />
            <span className="text-sm font-medium">All day</span>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDateTime" className="block text-sm font-medium mb-1">
              Start *
            </label>
            <input
              id="startDateTime"
              type={formData.allDay ? 'date' : 'datetime-local'}
              required
              value={
                formData.allDay
                  ? formData.startDateTime.split('T')[0]
                  : formData.startDateTime.slice(0, 16)
              }
              onChange={(e) => {
                const value = formData.allDay
                  ? `${e.target.value}T00:00:00`
                  : `${e.target.value}:00`;
                setFormData({ ...formData, startDateTime: value });
                if (errors.startDateTime) {
                  setErrors({ ...errors, startDateTime: undefined });
                }
              }}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              aria-invalid={!!errors.startDateTime}
              aria-describedby={errors.startDateTime ? 'start-error' : undefined}
            />
            {errors.startDateTime && (
              <p id="start-error" className="text-sm text-destructive mt-1">
                {errors.startDateTime}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="endDateTime" className="block text-sm font-medium mb-1">
              End *
            </label>
            <input
              id="endDateTime"
              type={formData.allDay ? 'date' : 'datetime-local'}
              required
              value={
                formData.allDay
                  ? formData.endDateTime.split('T')[0]
                  : formData.endDateTime.slice(0, 16)
              }
              onChange={(e) => {
                const value = formData.allDay
                  ? `${e.target.value}T00:00:00`
                  : `${e.target.value}:00`;
                setFormData({ ...formData, endDateTime: value });
                if (errors.endDateTime) {
                  setErrors({ ...errors, endDateTime: undefined });
                }
              }}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              aria-invalid={!!errors.endDateTime}
              aria-describedby={errors.endDateTime ? 'end-error' : undefined}
            />
            {errors.endDateTime && (
              <p id="end-error" className="text-sm text-destructive mt-1">
                {errors.endDateTime}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium mb-1">
            Location
          </label>
          <input
            id="location"
            type="text"
            value={formData.location}
            onChange={(e) => {
              setFormData({ ...formData, location: e.target.value });
              if (errors.location) {
                setErrors({ ...errors, location: undefined });
              }
            }}
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            aria-invalid={!!errors.location}
            aria-describedby={errors.location ? 'location-error' : undefined}
          />
          {errors.location && (
            <p id="location-error" className="text-sm text-destructive mt-1">
              {errors.location}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            value={formData.description}
            onChange={(e) => {
              setFormData({ ...formData, description: e.target.value });
              if (errors.description) {
                setErrors({ ...errors, description: undefined });
              }
            }}
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            aria-invalid={!!errors.description}
            aria-describedby={errors.description ? 'description-error' : undefined}
          />
          {errors.description && (
            <p id="description-error" className="text-sm text-destructive mt-1">
              {errors.description}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {event ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

