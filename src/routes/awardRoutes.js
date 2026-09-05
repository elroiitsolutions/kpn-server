import { Router } from 'express';
import { getAwards, createAward, updateAward, deleteAward } from '../controllers/awardController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = Router();

router.get('/', getAwards);
router.post('/', protect, authorize('admin', 'superadmin'), createAward);
router.put('/:id', protect, authorize('admin', 'superadmin'), updateAward);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteAward);

export default router;
