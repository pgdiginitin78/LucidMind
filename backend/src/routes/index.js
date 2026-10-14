import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { contactLimiter } from '../middleware/rateLimit.js';
import { uploadSingle } from '../services/uploadService.js';
import * as contact from '../controllers/contactController.js';
import * as uploads from '../controllers/uploadController.js';
import db from '../config/database.js';
import { asyncHandler } from '../utils/http.js';
import authRoutes from './authRoutes.js';
import blogRoutes from './blogRoutes.js';
import podcastRoutes from './podcastRoutes.js';
import serviceRoutes from './serviceRoutes.js';

const router = Router();

router.get('/health', (req, res) => res.json({ status: 'ok', message: 'LucidMind API is running' }));
router.get(
  '/health/db',
  asyncHandler(async (req, res) => {
    try {
      await db.ping();
      res.json({ status: 'ok', database: 'connected' });
    } catch {
      res.status(503).json({ status: 'error', database: 'unavailable' });
    }
  }),
);

router.use('/auth', authRoutes);
router.use('/blogs', blogRoutes);
router.use('/podcasts', podcastRoutes);
router.use('/services', serviceRoutes);
router.post('/contact', contactLimiter, contact.send);
// The PHP upload endpoint was unauthenticated; it now requires the admin JWT (frontend sends it).
router.post('/upload', authenticate, uploadSingle, uploads.upload);

export default router;
