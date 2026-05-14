import { Router } from 'express';
import { createProvider, getProvider, getAllProviders, updateProvider } from '../controllers/providerController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/', requireAuth, createProvider);
router.get('/', requireAuth, getAllProviders);
router.get('/:id', requireAuth, getProvider);
router.put('/:id', requireAuth, updateProvider);

export default router;
