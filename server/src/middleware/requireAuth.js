import { config } from '../config.js';
import { findSessionUser } from '../sessions.js';

export async function requireAuth(req, res, next) {
  const token = req.cookies?.[config.session.cookieName];
  const user = await findSessionUser(token);
  if (!user) {
    return res.status(401).json({ error: 'You are not signed in.' });
  }
  req.user = user;
  req.sessionToken = token;
  next();
}
