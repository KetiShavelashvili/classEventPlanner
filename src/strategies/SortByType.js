import { SortStrategy } from './SortStrategy';

const TYPE_ORDER = {
  exam: 1,
  deadline: 2,
  lecture: 3,
  meeting: 4
};

// Concrete Strategy: Sort by event type
export class SortByType extends SortStrategy {
  sort(events) {
    return events.sort((a, b) => TYPE_ORDER[a.type] - TYPE_ORDER[b.type]);
  }
}
