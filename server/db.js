// Singleton Pattern — one database connection shared across the entire server process.
// Importing this module always returns the same Database instance.
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcryptjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const db = new Database(join(__dirname, 'data', 'app.db'));

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id         TEXT PRIMARY KEY,
    username   TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role       TEXT NOT NULL DEFAULT 'student',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS events (
    id                  TEXT PRIMARY KEY,
    title               TEXT NOT NULL,
    description         TEXT,
    type                TEXT NOT NULL,
    start_date          TEXT NOT NULL,
    end_date            TEXT NOT NULL,
    location            TEXT,
    priority            TEXT NOT NULL DEFAULT 'medium',
    created_by          TEXT NOT NULL,
    created_at          TEXT NOT NULL DEFAULT (datetime('now')),
    course_code         TEXT,
    materials_link      TEXT,
    submission_required INTEGER DEFAULT 0,
    points_worth        INTEGER,
    max_score           INTEGER,
    duration            INTEGER,
    agenda              TEXT,
    attendees           TEXT
  );
`);

// Add profile columns if they don't exist yet (safe to run on existing DB)
for (const col of ['subject TEXT', 'room TEXT', 'year TEXT']) {
  try { db.exec(`ALTER TABLE users ADD COLUMN ${col}`); } catch {}
}

// Seed users once
const userCount = db.prepare('SELECT COUNT(*) as c FROM users').get().c;
if (userCount === 0) {
  const insertUser = db.prepare(
    'INSERT INTO users (id, username, password_hash, role) VALUES (?, ?, ?, ?)'
  );
  insertUser.run('1', 'teacher1', bcrypt.hashSync('teacher123', 10), 'teacher');
  insertUser.run('2', 'student1', bcrypt.hashSync('student123', 10), 'student');
}

// Seed demo events once
const eventCount = db.prepare('SELECT COUNT(*) as c FROM events').get().c;
if (eventCount === 0) {
  const insertEvent = db.prepare(`
    INSERT INTO events
      (id, title, description, type, start_date, end_date, location, priority,
       created_by, created_at, course_code, materials_link,
       submission_required, points_worth, max_score, duration, agenda, attendees)
    VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const seed = db.transaction(() => {
    insertEvent.run('1', 'Design Patterns Lecture',
      'Learn about Observer, Factory, Strategy, and Decorator patterns',
      'lecture', '2026-05-28T10:00:00.000Z', '2026-05-28T12:00:00.000Z',
      'Room 101', 'high', 'teacher1', new Date().toISOString(),
      'CS401', 'https://example.com/slides', 0, null, null, null, null, null);

    insertEvent.run('2', 'Final Project Submission',
      'Submit the complete Class Event Planner project',
      'deadline', '2026-06-05T23:59:00.000Z', '2026-06-05T23:59:00.000Z',
      'Online', 'high', 'teacher1', new Date().toISOString(),
      null, null, 1, 100, null, null, null, null);

    insertEvent.run('3', 'Midterm Exam',
      'Comprehensive exam on design patterns',
      'exam', '2026-06-01T09:00:00.000Z', '2026-06-01T12:00:00.000Z',
      'Exam Hall A', 'high', 'teacher1', new Date().toISOString(),
      null, null, 0, null, 100, 180, null, null);

    insertEvent.run('4', 'Study Group Meeting',
      'Review design patterns together',
      'meeting', '2026-05-27T15:00:00.000Z', '2026-05-27T17:00:00.000Z',
      'Library Room 5', 'medium', 'teacher1', new Date().toISOString(),
      null, null, 0, null, null, null,
      JSON.stringify(['Review Factory pattern', 'Discuss Strategy pattern', 'Plan presentation']),
      JSON.stringify(['Mariam', 'Tekla', 'Keti']));

    insertEvent.run('5', 'Weekly Team Sync',
      'Progress update on class events',
      'meeting', '2026-05-29T14:00:00.000Z', '2026-05-29T15:00:00.000Z',
      'Conference Room', 'low', 'teacher1', new Date().toISOString(),
      null, null, 0, null, null, null,
      JSON.stringify(['Weekly updates', 'Blockers discussion']),
      JSON.stringify(['Mariam', 'Tekla', 'Keti']));
  });
  seed();
}

export default db;
