import multer from 'multer';
import config from '../config/env.js';
import logger from '../utils/logger.js';

export function notFound(req, res) {
  res.status(404).json({ message: 'Route not found' });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  // Upload errors keep the PHP `{ error }` shape
  if (err instanceof multer.MulterError) {
    const msg =
      err.code === 'LIMIT_FILE_SIZE' ? 'File size exceeds 10MB limit' : 'Failed to process upload';
    return res.status(400).json({ error: msg });
  }
  if (err?.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, message: 'Invalid JSON payload received.' });
  }
  if (err?.type === 'entity.too.large') {
    return res.status(413).json({ message: 'Payload too large' });
  }
  if (err?.message === 'CORS_NOT_ALLOWED') {
    return res.status(403).json({ message: 'Origin not allowed' });
  }

  const status = err.status || 500;
  if (status >= 500) logger.error(err.stack || err.message);

  if (err.body) return res.status(status).json(err.body);
  const message = status >= 500 && config.isProduction ? 'Internal server error' : err.message;
  return res.status(status).json({ message: status >= 500 ? 'Internal server error' : message });
}
