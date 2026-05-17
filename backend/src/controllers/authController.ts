import { Request, Response } from 'express';
import User from '../models/User';

export const mockLogin = async (req: Request, res: Response) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  try {
    // 1. Check if user exists
    let user = await User.findOne({ phoneNumber });

    // 2. If not, create a new mock user
    if (!user) {
      user = new User({
        phoneNumber,
        firebaseUid: `mock_uid_${Math.random().toString(36).substring(7)}`,
        name: 'New User',
        languagePreference: 'ur-Latn'
      });
      await user.save();
    }

    // 3. Return user data and mock token
    res.status(200).json({
      user,
      token: `mock_jwt_token_${user._id}`,
      message: 'Logged in successfully (MOCK FLOW)'
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
