import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  // In production, configure with service account credentials
  // admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  admin.initializeApp();
}

export interface AuthRequest extends Request {
  user?: admin.auth.DecodedIdToken;
}

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Auth Verification Error:', error);
    return res.status(403).json({ error: 'Unauthorized: Invalid token' });
  }
};
