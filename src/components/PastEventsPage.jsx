import React from 'react';
import EventList from './EventList';
import './PastEventsPage.css';

const PastEventsPage = ({ events, onDeleteEvent, onEditEvent, isTeacher }) => {
  return (
    <div className="past-events-page">
      <div className="past-events-header">
        <div>
          <h2>🗂️ Past Events</h2>
          <p className="past-events-subtitle">
            {events.length === 0
              ? 'No past events yet.'
              : `${events.length} completed event${events.length !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="past-events-empty">
          <span className="empty-icon">📭</span>
          <p>No past events to show.</p>
        </div>
      ) : (
        <EventList
          events={events}
          onDeleteEvent={onDeleteEvent}
          onEditEvent={onEditEvent}
          isTeacher={isTeacher}
        />
      )}
    </div>
  );
};

export default PastEventsPage;
