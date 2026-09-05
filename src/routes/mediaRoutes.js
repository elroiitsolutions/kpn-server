import { Router } from 'express';
import { getMedia, createMedia, deleteMedia } from '../controllers/mediaController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = Router();

router.get('/', getMedia);
router.post('/', protect, authorize('admin', 'superadmin'), createMedia);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteMedia);

export default router;
