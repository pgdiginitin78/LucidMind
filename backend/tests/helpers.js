// Must be imported BEFORE any src module: pins a safe, isolated test environment.
import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs';

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.UPLOAD_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'lucidmind-uploads-'));
process.env.LOGIN_RATE_LIMIT = '1000';
process.env.CONTACT_RATE_LIMIT = '1000';
process.env.API_RATE_LIMIT = '100000';

const { default: db } = await import('../src/config/database.js');
const { createApp } = await import('../src/app.js');
const { default: config } = await import('../src/config/env.js');
const { resetSchemaCache } = await import('../src/services/podcastService.js');
const { default: jwt } = await import('jsonwebtoken');

export { db, config };
export const app = createApp();

export const tokenFor = (payload = { id: 1, username: 'admin' }, opts = {}) =>
  jwt.sign(payload, config.jwt.secret, { algorithm: 'HS256', expiresIn: '1h', ...opts });
export const authHeader = () => ({ Authorization: `Bearer ${tokenFor()}` });

/**
 * Replace the db facade with a scripted fake. `handler(sql, params)` returns the result.
 * Returns the recorded calls.
 */
export function mockDb(handler) {
  const calls = [];
  const orig = { query: db.query, withTransaction: db.withTransaction, ping: db.ping };
  db.query = async (sql, params = []) => {
    calls.push({ sql, params });
    return handler(sql, params);
  };
  db.withTransaction = async (fn) => {
    const conn = {
      execute: async (sql, params = []) => {
        calls.push({ sql, params, tx: true });
        return [{ affectedRows: 1 }];
      },
    };
    calls.push({ sql: 'BEGIN' });
    const r = await fn(conn);
    calls.push({ sql: 'COMMIT' });
    return r;
  };
  db.ping = async () => true;
  resetSchemaCache();
  return {
    calls,
    restore() {
      Object.assign(db, orig);
    },
  };
}
