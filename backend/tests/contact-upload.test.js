import './helpers.js';
import { test, describe, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import request from 'supertest';
import { app, authHeader, config } from './helpers.js';
import { mailer } from '../src/services/contactService.js';

describe('contact', () => {
  const origSmtp = { ...config.smtp };
  const origMailer = mailer.createTransport;
  afterEach(() => {
    Object.assign(config.smtp, origSmtp);
    mailer.createTransport = origMailer;
  });

  const valid = { name: 'Jane', email: 'jane@example.com', subject: 'Hi', message: 'Hello <b>there</b>\nline2' };
  const configure = () =>
    Object.assign(config.smtp, { user: 'sender@example.com', password: 'abcd efgh', receivers: 'a@x.com, b@x.com, bad, a@x.com' });

  test('sends mail to de-duplicated valid receivers, escapes HTML', async () => {
    configure();
    let sent;
    mailer.createTransport = () => ({ sendMail: async (o) => (sent = o) });
    const res = await request(app).post('/api/contact').send(valid);
    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { success: true, message: 'Message sent successfully.' });
    assert.deepEqual(sent.to, ['a@x.com', 'b@x.com']);
    assert.equal(sent.replyTo.address, 'jane@example.com');
    assert.equal(sent.subject, 'New Contact Enquiry from Jane: Hi');
    assert.ok(sent.html.includes('&lt;b&gt;there&lt;/b&gt;'));
    assert.ok(sent.html.includes('<br />'));
    assert.equal(sent.html.includes('<b>there</b>'), false);
  });

  test('validation errors', async () => {
    configure();
    const cases = [
      [{ ...valid, name: '' }, 'Name, email, subject and message are required.'],
      [{ ...valid, email: 'nope' }, 'Please provide a valid email address.'],
      [{ ...valid, subject: 'a\r\nBcc: x@y.z' }, 'Invalid characters detected.'],
    ];
    for (const [body, message] of cases) {
      const res = await request(app).post('/api/contact').send(body);
      assert.equal(res.status, 400);
      assert.deepEqual(res.body, { success: false, message });
    }
    const arr = await request(app).post('/api/contact').send([1, 2]);
    assert.equal(arr.status, 400);
    const bad = await request(app).post('/api/contact').set('Content-Type', 'application/json').send('{x');
    assert.equal(bad.status, 400);
  });

  test('unconfigured SMTP -> 500 generic', async () => {
    Object.assign(config.smtp, { user: '', password: '', receivers: '' });
    const res = await request(app).post('/api/contact').send(valid);
    assert.equal(res.status, 500);
    assert.deepEqual(res.body, { success: false, message: 'Email service is not configured correctly.' });
  });

  test('transport failure -> 500 without leaking error details', async () => {
    configure();
    mailer.createTransport = () => ({
      sendMail: async () => {
        throw new Error('535 auth failed for sender@example.com pw=abcdefgh');
      },
    });
    const res = await request(app).post('/api/contact').send(valid);
    assert.equal(res.status, 500);
    assert.deepEqual(res.body, { success: false, message: 'Failed to send message. Please try again later.' });
  });
});

describe('upload', () => {
  const png = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    'base64',
  );

  test('valid image is stored and URL returned; file is served back with sandbox CSP', async () => {
    const res = await request(app).post('/api/upload').set(authHeader()).attach('file', png, { filename: 'my pic!.png', contentType: 'image/png' });
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.match(res.body.filename, /^\d+-my_pic_\.png$/);
    assert.equal(res.body.url, `/uploads/${res.body.filename}`);
    assert.ok(fs.existsSync(path.join(config.uploads.dir, res.body.filename)));

    const get = await request(app).get(res.body.url);
    assert.equal(get.status, 200);
    assert.match(get.headers['content-security-policy'], /sandbox/);
  });

  test('no file -> 400', async () => {
    const res = await request(app).post('/api/upload').set(authHeader());
    assert.equal(res.status, 400);
    assert.deepEqual(res.body, { error: 'No file provided' });
  });

  test('disallowed extension / mismatched MIME -> 400, nothing written', async () => {
    const before = fs.readdirSync(config.uploads.dir).length;
    const php = await request(app).post('/api/upload').set(authHeader()).attach('file', Buffer.from('<?php ?>'), { filename: 'x.php', contentType: 'image/png' });
    assert.equal(php.status, 400);
    assert.match(php.body.error, /Unsupported file format/);
    const mismatch = await request(app).post('/api/upload').set(authHeader()).attach('file', Buffer.from('x'), { filename: 'x.png', contentType: 'text/html' });
    assert.equal(mismatch.status, 400);
    assert.equal(fs.readdirSync(config.uploads.dir).length, before);
  });

  test('over max upload limit -> 400', async () => {
    const limitMb = Math.round(config.uploads.maxBytes / (1024 * 1024));
    const big = Buffer.alloc(config.uploads.maxBytes + 10);
    const res = await request(app).post('/api/upload').set(authHeader()).attach('file', big, { filename: 'big.png', contentType: 'image/png' });
    assert.equal(res.status, 400);
    assert.deepEqual(res.body, { error: `File size exceeds ${limitMb}MB limit` });
  });

  test('path traversal in filename is neutralised', async () => {
    const res = await request(app).post('/api/upload').set(authHeader()).attach('file', png, { filename: '../../evil.png', contentType: 'image/png' });
    assert.equal(res.status, 200);
    assert.equal(res.body.filename.includes('/'), false);
    assert.ok(fs.existsSync(path.join(config.uploads.dir, res.body.filename)));
  });
});
