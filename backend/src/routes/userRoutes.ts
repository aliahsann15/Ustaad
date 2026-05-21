import { Router } from 'express';
import { createUser, getUser, updateUser, deleteUser, getMyUser } from '../controllers/userController';
import { requireAuth } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.post('/', upload.single('profileImage'), createUser); // Registration might happen without token initially, or verify token
router.get('/me', requireAuth, getMyUser);
router.get('/:id', requireAuth, getUser);
router.put('/:id', requireAuth, upload.single('profileImage'), updateUser);
router.delete('/:id', requireAuth, deleteUser);

export default router;
