import { Request, Response } from 'express';
import User from '../models/User';
import { toPublicUploadPath } from '../middleware/upload';
import { getPakistaniPhoneLookupCandidates, normalizePakistaniPhoneNumber } from '../utils/phone';

// Use plain Request and cast `req.file` where needed to avoid conflicting global typedefs

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

const buildProfileImageValue = (file?: Express.Multer.File | null, fallback?: unknown) => {
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

export const mockLogin = async (req: Request, res: Response) => {
  const phoneNumber = req.body.phoneNumber || req.body.identifier;
  const email = normalizeEmail(req.body.email);
  const profileImage = buildProfileImageValue((req as any).file as Express.Multer.File | undefined, req.body.profileImage || req.body.profileImageUrl || req.body.avatarUrl);
  const normalizedPhoneNumber = normalizePakistaniPhoneNumber(phoneNumber);
  const lookupCandidates = getPakistaniPhoneLookupCandidates(phoneNumber);

  if (!phoneNumber) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  if (!normalizedPhoneNumber) {
    return res.status(400).json({ error: 'Enter a valid Pakistani mobile number' });
  }

  try {
    let user = await User.findOne({ phoneNumber: { $in: lookupCandidates } });

    if (!user) {
      return res.status(401).json({ error: 'Account not found for this phone number' });
    }

    if (user.phoneNumber !== normalizedPhoneNumber) {
      const existingCanonicalUser = await User.findOne({ phoneNumber: normalizedPhoneNumber, _id: { $ne: user._id } });

      if (existingCanonicalUser) {
        return res.status(409).json({ error: 'Phone number already belongs to another account' });
      }

      user.phoneNumber = normalizedPhoneNumber;
    }

    let hasChanges = false;

    if (email && user.email !== email) {
      user.email = email;
      hasChanges = true;
    }

    if (profileImage && user.profileImage !== profileImage) {
      user.profileImage = profileImage;
      hasChanges = true;
    }

    if (user.isModified('phoneNumber') || hasChanges) {
      await user.save();
    }

    res.status(200).json({
      user,
      token: `mock_jwt_token_${user._id}`,
      message: 'Logged in successfully (MOCK FLOW)'
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const mockSignup = async (req: Request, res: Response) => {
  const fullName = req.body.fullName || req.body.name;
  const phoneNumber = req.body.phoneNumber || req.body.phone;
  const languagePreference = req.body.languagePreference || 'ur-Latn';
  const email = normalizeEmail(req.body.email);
  const profileImage = buildProfileImageValue((req as any).file as Express.Multer.File | undefined, req.body.profileImage || req.body.profileImageUrl || req.body.avatarUrl);
  const normalizedPhoneNumber = normalizePakistaniPhoneNumber(phoneNumber);
  const lookupCandidates = getPakistaniPhoneLookupCandidates(phoneNumber);

  if (!fullName) {
    return res.status(400).json({ error: 'Full name is required' });
  }

  if (!phoneNumber) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  if (!normalizedPhoneNumber) {
    return res.status(400).json({ error: 'Enter a valid Pakistani mobile number' });
  }

  try {
    let user = await User.findOne({ phoneNumber: { $in: lookupCandidates } });

    if (!user) {
      user = new User({
        phoneNumber: normalizedPhoneNumber,
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

      if (user.phoneNumber !== normalizedPhoneNumber) {
        const existingCanonicalUser = await User.findOne({ phoneNumber: normalizedPhoneNumber, _id: { $ne: user._id } });

        if (existingCanonicalUser) {
          return res.status(409).json({ error: 'Phone number already belongs to another account' });
        }

        user.phoneNumber = normalizedPhoneNumber;
      }

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
