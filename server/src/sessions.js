import crypto from 'node:crypto';
import { query } from './db.js';
import { config } from './config.js';

const hashToken = (token) => crypto.createHash('sha256').update(token).digest();

export async function createSession(userId, { remember, userAgent, ip }) {
  const token = crypto.randomBytes(32).toString('base64url');
  const ttl = remember ? config.session.longTtlMs : config.session.shortTtlMs;
  const expiresAt = new Date(Date.now() + ttl);

  await query(
    `INSERT INTO sessions (user_id, token_hash, expires_at, user_agent, ip_address)
     VALUES ($1, $2, $3, $4, $5)`,
    [userId, hashToken(token), expiresAt, userAgent?.slice(0, 400) ?? null, ip ?? null],
  );

  // Housekeeping: expired rows are never valid, so clear them out as we go.
  await query('DELETE FROM sessions WHERE expires_at < now()');

  return { token, expiresAt };
}

export async function findSessionUser(token) {
  if (!token) return null;
  const { rows } = await query(
    `SELECT u.id, u.email, u.full_name, u.last_login_at, u.previous_login_at,
            s.expires_at AS session_expires_at
       FROM sessions s
       JOIN users u ON u.id = s.user_id
      WHERE s.token_hash = $1
        AND s.expires_at > now()
        AND u.is_active`,
    [hashToken(token)],
  );
  return rows[0] ?? null;
}

export async function deleteSession(token) {
  if (!token) return;
  await query('DELETE FROM sessions WHERE token_hash = $1', [hashToken(token)]);
}

export function sessionCookieOptions(expiresAt) {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: config.isProduction,
    path: '/',
    ...(expiresAt ? { expires: expiresAt } : {}),
  };
}

export function toPublicUser(row) {
  return {
    id: String(row.id),
    email: row.email,
    fullName: row.full_name,
    lastLoginAt: row.last_login_at,
    previousLoginAt: row.previous_login_at,
  };
}
