import { Router } from 'express';
import {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogCategories,
} from '../controllers/blogController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = Router();

router.get('/', getBlogs);
router.get('/categories', getBlogCategories);
router.get('/:slug', getBlogBySlug);

router.post('/', protect, authorize('admin', 'superadmin'), createBlog);
router.put('/:id', protect, authorize('admin', 'superadmin'), updateBlog);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteBlog);

export default router;
