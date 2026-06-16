import { EventCommand } from './EventCommand';
import EventBus from '../EventBus';

export class CreateEventCommand extends EventCommand {
  constructor(event, apiFetch, setEvents) {
    super();
    this._event    = event;
    this._apiFetch = apiFetch;
    this._setEvents = setEvents;
    this._created  = null;
  }

  async execute() {
    const res = await this._apiFetch('/api/events', {
      method: 'POST',
      body: JSON.stringify(this._event),
    });
    if (res.ok) {
      this._created = await res.json();
      this._setEvents(prev => [this._created, ...prev]);
      EventBus.publish('event:created', this._created);
    }
  }

  async undo() {
    if (!this._created) return;
    await this._apiFetch(`/api/events/${this._created.id}`, { method: 'DELETE' });
    this._setEvents(prev => prev.filter(e => e.id !== this._created.id));
    EventBus.publish('event:deleted', { title: this._created.title });
  }
}
