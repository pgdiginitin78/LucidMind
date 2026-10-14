import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/database.js';
import config from '../config/env.js';
import { HttpError } from '../utils/http.js';

// Used to equalise timing when the username does not exist.
const DUMMY_HASH = '$2b$10$CwTycUXWue0Thq9StjUM0uJ8.4W3g3rQeGq3o7m3Yw5X0vZ8nYq2K';

export async function login({ username, password }) {
  const rows = await db.query('SELECT id, username, password FROM users WHERE username = ?', [username]);
  const user = rows[0];

  // bcryptjs verifies PHP password_hash() ($2y$) hashes
  const ok = await bcrypt.compare(password, user ? user.password : DUMMY_HASH);
  if (!user || !ok) throw new HttpError(401, 'Invalid username or password');

  const token = jwt.sign({ id: user.id, username: user.username }, config.jwt.secret, {
    algorithm: 'HS256',
    expiresIn: config.jwt.expiresIn,
  });
  return { token, user: { id: user.id, username: user.username } };
}

export async function getMe(userId) {
  const rows = await db.query('SELECT id, username FROM users WHERE id = ?', [userId]);
  if (!rows[0]) throw new HttpError(404, 'User not found');
  return rows[0];
}
