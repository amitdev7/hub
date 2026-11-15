import crypto from 'crypto';
import { cookies } from 'next/headers';
import db from './db';
import { User } from './types';

const SESSION_COOKIE_NAME = 'storagehub_session';
const SESSION_MAX_AGE_DAYS = 30;

/**
 * Hash a password using PBKDF2 with a random salt.
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 100000, 64, 'sha512')
    .toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verify a plaintext password against a stored salt:hash string.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, key] = storedHash.split(':');
    if (!salt || !key) return false;
    const hash = crypto
      .pbkdf2Sync(password, salt, 100000, 64, 'sha512')
      .toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(key));
  } catch {
    return false;
  }
}

/**
 * Create a new persistent session for a user.
 */
export function createSession(userId: string): string {
  const token = crypto.randomBytes(32).toString('hex');
  const id = crypto.randomUUID();
  const expiresAt = Date.now() + SESSION_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
  const createdAt = Date.now();

  const stmt = db.prepare(`
    INSERT INTO sessions (id, user_id, token, expires_at, created_at)
    VALUES (?, ?, ?, ?, ?)
  `);
  stmt.run(id, userId, token, expiresAt, createdAt);

  return token;
}

/**
 * Set the session cookie on the response.
 */
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_DAYS * 24 * 60 * 60,
  });
}

/**
 * Remove session cookie and revoke session in DB.
 */
export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Get current authenticated user from session cookie.
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const session = db
      .prepare(
        `SELECT s.*, u.id as u_id, u.username, u.email, u.name, u.avatar, u.role, u.created_at as u_created_at
         FROM sessions s
         JOIN users u ON s.user_id = u.id
         WHERE s.token = ? AND s.expires_at > ?`
      )
      .get(token, Date.now()) as any;

    if (!session) return null;

    return {
      id: session.u_id,
      username: session.username,
      email: session.email,
      name: session.name,
      avatar: session.avatar,
      role: session.role || 'admin',
      createdAt: session.u_created_at,
    };
  } catch (err) {
    console.error('getCurrentUser error:', err);
    return null;
  }
}
