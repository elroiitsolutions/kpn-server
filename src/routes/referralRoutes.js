import { Router } from 'express';
import {
  getReferrals,
  createReferral,
  updateReferral,
  deleteReferral,
} from '../controllers/referralController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = Router();

// Public referral submission
router.post('/', createReferral);

// Admin referral management
router.get('/', protect, getReferrals);
router.patch('/:id', protect, updateReferral);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteReferral);

export default router;
