import React from 'react';
import { getEventTypeIcon, getPriorityEmoji } from '../types/eventTypes';
import { translations } from '../i18n/translations';
import './EventCard.css';

const EventCard = ({ event, onDelete, onEdit, isTeacher, lang }) => {
  const t = translations[lang] ?? translations.en;

  const toDate = (d) => (d instanceof Date ? d : new Date(d));

  const formatDate = (date) =>
    toDate(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const formatTime = (date) =>
    toDate(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const isSameDay = (start, end) =>
    toDate(start).toDateString() === toDate(end).toDateString();

  const isSoon = () => {
    const now = new Date();
    const diffHours = (new Date(event.startDate) - now) / (1000 * 60 * 60);
    return diffHours > 0 && diffHours <= 48;
  };

  const isPast = () => new Date(event.endDate) < new Date();

  return (
    <div className={`event-card priority-${event.priority}`}>
      {isSoon() && !isPast() && (
        <div className="soon-badge">{t.soonBadge}</div>
      )}

      <div className="event-header">
        <div className="event-type-badge">
          <span className="event-icon">{getEventTypeIcon(event.type)}</span>
          <span className="event-type">{event.type}</span>
        </div>
        <div className="event-actions">
          <span className="event-priority">{getPriorityEmoji(event.priority)} {event.priority}</span>
          {!isPast() && isTeacher && (
            <>
              <button onClick={() => onEdit(event)} className="edit-btn" title={t.editTitle}>✏️</button>
              <button onClick={() => onDelete(event.id)} className="delete-btn" title={t.deleteTitle}>🗑️</button>
            </>
          )}
        </div>
      </div>

      <h3 className="event-title">{event.title}</h3>
      <p className="event-description">{event.description || t.noDescription}</p>

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
        <span>{event.location || t.locationTBA}</span>
      </div>

      {event.type === 'lecture' && (
        <div className="event-specific">
          <span className="specific-icon">📖</span>
          <span>{t.courseLabel} {event.courseCode}</span>
          {event.materialsLink && (
            <a href={event.materialsLink} target="_blank" rel="noopener noreferrer" className="materials-link">
              {t.materialsLink}
            </a>
          )}
        </div>
      )}

      {event.type === 'exam' && (
        <div className="event-specific">
          <span className="specific-icon">📊</span>
          <span>{t.maxScoreLabel} {event.maxScore} | {t.durationLabel} {event.duration} {t.durationUnit}</span>
        </div>
      )}

      {event.type === 'meeting' && (
        <>
          {event.agenda && event.agenda.length > 0 && (
            <div className="event-specific">
              <span className="specific-icon">📋</span>
              <span>{t.agendaLabel} {event.agenda.join(' • ')}</span>
            </div>
          )}
          {event.attendees && event.attendees.length > 0 && (
            <div className="event-specific">
              <span className="specific-icon">👥</span>
              <span>{t.attendeesLabel} {event.attendees.join(', ')}</span>
            </div>
          )}
        </>
      )}

      {event.type === 'deadline' && (
        <div className="event-specific">
          <span className="specific-icon">⭐</span>
          <span>
            {t.pointsLabel} {event.pointsWorth} | {event.submissionRequired ? t.submissionRequired : t.submissionOptional}
          </span>
        </div>
      )}

      <div className="event-footer">
        <span>{t.createdBy} {event.createdBy}</span>
        <span>{new Date(event.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default EventCard;
