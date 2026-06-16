import React, { useState, useMemo } from 'react';
import EventCard from './EventCard';
import withUrgencyBanner from '../decorators/withUrgencyBanner';
import { sortByDate }     from '../strategies/SortByDate';
import { sortByPriority } from '../strategies/SortByPriority';
import { sortByType }     from '../strategies/SortByType';
import { translations } from '../i18n/translations';
import './EventList.css';

// Decorator Pattern — EventCard wrapped with urgency banner
const UrgentEventCard = withUrgencyBanner(EventCard);

const EventList = ({ events, onDeleteEvent, onEditEvent, isTeacher, lang }) => {
  const t = translations[lang] ?? translations.en;

  // Strategy Pattern — context holds the current strategy; swapping it changes sort behaviour
  const [sortStrategy, setSortStrategy] = useState(sortByDate);
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const TYPE_OPTIONS = [
    { value: 'all',      label: t.filterAll },
    { value: 'lecture',  label: t.filterLecture },
    { value: 'exam',     label: t.filterExam },
    { value: 'meeting',  label: t.filterMeeting },
    { value: 'deadline', label: t.filterDeadline },
  ];

  const displayedEvents = useMemo(() => {
    const sorted = sortStrategy.sort(events);
    const typed  = typeFilter === 'all' ? sorted : sorted.filter(e => e.type === typeFilter);
    if (!searchQuery.trim()) return typed;
    const q = searchQuery.toLowerCase();
    return typed.filter(e =>
      e.title.toLowerCase().includes(q) ||
      (e.description && e.description.toLowerCase().includes(q))
    );
  }, [events, sortStrategy, typeFilter, searchQuery]);

  return (
    <div className="event-list-container">
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input type="text" className="search-input" placeholder={t.searchPlaceholder}
          value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        {searchQuery && <button className="search-clear" onClick={() => setSearchQuery('')}>✕</button>}
      </div>

      <div className="sort-controls">
        <span>{t.sortBy}</span>
        <button onClick={() => setSortStrategy(sortByDate)}     className="sort-btn">{t.sortDate}</button>
        <button onClick={() => setSortStrategy(sortByPriority)} className="sort-btn">{t.sortPriority}</button>
        <button onClick={() => setSortStrategy(sortByType)}     className="sort-btn">{t.sortType}</button>
        <div className="filter-divider" />
        <span>{t.filterLabel}</span>
        <select className="type-filter-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          {TYPE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>

      <div className="event-list">
        {displayedEvents.length === 0 ? (
          <p className="no-events">
            {searchQuery
              ? t.noEventsSearch(searchQuery)
              : typeFilter === 'all' ? t.noEventsEmpty : t.noEventsType(typeFilter)}
          </p>
        ) : (
          displayedEvents.map(event => (
            <UrgentEventCard key={event.id} event={event}
              onDelete={onDeleteEvent} onEdit={onEditEvent}
              isTeacher={isTeacher} lang={lang} />
          ))
        )}
      </div>
    </div>
  );
};

export default EventList;
