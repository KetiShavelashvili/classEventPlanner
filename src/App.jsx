import React, { useState, useEffect, useCallback } from 'react';
import EventList from './components/EventList';
import EventForm from './components/EventForm';
import EditModal from './components/EditModal';
import PastEventsPage from './components/PastEventsPage';
import LoginPage from './components/LoginPage';
import NavSidebar from './components/NavSidebar';
import { translations } from './i18n/translations';
import './App.css';

function resolveTheme(mode) {
  return mode; // 'light' | 'dark' | 'system' — each has its own CSS theme
}

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

function App() {
  const [themeMode, setThemeMode] = useState(() => {
    const stored = localStorage.getItem('themeMode') || localStorage.getItem('theme') || 'dark';
    return ['dark', 'light', 'system'].includes(stored) ? stored : 'dark';
  });
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'en');
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [editingEvent, setEditingEvent] = useState(null);
  const [events, setEvents] = useState([]);

  // Apply resolved theme to DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolveTheme(themeMode));
    localStorage.setItem('themeMode', themeMode);
  }, [themeMode]);


  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  // Restore session from stored JWT
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) { setAuthChecked(true); return; }
    fetch('/api/auth/verify', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setUser(data.user))
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
    if (user) fetchEvents();
    else setEvents([]);
  }, [user, fetchEvents]);

  // NavSidebar still gets a binary dark/light toggle
  const toggleTheme = () =>
    setThemeMode(m => resolveTheme(m) === 'dark' ? 'light' : 'dark');

  const addEvent = async (event) => {
    const res = await apiFetch('/api/events', { method: 'POST', body: JSON.stringify(event) });
    if (res.ok) {
      const created = await res.json();
      setEvents(prev => [created, ...prev]);
    }
  };

  const deleteEvent = async (eventId) => {
    const res = await apiFetch(`/api/events/${eventId}`, { method: 'DELETE' });
    if (res.ok) setEvents(prev => prev.filter(e => e.id !== eventId));
  };

  const updateEvent = async (updatedEvent) => {
    const res = await apiFetch(`/api/events/${updatedEvent.id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedEvent),
    });
    if (res.ok) {
      const saved = await res.json();
      setEvents(prev => prev.map(e => e.id === saved.id ? saved : e));
      setEditingEvent(null);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setCurrentPage('dashboard');
    setEditingEvent(null);
  };

  const t = translations[lang] ?? translations.en;

  if (!authChecked) return null;

  if (!user) {
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

  const now = new Date();
  const isTeacher = user.role === 'teacher';
  const upcomingEvents = events.filter(e => new Date(e.startDate) >= now);
  const pastEvents = events.filter(e => new Date(e.startDate) < now);

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
            </div>
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
