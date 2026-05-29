import React, { useState, useEffect } from 'react';
import EventCard from './EventCard';
import { SortByDate } from '../strategies/SortByDate';
import { SortByPriority } from '../strategies/SortByPriority';
import { SortByType } from '../strategies/SortByType';
import './EventList.css';

const EventList = ({ events, onDeleteEvent, onEditEvent, isTeacher }) => {
  const [sortStrategy, setSortStrategy] = useState(new SortByDate());
  const [sortedEvents, setSortedEvents] = useState([]);

  useEffect(() => {
    setSortedEvents(sortStrategy.sort(events));
  }, [events, sortStrategy]);

  const handleSort = (strategy) => {
    setSortStrategy(strategy);
  };

  return (
    <div className="event-list-container">
      <div className="sort-controls">
        <span>📊 Sort by:</span>
        <button onClick={() => handleSort(new SortByDate())} className="sort-btn">
          📅 Date
        </button>
        <button onClick={() => handleSort(new SortByPriority())} className="sort-btn">
          ⚡ Priority
        </button>
        <button onClick={() => handleSort(new SortByType())} className="sort-btn">
          🏷️ Type
        </button>
      </div>
      
      <div className="event-list">
        {sortedEvents.length === 0 ? (
          <p className="no-events">✨ No events yet. Create your first event!</p>
        ) : (
          sortedEvents.map(event => (
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