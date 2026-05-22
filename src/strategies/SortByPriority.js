import { SortStrategy } from './SortStrategy';
import { PRIORITY_ORDER } from '../types/eventTypes';

// Concrete Strategy: Sort by priority (high to low)
export class SortByPriority extends SortStrategy {
  sort(events) {
    return events.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
  }
}