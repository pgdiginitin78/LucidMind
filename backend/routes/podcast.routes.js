import express from 'express';
import podcastController from '../controllers/podcast.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', podcastController.getAllPodcasts);
router.get('/:id', podcastController.getPodcastById);

router.post('/', authMiddleware.protect, authMiddleware.adminOnly, podcastController.createPodcast);
router.put('/:id', authMiddleware.protect, authMiddleware.adminOnly, podcastController.updatePodcast);
router.delete('/:id', authMiddleware.protect, authMiddleware.adminOnly, podcastController.deletePodcast);
router.patch('/:id/publish', authMiddleware.protect, authMiddleware.adminOnly, podcastController.publishPodcast);

export default router;
