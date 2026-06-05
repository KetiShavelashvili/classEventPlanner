import { Router } from 'express';
import db from '../db.js';
import { requireAuth, requireTeacher } from '../middleware/auth.js';

const router = Router();

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

router.get('/', requireAuth, (req, res) => {
  const rows = db.prepare('SELECT * FROM events ORDER BY start_date ASC').all();
  res.json(rows.map(rowToEvent));
});

router.post('/', requireAuth, requireTeacher, (req, res) => {
  const e = req.body;
  if (!e.title || !e.type || !e.startDate || !e.endDate) {
    return res.status(400).json({ error: 'title, type, startDate and endDate are required.' });
  }
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
    req.user.username, new Date().toISOString(),
    e.courseCode ?? null, e.materialsLink ?? null,
    e.submissionRequired ? 1 : 0,
    e.pointsWorth ?? null, e.maxScore ?? null, e.duration ?? null,
    e.agenda ? JSON.stringify(e.agenda) : null,
    e.attendees ? JSON.stringify(e.attendees) : null
  );
  const created = db.prepare('SELECT * FROM events WHERE id = ?').get(id);
  res.status(201).json(rowToEvent(created));
});

router.put('/:id', requireAuth, requireTeacher, (req, res) => {
  const e = req.body;
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
    req.params.id
  );
  if (result.changes === 0) return res.status(404).json({ error: 'Event not found.' });
  const updated = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
  res.json(rowToEvent(updated));
});

router.delete('/:id', requireAuth, requireTeacher, (req, res) => {
  const result = db.prepare('DELETE FROM events WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Event not found.' });
  res.json({ ok: true });
});

export default router;
