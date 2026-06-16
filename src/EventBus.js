// Observer Pattern — explicit pub/sub event bus.
// Singleton Pattern — one instance is exported so every module subscribes
// to the same bus. Modules stay decoupled: publishers never reference subscribers.
class EventBus {
  constructor() {
    this.listeners = {};
  }

  subscribe(event, fn) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(fn);
    return () => {
      this.listeners[event] = this.listeners[event].filter(l => l !== fn);
    };
  }

  publish(event, data) {
    (this.listeners[event] || []).forEach(fn => fn(data));
  }
}

// Singleton — module-level instance; every import receives the same object
export default new EventBus();
