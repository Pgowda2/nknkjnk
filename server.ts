import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { createServer as createViteServer } from 'vite';

import { connectDB } from './server/db.js';
import { seedDatabase } from './server/seed.js';
import authRoutes from './server/routes/auth.js';
import postRoutes from './server/routes/posts.js';
import bookingsRoutes from './server/routes/bookings.js';

const PORT = 3000;

async function startServer() {
  const app = express();

  // Connect to database and seed publisher & posts
  await connectDB();
  await seedDatabase();

  // Security Middleware
  app.use(
    helmet({
      contentSecurityPolicy: false, // Allows Vite inline scripts and font loading
      crossOriginEmbedderPolicy: false,
    })
  );

  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );

  app.use(cookieParser());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Rate limiter on login endpoint
  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 25, // limit each IP to 25 login requests per windowMs
    message: { error: 'Too many login attempts. Please try again in 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api/auth/login', loginLimiter);

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api', postRoutes);
  app.use('/api', bookingsRoutes);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Inkwell Blog Engine',
      time: new Date().toISOString(),
    });
  });

  // Vite Middleware for SPA Frontend
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Express v5 wildcard route
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✓ Blog Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
