import { SortStrategy } from './SortStrategy';

const TYPE_ORDER = { exam: 1, deadline: 2, lecture: 3, meeting: 4 };

export class SortByType extends SortStrategy {
  sort(events) {
    return [...events].sort((a, b) => TYPE_ORDER[a.type] - TYPE_ORDER[b.type]);
  }
}

export const sortByType = new SortByType();
