import { SortStrategy } from './SortStrategy';

export class SortByDate extends SortStrategy {
  sort(events) {
    // Explicit Date construction required — startDate arrives as an ISO string
    // from the API. Subtracting strings directly yields NaN and sorts nothing.
    return [...events].sort(
      (a, b) => new Date(a.startDate) - new Date(b.startDate)
    );
  }
}

// Singleton instance — strategies are stateless; no need to re-instantiate on every sort click.
export const sortByDate = new SortByDate();
