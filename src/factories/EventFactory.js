import { EVENT_TYPES } from '../types/eventTypes';

// Factory Method Pattern - Creates different types of events
export class EventFactory {
  static createEvent(params) {
    const baseEvent = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      title: params.title,
      description: params.description || '',
      startDate: params.startDate,
      endDate: params.endDate,
      location: params.location || '',
      priority: params.priority,
      createdBy: params.createdBy || 'Current User',
      createdAt: new Date(),
      type: params.type
    };

    switch (params.type) {
      case EVENT_TYPES.LECTURE:
        return {
          ...baseEvent,
          type: EVENT_TYPES.LECTURE,
          courseCode: params.courseCode || 'N/A',
          materialsLink: params.materialsLink || null
        };
      
      case EVENT_TYPES.EXAM:
        return {
          ...baseEvent,
          type: EVENT_TYPES.EXAM,
          maxScore: params.maxScore || 100,
          duration: params.duration || 60
        };
      
      case EVENT_TYPES.MEETING:
        return {
          ...baseEvent,
          type: EVENT_TYPES.MEETING,
          agenda: params.agenda || [],
          attendees: params.attendees || []
        };
      
      case EVENT_TYPES.DEADLINE:
        return {
          ...baseEvent,
          type: EVENT_TYPES.DEADLINE,
          submissionRequired: params.submissionRequired || false,
          pointsWorth: params.pointsWorth || 0
        };
      
      default:
        return baseEvent;
    }
  }
}