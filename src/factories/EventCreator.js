// Factory Method Pattern — Abstract Creator
// Defines the factory method `createEvent` that subclasses must implement.
// The `buildEvent` method provides the skeleton that calls the factory method,
// which is the defining characteristic of this pattern over a Simple Factory.
export class EventCreator {
  // Factory Method — concrete creators override this to return type-specific fields
  createEvent(params) {
    throw new Error(`${this.constructor.name} must implement createEvent()`);
  }

  // Skeleton method that USES the factory method internally.
  // Callers use this, not createEvent directly.
  buildEvent(params) {
    const typeSpecific = this.createEvent(params);
    return {
      title: params.title,
      description: params.description || '',
      startDate: params.startDate,
      endDate: params.endDate,
      location: params.location || '',
      priority: params.priority || 'medium',
      createdBy: params.createdBy || 'Current User',
      createdAt: new Date(),
      ...typeSpecific,
    };
  }
}
