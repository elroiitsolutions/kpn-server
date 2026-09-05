import { Router } from 'express';
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../controllers/testimonialController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = Router();

router.get('/', getTestimonials);
router.post('/', protect, authorize('admin', 'superadmin'), createTestimonial);
router.put('/:id', protect, authorize('admin', 'superadmin'), updateTestimonial);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteTestimonial);

export default router;
