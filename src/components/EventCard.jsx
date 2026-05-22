import React from 'react';
import { getEventTypeIcon, getPriorityEmoji } from '../types/eventTypes';
import './EventCard.css';

const EventCard = ({ event, onDelete }) => {
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const isSameDay = (start, end) => {
    return start.toDateString() === end.toDateString();
  };

  return (
    <div className={`event-card priority-${event.priority}`}>
      <div className="event-header">
        <div className="event-type-badge">
          <span className="event-icon">{getEventTypeIcon(event.type)}</span>
          <span className="event-type">{event.type}</span>
        </div>
        <div className="event-actions">
          <span className="event-priority">{getPriorityEmoji(event.priority)} {event.priority}</span>
          <button onClick={() => onDelete(event.id)} className="delete-btn" title="Delete event">
            🗑️
          </button>
        </div>
      </div>
      
      <h3 className="event-title">{event.title}</h3>
      <p className="event-description">{event.description || 'No description provided'}</p>
      
      <div className="event-datetime">
        <div className="datetime-item">
          <span className="datetime-icon">📅</span>
          <span>{formatDate(event.startDate)}</span>
        </div>
        <div className="datetime-item">
          <span className="datetime-icon">⏰</span>
          <span>
            {formatTime(event.startDate)} 
            {!isSameDay(event.startDate, event.endDate) && ` → ${formatDate(event.endDate)} `}
            {' - '}
            {formatTime(event.endDate)}
          </span>
        </div>
      </div>
      
      <div className="event-location">
        <span className="location-icon">📍</span>
        <span>{event.location || 'Location TBA'}</span>
      </div>
      
      {event.type === 'lecture' && (
        <div className="event-specific">
          <span className="specific-icon">📖</span>
          <span>Course: {event.courseCode}</span>
          {event.materialsLink && (
            <a href={event.materialsLink} target="_blank" rel="noopener noreferrer" className="materials-link">
              📎 Materials
            </a>
          )}
        </div>
      )}
      
      {event.type === 'exam' && (
        <div className="event-specific">
          <span className="specific-icon">📊</span>
          <span>Score: {event.maxScore} points | Duration: {event.duration} min</span>
        </div>
      )}
      
      {event.type === 'meeting' && (
        <>
          {event.agenda && event.agenda.length > 0 && (
            <div className="event-specific">
              <span className="specific-icon">📋</span>
              <span>Agenda: {event.agenda.join(' • ')}</span>
            </div>
          )}
          {event.attendees && event.attendees.length > 0 && (
            <div className="event-specific">
              <span className="specific-icon">👥</span>
              <span>Attendees: {event.attendees.join(', ')}</span>
            </div>
          )}
        </>
      )}
      
      {event.type === 'deadline' && (
        <div className="event-specific">
          <span className="specific-icon">⭐</span>
          <span>Points: {event.pointsWorth} | Submission: {event.submissionRequired ? 'Required' : 'Optional'}</span>
        </div>
      )}
      
      <div className="event-footer">
        <span className="created-by">Created by: {event.createdBy}</span>
        <span className="created-at">{new Date(event.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default EventCard;