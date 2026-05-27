import { SortStrategy } from './SortStrategy';

// Concrete Strategy: Sort by date (oldest to newest)
export class SortByDate extends SortStrategy {
  sort(events) {
    return [...events].sort((a, b) => a.startDate - b.startDate);
  }
}