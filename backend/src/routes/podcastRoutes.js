import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import * as c from '../controllers/podcastController.js';

const router = Router();
router.get('/', c.list);
router.post('/', authenticate, c.create);
router.put('/reorder', authenticate, c.reorder); // must precede /:id
router.get('/:id', c.get);
router.put('/:id', authenticate, c.update);
router.delete('/:id', authenticate, c.remove);
router.patch('/:id/publish', authenticate, c.publish);
export default router;
