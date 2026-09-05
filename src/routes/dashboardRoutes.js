import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { protect } from '../middlewares/auth.js';

const router = Router();

router.get('/stats', protect, getDashboardStats);

export default router;
