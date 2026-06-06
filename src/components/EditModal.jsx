import React, { useState } from 'react';
import { EVENT_TYPES, PRIORITY_LEVELS } from '../types/eventTypes';
import { translations } from '../i18n/translations';
import './EditModal.css';

const toDateTimeLocal = (date) => {
  const d = new Date(date);
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const EditModal = ({ event, onSave, onClose, lang }) => {
  const t = translations[lang] ?? translations.en;
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
      alert(t.alertNoDates);
      return;
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      alert(t.alertEndBeforeStart);
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
          <h2>{t.editModalTitle}</h2>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-group">
            <label>{t.formEventType} *</label>
            <select value={eventType} onChange={e => setEventType(e.target.value)}>
              <option value={EVENT_TYPES.LECTURE}>{t.formLecture}</option>
              <option value={EVENT_TYPES.EXAM}>{t.formExam}</option>
              <option value={EVENT_TYPES.MEETING}>{t.formMeeting}</option>
              <option value={EVENT_TYPES.DEADLINE}>{t.formDeadline}</option>
            </select>
          </div>

          <div className="form-group">
            <label>{t.formTitle} *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder={t.formTitlePlaceholder}
            />
          </div>

          <div className="form-group">
            <label>{t.formDescription}</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={t.formDescriptionPlaceholder}
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{t.formStart} *</label>
              <input type="datetime-local" name="startDate" value={formData.startDate} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>{t.formEnd} *</label>
              <input type="datetime-local" name="endDate" value={formData.endDate} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{t.formLocation}</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder={t.formLocationPlaceholder}
              />
            </div>
            <div className="form-group">
              <label>{t.formPriority}</label>
              <select name="priority" value={formData.priority} onChange={handleChange}>
                <option value={PRIORITY_LEVELS.LOW}>{t.formLow}</option>
                <option value={PRIORITY_LEVELS.MEDIUM}>{t.formMedium}</option>
                <option value={PRIORITY_LEVELS.HIGH}>{t.formHigh}</option>
              </select>
            </div>
          </div>

          {eventType === EVENT_TYPES.LECTURE && (
            <div className="form-group">
              <label>{t.formCourseCode}</label>
              <input
                type="text"
                name="courseCode"
                value={formData.courseCode}
                onChange={handleChange}
                placeholder={t.formCourseCodePlaceholder}
              />
            </div>
          )}

          {eventType === EVENT_TYPES.EXAM && (
            <div className="form-row">
              <div className="form-group">
                <label>{t.formMaxScore}</label>
                <input type="number" name="maxScore" value={formData.maxScore} onChange={handleChange} min="0" />
              </div>
              <div className="form-group">
                <label>{t.formDuration}</label>
                <input type="number" name="duration" value={formData.duration} onChange={handleChange} min="1" />
              </div>
            </div>
          )}

          {eventType === EVENT_TYPES.MEETING && (
            <>
              <div className="form-group">
                <label>{t.formAgenda}</label>
                <input
                  type="text"
                  name="agenda"
                  value={formData.agenda}
                  onChange={handleChange}
                  placeholder={t.formAgendaPlaceholder}
                />
              </div>
              <div className="form-group">
                <label>{t.formAttendees}</label>
                <input
                  type="text"
                  name="attendees"
                  value={formData.attendees}
                  onChange={handleChange}
                  placeholder={t.formAttendeesPlaceholder}
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
                  {t.formSubmissionRequired}
                </label>
              </div>
              <div className="form-group">
                <label>{t.formPointsWorth}</label>
                <input type="number" name="pointsWorth" value={formData.pointsWorth} onChange={handleChange} min="0" />
              </div>
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>{t.editCancel}</button>
            <button type="submit" className="save-btn">{t.editSave}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
