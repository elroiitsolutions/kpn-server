import { Router } from 'express';
import { handleFileUpload, handleMultipleFileUpload } from '../controllers/uploadController.js';
import { upload } from '../middlewares/upload.js';
import { protect } from '../middlewares/auth.js';

const router = Router();

router.post('/', protect, upload.single('file'), handleFileUpload);
router.post('/multiple', protect, upload.array('files', 30), handleMultipleFileUpload);

export default router;
