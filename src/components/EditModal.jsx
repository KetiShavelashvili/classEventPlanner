import React from 'react';
import { EVENT_TYPES, PRIORITY_LEVELS } from '../types/eventTypes';
import { useEventForm } from '../hooks/useEventForm';
import TypeSpecificFields from './TypeSpecificFields';
import { translations } from '../i18n/translations';
import './EditModal.css';

const toDateTimeLocal = (date) => {
  const d = new Date(date);
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const EditModal = ({ event, onSave, onClose, lang }) => {
  const t = translations[lang] ?? translations.en;

  const { eventType, setEventType, formData, handleChange, buildEventParams } = useEventForm({
    type:               event.type,
    title:              event.title              || '',
    description:        event.description        || '',
    startDate:          toDateTimeLocal(event.startDate),
    endDate:            toDateTimeLocal(event.endDate),
    location:           event.location           || '',
    priority:           event.priority           || PRIORITY_LEVELS.MEDIUM,
    courseCode:         event.courseCode         || '',
    maxScore:           event.maxScore           || 100,
    duration:           event.duration           || 60,
    agenda:             (event.agenda            || []).join(', '),
    attendees:          (event.attendees         || []).join(', '),
    submissionRequired: event.submissionRequired || false,
    pointsWorth:        event.pointsWorth        || 0,
  });

  // Template Method — Step 4 unique to EditModal: merge with existing event, call onSave.
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.startDate || !formData.endDate) { alert(t.alertNoDates); return; }
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      alert(t.alertEndBeforeStart);
      return;
    }
    try {
      const params = buildEventParams();
      onSave({ ...event, ...params });
    } catch (err) {
      alert(err.message);
    }
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
            <input type="text" name="title" value={formData.title} onChange={handleChange}
              required placeholder={t.formTitlePlaceholder} />
          </div>

          <div className="form-group">
            <label>{t.formDescription}</label>
            <textarea name="description" value={formData.description} onChange={handleChange}
              placeholder={t.formDescriptionPlaceholder} rows="3" />
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
              <input type="text" name="location" value={formData.location} onChange={handleChange}
                placeholder={t.formLocationPlaceholder} />
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

          <TypeSpecificFields eventType={eventType} formData={formData} handleChange={handleChange} t={t} />

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
