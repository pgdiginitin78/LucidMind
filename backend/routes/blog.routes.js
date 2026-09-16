import express from 'express';
import blogController from '../controllers/blog.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', blogController.getAllBlogs);
router.get('/:slug', blogController.getBlogBySlug);

router.post('/', authMiddleware.protect, authMiddleware.adminOnly, blogController.createBlog);
router.put('/:id', authMiddleware.protect, authMiddleware.adminOnly, blogController.updateBlog);
router.delete('/:id', authMiddleware.protect, authMiddleware.adminOnly, blogController.deleteBlog);
router.patch('/:id/publish', authMiddleware.protect, authMiddleware.adminOnly, blogController.publishBlog);

export default router;
