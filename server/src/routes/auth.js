import { Router } from 'express';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import { query } from '../db.js';
import { config } from '../config.js';
import {
  createSession,
  deleteSession,
  findSessionUser,
  sessionCookieOptions,
  toPublicUser,
} from '../sessions.js';

export const authRouter = Router();

// Used when the email is unknown, so a wrong email takes as long to reject as a
// wrong password and response times don't reveal which accounts exist.
const DUMMY_HASH = bcrypt.hashSync('timing-equaliser-not-a-real-password', 12);
const INVALID_LOGIN = 'Email or password is incorrect.';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { error: 'Too many sign-in attempts. Wait 15 minutes, then try again.' },
});

// Only accept JSON bodies. Browsers cannot send a cross-site JSON POST without
// a CORS preflight, which this API never approves, so this blocks login CSRF.
function requireJson(req, res, next) {
  if (!req.is('application/json')) {
    return res.status(415).json({ error: 'Send the request as JSON.' });
  }
  next();
}

authRouter.post('/login', loginLimiter, requireJson, async (req, res) => {
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  const remember = req.body?.remember === true;

  if (!email || !password) {
    return res.status(400).json({ error: 'Enter your email address and password.' });
  }
  if (email.length > 254 || password.length > 200) {
    return res.status(400).json({ error: INVALID_LOGIN });
  }

  const { rows } = await query(
    'SELECT id, password_hash, is_active FROM users WHERE email = $1',
    [email],
  );
  const account = rows[0];
  const passwordOk = await bcrypt.compare(password, account?.password_hash ?? DUMMY_HASH);

  if (!account || !passwordOk || !account.is_active) {
    return res.status(401).json({ error: INVALID_LOGIN });
  }

  const { rows: updated } = await query(
    `UPDATE users
        SET previous_login_at = last_login_at,
            last_login_at     = now()
      WHERE id = $1
  RETURNING id, email, full_name, last_login_at, previous_login_at`,
    [account.id],
  );

  const { token, expiresAt } = await createSession(account.id, {
    remember,
    userAgent: req.get('user-agent'),
    ip: req.ip,
  });

  // Without "keep me signed in" the cookie ends with the browser session.
  res.cookie(config.session.cookieName, token, sessionCookieOptions(remember ? expiresAt : null));
  res.json({ user: toPublicUser(updated[0]) });
});

// Returns the signed-in user, or { user: null } for visitors. It answers 200
// either way so ordinary page loads don't show errors in the browser console.
authRouter.get('/me', async (req, res) => {
  const user = await findSessionUser(req.cookies?.[config.session.cookieName]);
  res.json({ user: user ? toPublicUser(user) : null });
});

authRouter.post('/logout', async (req, res) => {
  await deleteSession(req.cookies?.[config.session.cookieName]);
  res.clearCookie(config.session.cookieName, sessionCookieOptions());
  res.status(204).end();
});
