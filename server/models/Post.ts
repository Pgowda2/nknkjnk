import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
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
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    content: { type: String, required: true },
    excerpt: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    tags: [{ type: String, trim: true }],
    category: { type: String, required: true, default: 'General', trim: true },
    status: { type: String, enum: ['draft', 'published'], default: 'published', index: true },
    author: {
      name: { type: String, required: true },
      email: { type: String, required: true },
    },
    readingTime: { type: Number, default: 3 },
  },
  { timestamps: true }
);

// Helper to compute reading time
PostSchema.pre('save', function () {
  if (this.content) {
    // strip HTML tags for word count
    const words = this.content.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).length;
    this.readingTime = Math.max(1, Math.ceil(words / 200));
  }
});

export const PostModel = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);
