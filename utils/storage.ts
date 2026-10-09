import { BlogPost, BlogComment } from '../types';
import { INITIAL_BLOGS } from '../data/initialBlogs';

const STORAGE_KEY = 'inkwell_clean_blogs_v2';
const BOOKMARKS_KEY = 'inkwell_bookmarks_v2';
const CATEGORIES_KEY = 'inkwell_custom_categories_v2';

export const DEFAULT_CATEGORIES: string[] = [
  'Stories',
  'Essays',
  'Life & Reflections',
  'Thoughts & Perspectives',
  'Culture & Art',
  'Travel & Memories',
  'Personal',
  'General',
];

export function getStoredCategories(): string[] {
  try {
    const raw = localStorage.getItem(CATEGORIES_KEY);
    if (!raw) return DEFAULT_CATEGORIES;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_CATEGORIES;
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

export function saveCategories(categories: string[]): void {
  try {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  } catch (err) {
    console.error('Error saving categories:', err);
  }
}

export function addCustomCategory(newCategory: string): string[] {
  const trimmed = newCategory.trim();
  if (!trimmed) return getStoredCategories();
  const current = getStoredCategories();
  const exists = current.some((c) => c.toLowerCase() === trimmed.toLowerCase());
  if (exists) return current;
  const updated = [...current, trimmed];
  saveCategories(updated);
  return updated;
}

export function removeCustomCategory(categoryToRemove: string): string[] {
  const current = getStoredCategories();
  const updated = current.filter((c) => c.toLowerCase() !== categoryToRemove.toLowerCase());
  const finalCategories = updated.length > 0 ? updated : DEFAULT_CATEGORIES;
  saveCategories(finalCategories);
  return finalCategories;
}

export function getStoredBlogs(): BlogPost[] {
  try {
    // Clear out old default blogs if v1 key was previously saved
    if (localStorage.getItem('inkwell_clean_blogs_v1')) {
      localStorage.removeItem('inkwell_clean_blogs_v1');
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      // Initialize with empty blogs array
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_BLOGS));
      return INITIAL_BLOGS;
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      return [];
    }
    return parsed;
  } catch (err) {
    console.error('Error reading blogs from localStorage:', err);
    return [];
  }
}

export function saveAllBlogs(blogs: BlogPost[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(blogs));
  } catch (err) {
    console.error('Error saving blogs to localStorage:', err);
  }
}

export function saveNewBlog(blog: BlogPost): BlogPost[] {
  const current = getStoredBlogs();
  const updated = [blog, ...current];
  saveAllBlogs(updated);
  return updated;
}

export function updateExistingBlog(updatedBlog: BlogPost): BlogPost[] {
  const current = getStoredBlogs();
  const updated = current.map((b) => (b.id === updatedBlog.id ? updatedBlog : b));
  saveAllBlogs(updated);
  return updated;
}

export function deleteBlogById(id: string): BlogPost[] {
  const current = getStoredBlogs();
  const updated = current.filter((b) => b.id !== id);
  saveAllBlogs(updated);
  return updated;
}

export function toggleLikeBlog(id: string): BlogPost[] {
  const current = getStoredBlogs();
  const updated = current.map((b) => {
    if (b.id === id) {
      return { ...b, likes: b.likes + 1 };
    }
    return b;
  });
  saveAllBlogs(updated);
  return updated;
}

export function incrementViewBlog(id: string): BlogPost[] {
  const current = getStoredBlogs();
  const updated = current.map((b) => {
    if (b.id === id) {
      return { ...b, views: (b.views || 0) + 1 };
    }
    return b;
  });
  saveAllBlogs(updated);
  return updated;
}

export function addCommentToBlog(blogId: string, comment: BlogComment): BlogPost[] {
  const current = getStoredBlogs();
  const updated = current.map((b) => {
    if (b.id === blogId) {
      return { ...b, comments: [comment, ...(b.comments || [])] };
    }
    return b;
  });
  saveAllBlogs(updated);
  return updated;
}

export function getBookmarks(): string[] {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleBookmarkId(id: string): string[] {
  const current = getBookmarks();
  let next: string[];
  if (current.includes(id)) {
    next = current.filter((item) => item !== id);
  } else {
    next = [...current, id];
  }
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next));
  return next;
}

export function clearAllBlogsData(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  } catch (err) {
    console.error('Error clearing blogs:', err);
  }
}

export function estimateReadingTime(content: string): number {
  if (!content) return 1;
  const words = content.trim().split(/\s+/).length;
  const wordsPerMinute = 200;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

/**
 * Parses uploaded .md or .txt file into clean title, subtitle, tags, and content
 */
export async function parseUploadedFile(file: File): Promise<{
  title: string;
  subtitle: string;
  category?: string;
  tags: string[];
  content: string;
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = (e.target?.result as string) || '';
      
      let title = file.name.replace(/\.(md|markdown|txt)$/i, '').replace(/[-_]/g, ' ');
      // Capitalize first letter of each word
      title = title.replace(/\b\w/g, (c) => c.toUpperCase());
      
      let subtitle = '';
      let category: string | undefined = undefined;
      let tags: string[] = [];
      let content = text;

      // Check for Markdown frontmatter (--- ... ---)
      if (text.startsWith('---')) {
        const parts = text.split('---');
        if (parts.length >= 3) {
          const frontmatter = parts[1];
          content = parts.slice(2).join('---').trim();

          const titleMatch = frontmatter.match(/title:\s*["']?([^"'\n\r]+)["']?/i);
          if (titleMatch) title = titleMatch[1].trim();

          const subtitleMatch = frontmatter.match(/(subtitle|description):\s*["']?([^"'\n\r]+)["']?/i);
          if (subtitleMatch) subtitle = subtitleMatch[1].trim();

          const categoryMatch = frontmatter.match(/category:\s*["']?([^"'\n\r]+)["']?/i);
          if (categoryMatch) category = categoryMatch[1].trim();

          const tagsMatch = frontmatter.match(/tags:\s*\[?([^\]\n\r]+)\]?/i);
          if (tagsMatch) {
            tags = tagsMatch[1]
              .split(',')
              .map((t) => t.replace(/["']/g, '').trim())
              .filter(Boolean);
          }
        }
      } else {
        // Look for initial # Title in markdown
        const lines = text.split('\n');
        for (let i = 0; i < Math.min(lines.length, 5); i++) {
          const line = lines[i].trim();
          if (line.startsWith('# ')) {
            title = line.replace(/^#\s+/, '').trim();
            // Optional subtitle from next line
            if (lines[i + 1] && !lines[i + 1].startsWith('#')) {
              subtitle = lines[i + 1].trim();
            }
            break;
          }
        }
      }

      if (!subtitle && content) {
        // Generate snippet as subtitle
        const cleaned = content.replace(/[#*`_\[\]()]/g, '').trim();
        subtitle = cleaned.slice(0, 130) + (cleaned.length > 130 ? '...' : '');
      }

      resolve({ title, subtitle, category, tags, content });
    };
    reader.onerror = (err) => reject(err);
    reader.readAsText(file);
  });
}

/**
 * Downloads a single blog post as standard Markdown with frontmatter
 */
export function exportBlogToMarkdown(blog: BlogPost): void {
  const frontmatter = `---
title: "${blog.title.replace(/"/g, '\\"')}"
subtitle: "${blog.subtitle.replace(/"/g, '\\"')}"
category: "${blog.category}"
author: "${blog.author.name}"
date: "${blog.publishedAt}"
tags: [${blog.tags.map((t) => `"${t}"`).join(', ')}]
coverImage: "${blog.coverImage}"
readTime: "${blog.readTimeMinutes} min"
---

`;
  const fullContent = frontmatter + blog.content;
  const blob = new Blob([fullContent], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${blog.slug || 'blog-post'}.md`;
  a.click();
  URL.revokeObjectURL(url);
}
