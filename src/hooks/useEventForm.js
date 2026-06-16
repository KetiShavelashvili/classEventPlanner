// Template Method (via hook composition) + Builder Pattern
// Defines the skeleton algorithm for event form state shared by EventForm and EditModal:
//   Step 1 — initialise state
//   Step 2 — handle field changes
//   Step 3 — build params via EventBuilder (domain validation here)
// Each consumer (EventForm, EditModal) implements its own Step 4 (submit logic).
import { useState } from 'react';
import { EVENT_TYPES, PRIORITY_LEVELS } from '../types/eventTypes';
import { EventBuilder } from '../builders/EventBuilder';

const DEFAULT_FORM = {
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  location: '',
  priority: PRIORITY_LEVELS.MEDIUM,
  courseCode: '',
  maxScore: 100,
  duration: 60,
  agenda: '',
  attendees: '',
  submissionRequired: false,
  pointsWorth: 0,
};

export function useEventForm(initialData = {}) {
  const [eventType, setEventType] = useState(initialData.type || EVENT_TYPES.LECTURE);
  const [formData, setFormData] = useState({ ...DEFAULT_FORM, ...initialData });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  // Builder Pattern — fluent construction with domain-level validation in build()
  const buildEventParams = () => {
    const builder = new EventBuilder()
      .setType(eventType)
      .setTitle(formData.title)
      .setDescription(formData.description)
      .setDates(new Date(formData.startDate), new Date(formData.endDate))
      .setLocation(formData.location)
      .setPriority(formData.priority);

    if (eventType === EVENT_TYPES.LECTURE) {
      builder.withCourseCode(formData.courseCode)
             .withMaterialsLink(formData.materialsLink || null);
    } else if (eventType === EVENT_TYPES.EXAM) {
      builder.withMaxScore(parseInt(formData.maxScore))
             .withDuration(parseInt(formData.duration));
    } else if (eventType === EVENT_TYPES.MEETING) {
      builder
        .withAgenda(formData.agenda.split(',').map(a => a.trim()).filter(Boolean))
        .withAttendees(formData.attendees.split(',').map(a => a.trim()).filter(Boolean));
    } else if (eventType === EVENT_TYPES.DEADLINE) {
      builder.withSubmission(formData.submissionRequired, parseInt(formData.pointsWorth));
    }

    return builder.build();
  };

  const reset = () => {
    setFormData(DEFAULT_FORM);
    setEventType(EVENT_TYPES.LECTURE);
  };

  return { eventType, setEventType, formData, handleChange, buildEventParams, reset };
}
