import { EventCreator } from './EventCreator';
import { EVENT_TYPES } from '../types/eventTypes';

export class LectureCreator extends EventCreator {
  createEvent(params) {
    return {
      type: EVENT_TYPES.LECTURE,
      courseCode: params.courseCode || 'N/A',
      materialsLink: params.materialsLink || null,
    };
  }
}
