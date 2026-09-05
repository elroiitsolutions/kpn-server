import { Router } from 'express';
import {
  getCelebrations,
  getAdminCelebrations,
  createCelebration,
  updateCelebration,
  deleteCelebration,
} from '../controllers/celebrationController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = Router();

// Public route
router.get('/', getCelebrations);

// Admin routes
router.get('/admin/all', protect, authorize('admin', 'superadmin'), getAdminCelebrations);
router.post('/', protect, authorize('admin', 'superadmin'), createCelebration);
router.put('/:id', protect, authorize('admin', 'superadmin'), updateCelebration);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteCelebration);

export default router;
