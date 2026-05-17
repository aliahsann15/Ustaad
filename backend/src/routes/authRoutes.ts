import { Router } from 'express';
import { mockLogin } from '../controllers/authController';

const router = Router();

router.post('/login-mock', mockLogin);

export default router;
