import React, { useState, useEffect, useCallback } from 'react';
import EventList      from './components/EventList';
import EventForm      from './components/EventForm';
import EditModal      from './components/EditModal';
import PastEventsPage from './components/PastEventsPage';
import LoginPage      from './components/LoginPage';
import NavSidebar     from './components/NavSidebar';
import ActivityLog    from './components/ActivityLog';
import EventBus       from './EventBus';
import { UnauthenticatedState } from './states/UnauthenticatedState';
import { TeacherState }         from './states/TeacherState';
import { StudentState }         from './states/StudentState';
import { CreateEventCommand }   from './commands/CreateEventCommand';
import { DeleteEventCommand }   from './commands/DeleteEventCommand';
import { UpdateEventCommand }   from './commands/UpdateEventCommand';
import { translations } from './i18n/translations';
import './App.css';

// Facade Pattern — hides fetch + auth token injection behind a single function.
// All network calls in this file go through apiFetch; nothing else touches fetch directly.
function apiFetch(path, options = {}) {
  const token = localStorage.getItem('authToken');
  return fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
}

function resolveTheme(mode) {
  return mode;
}

// State Pattern — builds the correct concrete AppState from a user payload
function stateFromUser(userData) {
  return userData.role === 'teacher'
    ? new TeacherState(userData)
    : new StudentState(userData);
}

function App() {
  const [themeMode, setThemeMode] = useState(() => {
    const stored = localStorage.getItem('themeMode') || 'dark';
    return ['dark', 'light', 'system'].includes(stored) ? stored : 'dark';
  });
  const [lang, setLang]           = useState(() => localStorage.getItem('lang') || 'en');
  const [authChecked, setAuthChecked] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [editingEvent, setEditingEvent] = useState(null);
  const [events, setEvents]       = useState([]);

  // State Pattern — single appState replaces scattered user + isTeacher booleans
  const [appState, setAppState]   = useState(new UnauthenticatedState());

  // Command Pattern — history stack enables undo
  const [commandHistory, setCommandHistory] = useState([]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolveTheme(themeMode));
    localStorage.setItem('themeMode', themeMode);
  }, [themeMode]);

  useEffect(() => { localStorage.setItem('lang', lang); }, [lang]);

  // Restore session from stored JWT
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) { setAuthChecked(true); return; }
    fetch('/api/auth/verify', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setAppState(stateFromUser(data.user)))
      .catch(() => localStorage.removeItem('authToken'))
      .finally(() => setAuthChecked(true));
  }, []);

  const fetchEvents = useCallback(() => {
    apiFetch('/api/events')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(setEvents)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (appState.isAuthenticated) fetchEvents();
    else setEvents([]);
  }, [appState, fetchEvents]);

  const toggleTheme = () =>
    setThemeMode(m => resolveTheme(m) === 'dark' ? 'light' : 'dark');

  // Command Pattern — executes a command and pushes it onto the history stack
  const executeCommand = useCallback(async (command) => {
    await command.execute();
    setCommandHistory(prev => [...prev, command]);
  }, []);

  // Command Pattern — undoes the most recent command
  const undoLastCommand = useCallback(async () => {
    if (commandHistory.length === 0) return;
    const last = commandHistory[commandHistory.length - 1];
    await last.undo();
    setCommandHistory(prev => prev.slice(0, -1));
  }, [commandHistory]);

  const addEvent = useCallback((event) => {
    executeCommand(new CreateEventCommand(event, apiFetch, setEvents));
  }, [executeCommand]);

  const deleteEvent = useCallback((eventId) => {
    const original = events.find(e => e.id === eventId);
    executeCommand(new DeleteEventCommand(eventId, original, apiFetch, setEvents));
  }, [executeCommand, events]);

  const updateEvent = useCallback((updatedEvent) => {
    const original = events.find(e => e.id === updatedEvent.id);
    executeCommand(new UpdateEventCommand(updatedEvent, original, apiFetch, setEvents, setEditingEvent));
  }, [executeCommand, events]);

  const handleLogin = (userData) => {
    setAppState(stateFromUser(userData));
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setAppState(new UnauthenticatedState());
    setCurrentPage('dashboard');
    setEditingEvent(null);
    setCommandHistory([]);
  };

  const t = translations[lang] ?? translations.en;

  if (!authChecked) return null;

  // State Pattern — delegates authentication check to the state object
  if (!appState.isAuthenticated) {
    return (
      <LoginPage
        onLogin={handleLogin}
        themeMode={themeMode}
        setThemeMode={setThemeMode}
        lang={lang}
        setLang={setLang}
      />
    );
  }

  const now            = new Date();
  const user           = appState.user;
  const isTeacher      = appState.canManageEvents;    // State Pattern — no role string comparisons
  const upcomingEvents = events.filter(e => new Date(e.startDate) >= now);
  const pastEvents     = events.filter(e => new Date(e.startDate) < now);

  return (
    <div className="app">
      <div className="app-body">
        <NavSidebar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          user={user}
          upcomingCount={upcomingEvents.length}
          pastCount={pastEvents.length}
          onLogout={handleLogout}
          theme={resolveTheme(themeMode)}
          onToggleTheme={toggleTheme}
          lang={lang}
          setLang={setLang}
        />

        <div className="app-content">
          <header className="app-header">
            <h1>{t.appTitle}</h1>
            <p>{t.appSubtitle}</p>
            <div className="pattern-badges">
              <span className="badge">🏭 Factory Method</span>
              <span className="badge">🎯 Strategy</span>
              <span className="badge">👁️ Observer</span>
              <span className="badge">🎨 Decorator</span>
              <span className="badge">📐 Template Method</span>
              <span className="badge">🗄️ Repository</span>
              <span className="badge">🏗️ Builder</span>
              <span className="badge">⌨️ Command</span>
              <span className="badge">🔄 State</span>
            </div>
            <div className="header-actions">
              {commandHistory.length > 0 && (
                <button className="undo-btn" onClick={undoLastCommand} title="Undo last action">
                  ↩ Undo
                </button>
              )}
            </div>
            <ActivityLog lang={lang} />
          </header>

          {currentPage === 'dashboard' && (
            <main className={`app-main ${!isTeacher ? 'app-main-student' : ''}`}>
              {isTeacher && (
                <aside className="sidebar">
                  <h2>{t.createNewEvent}</h2>
                  <EventForm onEventCreated={addEvent} lang={lang} />
                </aside>
              )}
              <section className="content">
                <h2>{t.upcomingEvents} ({upcomingEvents.length})</h2>
                <EventList
                  events={upcomingEvents}
                  onDeleteEvent={deleteEvent}
                  onEditEvent={setEditingEvent}
                  isTeacher={isTeacher}
                  lang={lang}
                />
              </section>
            </main>
          )}

          {currentPage === 'past' && (
            <PastEventsPage
              events={pastEvents}
              onDeleteEvent={deleteEvent}
              onEditEvent={setEditingEvent}
              isTeacher={isTeacher}
              lang={lang}
            />
          )}
        </div>
      </div>

      {editingEvent && (
        <EditModal
          event={editingEvent}
          onSave={updateEvent}
          onClose={() => setEditingEvent(null)}
          lang={lang}
        />
      )}
    </div>
  );
}

export default App;
