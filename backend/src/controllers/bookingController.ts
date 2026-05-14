import { Request, Response } from 'express';
import Booking from '../models/Booking';

export const createBooking = async (req: Request, res: Response) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getBooking = async (req: Request, res: Response) => {
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

export const updateBookingStatus = async (req: Request, res: Response) => {
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
