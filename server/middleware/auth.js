// Chain of Responsibility Pattern — each middleware either handles the request
// (returns an error response) or passes it to the next handler via next().
// Usage in routes: requireAuth → requireTeacher → route handler.
// Neither handler knows about the others; each only inspects its own concern.
import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }
  try {
    req.user = jwt.verify(auth.slice(7), process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Token is invalid or expired.' });
  }
}

export function requireTeacher(req, res, next) {
  if (req.user?.role !== 'teacher') {
    return res.status(403).json({ error: 'Only teachers can perform this action.' });
  }
  next();
}
