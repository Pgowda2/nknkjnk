import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User.js';
import { getIsMongoConnected, readFallbackDB } from '../db.js';
import { JWT_SECRET, requirePublisherAuth, AuthRequest } from '../middleware/auth.js';
import { validateBody, loginSchema } from '../middleware/validation.js';

const router = Router();

// POST /api/auth/login
router.post('/login', validateBody(loginSchema), async (req, res: Response) => {
  const { email, password } = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  let user: { id: string; name: string; email: string; passwordHash: string; role: 'publisher' } | null = null;

  if (getIsMongoConnected()) {
    try {
      const doc = await (UserModel as any).findOne({ email: normalizedEmail });
      if (doc) {
        user = {
          id: doc._id.toString(),
          name: doc.name,
          email: doc.email,
          passwordHash: doc.passwordHash,
          role: doc.role,
        };
      }
    } catch (err) {
      console.error('Mongo user query error', err);
    }
  }

  // Fallback to local DB if not in mongo or mongo offline
  if (!user) {
    const fallbackDB = readFallbackDB();
    const found = fallbackDB.users.find(u => u.email.toLowerCase() === normalizedEmail);
    if (found) {
      user = {
        id: found._id,
        name: found.name,
        email: found.email,
        passwordHash: found.passwordHash,
        role: found.role,
      };
    }
  }

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials. Access restricted to verified publishers.' });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid credentials. Incorrect password.' });
  }

  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.json({
    user: payload,
    message: 'Publisher authenticated successfully',
  });
});

// POST /api/auth/logout
router.post('/logout', (req, res: Response) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  return res.json({ message: 'Logged out successfully' });
});

// GET /api/auth/me
router.get('/me', requirePublisherAuth, (req: AuthRequest, res: Response) => {
  return res.json({ user: req.user });
});

export default router;
