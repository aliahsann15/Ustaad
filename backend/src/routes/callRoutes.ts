import { Router } from 'express';
import { createCall, getCall, hangupCallById, promptForAvailability } from '../controllers/callController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/', requireAuth, createCall);
router.get('/:id', requireAuth, getCall);
router.post('/:id/hangup', requireAuth, hangupCallById);
router.post('/:id/prompt', requireAuth, promptForAvailability);

export default router;