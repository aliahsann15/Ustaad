import { Router } from 'express';
import { createUser, getUser, updateUser, deleteUser } from '../controllers/userController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/', createUser); // Registration might happen without token initially, or verify token
router.get('/:id', requireAuth, getUser);
router.put('/:id', requireAuth, updateUser);
router.delete('/:id', requireAuth, deleteUser);

export default router;
