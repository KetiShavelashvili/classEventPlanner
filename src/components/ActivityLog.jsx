import React, { useState, useEffect } from 'react';
import EventBus from '../EventBus';

// Observer Pattern — subscribes to EventBus and renders a live activity feed
const ActivityLog = ({ lang }) => {
  const [log, setLog] = useState([]);

  useEffect(() => {
    const addEntry = (icon, message) => {
      const entry = { id: Date.now() + Math.random(), icon, message, time: new Date().toLocaleTimeString() };
      setLog(prev => [entry, ...prev].slice(0, 5));
    };

    const unsubCreate = EventBus.subscribe('event:created', (e) =>
      addEntry('✅', `Created "${e.title}"`)
    );
    const unsubUpdate = EventBus.subscribe('event:updated', (e) =>
      addEntry('✏️', `Updated "${e.title}"`)
    );
    const unsubDelete = EventBus.subscribe('event:deleted', ({ title }) =>
      addEntry('🗑️', `Deleted "${title}"`)
    );

    return () => {
      unsubCreate();
      unsubUpdate();
      unsubDelete();
    };
  }, []);

  if (log.length === 0) return null;

  return (
    <div className="activity-log">
      <span className="activity-log-label">👁️ Observer log</span>
      {log.map(entry => (
        <div key={entry.id} className="activity-log-entry">
          <span>{entry.icon}</span>
          <span className="activity-log-message">{entry.message}</span>
          <span className="activity-log-time">{entry.time}</span>
        </div>
      ))}
    </div>
  );
};

export default ActivityLog;
