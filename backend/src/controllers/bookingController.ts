import { Request, Response } from 'express';
import Booking from '../models/Booking';
import { AuthRequest } from '../middleware/auth';

export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const booking = new Booking({
      ...req.body,
      userId: req.user?.uid || req.body.userId,
    });
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getBooking = async (req: AuthRequest, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('userId')
      .populate('providerId')
      .populate('serviceRequestId');
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.status(200).json(booking);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getMyBookings = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(400).json({ error: 'User id is required' });
    }

    const bookings = await Booking.find({ userId })
      .populate('providerId')
      .populate('serviceRequestId')
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const updateBookingStatus = async (req: AuthRequest, res: Response) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status }, 
      { new: true }
    );
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.status(200).json(booking);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
