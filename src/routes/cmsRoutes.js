import { Router } from 'express';
import {
  getHomepageCMS,
  updateHomepageCMS,
  getMenuCMS,
  updateMenuCMS,
  getFooterCMS,
  updateFooterCMS,
} from '../controllers/cmsController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = Router();

// Homepage CMS
router.get('/home', getHomepageCMS);
router.put('/home', protect, authorize('admin', 'superadmin'), updateHomepageCMS);

// Menu CMS
router.get('/menu', getMenuCMS);
router.put('/menu', protect, authorize('admin', 'superadmin'), updateMenuCMS);

// Footer CMS
router.get('/footer', getFooterCMS);
router.put('/footer', protect, authorize('admin', 'superadmin'), updateFooterCMS);

export default router;
