import React from 'react';
import { BlogPost } from '../types';
import { Clock, Eye, Heart, Bookmark, ArrowUpRight } from 'lucide-react';

interface BlogCardProps {
  blog: BlogPost;
  isBookmarked: boolean;
  onRead: (blog: BlogPost) => void;
  onToggleBookmark: (id: string, e: React.MouseEvent) => void;
  onLike: (id: string, e: React.MouseEvent) => void;
}

export const BlogCard: React.FC<BlogCardProps> = ({
  blog,
  isBookmarked,
  onRead,
  onToggleBookmark,
  onLike,
}) => {
  return (
    <article
      onClick={() => onRead(blog)}
      className="group bg-white rounded-2xl border border-gray-200/80 hover:border-gray-300 hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Cover Image Container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md text-gray-900 border border-gray-200/60 shadow-xs">
            {blog.category}
          </span>
        </div>
        <button
          onClick={(e) => onToggleBookmark(blog.id, e)}
          title={isBookmarked ? 'Remove bookmark' : 'Bookmark for later'}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer ${
            isBookmarked
              ? 'bg-brand-600 text-white shadow-md'
              : 'bg-white/80 text-gray-600 hover:bg-white hover:text-gray-900'
          }`}
        >
          <Bookmark size={15} className={isBookmarked ? 'fill-current' : ''} />
        </button>
      </div>

      {/* Content Body */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata line */}
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2.5">
            <span>{blog.publishedAt}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock size={12} /> {blog.readTimeMinutes} min read
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-600 transition-colors leading-snug line-clamp-2 mb-2 font-sans">
            {blog.title}
          </h3>

          {/* Subtitle / Excerpt */}
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-4 font-serif">
            {blog.subtitle}
          </p>
        </div>

        <div>
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {blog.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-100 text-gray-600 group-hover:bg-gray-200/60 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Author & Interactions Footer */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={blog.author.avatar}
                alt={blog.author.name}
                className="w-7 h-7 rounded-full object-cover border border-gray-200"
              />
              <div>
                <p className="text-xs font-semibold text-gray-900 leading-tight">
                  {blog.author.name}
                </p>
                <p className="text-[10px] text-gray-500 leading-tight">
                  {blog.author.role}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-gray-500">
              <button
                onClick={(e) => onLike(blog.id, e)}
                className="flex items-center gap-1 hover:text-red-600 transition-colors cursor-pointer group/like"
                title="Like this blog"
              >
                <Heart size={14} className="group-hover/like:fill-red-500 group-hover/like:text-red-500" />
                <span>{blog.likes}</span>
              </button>

              <span className="flex items-center gap-1" title={`${blog.views || 0} views`}>
                <Eye size={14} />
                <span>{blog.views || 0}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
