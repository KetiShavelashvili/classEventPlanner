// Strategy Pattern - Abstract base class
export class SortStrategy {
  sort(events) {
    throw new Error('sort method must be implemented');
  }
}