import React, { useState } from 'react';
import { EventFactory } from '../factories/EventFactory';
import { EVENT_TYPES, PRIORITY_LEVELS } from '../types/eventTypes';
import { translations } from '../i18n/translations';
import './EventForm.css';

const EventForm = ({ onEventCreated, lang }) => {
  const t = translations[lang] ?? translations.en;
  const [eventType, setEventType] = useState(EVENT_TYPES.LECTURE);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    priority: PRIORITY_LEVELS.MEDIUM,
    courseCode: '',
    maxScore: 100,
    duration: 60,
    agenda: '',
    attendees: '',
    submissionRequired: false,
    pointsWorth: 0
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

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const selectedStart = new Date(formData.startDate);
    selectedStart.setHours(0, 0, 0, 0);

    if (selectedStart < now) {
      alert(t.alertPastDate);
      return;
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      alert(t.alertEndBeforeStart);
      return;
    }

    const eventParams = {
      type: eventType,
      title: formData.title,
      description: formData.description,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      location: formData.location,
      priority: formData.priority,
      createdBy: 'Current User'
    };

    if (eventType === EVENT_TYPES.LECTURE) {
      eventParams.courseCode = formData.courseCode;
    } else if (eventType === EVENT_TYPES.EXAM) {
      eventParams.maxScore = parseInt(formData.maxScore);
      eventParams.duration = parseInt(formData.duration);
    } else if (eventType === EVENT_TYPES.MEETING) {
      eventParams.agenda = formData.agenda.split(',').map(a => a.trim()).filter(a => a);
      eventParams.attendees = formData.attendees.split(',').map(a => a.trim()).filter(a => a);
    } else if (eventType === EVENT_TYPES.DEADLINE) {
      eventParams.submissionRequired = formData.submissionRequired;
      eventParams.pointsWorth = parseInt(formData.pointsWorth);
    }

    const newEvent = EventFactory.createEvent(eventParams);
    onEventCreated(newEvent);

    setFormData({
      title: '', description: '', startDate: '', endDate: '', location: '',
      priority: PRIORITY_LEVELS.MEDIUM, courseCode: '', maxScore: 100,
      duration: 60, agenda: '', attendees: '', submissionRequired: false, pointsWorth: 0
    });
    setEventType(EVENT_TYPES.LECTURE);
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

      <button type="submit" className="submit-btn">{t.formCreateBtn}</button>
    </form>
  );
};

export default EventForm;
