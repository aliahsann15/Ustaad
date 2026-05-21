import { Router } from 'express';
import { mockLogin, mockSignup, mockForgotPassword } from '../controllers/authController';
import { upload } from '../middleware/upload';

const router = Router();

router.post('/login-mock', upload.single('profileImage'), mockLogin);
router.post('/signup-mock', upload.single('profileImage'), mockSignup);
router.post('/forgot-password-mock', mockForgotPassword);

export default router;
