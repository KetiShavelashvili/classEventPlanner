import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories/UserRepository.js';

const router = Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }
  const user = UserRepository.findByUsername(username.trim());
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  res.json({ token, user: { username: user.username, role: user.role } });
});

function validatePassword(password) {
  if (password.length < 8)             return 'Password must be at least 8 characters.';
  if (!/[A-Z]/.test(password))         return 'Password must contain at least one uppercase letter.';
  if (!/[a-z]/.test(password))         return 'Password must contain at least one lowercase letter.';
  if (!/[0-9]/.test(password))         return 'Password must contain at least one number.';
  if (!/[^A-Za-z0-9]/.test(password))  return 'Password must contain at least one special character.';
  return null;
}

router.post('/register', async (req, res) => {
  const { username, password, confirmPassword, role, subject, room, year } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match.' });
  }
  const pwError = validatePassword(password);
  if (pwError) return res.status(400).json({ error: pwError });

  const safeRole = role === 'teacher' ? 'teacher' : 'student';
  if (safeRole === 'teacher' && !subject?.trim()) {
    return res.status(400).json({ error: 'Subject is required for teachers.' });
  }
  if (safeRole === 'teacher' && !room?.trim()) {
    return res.status(400).json({ error: 'Room is required for teachers.' });
  }
  if (safeRole === 'student' && !year?.trim()) {
    return res.status(400).json({ error: 'Year is required for students.' });
  }

  if (UserRepository.existsByUsername(username.trim())) {
    return res.status(409).json({ error: 'Username is already taken.' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const id = Date.now().toString();
  UserRepository.create({
    id,
    username: username.trim(),
    passwordHash,
    role: safeRole,
    subject: safeRole === 'teacher' ? (subject?.trim() || null) : null,
    room: safeRole === 'teacher' ? (room?.trim() || null) : null,
    year: safeRole === 'student' ? (year?.trim() || null) : null,
  });

  const token = jwt.sign(
    { id, username: username.trim(), role: safeRole },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  res.status(201).json({ token, user: { username: username.trim(), role: safeRole } });
});

router.get('/verify', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided.' });
  }
  try {
    const payload = jwt.verify(auth.slice(7), process.env.JWT_SECRET);
    res.json({ user: { username: payload.username, role: payload.role } });
  } catch {
    res.status(401).json({ error: 'Token is invalid or expired.' });
  }
});

export default router;
