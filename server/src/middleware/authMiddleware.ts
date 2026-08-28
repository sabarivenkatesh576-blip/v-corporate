import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'vcorp_sih_hackathon_super_secure_jwt_secret_key_2026';
    const decoded = jwt.verify(token, secret) as any;

    const user = await User.findById(decoded.userId).select('-passwordHash');
    if (!user) {
      return res.status(401).json({ error: 'Invalid authentication token. User not found.' });
    }

    req.user = user;
    next();
  } catch (err: any) {
    return res.status(401).json({ error: 'Session expired or invalid token. Please log in again.' });
  }
};

export const authenticateToken = authMiddleware;

export const adminOnlyMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Administrator privilege required.' });
  }
  next();
};
