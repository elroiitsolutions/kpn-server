import { Router } from 'express';
import {
  getEnquiries,
  createEnquiry,
  updateEnquiryStatus,
  addEnquiryNote,
  deleteEnquiry,
} from '../controllers/enquiryController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = Router();

// Public lead submission
router.post('/', createEnquiry);

// Admin lead management
router.get('/', protect, getEnquiries);
router.patch('/:id/status', protect, updateEnquiryStatus);
router.post('/:id/notes', protect, addEnquiryNote);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteEnquiry);

export default router;
