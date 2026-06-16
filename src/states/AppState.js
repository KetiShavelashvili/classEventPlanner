// State Pattern — Abstract base state.
// The application's behaviour (what the UI shows, what actions are allowed)
// changes based on which concrete state is active. App.jsx holds the current
// state and delegates behavioural queries to it, eliminating scattered
// `user.role === 'teacher'` conditionals throughout the component tree.
export class AppState {
  get user()              { return null; }
  get isAuthenticated()   { return false; }
  get canManageEvents()   { return false; }
}
