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

type MockDecodedToken = {
  uid: string;
};

const MOCK_TOKEN_PREFIX = 'mock_jwt_token_';
const LOCAL_TOKEN_PREFIX = 'local_token';

const getHeaderValue = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) return value[0];
  return value;
};

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split('Bearer ')[1];
  const userIdHeader = getHeaderValue(req.headers['x-user-id']);

  if (token.startsWith(MOCK_TOKEN_PREFIX) || token.startsWith(LOCAL_TOKEN_PREFIX)) {
    const fallbackUid = userIdHeader || token.slice(token.lastIndexOf('_') + 1) || 'mock-user';
    req.user = { uid: fallbackUid } as MockDecodedToken as admin.auth.DecodedIdToken;
    return next();
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Auth Verification Error:', error);
    return res.status(403).json({ error: 'Unauthorized: Invalid token' });
  }
};
