import { Router } from 'express';
import { createServiceRequest, getServiceRequest, updateServiceRequest } from '../controllers/serviceRequestController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/', requireAuth, createServiceRequest);
router.get('/:id', requireAuth, getServiceRequest);
router.put('/:id', requireAuth, updateServiceRequest);

export default router;
