// Command Pattern — Abstract base command.
// Each concrete command encapsulates one operation (create/delete/update)
// and its inverse (undo), enabling a history stack in App.jsx.
export class EventCommand {
  async execute() {
    throw new Error(`${this.constructor.name} must implement execute()`);
  }

  async undo() {
    throw new Error(`${this.constructor.name} must implement undo()`);
  }
}
