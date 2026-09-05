import { Router } from 'express';
import { handleFileUpload } from '../controllers/uploadController.js';
import { upload } from '../middlewares/upload.js';
import { protect } from '../middlewares/auth.js';

const router = Router();

router.post('/', protect, upload.single('file'), handleFileUpload);

export default router;
