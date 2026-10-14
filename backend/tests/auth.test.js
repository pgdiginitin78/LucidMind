import './helpers.js';
import { test, describe, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { app, mockDb, authHeader, tokenFor, config } from './helpers.js';

const require = createRequire(import.meta.url);

describe('health & routing', () => {
  let m;
  afterEach(() => m?.restore());

  test('GET /api/health', async () => {
    const res = await request(app).get('/api/health');
    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { status: 'ok', message: 'LucidMind API is running' });
  });

  test('GET /api/health/db ok / unavailable', async () => {
    m = mockDb(() => []);
    assert.equal((await request(app).get('/api/health/db')).status, 200);
    const { db } = await import('./helpers.js');
    db.ping = async () => {
      throw new Error('boom');
    };
    const res = await request(app).get('/api/health/db');
    assert.equal(res.status, 503);
    assert.equal(JSON.stringify(res.body).includes('boom'), false);
  });

  test('unknown route -> 404', async () => {
    const res = await request(app).get('/api/nope');
    assert.equal(res.status, 404);
    assert.equal(res.body.message, 'Route not found');
  });

  test('security headers set, x-powered-by removed', async () => {
    const res = await request(app).get('/api/health');
    assert.ok(res.headers['x-content-type-options']);
    assert.equal(res.headers['x-powered-by'], undefined);
  });

  test('CORS: allowed origin echoed, unknown origin rejected', async () => {
    const ok = await request(app).get('/api/health').set('Origin', 'https://lucidmind.co.in');
    assert.equal(ok.headers['access-control-allow-origin'], 'https://lucidmind.co.in');
    assert.equal(ok.headers['access-control-allow-credentials'], 'true');
    const bad = await request(app).get('/api/health').set('Origin', 'https://evil.example');
    assert.equal(bad.status, 403);
  });
});

describe('auth', () => {
  let m;
  afterEach(() => m?.restore());

  // PHP password_hash() produces $2y$ hashes; verify the Node side accepts them.
  const phpHash = bcrypt.hashSync('s3cret-pass', 10).replace('$2b$', '$2y$');

  const userRow = { id: 7, username: 'admin', password: phpHash };

  test('login with plaintext fallback succeeds with $2y$ hash, token verifies', async () => {
    m = mockDb(() => [userRow]);
    const res = await request(app).post('/api/auth/login').send({ username: 'admin', password: 's3cret-pass' });
    assert.equal(res.status, 200);
    assert.equal(res.body.message, 'Login successful');
    assert.deepEqual(res.body.user, { id: 7, username: 'admin' });
    const decoded = jwt.verify(res.body.token, config.jwt.secret);
    assert.equal(decoded.id, 7);
    assert.ok(decoded.exp - decoded.iat === 30 * 86400);
  });

  test('login with CryptoJS-encrypted payload (real crypto-js from frontend)', async (t) => {
    let CryptoJS;
    for (const p of ['../../frontend/node_modules/crypto-js', '../../node_modules/crypto-js']) {
      try {
        CryptoJS = require(p);
        break;
      } catch {
        /* try next */
      }
    }
    if (!CryptoJS) return t.skip('crypto-js not installed'); // frontend deps not installed
    const payload = CryptoJS.AES.encrypt(
      JSON.stringify({ username: 'admin', password: 's3cret-pass' }),
      config.payloadSecret,
    ).toString();
    m = mockDb(() => [userRow]);
    const res = await request(app).post('/api/auth/login').send({ payload });
    assert.equal(res.status, 200);
    assert.ok(res.body.token);
  });

  test('wrong password -> 401', async () => {
    m = mockDb(() => [userRow]);
    const res = await request(app).post('/api/auth/login').send({ username: 'admin', password: 'wrong' });
    assert.equal(res.status, 401);
    assert.equal(res.body.message, 'Invalid username or password');
  });

  test('unknown user -> 401', async () => {
    m = mockDb(() => []);
    const res = await request(app).post('/api/auth/login').send({ username: 'ghost', password: 'x' });
    assert.equal(res.status, 401);
  });

  test('missing fields -> 400', async () => {
    m = mockDb(() => []);
    const res = await request(app).post('/api/auth/login').send({ username: 'admin' });
    assert.equal(res.status, 400);
    assert.equal(res.body.message, 'Username and password are required');
  });

  test('malformed JSON -> 400, not 500', async () => {
    const res = await request(app).post('/api/auth/login').set('Content-Type', 'application/json').send('{bad');
    assert.equal(res.status, 400);
  });

  test('SQL-injection-looking username is only ever a bound parameter', async () => {
    m = mockDb(() => []);
    await request(app).post('/api/auth/login').send({ username: "' OR 1=1 --", password: 'x' });
    assert.equal(m.calls[0].sql, 'SELECT id, username, password FROM users WHERE username = ?');
    assert.deepEqual(m.calls[0].params, ["' OR 1=1 --"]);
  });

  test('GET /auth/me requires token, returns user with token', async () => {
    m = mockDb(() => [{ id: 1, username: 'admin' }]);
    assert.equal((await request(app).get('/api/auth/me')).status, 401);
    const res = await request(app).get('/api/auth/me').set(authHeader());
    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { user: { id: 1, username: 'admin' } });
  });

  test('me: user deleted -> 404', async () => {
    m = mockDb(() => []);
    assert.equal((await request(app).get('/api/auth/me').set(authHeader())).status, 404);
  });

  test('invalid / expired / wrong-secret / alg=none tokens -> 401', async () => {
    m = mockDb(() => []);
    const bad = [
      'garbage',
      jwt.sign({ id: 1 }, 'other-secret'),
      tokenFor({ id: 1 }, { expiresIn: -10 }),
      `${Buffer.from('{"alg":"none","typ":"JWT"}').toString('base64url')}.${Buffer.from('{"id":1}').toString('base64url')}.`,
    ];
    for (const t of bad) {
      const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${t}`);
      assert.equal(res.status, 401, t);
      assert.equal(res.body.message, 'Invalid token.');
    }
  });

  test('login endpoint is rate limited', async () => {
    // fresh app with a tight limit
    const { default: rateLimit } = await import('express-rate-limit');
    const express = (await import('express')).default;
    const a = express();
    a.use(rateLimit({ windowMs: 60000, limit: 2, handler: (q, r) => r.status(429).json({}) }));
    a.get('/', (q, r) => r.send('ok'));
    await request(a).get('/');
    await request(a).get('/');
    assert.equal((await request(a).get('/')).status, 429);
  });
});

describe('authorization on admin endpoints (never open)', () => {
  const protectedRoutes = [
    ['post', '/api/blogs'],
    ['put', '/api/blogs/reorder'],
    ['put', '/api/blogs/x'],
    ['delete', '/api/blogs/x'],
    ['patch', '/api/blogs/x/publish'],
    ['post', '/api/podcasts'],
    ['put', '/api/podcasts/reorder'],
    ['put', '/api/podcasts/x'],
    ['delete', '/api/podcasts/x'],
    ['patch', '/api/podcasts/x/publish'],
    ['post', '/api/services'],
    ['put', '/api/services/reorder'],
    ['put', '/api/services/x'],
    ['delete', '/api/services/x'],
    ['post', '/api/upload'],
  ];
  for (const [method, url] of protectedRoutes) {
    test(`${method.toUpperCase()} ${url} without token -> 401`, async () => {
      const m = mockDb(() => []);
      const res = await request(app)[method](url).send({ title: 'x' });
      m.restore();
      assert.equal(res.status, 401);
      assert.equal(res.body.message, 'Access denied. No token provided.');
      assert.equal(m.calls.length, 0, 'no DB access for unauthenticated request');
    });
  }
});
