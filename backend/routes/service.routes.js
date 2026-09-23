import express from 'express';
import serviceController from '../controllers/service.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', serviceController.getAllServices);
router.post('/', authMiddleware.protect, authMiddleware.adminOnly, serviceController.createService);
router.put('/reorder', authMiddleware.protect, authMiddleware.adminOnly, serviceController.reorderServices);
router.put('/:id', authMiddleware.protect, authMiddleware.adminOnly, serviceController.updateService);
router.delete('/:id', authMiddleware.protect, authMiddleware.adminOnly, serviceController.deleteService);

export default router;
