import nodemailer from 'nodemailer';
import config from '../config/env.js';
import logger from '../utils/logger.js';
import { HttpError } from '../utils/http.js';
import { isValidEmail } from '../validators/contact.js';

const escapeHtml = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const fail = (message) => new HttpError(500, message, { success: false, message });

export function buildHtml({ name, email, subject, message }) {
  const n = escapeHtml(name);
  const e = escapeHtml(email);
  const s = escapeHtml(subject);
  const m = escapeHtml(message).replace(/\r?\n/g, '<br />');
  return `<!DOCTYPE html>
<html>
<head>
<meta charset='UTF-8'>
<title>New Contact Form Submission</title>
<style>
body{font-family:Arial,Helvetica,sans-serif;background-color:#f4f7f6;margin:0;padding:20px}
.container{max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,.08)}
.header{background:#000;padding:25px;text-align:center}
.header img{max-width:200px;max-height:120px;height:auto}
.content{padding:30px;color:#333}
.content h2{margin-top:0;color:#1a1a1a;font-size:20px;margin-bottom:25px;border-bottom:1px solid #eee;padding-bottom:15px}
.field{margin-bottom:20px}
.field-label{font-size:12px;text-transform:uppercase;color:#888;letter-spacing:1px;margin-bottom:6px}
.field-value{font-size:16px;background:#f9f9f9;padding:12px 15px;border-left:3px solid #000;border-radius:4px;word-break:break-word}
.message-box{background:#f9f9f9;padding:15px;border-radius:4px;border:1px solid #eee;font-size:15px;line-height:1.6;word-break:break-word}
.footer{background:#f9f9f9;padding:15px;text-align:center;font-size:12px;color:#aaa;border-top:1px solid #eee}
a{color:#000}
</style>
</head>
<body>
<div class='container'>
<div class='header'><img src='https://lucidmind.co.in/assets/logo/LucidMind%20logo%202.svg' alt='LucidMind Logo'></div>
<div class='content'>
<h2>New Contact Submission</h2>
<div class='field'><div class='field-label'>Name</div><div class='field-value'>${n}</div></div>
<div class='field'><div class='field-label'>Email</div><div class='field-value'><a href='mailto:${e}'>${e}</a></div></div>
<div class='field'><div class='field-label'>Subject</div><div class='field-value'>${s}</div></div>
<div class='field'><div class='field-label'>Message</div><div class='message-box'>${m}</div></div>
</div>
<div class='footer'>This email was automatically generated from the LucidMind Contact Form.</div>
</div>
</body>
</html>`;
}

export function createTransport() {
  const { host, port, encryption, user, password } = config.smtp;
  // Mirrors PHP: TLS/587 => STARTTLS on 587, otherwise implicit SSL on 465
  const starttls = encryption === 'tls' || port === 587;
  return nodemailer.createTransport({
    host,
    port: starttls ? 587 : 465,
    secure: !starttls,
    requireTLS: starttls,
    auth: { user, pass: password.replace(/ /g, '') },
    tls: { rejectUnauthorized: false },
  });
}

/** Overridable in tests. */
export const mailer = { createTransport };

export async function sendContactEmail(fields) {
  const { user, password, receivers } = config.smtp;

  if (!user || !password || !receivers) {
    logger.error(
      `SMTP configuration error. SMTP_USER=${user ? 'SET' : 'MISSING'} | SMTP_PASSWORD=${
        password ? 'SET' : 'MISSING'
      } | RECEIVER_EMAIL=${receivers ? 'SET' : 'MISSING'}`,
    );
    throw fail('Email service is not configured correctly.');
  }

  const validReceivers = [
    ...new Set(receivers.split(',').map((r) => r.trim()).filter((r) => r && isValidEmail(r))),
  ];
  if (!validReceivers.length) {
    logger.error('SMTP error: no valid receiver emails in RECEIVER_EMAIL');
    throw fail('No valid recipient email configured.');
  }

  try {
    const transport = mailer.createTransport();
    const results = await Promise.allSettled(
      validReceivers.map((to) =>
        transport.sendMail({
          from: { name: 'LucidMind Website', address: user },
          to,
          replyTo: { name: fields.name, address: fields.email },
          subject: `New Contact Enquiry from ${fields.name}: ${fields.subject}`,
          html: buildHtml(fields),
          text: `New Contact Submission\n\nName: ${fields.name}\nEmail: ${fields.email}\nSubject: ${fields.subject}\n\nMessage:\n${fields.message}`,
        })
      )
    );
    const anySuccess = results.some((r) => r.status === 'fulfilled');
    if (!anySuccess) {
      const firstErr = results.find((r) => r.status === 'rejected')?.reason;
      throw firstErr || new Error('All recipients failed to receive email');
    }
  } catch (err) {
    logger.error('Contact mail send failed:', err.message);
    throw fail('Failed to send message. Please try again later.');
  }
}
