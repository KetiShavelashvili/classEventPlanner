import { EventCommand } from './EventCommand';
import EventBus from '../EventBus';

export class DeleteEventCommand extends EventCommand {
  constructor(eventId, originalEvent, apiFetch, setEvents) {
    super();
    this._eventId   = eventId;
    this._original  = originalEvent;
    this._apiFetch  = apiFetch;
    this._setEvents = setEvents;
  }

  async execute() {
    const res = await this._apiFetch(`/api/events/${this._eventId}`, { method: 'DELETE' });
    if (res.ok) {
      this._setEvents(prev => prev.filter(e => e.id !== this._eventId));
      EventBus.publish('event:deleted', { title: this._original?.title ?? 'Event' });
    }
  }

  async undo() {
    if (!this._original) return;
    const res = await this._apiFetch('/api/events', {
      method: 'POST',
      body: JSON.stringify(this._original),
    });
    if (res.ok) {
      const restored = await res.json();
      this._setEvents(prev => [restored, ...prev]);
      EventBus.publish('event:created', restored);
    }
  }
}
