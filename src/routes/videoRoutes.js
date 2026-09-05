import { Router } from 'express';
import { getVideos, createVideo, updateVideo, deleteVideo } from '../controllers/videoController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = Router();

router.get('/', getVideos);
router.post('/', protect, authorize('admin', 'superadmin'), createVideo);
router.put('/:id', protect, authorize('admin', 'superadmin'), updateVideo);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteVideo);

export default router;
