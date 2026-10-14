import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { loginLimiter } from '../middleware/rateLimit.js';
import * as auth from '../controllers/authController.js';

const router = Router();
router.post('/login', loginLimiter, auth.login);
router.get('/me', authenticate, auth.me);
export default router;
