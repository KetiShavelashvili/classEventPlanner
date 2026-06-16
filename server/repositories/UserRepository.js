import db from '../db.js';

export const UserRepository = {
  findByUsername(username) {
    return db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  },

  findById(id) {
    return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  },

  existsByUsername(username) {
    return !!db.prepare('SELECT id FROM users WHERE username = ?').get(username);
  },

  create({ id, username, passwordHash, role, subject, room, year }) {
    db.prepare(
      'INSERT INTO users (id, username, password_hash, role, subject, room, year) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(id, username, passwordHash, role, subject ?? null, room ?? null, year ?? null);
    return this.findById(id);
  },
};
