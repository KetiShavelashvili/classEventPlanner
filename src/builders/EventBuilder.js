// Builder Pattern — constructs complex event parameter objects step-by-step.
// Separates construction from the creator (Factory Method) so the same
// fluent API builds every event type cleanly.
export class EventBuilder {
  constructor() {
    this._data = {};
  }

  // ── Required base fields ──────────────────────────────────────────
  setType(type)            { this._data.type = type;               return this; }
  setTitle(title)          { this._data.title = title;             return this; }
  setDates(start, end)     { this._data.startDate = start; this._data.endDate = end; return this; }

  // ── Optional base fields ──────────────────────────────────────────
  setDescription(desc)     { this._data.description = desc;        return this; }
  setLocation(loc)         { this._data.location = loc;            return this; }
  setPriority(p)           { this._data.priority = p;              return this; }

  // ── Lecture-specific ──────────────────────────────────────────────
  withCourseCode(code)     { this._data.courseCode = code;         return this; }
  withMaterialsLink(link)  { this._data.materialsLink = link;      return this; }

  // ── Exam-specific ─────────────────────────────────────────────────
  withMaxScore(score)      { this._data.maxScore = score;          return this; }
  withDuration(mins)       { this._data.duration = mins;           return this; }

  // ── Meeting-specific ──────────────────────────────────────────────
  withAgenda(items)        { this._data.agenda = items;            return this; }
  withAttendees(people)    { this._data.attendees = people;        return this; }

  // ── Deadline-specific ─────────────────────────────────────────────
  withSubmission(required, points) {
    this._data.submissionRequired = required;
    this._data.pointsWorth = points;
    return this;
  }

  // ── Build — validates before returning ───────────────────────────
  build() {
    const { type, title, startDate, endDate } = this._data;
    if (!type)      throw new Error("EventBuilder: 'type' is required");
    if (!title)     throw new Error("EventBuilder: 'title' is required");
    if (!startDate) throw new Error("EventBuilder: 'startDate' is required");
    if (!endDate)   throw new Error("EventBuilder: 'endDate' is required");
    if (new Date(startDate) >= new Date(endDate))
      throw new Error("EventBuilder: 'endDate' must be after 'startDate'");
    return { ...this._data };
  }
}
