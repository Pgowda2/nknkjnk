import bcrypt from 'bcryptjs';
import { UserModel } from './models/User.js';
import { PostModel } from './models/Post.js';
import { getIsMongoConnected, readFallbackDB, writeFallbackDB } from './db.js';

const SEED_PUBLISHERS = [
  {
    name: 'Aishwarya Gowda S R',
    email: 'aishwaryagowda227@gmail.com',
    password: 'publisher123',
    role: 'publisher' as const,
  },
  {
    name: 'Pavan Gowda B S',
    email: 'pgowda6021@gmail.com',
    password: 'publisher123',
    role: 'publisher' as const,
  },
  {
    name: 'Madhurya Gowda SR',
    email: 'publisher@blog.local',
    password: 'publisher123',
    role: 'publisher' as const,
  },
];

const SEED_PUBLISHER = SEED_PUBLISHERS[0];

const INITIAL_POSTS: any[] = [];

export async function seedDatabase() {
  if (getIsMongoConnected()) {
    try {
      const User = UserModel as any;
      const Post = PostModel as any;

      // Check / Seed Publishers
      for (const pub of SEED_PUBLISHERS) {
        const existingUser = await User.findOne({ email: pub.email });
        if (!existingUser) {
          const passwordHash = await bcrypt.hash(pub.password, 10);
          await User.create({
            name: pub.name,
            email: pub.email,
            passwordHash,
            role: pub.role,
          });
          console.log(`✓ Seeded publisher user in MongoDB: ${pub.email}`);
        }
      }

      // Check / Seed Initial Posts
      const postCount = await Post.countDocuments();
      if (postCount === 0) {
        for (const post of INITIAL_POSTS) {
          await Post.create(post);
        }
        console.log(`✓ Seeded ${INITIAL_POSTS.length} initial published posts into MongoDB`);
      }
      return;
    } catch (err) {
      console.error('Mongo seed error', err);
    }
  }

  // Fallback DB Seeding
  const db = readFallbackDB();
  let modified = false;

  // Check all publishers
  for (const pub of SEED_PUBLISHERS) {
    const existingIndex = db.users.findIndex(u => u.email.toLowerCase() === pub.email.toLowerCase());
    const passwordHash = await bcrypt.hash(pub.password, 10);
    if (existingIndex === -1) {
      db.users.push({
        _id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: pub.name,
        email: pub.email,
        passwordHash,
        role: 'publisher',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      modified = true;
      console.log(`✓ Seeded publisher user in local store: ${pub.email}`);
    } else {
      // Ensure password is set to pub.password hash
      db.users[existingIndex].passwordHash = passwordHash;
      db.users[existingIndex].name = pub.name;
      modified = true;
    }
  }

  // Check posts
  if (INITIAL_POSTS.length > 0 && db.posts.length === 0) {
    db.posts = INITIAL_POSTS.map((p, idx) => ({
      _id: `post_seed_${idx + 1}`,
      ...p,
    }));
    modified = true;
    console.log(`✓ Seeded ${INITIAL_POSTS.length} initial published posts in local store`);
  }

  if (modified) {
    writeFallbackDB(db);
  }
}
