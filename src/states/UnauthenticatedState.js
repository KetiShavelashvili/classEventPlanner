import { AppState } from './AppState';

export class UnauthenticatedState extends AppState {
  get user()            { return null; }
  get isAuthenticated() { return false; }
  get canManageEvents() { return false; }
}
