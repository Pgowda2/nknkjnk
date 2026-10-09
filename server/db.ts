import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

let isMongoConnected = false;

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

export function getIsMongoConnected() {
  return isMongoConnected;
}

export async function connectDB() {
  const rawUri = process.env.MONGODB_URI?.trim();
  // Valid MongoDB URIs must strictly start with mongodb:// or mongodb+srv://
  const hasValidScheme =
    Boolean(rawUri) &&
    (rawUri!.startsWith('mongodb://') || rawUri!.startsWith('mongodb+srv://'));

  if (hasValidScheme) {
    try {
      console.log('Attempting connection to MongoDB cluster...');
      await mongoose.connect(rawUri!, {
        serverSelectionTimeoutMS: 4000,
      });
      isMongoConnected = true;
      console.log('✓ Successfully connected to MongoDB via Mongoose');
      return;
    } catch (err) {
      console.log('Notice: Remote MongoDB connection unreachable, using local persistent file store.');
      isMongoConnected = false;
    }
  } else {
    console.log('Using local persistent database store (MONGODB_URI not configured or non-MongoDB string).');
    isMongoConnected = false;
  }

  // Ensure data folder exists for fallback
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Fallback File-backed Store Helper
export interface FallbackDB {
  users: Array<{
    _id: string;
    name: string;
    email: string;
    passwordHash: string;
    role: 'publisher';
    createdAt: string;
    updatedAt: string;
  }>;
  posts: Array<{
    _id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    coverImage: string;
    tags: string[];
    category: string;
    status: 'draft' | 'published';
    author: {
      name: string;
      email: string;
    };
    readingTime: number;
    createdAt: string;
    updatedAt: string;
  }>;
}

export function readFallbackDB(): FallbackDB {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading fallback db.json', e);
  }
  return { users: [], posts: [] };
}

export function writeFallbackDB(data: FallbackDB) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing fallback db.json', e);
  }
}
