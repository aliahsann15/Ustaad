import { Request, Response } from 'express';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { toPublicUploadPath } from '../middleware/upload';

const normalizeEmail = (value: unknown) => {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim().toLowerCase();
  return trimmed || undefined;
};

const resolveProfileImage = (file?: Express.Multer.File | null, fallback?: unknown) => {
  if (file) {
    return toPublicUploadPath(file.filename);
  }

  if (typeof fallback !== 'string') return undefined;
  const trimmed = fallback.trim();
  return trimmed || undefined;
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = new User({
      ...req.body,
      email: normalizeEmail(req.body.email),
      profileImage: resolveProfileImage(req.file as Express.Multer.File | undefined, req.body.profileImage || req.body.profileImageUrl || req.body.avatarUrl),
    });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const updates = {
      ...req.body,
      email: normalizeEmail(req.body.email),
      profileImage: resolveProfileImage(req.file as Express.Multer.File | undefined, req.body.profileImage || req.body.profileImageUrl || req.body.avatarUrl),
    };

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getMyUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(400).json({ error: 'User id is required' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
