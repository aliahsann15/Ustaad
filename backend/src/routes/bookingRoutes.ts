import { Router } from 'express';
import { createBooking, getBooking, updateBookingStatus } from '../controllers/bookingController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/', requireAuth, createBooking);
router.get('/:id', requireAuth, getBooking);
router.patch('/:id/status', requireAuth, updateBookingStatus);

export default router;
