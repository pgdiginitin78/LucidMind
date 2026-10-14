import fs from 'node:fs';
import path from 'node:path';
import multer from 'multer';
import config from '../config/env.js';
import { HttpError } from '../utils/http.js';

const MIME_BY_EXT = {
  jpg: ['image/jpeg'],
  jpeg: ['image/jpeg'],
  png: ['image/png'],
  svg: ['image/svg+xml'],
  webp: ['image/webp'],
  gif: ['image/gif'],
};

const storage = multer.diskStorage({
  destination(req, file, cb) {
    fs.mkdir(config.uploads.dir, { recursive: true }, (err) => cb(err, config.uploads.dir));
  },
  filename(req, file, cb) {
    const clean = path.basename(file.originalname).replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${Date.now()}-${clean}`);
  },
});

export const uploadSingle = multer({
  storage,
  limits: { fileSize: config.uploads.maxBytes, files: 1 },
  fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname).slice(1).toLowerCase();
    const allowed = MIME_BY_EXT[ext];
    if (!allowed || !allowed.includes(file.mimetype)) {
      return cb(
        new HttpError(400, 'Unsupported file format', {
          error: 'Unsupported file format. Only JPG, PNG, SVG, WEBP, and GIF are allowed.',
        }),
      );
    }
    return cb(null, true);
  },
}).single('file');

export function describeUpload(file) {
  if (!file) throw new HttpError(400, 'No file provided', { error: 'No file provided' });
  try {
    const publicUploads = path.resolve(config.backendRoot, '../frontend/public/uploads');
    fs.mkdirSync(publicUploads, { recursive: true });
    fs.copyFileSync(file.path, path.join(publicUploads, file.filename));
  } catch (e) {
    // Non-fatal
  }
  return { success: true, url: `/uploads/${file.filename}`, filename: file.filename };
}
