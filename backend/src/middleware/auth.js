import jwt from 'jsonwebtoken';
import config from '../config/env.js';

export function getBearerToken(req) {
  const header = req.headers.authorization;
  if (!header) return null;
  const match = /Bearer\s(\S+)/.exec(header);
  return match ? match[1] : null;
}

/** Requires a valid JWT (HS256, same format the PHP backend issued). Sets req.user. */
export function authenticate(req, res, next) {
  const token = getBearerToken(req);
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  try {
    req.user = jwt.verify(token, config.jwt.secret, { algorithms: ['HS256'] });
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid token.' });
  }
}
