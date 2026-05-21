import { Router } from 'express';
import { telnyxWebhook } from '../controllers/telnyxWebhookController';

const router = Router();

router.post('/webhook', telnyxWebhook);

export default router;