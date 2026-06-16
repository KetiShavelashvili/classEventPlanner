import { EventCommand } from './EventCommand';
import EventBus from '../EventBus';

export class UpdateEventCommand extends EventCommand {
  constructor(updatedEvent, originalEvent, apiFetch, setEvents, setEditingEvent) {
    super();
    this._updated         = updatedEvent;
    this._original        = originalEvent;
    this._apiFetch        = apiFetch;
    this._setEvents       = setEvents;
    this._setEditingEvent = setEditingEvent;
  }

  async execute() {
    const res = await this._apiFetch(`/api/events/${this._updated.id}`, {
      method: 'PUT',
      body: JSON.stringify(this._updated),
    });
    if (res.ok) {
      const saved = await res.json();
      this._setEvents(prev => prev.map(e => e.id === saved.id ? saved : e));
      this._setEditingEvent(null);
      EventBus.publish('event:updated', saved);
    }
  }

  async undo() {
    if (!this._original) return;
    const res = await this._apiFetch(`/api/events/${this._original.id}`, {
      method: 'PUT',
      body: JSON.stringify(this._original),
    });
    if (res.ok) {
      const restored = await res.json();
      this._setEvents(prev => prev.map(e => e.id === restored.id ? restored : e));
      EventBus.publish('event:updated', restored);
    }
  }
}
