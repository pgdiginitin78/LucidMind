#!/usr/bin/env node
/**
 * Creates the initial admin user if (and only if) it does not exist.
 * Unlike the old seed-admin.php it NEVER resets an existing password and has no hardcoded credentials.
 *
 * Usage: ADMIN_USERNAME=admin ADMIN_PASSWORD='choose-a-strong-one' npm run seed:admin
 */
import bcrypt from 'bcryptjs';
import db from '../src/config/database.js';

const username = process.env.ADMIN_USERNAME;
const password = process.env.ADMIN_PASSWORD;

if (!username || !password || password.length < 8) {
  console.error('Set ADMIN_USERNAME and ADMIN_PASSWORD (min 8 chars).');
  process.exit(1);
}

try {
  const existing = await db.query('SELECT id FROM users WHERE username = ?', [username]);
  if (existing.length) {
    console.log(`User "${username}" already exists. Nothing changed.`);
  } else {
    await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, await bcrypt.hash(password, 10)]);
    console.log(`Admin user "${username}" created.`);
  }
} catch (err) {
  console.error('Seed failed:', err.code || err.message);
  process.exitCode = 1;
} finally {
  await db.close();
}
