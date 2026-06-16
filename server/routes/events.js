import { Router } from 'express';
import { EventRepository } from '../repositories/EventRepository.js';
import { requireAuth, requireTeacher } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, (req, res) => {
  res.json(EventRepository.findAll());
});

router.post('/', requireAuth, requireTeacher, (req, res) => {
  const e = req.body;
  if (!e.title || !e.type || !e.startDate || !e.endDate) {
    return res.status(400).json({ error: 'title, type, startDate and endDate are required.' });
  }
  const created = EventRepository.create(e, req.user.username);
  res.status(201).json(created);
});

router.put('/:id', requireAuth, requireTeacher, (req, res) => {
  const updated = EventRepository.update(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Event not found.' });
  res.json(updated);
});

router.delete('/:id', requireAuth, requireTeacher, (req, res) => {
  const deleted = EventRepository.delete(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Event not found.' });
  res.json({ ok: true });
});

export default router;
