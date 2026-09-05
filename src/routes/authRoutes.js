import { Router } from 'express';
import { login, getMe, updatePassword } from '../controllers/authController.js';
import { protect } from '../middlewares/auth.js';

const router = Router();

router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/update-password', protect, updatePassword);

export default router;
