import { EventCreator } from './EventCreator';
import { EVENT_TYPES } from '../types/eventTypes';

export class DeadlineCreator extends EventCreator {
  createEvent(params) {
    return {
      type: EVENT_TYPES.DEADLINE,
      submissionRequired: params.submissionRequired ?? false,
      pointsWorth: params.pointsWorth ?? 0,
    };
  }
}
