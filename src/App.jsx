import React, { useState, useEffect } from 'react';
import EventList from './components/EventList';
import EventForm from './components/EventForm';
import EditModal from './components/EditModal';
import PastEventsPage from './components/PastEventsPage';
import LoginPage from './components/LoginPage';
import NavSidebar from './components/NavSidebar';
import { EVENT_TYPES, PRIORITY_LEVELS } from './types/eventTypes';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [editingEvent, setEditingEvent] = useState(null);

  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('classEvents');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map(event => ({
        ...event,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate),
        createdAt: new Date(event.createdAt)
      }));
    }
    return [
      {
        id: '1',
        title: 'Design Patterns Lecture',
        description: 'Learn about Observer, Factory, Strategy, and Decorator patterns',
        type: EVENT_TYPES.LECTURE,
        startDate: new Date(2026, 4, 28, 10, 0),
        endDate: new Date(2026, 4, 28, 12, 0),
        location: 'Room 101',
        priority: PRIORITY_LEVELS.HIGH,
        createdBy: 'Mariam',
        createdAt: new Date(),
        courseCode: 'CS401',
        materialsLink: 'https://example.com/slides'
      },
      {
        id: '2',
        title: 'Final Project Submission',
        description: 'Submit the complete Class Event Planner project',
        type: EVENT_TYPES.DEADLINE,
        startDate: new Date(2026, 5, 5, 23, 59),
        endDate: new Date(2026, 5, 5, 23, 59),
        location: 'Online',
        priority: PRIORITY_LEVELS.HIGH,
        createdBy: 'Tekla',
        createdAt: new Date(),
        submissionRequired: true,
        pointsWorth: 100
      },
      {
        id: '3',
        title: 'Midterm Exam',
        description: 'Comprehensive exam on design patterns',
        type: EVENT_TYPES.EXAM,
        startDate: new Date(2026, 5, 1, 9, 0),
        endDate: new Date(2026, 5, 1, 12, 0),
        location: 'Exam Hall A',
        priority: PRIORITY_LEVELS.HIGH,
        createdBy: 'Keti',
        createdAt: new Date(),
        maxScore: 100,
        duration: 180
      },
      {
        id: '4',
        title: 'Study Group Meeting',
        description: 'Review design patterns together',
        type: EVENT_TYPES.MEETING,
        startDate: new Date(2026, 4, 27, 15, 0),
        endDate: new Date(2026, 4, 27, 17, 0),
        location: 'Library Room 5',
        priority: PRIORITY_LEVELS.MEDIUM,
        createdBy: 'Mariam',
        createdAt: new Date(),
        agenda: ['Review Factory pattern', 'Discuss Strategy pattern', 'Plan presentation'],
        attendees: ['Mariam', 'Tekla', 'Keti']
      },
      {
        id: '5',
        title: 'Weekly Team Sync',
        description: 'Progress update on class events',
        type: EVENT_TYPES.MEETING,
        startDate: new Date(2026, 4, 29, 14, 0),
        endDate: new Date(2026, 4, 29, 15, 0),
        location: 'Conference Room',
        priority: PRIORITY_LEVELS.LOW,
        createdBy: 'Tekla',
        createdAt: new Date(),
        agenda: ['Weekly updates', 'Blockers discussion'],
        attendees: ['Mariam', 'Tekla', 'Keti']
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('classEvents', JSON.stringify(events));
  }, [events]);

  const addEvent = (event) => setEvents([event, ...events]);

  const deleteEvent = (eventId) => setEvents(events.filter(e => e.id !== eventId));

  const updateEvent = (updatedEvent) => {
    setEvents(events.map(e => e.id === updatedEvent.id ? updatedEvent : e));
    setEditingEvent(null);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('dashboard');
    setEditingEvent(null);
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
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
        />

        <div className="app-content">
          <header className="app-header">
            <h1>📅 Class Event Planner</h1>
            <p>Design Patterns Demo: Factory • Strategy • Observer • Decorator</p>
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
                  <h2>➕ Create New Event</h2>
                  <EventForm onEventCreated={addEvent} />
                </aside>
              )}
              <section className="content">
                <h2>📋 Upcoming Events ({upcomingEvents.length})</h2>
                <EventList
                  events={upcomingEvents}
                  onDeleteEvent={deleteEvent}
                  onEditEvent={setEditingEvent}
                  isTeacher={isTeacher}
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
            />
          )}
        </div>
      </div>

      {editingEvent && (
        <EditModal
          event={editingEvent}
          onSave={updateEvent}
          onClose={() => setEditingEvent(null)}
        />
      )}
    </div>
  );
}

export default App;
