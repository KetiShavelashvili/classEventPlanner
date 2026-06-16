import { AppState } from './AppState';

export class TeacherState extends AppState {
  constructor(user) {
    super();
    this._user = user;
  }
  get user()            { return this._user; }
  get isAuthenticated() { return true; }
  get canManageEvents() { return true; }
}
