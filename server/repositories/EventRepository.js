import db from '../db.js';

// Adapter Pattern — translates the database row (snake_case, integers for booleans,
// JSON strings for arrays) into the camelCase JavaScript domain object the frontend expects.
// The Repository exposes only domain objects; callers never see raw DB rows.
function rowToEvent(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    type: row.type,
    startDate: row.start_date,
    endDate: row.end_date,
    location: row.location,
    priority: row.priority,
    createdBy: row.created_by,
    createdAt: row.created_at,
    courseCode: row.course_code,
    materialsLink: row.materials_link,
    submissionRequired: Boolean(row.submission_required),
    pointsWorth: row.points_worth,
    maxScore: row.max_score,
    duration: row.duration,
    agenda: row.agenda ? JSON.parse(row.agenda) : undefined,
    attendees: row.attendees ? JSON.parse(row.attendees) : undefined,
  };
}

export const EventRepository = {
  findAll() {
    return db.prepare('SELECT * FROM events ORDER BY start_date ASC').all().map(rowToEvent);
  },

  findById(id) {
    const row = db.prepare('SELECT * FROM events WHERE id = ?').get(id);
    return row ? rowToEvent(row) : null;
  },

  create(e, createdBy) {
    const id = e.id || (Date.now().toString() + Math.random().toString(36).slice(2, 7));
    db.prepare(`
      INSERT INTO events
        (id, title, description, type, start_date, end_date, location, priority,
         created_by, created_at, course_code, materials_link,
         submission_required, points_worth, max_score, duration, agenda, attendees)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `).run(
      id, e.title, e.description ?? null, e.type,
      new Date(e.startDate).toISOString(), new Date(e.endDate).toISOString(),
      e.location ?? null, e.priority ?? 'medium',
      createdBy, new Date().toISOString(),
      e.courseCode ?? null, e.materialsLink ?? null,
      e.submissionRequired ? 1 : 0,
      e.pointsWorth ?? null, e.maxScore ?? null, e.duration ?? null,
      e.agenda ? JSON.stringify(e.agenda) : null,
      e.attendees ? JSON.stringify(e.attendees) : null
    );
    return this.findById(id);
  },

  update(id, e) {
    const result = db.prepare(`
      UPDATE events SET
        title=?, description=?, type=?, start_date=?, end_date=?,
        location=?, priority=?, course_code=?, materials_link=?,
        submission_required=?, points_worth=?, max_score=?, duration=?,
        agenda=?, attendees=?
      WHERE id=?
    `).run(
      e.title, e.description ?? null, e.type,
      new Date(e.startDate).toISOString(), new Date(e.endDate).toISOString(),
      e.location ?? null, e.priority ?? 'medium',
      e.courseCode ?? null, e.materialsLink ?? null,
      e.submissionRequired ? 1 : 0,
      e.pointsWorth ?? null, e.maxScore ?? null, e.duration ?? null,
      e.agenda ? JSON.stringify(e.agenda) : null,
      e.attendees ? JSON.stringify(e.attendees) : null,
      id
    );
    return result.changes > 0 ? this.findById(id) : null;
  },

  delete(id) {
    const result = db.prepare('DELETE FROM events WHERE id = ?').run(id);
    return result.changes > 0;
  },
};
