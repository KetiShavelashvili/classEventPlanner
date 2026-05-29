import React, { useState } from 'react';
import { EVENT_TYPES, PRIORITY_LEVELS } from '../types/eventTypes';
import './EditModal.css';

const toDateTimeLocal = (date) => {
  const d = new Date(date);
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const EditModal = ({ event, onSave, onClose }) => {
  const [eventType, setEventType] = useState(event.type);
  const [formData, setFormData] = useState({
    title: event.title || '',
    description: event.description || '',
    startDate: toDateTimeLocal(event.startDate),
    endDate: toDateTimeLocal(event.endDate),
    location: event.location || '',
    priority: event.priority || PRIORITY_LEVELS.MEDIUM,
    courseCode: event.courseCode || '',
    maxScore: event.maxScore || 100,
    duration: event.duration || 60,
    agenda: (event.agenda || []).join(', '),
    attendees: (event.attendees || []).join(', '),
    submissionRequired: event.submissionRequired || false,
    pointsWorth: event.pointsWorth || 0
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.startDate || !formData.endDate) {
      alert('❌ Please select both start date and end date!');
      return;
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      alert('❌ End date must be after start date!');
      return;
    }

    const updatedEvent = {
      ...event,
      type: eventType,
      title: formData.title,
      description: formData.description,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      location: formData.location,
      priority: formData.priority
    };

    if (eventType === EVENT_TYPES.LECTURE) {
      updatedEvent.courseCode = formData.courseCode;
    } else if (eventType === EVENT_TYPES.EXAM) {
      updatedEvent.maxScore = parseInt(formData.maxScore);
      updatedEvent.duration = parseInt(formData.duration);
    } else if (eventType === EVENT_TYPES.MEETING) {
      updatedEvent.agenda = formData.agenda.split(',').map(a => a.trim()).filter(a => a);
      updatedEvent.attendees = formData.attendees.split(',').map(a => a.trim()).filter(a => a);
    } else if (eventType === EVENT_TYPES.DEADLINE) {
      updatedEvent.submissionRequired = formData.submissionRequired;
      updatedEvent.pointsWorth = parseInt(formData.pointsWorth);
    }

    onSave(updatedEvent);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>✏️ Edit Event</h2>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-group">
            <label>Event Type *</label>
            <select value={eventType} onChange={e => setEventType(e.target.value)}>
              <option value={EVENT_TYPES.LECTURE}>📚 Lecture</option>
              <option value={EVENT_TYPES.EXAM}>📝 Exam</option>
              <option value={EVENT_TYPES.MEETING}>👥 Meeting</option>
              <option value={EVENT_TYPES.DEADLINE}>⏰ Deadline</option>
            </select>
          </div>

          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter event title"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the event"
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>📅 Start *</label>
              <input
                type="datetime-local"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>⏰ End *</label>
              <input
                type="datetime-local"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Room, building, or online link"
              />
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select name="priority" value={formData.priority} onChange={handleChange}>
                <option value={PRIORITY_LEVELS.LOW}>🟢 Low</option>
                <option value={PRIORITY_LEVELS.MEDIUM}>🟡 Medium</option>
                <option value={PRIORITY_LEVELS.HIGH}>🔴 High</option>
              </select>
            </div>
          </div>

          {eventType === EVENT_TYPES.LECTURE && (
            <div className="form-group">
              <label>Course Code</label>
              <input
                type="text"
                name="courseCode"
                value={formData.courseCode}
                onChange={handleChange}
                placeholder="e.g., CS401, MATH202"
              />
            </div>
          )}

          {eventType === EVENT_TYPES.EXAM && (
            <div className="form-row">
              <div className="form-group">
                <label>Max Score</label>
                <input type="number" name="maxScore" value={formData.maxScore} onChange={handleChange} min="0" />
              </div>
              <div className="form-group">
                <label>Duration (minutes)</label>
                <input type="number" name="duration" value={formData.duration} onChange={handleChange} min="1" />
              </div>
            </div>
          )}

          {eventType === EVENT_TYPES.MEETING && (
            <>
              <div className="form-group">
                <label>Agenda Items (comma-separated)</label>
                <input
                  type="text"
                  name="agenda"
                  value={formData.agenda}
                  onChange={handleChange}
                  placeholder="Review project, Discuss deadlines"
                />
              </div>
              <div className="form-group">
                <label>Attendees (comma-separated)</label>
                <input
                  type="text"
                  name="attendees"
                  value={formData.attendees}
                  onChange={handleChange}
                  placeholder="Mariam, Tekla, Keti"
                />
              </div>
            </>
          )}

          {eventType === EVENT_TYPES.DEADLINE && (
            <div className="form-row">
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="submissionRequired"
                    checked={formData.submissionRequired}
                    onChange={handleChange}
                  />
                  Submission Required
                </label>
              </div>
              <div className="form-group">
                <label>Points Worth</label>
                <input type="number" name="pointsWorth" value={formData.pointsWorth} onChange={handleChange} min="0" />
              </div>
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="save-btn">💾 Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
