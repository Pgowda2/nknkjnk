import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Valid email address is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const postSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(200, 'Title too long'),
  slug: z.string().min(2).max(200).optional(),
  content: z.string().min(5, 'Post content must be at least 5 characters'),
  excerpt: z.string().max(500, 'Excerpt must be under 500 characters').optional().default(''),
  coverImage: z.string().optional().default(''),
  tags: z.array(z.string()).optional().default([]),
  category: z.string().min(1, 'Category is required').default('General'),
  status: z.enum(['draft', 'published']).default('published'),
});

export function validateBody(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const issues = (err as ZodError).issues.map(e => e.message);
        return res.status(400).json({ error: issues.join(', ') });
      }
      return res.status(400).json({ error: 'Invalid request payload' });
    }
  };
}
