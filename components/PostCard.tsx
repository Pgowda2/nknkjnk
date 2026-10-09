import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar, ArrowUpRight } from 'lucide-react';
import { Post } from '../types.js';

interface PostCardProps {
  post: Post;
  featured?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({ post, featured = false }) => {
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const defaultCover = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80';
  const cover = post.coverImage || defaultCover;

  if (featured) {
    return (
      <article className="group relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-surfaceLight dark:bg-gray-900/60 p-6 sm:p-8 rounded-3xl border border-gray-200/90 dark:border-gray-800 transition-all hover:border-gray-300 dark:hover:border-gray-700 shadow-sm mb-12">
        <div className="lg:col-span-7 overflow-hidden rounded-2xl aspect-16/10 bg-gray-100 dark:bg-gray-800">
          <Link to={`/post/${post.slug}`}>
            <img
              src={cover}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </Link>
        </div>

        <div className="lg:col-span-5 flex flex-col justify-center space-y-4">
          <div className="flex items-center gap-3 text-xs">
            <span className="px-3 py-1 rounded-full font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950 border border-brand-200 dark:border-brand-800">
              {post.category}
            </span>
            <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
              <Clock size={12} /> {post.readingTime} min read
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-snug font-sans group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
            <Link to={`/post/${post.slug}`} className="inline-flex items-center gap-1">
              {post.title}
            </Link>
          </h2>

          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed font-sans">
            {post.excerpt}
          </p>

          <div className="pt-2 flex items-center justify-between border-t border-gray-200/80 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-800 dark:text-gray-200">{post.author.name}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar size={12} /> {formattedDate}
              </span>
            </div>

            <Link
              to={`/post/${post.slug}`}
              className="inline-flex items-center gap-1 font-bold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Read Article <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex flex-col bg-white dark:bg-gray-900/60 rounded-2xl border border-gray-200/80 dark:border-gray-800 overflow-hidden hover:border-brand-500/40 dark:hover:border-brand-500/40 transition-all hover:shadow-lg">
      <div className="aspect-16/10 overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
        <Link to={`/post/${post.slug}`}>
          <img
            src={cover}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </Link>
        <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/95 dark:bg-gray-900/95 text-gray-900 dark:text-white shadow-xs backdrop-blur-xs">
          {post.category}
        </span>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Clock size={12} /> {post.readingTime} min read
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar size={12} /> {formattedDate}
            </span>
          </div>

          <h3 className="font-extrabold text-base sm:text-lg text-gray-900 dark:text-white tracking-tight leading-snug font-sans group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2">
            <Link to={`/post/${post.slug}`}>
              {post.title}
            </Link>
          </h3>

          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed font-sans">
            {post.excerpt}
          </p>
        </div>

        <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
          <span className="text-gray-600 dark:text-gray-400 font-medium">
            By {post.author.name}
          </span>
          <Link
            to={`/post/${post.slug}`}
            className="font-bold text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center gap-1"
          >
            Read <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>
    </article>
  );
};
