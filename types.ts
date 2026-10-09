export interface User {
  id: string;
  name: string;
  email: string;
  role: 'publisher';
}

export interface Post {
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
}

export interface PostListResponse {
  posts: Post[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CategoriesResponse {
  categories: string[];
  tags: string[];
}

// Legacy types for compatibility
export interface Author {
  name: string;
  avatar: string;
  role: string;
  bio?: string;
}

export interface BlogComment {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  createdAt: string;
  likes?: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  author: Author;
  publishedAt: string;
  readTimeMinutes: number;
  likes: number;
  views: number;
  comments: BlogComment[];
  featured?: boolean;
}

export interface SkillItem {
  name: string;
  category: string;
  level?: number;
  [key: string]: any;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  tags?: string[];
  link?: string;
  github?: string;
  image?: string;
  [key: string]: any;
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  description?: string[];
  [key: string]: any;
}

export interface EducationItem {
  degree: string;
  institution: string;
  year?: string;
  [key: string]: any;
}
