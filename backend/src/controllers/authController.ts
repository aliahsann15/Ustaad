import { Request, Response } from 'express';
import User from '../models/User';
import { toPublicUploadPath } from '../middleware/upload';

type UploadedFile = {
  filename: string;
};

interface RequestWithFile extends Request {
  file?: any;
}

const normalizeEmail = (value: unknown) => {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim().toLowerCase();
  return trimmed || undefined;
};

const normalizeProfileImage = (value: unknown) => {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
};

const buildProfileImageValue = (file?: UploadedFile | null, fallback?: unknown) => {
  if (file) {
    return toPublicUploadPath(file.filename);
  }

  const profileImage = normalizeProfileImage(fallback);
  if (!profileImage) return undefined;

  if (profileImage.startsWith('/uploads/')) {
    return profileImage;
  }

  if (profileImage.startsWith('http://') || profileImage.startsWith('https://')) {
    return profileImage;
  }

  return profileImage;
};

export const mockLogin = async (req: RequestWithFile, res: Response) => {
  const phoneNumber = req.body.phoneNumber || req.body.identifier;
  const email = normalizeEmail(req.body.email);
  const profileImage = buildProfileImageValue(req.file, req.body.profileImage || req.body.profileImageUrl || req.body.avatarUrl);

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
        languagePreference: 'ur-Latn',
        email,
        profileImage,
      });
      await user.save();
    } else {
      let hasChanges = false;

      if (email && user.email !== email) {
        user.email = email;
        hasChanges = true;
      }

      if (profileImage && user.profileImage !== profileImage) {
        user.profileImage = profileImage;
        hasChanges = true;
      }

      if (hasChanges) {
        await user.save();
      }
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

export const mockSignup = async (req: RequestWithFile, res: Response) => {
  const fullName = req.body.fullName || req.body.name;
  const phoneNumber = req.body.phoneNumber || req.body.phone;
  const languagePreference = req.body.languagePreference || 'ur-Latn';
  const email = normalizeEmail(req.body.email);
  const profileImage = buildProfileImageValue(req.file, req.body.profileImage || req.body.profileImageUrl || req.body.avatarUrl);

  if (!fullName) {
    return res.status(400).json({ error: 'Full name is required' });
  }

  if (!phoneNumber) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  try {
    let user = await User.findOne({ phoneNumber });

    if (!user) {
      user = new User({
        phoneNumber,
        firebaseUid: `mock_uid_${Math.random().toString(36).substring(7)}`,
        name: fullName,
        languagePreference,
        email,
        profileImage,
      });
      await user.save();
    } else {
      user.name = fullName;
      user.languagePreference = languagePreference;

      if (email) {
        user.email = email;
      }

      if (profileImage) {
        user.profileImage = profileImage;
      }

      await user.save();
    }

    res.status(201).json({
      user,
      token: `mock_jwt_token_${user._id}`,
      message: 'Signed up successfully (MOCK FLOW)',
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const mockForgotPassword = async (req: Request, res: Response) => {
  const identifier = req.body.identifier || req.body.phoneNumber || req.body.email;

  if (!identifier) {
    return res.status(400).json({ error: 'Email or phone number is required' });
  }

  return res.status(200).json({
    message: `A password reset code has been sent to ${identifier}.`,
    identifier,
  });
};
