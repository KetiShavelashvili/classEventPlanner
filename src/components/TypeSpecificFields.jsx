import React from 'react';
import { EVENT_TYPES } from '../types/eventTypes';

// Template Method Pattern — the "overridable step" shared by EventForm and EditModal.
// Renders the type-specific fields section for whichever event type is selected.
const TypeSpecificFields = ({ eventType, formData, handleChange, t }) => {
  if (eventType === EVENT_TYPES.LECTURE) {
    return (
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
    );
  }

  if (eventType === EVENT_TYPES.EXAM) {
    return (
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
    );
  }

  if (eventType === EVENT_TYPES.MEETING) {
    return (
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
    );
  }

  if (eventType === EVENT_TYPES.DEADLINE) {
    return (
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
    );
  }

  return null;
};

export default TypeSpecificFields;
