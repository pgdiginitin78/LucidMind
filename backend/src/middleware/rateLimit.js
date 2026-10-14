import rateLimit from 'express-rate-limit';

const limiter = (windowMs, limit, message) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (req, res) => res.status(429).json({ success: false, message }),
  });

export const loginLimiter = limiter(
  15 * 60 * 1000,
  Number(process.env.LOGIN_RATE_LIMIT) || 20,
  'Too many login attempts. Please try again later.',
);

export const contactLimiter = limiter(
  60 * 60 * 1000,
  Number(process.env.CONTACT_RATE_LIMIT) || 20,
  'Too many messages sent. Please try again later.',
);

export const apiLimiter = limiter(
  60 * 1000,
  Number(process.env.API_RATE_LIMIT) || 300,
  'Too many requests. Please slow down.',
);
