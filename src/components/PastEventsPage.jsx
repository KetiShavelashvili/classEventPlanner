import React from 'react';
import EventList from './EventList';
import { translations } from '../i18n/translations';
import './PastEventsPage.css';

const PastEventsPage = ({ events, onDeleteEvent, onEditEvent, isTeacher, lang }) => {
  const t = translations[lang] ?? translations.en;

  return (
    <div className="past-events-page">
      <div className="past-events-header">
        <div>
          <h2>{t.pastTitle}</h2>
          <p className="past-events-subtitle">
            {events.length === 0 ? t.pastNone : t.pastCount(events.length)}
          </p>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="past-events-empty">
          <span className="empty-icon">📭</span>
          <p>{t.pastEmpty}</p>
        </div>
      ) : (
        <EventList
          events={events}
          onDeleteEvent={onDeleteEvent}
          onEditEvent={onEditEvent}
          isTeacher={isTeacher}
          lang={lang}
        />
      )}
    </div>
  );
};

export default PastEventsPage;
