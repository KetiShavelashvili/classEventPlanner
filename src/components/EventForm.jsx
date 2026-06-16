import React from 'react';
import { EVENT_TYPES, PRIORITY_LEVELS } from '../types/eventTypes';
import { getCreator } from '../factories/EventCreatorRegistry';
import { useEventForm } from '../hooks/useEventForm';
import TypeSpecificFields from './TypeSpecificFields';
import { translations } from '../i18n/translations';
import './EventForm.css';

const EventForm = ({ onEventCreated, lang }) => {
  const t = translations[lang] ?? translations.en;
  const { eventType, setEventType, formData, handleChange, buildEventParams, reset } = useEventForm();

  // Template Method — Step 4 unique to EventForm: validate future date,
  // then delegate to the concrete EventCreator via the Factory Method registry.
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.startDate || !formData.endDate) {
      alert(t.alertNoDates);
      return;
    }

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const selectedStart = new Date(formData.startDate);
    selectedStart.setHours(0, 0, 0, 0);
    if (selectedStart < now) { alert(t.alertPastDate); return; }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      alert(t.alertEndBeforeStart);
      return;
    }

    try {
      const params  = buildEventParams();                   // Builder assembles params
      const creator = getCreator(eventType);               // Factory Method registry
      const newEvent = creator.buildEvent({ ...params, createdBy: 'Current User' });
      onEventCreated(newEvent);
      reset();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="event-form">
      <div className="form-group">
        <label>{t.formEventType} *</label>
        <select value={eventType} onChange={(e) => setEventType(e.target.value)}>
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

      <button type="submit" className="submit-btn">{t.formCreateBtn}</button>
    </form>
  );
};

export default EventForm;
