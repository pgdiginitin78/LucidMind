import { HttpError } from '../utils/http.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const isValidEmail = (v) => EMAIL_RE.test(v);

const fail = (status, message) => {
  throw new HttpError(status, message, { success: false, message });
};

export function validateContact(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    fail(400, 'Invalid JSON payload received.');
  }
  const str = (v) => (typeof v === 'string' ? v.trim() : '');
  const name = str(body.name);
  const email = str(body.email);
  const subject = str(body.subject);
  const message = str(body.message);

  if (/[\r\n]/.test(name) || /[\r\n]/.test(email) || /[\r\n]/.test(subject)) {
    fail(400, 'Invalid characters detected.');
  }
  if (!name || !email || !subject || !message) {
    fail(400, 'Name, email, subject and message are required.');
  }
  if (!isValidEmail(email)) fail(400, 'Please provide a valid email address.');

  return { name, email, subject, message };
}
