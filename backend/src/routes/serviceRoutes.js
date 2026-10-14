import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import * as c from '../controllers/serviceController.js';

const router = Router();
router.get('/', c.list);
router.post('/', authenticate, c.create);
router.put('/reorder', authenticate, c.reorder); // must precede /:id
router.put('/:id', authenticate, c.update);
router.delete('/:id', authenticate, c.remove);
export default router;
