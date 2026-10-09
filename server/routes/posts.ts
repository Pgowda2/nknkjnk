import { Router, Request, Response } from 'express';
import { PostModel } from '../models/Post.js';
import { getIsMongoConnected, readFallbackDB, writeFallbackDB } from '../db.js';
import { requirePublisherAuth, AuthRequest } from '../middleware/auth.js';
import { validateBody, postSchema } from '../middleware/validation.js';

const router = Router();
const Post = PostModel as any;

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function calculateReadingTime(content: string): number {
  const words = content.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

// -------------------------------------------------------------
// PUBLIC ROUTES
// -------------------------------------------------------------

// GET /api/posts - Public paginated published posts
router.get('/posts', async (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
  const limit = Math.max(1, Math.min(50, parseInt(req.query.limit as string, 10) || 6));
  const search = ((req.query.search as string) || '').trim();
  const category = ((req.query.category as string) || '').trim();
  const tag = ((req.query.tag as string) || '').trim();

  if (getIsMongoConnected()) {
    try {
      const query: Record<string, unknown> = { status: 'published' };

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { excerpt: { $regex: search, $options: 'i' } },
        ];
      }

      if (category && category !== 'All') {
        query.category = { $regex: new RegExp(`^${category}$`, 'i') };
      }

      if (tag) {
        query.tags = { $in: [tag] };
      }

      const total = await Post.countDocuments(query);
      const posts = await Post.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

      return res.json({
        posts,
        total,
        page,
        totalPages: Math.ceil(total / limit) || 1,
      });
    } catch (err) {
      console.error('Mongo query error in GET /api/posts', err);
    }
  }

  // Fallback to local DB store
  const db = readFallbackDB();
  let filtered = db.posts.filter(p => p.status === 'published');

  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(p => p.title.toLowerCase().includes(s) || (p.excerpt && p.excerpt.toLowerCase().includes(s)));
  }

  if (category && category !== 'All') {
    filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (tag) {
    filtered = filtered.filter(p => p.tags && p.tags.map(t => t.toLowerCase()).includes(tag.toLowerCase()));
  }

  // Sort descending by date
  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const total = filtered.length;
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  return res.json({
    posts: paginated,
    total,
    page,
    totalPages: Math.ceil(total / limit) || 1,
  });
});

// GET /api/categories - Public categories and tags
router.get('/categories', async (req: Request, res: Response) => {
  if (getIsMongoConnected()) {
    try {
      const categories = await Post.distinct('category', { status: 'published' });
      const allPosts = await Post.find({ status: 'published' }, 'tags').lean();
      const tagSet = new Set<string>();
      allPosts.forEach((p: any) => p.tags?.forEach((t: any) => tagSet.add(t)));

      return res.json({
        categories: categories.filter(Boolean),
        tags: Array.from(tagSet),
      });
    } catch (err) {
      console.error('Mongo categories query error', err);
    }
  }

  const db = readFallbackDB();
  const published = db.posts.filter(p => p.status === 'published');
  const catSet = new Set<string>();
  const tagSet = new Set<string>();

  published.forEach(p => {
    if (p.category) catSet.add(p.category);
    p.tags?.forEach(t => tagSet.add(t));
  });

  return res.json({
    categories: Array.from(catSet),
    tags: Array.from(tagSet),
  });
});

// GET /api/posts/:slug - Public single post by slug (published only)
router.get('/posts/:slug', async (req: Request, res: Response) => {
  const { slug } = req.params;

  if (getIsMongoConnected()) {
    try {
      const post = await Post.findOne({ slug, status: 'published' }).lean();
      if (!post) {
        return res.status(404).json({ error: 'Post not found or unpublished' });
      }
      return res.json({ post });
    } catch (err) {
      console.error('Mongo post detail error', err);
    }
  }

  const db = readFallbackDB();
  const post = db.posts.find(p => p.slug === slug && p.status === 'published');
  if (!post) {
    return res.status(404).json({ error: 'Post not found or unpublished' });
  }

  return res.json({ post });
});

// -------------------------------------------------------------
// PROTECTED PUBLISHER ROUTES
// -------------------------------------------------------------

// GET /api/publisher/posts - All posts for publisher (drafts + published)
router.get('/publisher/posts', requirePublisherAuth, async (req: AuthRequest, res: Response) => {
  if (getIsMongoConnected()) {
    try {
      const posts = await Post.find().sort({ createdAt: -1 }).lean();
      return res.json({ posts });
    } catch (err) {
      console.error('Mongo publisher posts error', err);
    }
  }

  const db = readFallbackDB();
  const posts = [...db.posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return res.json({ posts });
});

// POST /api/posts - Create new post
router.post('/posts', requirePublisherAuth, validateBody(postSchema), async (req: AuthRequest, res: Response) => {
  const { title, content, excerpt, coverImage, tags, category, status } = req.body;
  let baseSlug = req.body.slug ? slugify(req.body.slug) : slugify(title);
  if (!baseSlug) baseSlug = `post-${Date.now()}`;

  const readingTime = calculateReadingTime(content);
  const author = {
    name: req.user?.name || 'Madhurya Gowda SR',
    email: req.user?.email || 'publisher@blog.local',
  };

  if (getIsMongoConnected()) {
    try {
      // Ensure unique slug
      let uniqueSlug = baseSlug;
      let counter = 1;
      while (await Post.findOne({ slug: uniqueSlug })) {
        uniqueSlug = `${baseSlug}-${counter++}`;
      }

      const newPost = await Post.create({
        title,
        slug: uniqueSlug,
        content,
        excerpt: excerpt || content.replace(/<[^>]*>/g, '').slice(0, 160) + '...',
        coverImage: coverImage || '',
        tags: tags || [],
        category: category || 'General',
        status: status || 'published',
        author,
        readingTime,
      });

      return res.status(201).json({ post: newPost, message: 'Post created successfully' });
    } catch (err) {
      console.error('Mongo post create error', err);
      return res.status(500).json({ error: 'Failed to save post to database' });
    }
  }

  // Fallback DB
  const db = readFallbackDB();
  let uniqueSlug = baseSlug;
  let counter = 1;
  while (db.posts.some(p => p.slug === uniqueSlug)) {
    uniqueSlug = `${baseSlug}-${counter++}`;
  }

  const newPost = {
    _id: `post_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title,
    slug: uniqueSlug,
    content,
    excerpt: excerpt || content.replace(/<[^>]*>/g, '').slice(0, 160) + '...',
    coverImage: coverImage || '',
    tags: tags || [],
    category: category || 'General',
    status: status || 'published',
    author,
    readingTime,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.posts.unshift(newPost);
  writeFallbackDB(db);

  return res.status(201).json({ post: newPost, message: 'Post created successfully' });
});

// PUT /api/posts/:id - Update post
router.put('/posts/:id', requirePublisherAuth, validateBody(postSchema), async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { title, slug, content, excerpt, coverImage, tags, category, status } = req.body;
  const readingTime = calculateReadingTime(content);

  if (getIsMongoConnected()) {
    try {
      const updateData: Record<string, unknown> = {
        title,
        content,
        excerpt: excerpt || content.replace(/<[^>]*>/g, '').slice(0, 160) + '...',
        coverImage: coverImage || '',
        tags: tags || [],
        category: category || 'General',
        status: status || 'published',
        readingTime,
      };

      if (slug) {
        updateData.slug = slugify(slug);
      }

      const updated = await Post.findByIdAndUpdate(id, updateData, { new: true });
      if (!updated) {
        return res.status(404).json({ error: 'Post not found' });
      }
      return res.json({ post: updated, message: 'Post updated successfully' });
    } catch (err) {
      console.error('Mongo post update error', err);
      return res.status(500).json({ error: 'Failed to update post' });
    }
  }

  // Fallback DB
  const db = readFallbackDB();
  const index = db.posts.findIndex(p => p._id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Post not found' });
  }

  const existing = db.posts[index];
  const updatedPost = {
    ...existing,
    title,
    slug: slug ? slugify(slug) : existing.slug,
    content,
    excerpt: excerpt || content.replace(/<[^>]*>/g, '').slice(0, 160) + '...',
    coverImage: coverImage !== undefined ? coverImage : existing.coverImage,
    tags: tags || existing.tags,
    category: category || existing.category,
    status: status || existing.status,
    readingTime,
    updatedAt: new Date().toISOString(),
  };

  db.posts[index] = updatedPost;
  writeFallbackDB(db);

  return res.json({ post: updatedPost, message: 'Post updated successfully' });
});

// DELETE /api/posts/:id - Delete post
router.delete('/posts/:id', requirePublisherAuth, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  if (getIsMongoConnected()) {
    try {
      const deleted = await Post.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Post not found' });
      }
      return res.json({ message: 'Post deleted successfully', id });
    } catch (err) {
      console.error('Mongo post delete error', err);
      return res.status(500).json({ error: 'Failed to delete post' });
    }
  }

  // Fallback DB
  const db = readFallbackDB();
  const initialLen = db.posts.length;
  db.posts = db.posts.filter(p => p._id !== id);

  if (db.posts.length === initialLen) {
    return res.status(404).json({ error: 'Post not found' });
  }

  writeFallbackDB(db);
  return res.json({ message: 'Post deleted successfully', id });
});

export default router;
