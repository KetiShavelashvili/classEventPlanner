import React, { useState } from 'react';
import EventList from './components/EventList';
import EventForm from './components/EventForm';
import { EVENT_TYPES, PRIORITY_LEVELS } from './types/eventTypes';
import './App.css';

function App() {
  const [events, setEvents] = useState([
    {
      id: '1',
      title: 'Design Patterns Lecture',
      description: 'Learn about Observer, Factory, Strategy, and Decorator patterns',
      type: EVENT_TYPES.LECTURE,
      startDate: new Date(2026, 4, 25, 10, 0),
      endDate: new Date(2026, 4, 25, 12, 0),
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
      startDate: new Date(2026, 5, 1, 23, 59),
      endDate: new Date(2026, 5, 1, 23, 59),
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
      startDate: new Date(2026, 4, 28, 9, 0),
      endDate: new Date(2026, 4, 28, 12, 0),
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
      startDate: new Date(2026, 4, 26, 15, 0),
      endDate: new Date(2026, 4, 26, 17, 0),
      location: 'Library Room 5',
      priority: PRIORITY_LEVELS.MEDIUM,
      createdBy: 'Mariam',
      createdAt: new Date(),
      agenda: ['Review Factory pattern', 'Discuss Strategy pattern', 'Plan presentation'],
      attendees: ['Mariam', 'Tekla', 'Keti']
    }
  ]);

  const addEvent = (event) => {
    setEvents([event, ...events]);
  };

  const deleteEvent = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  return (
    <div className="app">
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
      
      <main className="app-main">
        <aside className="sidebar">
          <h2>➕ Create New Event</h2>
          <EventForm onEventCreated={addEvent} />
        </aside>
        
        <section className="content">
          <h2>📋 Events ({events.length})</h2>
          <EventList events={events} onDeleteEvent={deleteEvent} />
        </section>
      </main>
    </div>
  );
}

export default App;