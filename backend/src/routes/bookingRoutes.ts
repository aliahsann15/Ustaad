import { Router } from 'express';
import { createBooking, getBooking, getMyBookings, updateBookingStatus } from '../controllers/bookingController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/me', requireAuth, getMyBookings);
router.post('/', requireAuth, createBooking);
router.get('/:id', requireAuth, getBooking);
router.patch('/:id/status', requireAuth, updateBookingStatus);

export default router;
