import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || 'inkwell_super_secret_jwt_key_2026_production_safe';

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: 'publisher';
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

export function requirePublisherAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. No token found in session.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
    if (!decoded || decoded.role !== 'publisher') {
      return res.status(403).json({ error: 'Forbidden. Publisher role required.' });
    }
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Session expired or invalid token. Please log in again.' });
  }
}
