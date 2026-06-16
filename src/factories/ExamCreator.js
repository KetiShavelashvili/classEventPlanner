import { EventCreator } from './EventCreator';
import { EVENT_TYPES } from '../types/eventTypes';

export class ExamCreator extends EventCreator {
  createEvent(params) {
    return {
      type: EVENT_TYPES.EXAM,
      maxScore: params.maxScore ?? 100,
      duration: params.duration ?? 60,
    };
  }
}
