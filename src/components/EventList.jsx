import React, { useState, useMemo } from 'react';
import EventCard from './EventCard';
import { SortByDate } from '../strategies/SortByDate';
import { SortByPriority } from '../strategies/SortByPriority';
import './EventList.css';

const TYPE_OPTIONS = [
  { value: 'all',      label: 'All Types' },
  { value: 'lecture',  label: '📚 Lecture' },
  { value: 'exam',     label: '📝 Exam' },
  { value: 'meeting',  label: '👥 Meeting' },
  { value: 'deadline', label: '⏰ Deadline' },
];

const EventList = ({ events, onDeleteEvent, onEditEvent, isTeacher }) => {
  const [sortStrategy, setSortStrategy] = useState(new SortByDate());
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const displayedEvents = useMemo(() => {
    // Step 1: sort the full array with the active strategy
    const sorted = sortStrategy.sort(events);

    // Step 2: apply type filter
    const typed = typeFilter === 'all'
      ? sorted
      : sorted.filter(e => e.type === typeFilter);

    // Step 3: apply search filter only when there's a query
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
        <input
          type="text"
          className="search-input"
          placeholder="Search by title or description…"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button className="search-clear" onClick={() => setSearchQuery('')}>✕</button>
        )}
      </div>

      <div className="sort-controls">
        <span>📊 Sort by:</span>
        <button onClick={() => setSortStrategy(new SortByDate())} className="sort-btn">
          📅 Date
        </button>
        <button onClick={() => setSortStrategy(new SortByPriority())} className="sort-btn">
          ⚡ Priority
        </button>

        <div className="filter-divider" />

        <span>🏷️ Filter:</span>
        <select
          className="type-filter-select"
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
        >
          {TYPE_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="event-list">
        {displayedEvents.length === 0 ? (
          <p className="no-events">
            {searchQuery
              ? `No events match "${searchQuery}".`
              : typeFilter === 'all'
                ? '✨ No events yet. Create your first event!'
                : `No ${typeFilter} events found.`}
          </p>
        ) : (
          displayedEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onDelete={onDeleteEvent}
              onEdit={onEditEvent}
              isTeacher={isTeacher}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default EventList;
