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

const MAIL_ICON_PNG =
  'iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAB90lEQVR4nO1ZLWwCUQyGJhg0BovBYGYRkEkEBoWYQWBmMBgMJEuTmQnUxAxmZmZiemY50WRmZoiZiZnpmWXJkm28rOJGrr13P9xx2fuS5oV77dfvO4oppZKDg4ODg0MAAKkDSEtA8gBpnWN4rKMTRfwCkD425/cehdGzsBWft1gtZBM8Nvv25oO+ieBx4lmTCvOYf0nLUjLghbh/BqQj6x9TDBh+7qPp8KRizbU/TgCpnLLwMvPa9F/bGtAMXQFSMyXxTebTxje2gZVC/ABI/YTi+8wj9VglMsDPZ4D0KTR4B6RpTPFTrg/iNf1mmi5rA3w3AKRH5U1dAFLdUnid8yUu02dgo8vaAN+3AOlaaXwHSN0Q8V3OkzgMfyuKrkiJgFQBpFNFwCsgjQX+Md9LtYa3EkdXtMTf3BEgvShizgCpyrlV/izlGp6R0it9A5zfBqRbRdgNIB3wKeWY+nZIn90Y4JoaIJ0rAp+UO1NXs+ixOwO+2gkgvSli/WHyJhG4d2+A63uAdB8i3tz3IvJmY4A5GoB0KYg3zxsxOLMz4OOab+KLecw5T8CVvQHmOwSkY3Mm5MnHQFpwBvKGM5A3/pWBoK3EMHPFfzUNAzSJWwlpL5TnbjRIj7gXKvZmrlT03eiWiX37Juy201vjVMz/BxwcHBwcbPEDEHtzEb0VdBIAAAAASUVORK5CYII=';

const fail = (message) => new HttpError(500, message, { success: false, message });

export function formatIstDate(dateInput) {
  const d = dateInput ? new Date(dateInput) : new Date();
  const validDate = isNaN(d.getTime()) ? new Date() : d;
  try {
    const formatted = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(validDate);
    return `${formatted.replace(/\b(am|pm)\b/i, (m) => m.toUpperCase())} (IST)`;
  } catch {
    return `${validDate.toUTCString()} (UTC)`;
  }
}

export function buildHtml({ name, email, phone, company, subject, message, submittedAt }) {
  const n = escapeHtml(name);
  const e = escapeHtml(email);
  const p = phone ? escapeHtml(phone) : '';
  const c = company ? escapeHtml(company) : '';
  const s = escapeHtml(subject);
  const m = escapeHtml(message).replace(/\r?\n/g, '<br />');
  const formattedDate = formatIstDate(submittedAt);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>New Contact Form Submission</title>
<style>
  body, table, td, p, a, li, blockquote {
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
  }
  table, td {
    mso-table-lspace: 0pt;
    mso-table-rspace: 0pt;
  }
  img {
    -ms-interpolation-mode: bicubic;
    border: 0;
    outline: none;
    text-decoration: none;
  }
  body {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    background-color: #f3f4f6;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  }
  @media only screen and (max-width: 620px) {
    .email-container {
      width: 100% !important;
      max-width: 100% !important;
      border-radius: 0 !important;
    }
    .content-cell {
      padding: 24px 18px !important;
    }
    .banner-title {
      font-size: 24px !important;
    }
    .banner-tagline {
      font-size: 8px !important;
      letter-spacing: 1.5px !important;
    }
    .label-col {
      width: 35% !important;
      font-size: 10px !important;
      padding: 10px 14px !important;
    }
    .value-col {
      font-size: 13px !important;
      padding: 10px 14px !important;
    }
  }
</style>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f3f4f6; padding: 36px 12px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" class="email-container" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06); border: 1px solid #e2e8f0; border-collapse: separate;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #040c1a; background: radial-gradient(circle at 95% 15%, rgba(0, 210, 255, 0.45) 0%, rgba(0, 102, 255, 0.25) 35%, rgba(4, 12, 26, 0) 70%), linear-gradient(135deg, #020914 0%, #06152d 55%, #032042 100%); padding: 0; overflow: hidden; border-radius: 15px 15px 0 0;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="padding: 34px 20px 34px 32px; vertical-align: middle;">
                    <div class="banner-title" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 30px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; line-height: 1;">
                      Lucid<span style="color: #2fd3df;">Mind</span>
                    </div>
                    <div class="banner-tagline" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 9px; font-weight: 600; color: #849ebd; letter-spacing: 2.2px; text-transform: uppercase; margin-top: 10px; line-height: 1;">
                      STRATEGY &nbsp;&bull;&nbsp; TECHNOLOGY &nbsp;&bull;&nbsp; HUMAN POTENTIAL
                    </div>
                  </td>
                  <td width="150" align="right" style="vertical-align: top; padding: 0; overflow: hidden;">
                    <svg width="150" height="110" viewBox="0 0 150 110" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block;">
                      <defs>
                        <radialGradient id="lmSphereGlow" cx="130" cy="20" r="120" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stop-color="#00D2FF" stop-opacity="0.85"/>
                          <stop offset="40%" stop-color="#0066FF" stop-opacity="0.45"/>
                          <stop offset="100%" stop-color="#040c1a" stop-opacity="0"/>
                        </radialGradient>
                        <linearGradient id="lmArcGlow" x1="10" y1="110" x2="150" y2="10" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stop-color="#0055ff" stop-opacity="0"/>
                          <stop offset="50%" stop-color="#00e5ff" stop-opacity="0.9"/>
                          <stop offset="100%" stop-color="#38bdf8" stop-opacity="1"/>
                        </linearGradient>
                      </defs>
                      <circle cx="145" cy="15" r="90" fill="url(#lmSphereGlow)"/>
                      <path d="M 20 110 C 60 85, 110 50, 150 10" stroke="url(#lmArcGlow)" stroke-width="4.5" fill="none" stroke-linecap="round"/>
                    </svg>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content Body -->
          <tr>
            <td class="content-cell" style="padding: 32px 32px 28px 32px; background-color: #ffffff;">
              
              <!-- Submission Notice with Icon -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td width="52" style="vertical-align: top; padding-right: 16px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width: 48px; height: 48px; background-color: #ebf5fe; border-radius: 12px;">
                      <tr>
                        <td align="center" style="vertical-align: middle; text-align: center; padding: 0;">
                          <img src="cid:mailIcon" width="24" height="24" alt="✉" style="display: block; width: 24px; height: 24px; max-width: 24px; max-height: 24px; margin: 0 auto; border: 0;" />
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td style="vertical-align: middle;">
                    <h2 style="margin: 0 0 4px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 21px; font-weight: 700; color: #0b1a30; letter-spacing: -0.3px; line-height: 1.25;">
                      New Contact Form Submission
                    </h2>
                    <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13.5px; color: #64748b; line-height: 1.45;">
                      You have received a new message from your website contact form.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Contact Details Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top: 26px; border: 1px solid #e5eaf2; border-radius: 8px; overflow: hidden; background-color: #ffffff; border-collapse: separate;">
                <tr>
                  <td colspan="2" style="background-color: #f1f6fd; padding: 12px 18px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; font-weight: 700; color: #0b1a30; border-bottom: 1px solid #e5eaf2;">
                    Contact Details
                  </td>
                </tr>
                <tr>
                  <td class="label-col" width="30%" style="padding: 13px 18px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.6px; border-bottom: 1px solid #edf2f7; vertical-align: middle;">
                    FULL NAME
                  </td>
                  <td class="value-col" style="padding: 13px 18px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; font-weight: 500; color: #1e293b; border-bottom: 1px solid #edf2f7; vertical-align: middle;">
                    ${n}
                  </td>
                </tr>
                <tr>
                  <td class="label-col" style="padding: 13px 18px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.6px; border-bottom: 1px solid #edf2f7; vertical-align: middle;">
                    EMAIL
                  </td>
                  <td class="value-col" style="padding: 13px 18px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; font-weight: 500; color: #1e293b; border-bottom: 1px solid #edf2f7; vertical-align: middle;">
                    <a href="mailto:${e}" style="color: #1e293b; text-decoration: none;">${e}</a>
                  </td>
                </tr>
                <tr>
                  <td class="label-col" style="padding: 13px 18px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.6px; border-bottom: 1px solid #edf2f7; vertical-align: middle;">
                    PHONE
                  </td>
                  <td class="value-col" style="padding: 13px 18px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; font-weight: 500; color: #1e293b; border-bottom: 1px solid #edf2f7; vertical-align: middle;">
                    ${p || 'Not provided'}
                  </td>
                </tr>
                <tr>
                  <td class="label-col" style="padding: 13px 18px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.6px; vertical-align: middle;">
                    COMPANY
                  </td>
                  <td class="value-col" style="padding: 13px 18px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; font-weight: 500; color: #1e293b; vertical-align: middle;">
                    ${c || 'Not provided'}
                  </td>
                </tr>
              </table>

              <!-- Message Details Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top: 20px; border: 1px solid #e5eaf2; border-radius: 8px; overflow: hidden; background-color: #ffffff; border-collapse: separate;">
                <tr>
                  <td colspan="2" style="background-color: #f1f6fd; padding: 12px 18px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; font-weight: 700; color: #0b1a30; border-bottom: 1px solid #e5eaf2;">
                    Message Details
                  </td>
                </tr>
                <tr>
                  <td class="label-col" width="30%" style="padding: 13px 18px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.6px; border-bottom: 1px solid #edf2f7; vertical-align: middle;">
                    SUBJECT
                  </td>
                  <td class="value-col" style="padding: 13px 18px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; font-weight: 500; color: #1e293b; border-bottom: 1px solid #edf2f7; vertical-align: middle;">
                    ${s}
                  </td>
                </tr>
                <tr>
                  <td class="label-col" style="padding: 13px 18px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.6px; vertical-align: top;">
                    MESSAGE
                  </td>
                  <td class="value-col" style="padding: 13px 18px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; color: #334155; line-height: 1.6; vertical-align: top; word-break: break-word;">
                    ${m}
                  </td>
                </tr>
              </table>

              <!-- Footer Section -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top: 24px; border-top: 1px solid #edf2f7; padding-top: 18px;">
                <tr>
                  <td>
                    <p style="margin: 0 0 4px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #64748b; line-height: 1.4;">
                      This message was submitted from your website contact form.
                    </p>
                    <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #94a3b8; line-height: 1.4;">
                      Received on ${formattedDate}
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
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
          text: `New Contact Submission\n\nFull Name: ${fields.name}\nEmail: ${fields.email}\nPhone: ${fields.phone || 'Not provided'}\nCompany: ${fields.company || 'Not provided'}\nSubject: ${fields.subject}\n\nMessage:\n${fields.message}\n\nThis message was submitted from your website contact form.\nReceived on ${formatIstDate(fields.submittedAt)}`,
          attachments: [
            {
              filename: 'mail-icon.png',
              content: Buffer.from(MAIL_ICON_PNG, 'base64'),
              cid: 'mailIcon',
              contentType: 'image/png',
            },
          ],
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
