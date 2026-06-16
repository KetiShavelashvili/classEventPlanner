import { EventCreator } from './EventCreator';
import { EVENT_TYPES } from '../types/eventTypes';

export class MeetingCreator extends EventCreator {
  createEvent(params) {
    return {
      type: EVENT_TYPES.MEETING,
      agenda: params.agenda ?? [],
      attendees: params.attendees ?? [],
    };
  }
}
