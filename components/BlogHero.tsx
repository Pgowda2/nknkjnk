import React from 'react';
import { BlogPost } from '../types';
import { Clock, ArrowRight, Sparkles, Heart, Bookmark } from 'lucide-react';

interface BlogHeroProps {
  featuredBlog: BlogPost;
  isBookmarked: boolean;
  onRead: (blog: BlogPost) => void;
  onToggleBookmark: (id: string, e: React.MouseEvent) => void;
}

export const BlogHero: React.FC<BlogHeroProps> = ({
  featuredBlog,
  isBookmarked,
  onRead,
  onToggleBookmark,
}) => {
  return (
    <section className="mb-14">
      <div
        onClick={() => onRead(featuredBlog)}
        className="group relative bg-white rounded-3xl border border-gray-200/90 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer grid grid-cols-1 lg:grid-cols-12 gap-0"
      >
        {/* Left Editorial Text Column */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between order-2 lg:order-1">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-50 text-brand-700 border border-brand-100">
                <Sparkles size={13} /> Featured Story
              </span>
              <span className="text-xs font-semibold text-gray-500">
                {featuredBlog.category}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight group-hover:text-brand-600 transition-colors mb-4 font-sans">
              {featuredBlog.title}
            </h1>

            <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-serif mb-6 line-clamp-3">
              {featuredBlog.subtitle}
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {featuredBlog.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={featuredBlog.author.avatar}
                alt={featuredBlog.author.name}
                className="w-10 h-10 rounded-full object-cover border border-gray-200"
              />
              <div>
                <p className="text-sm font-bold text-gray-900 leading-snug">
                  {featuredBlog.author.name}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{featuredBlog.publishedAt}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {featuredBlog.readTimeMinutes} min read
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={(e) => onToggleBookmark(featuredBlog.id, e)}
                title={isBookmarked ? 'Remove bookmark' : 'Bookmark story'}
                className={`p-2.5 rounded-full border transition-colors cursor-pointer ${
                  isBookmarked
                    ? 'bg-brand-600 border-brand-600 text-white'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Bookmark size={16} className={isBookmarked ? 'fill-current' : ''} />
              </button>

              <span className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-gray-900 text-white font-semibold text-xs group-hover:bg-brand-600 transition-colors shadow-sm">
                Read Story <ArrowRight size={14} />
              </span>
            </div>
          </div>
        </div>

        {/* Right High-Impact Image Column */}
        <div className="lg:col-span-5 relative aspect-[16/10] lg:aspect-auto h-full min-h-[280px] overflow-hidden bg-gray-100 order-1 lg:order-2">
          <img
            src={featuredBlog.coverImage}
            alt={featuredBlog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent lg:hidden" />
        </div>
      </div>
    </section>
  );
};
