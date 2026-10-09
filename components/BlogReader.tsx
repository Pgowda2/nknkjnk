import React, { useState, useEffect } from 'react';
import { BlogPost, BlogComment } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { exportBlogToMarkdown } from '../utils/storage';
import { 
  ArrowLeft, Clock, Heart, Bookmark, Share2, Download, 
  Edit3, Trash2, MessageSquare, Send, Check, Sparkles, User
} from 'lucide-react';

interface BlogReaderProps {
  blog: BlogPost;
  allBlogs: BlogPost[];
  isBookmarked: boolean;
  onBack: () => void;
  onToggleBookmark: (id: string, e: React.MouseEvent) => void;
  onLike: (id: string) => void;
  onEdit: (blog: BlogPost) => void;
  onDelete: (id: string) => void;
  onAddComment: (blogId: string, comment: BlogComment) => void;
  onSelectBlog: (blog: BlogPost) => void;
  isPublisher: boolean;
}

export const BlogReader: React.FC<BlogReaderProps> = ({
  blog,
  allBlogs,
  isBookmarked,
  onBack,
  onToggleBookmark,
  onLike,
  onEdit,
  onDelete,
  onAddComment,
  onSelectBlog,
  isPublisher,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [showShareToast, setShowShareToast] = useState(false);
  const [hasLikedLocally, setHasLikedLocally] = useState(false);

  // Track reading scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [blog.id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 3000);
  };

  const handleLikeClick = () => {
    onLike(blog.id);
    setHasLikedLocally(true);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: BlogComment = {
      id: `c-${Date.now()}`,
      author: commentAuthor.trim() || 'Reader',
      content: commentText.trim(),
      createdAt: 'Just now',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    };

    onAddComment(blog.id, newComment);
    setCommentText('');
  };

  // Find 2 related articles
  const relatedPosts = allBlogs
    .filter((b) => b.id !== blog.id)
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-white">
      {/* Reading Progress Bar Fixed at Screen Top */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-gray-100">
        <div
          className="h-full bg-brand-600 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Reader Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-20">
        
        {/* Navigation & Header Actions */}
        <div className="flex items-center justify-between pb-8 mb-8 border-b border-gray-100">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-gray-900 transition-colors cursor-pointer group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to All Articles
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => onToggleBookmark(blog.id, e)}
              className={`p-2.5 rounded-full border transition-colors cursor-pointer ${
                isBookmarked
                  ? 'bg-brand-600 border-brand-600 text-white'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark story'}
            >
              <Bookmark size={15} className={isBookmarked ? 'fill-current' : ''} />
            </button>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer relative"
              title="Share article"
            >
              <Share2 size={15} />
              {showShareToast && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-semibold px-2 py-1 rounded shadow-md whitespace-nowrap">
                  Link copied!
                </span>
              )}
            </button>

            <button
              onClick={() => exportBlogToMarkdown(blog)}
              className="p-2.5 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              title="Export as Markdown (.md)"
            >
              <Download size={15} />
            </button>

            {isPublisher && (
              <>
                <button
                  onClick={() => onEdit(blog)}
                  className="p-2.5 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                  title="Edit post (Publisher only)"
                >
                  <Edit3 size={15} />
                </button>

                <button
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to delete "${blog.title}"?`)) {
                      onDelete(blog.id);
                    }
                  }}
                  className="p-2.5 rounded-full border border-gray-200 text-gray-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors cursor-pointer"
                  title="Delete post (Publisher only)"
                >
                  <Trash2 size={15} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Article Meta Header */}
        <header className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-50 text-brand-700">
              {blog.category}
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500 font-medium">{blog.publishedAt}</span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
              <Clock size={12} /> {blog.readTimeMinutes} min read
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-[1.15] mb-6 font-sans">
            {blog.title}
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed font-serif mb-8">
            {blog.subtitle}
          </p>

          {/* Author Byline Box */}
          <div className="flex items-center gap-4 py-4 border-y border-gray-100">
            <img
              src={blog.author.avatar}
              alt={blog.author.name}
              className="w-12 h-12 rounded-full object-cover border border-gray-200"
            />
            <div>
              <h4 className="text-sm font-bold text-gray-900 leading-tight">
                {blog.author.name}
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                {blog.author.role} {blog.author.bio && `• ${blog.author.bio}`}
              </p>
            </div>
          </div>
        </header>

        {/* Lead Cover Image */}
        <div className="mb-12 rounded-3xl overflow-hidden border border-gray-200 shadow-sm bg-gray-100">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full max-h-[500px] object-cover"
          />
        </div>

        {/* Main Article Body */}
        <article className="max-w-[70ch] mx-auto">
          <MarkdownRenderer content={blog.content} />

          {/* Tags */}
          <div className="mt-12 pt-6 border-t border-gray-100 flex flex-wrap gap-2">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Bottom Reader Action Toolbar */}
          <div className="my-10 p-5 rounded-2xl bg-surfaceLight border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleLikeClick}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-xs transition-all cursor-pointer ${
                  hasLikedLocally
                    ? 'bg-red-50 text-red-600 border border-red-200 shadow-xs'
                    : 'bg-white text-gray-700 hover:text-red-600 border border-gray-200 shadow-2xs'
                }`}
              >
                <Heart size={16} className={hasLikedLocally ? 'fill-current text-red-500' : ''} />
                <span>{blog.likes} {blog.likes === 1 ? 'Like' : 'Likes'}</span>
              </button>

              <span className="text-xs text-gray-500 font-medium">
                Liked this post? Give it a tap.
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => onToggleBookmark(blog.id, e)}
                className={`px-4 py-2.5 rounded-full font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  isBookmarked
                    ? 'bg-brand-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Bookmark size={14} className={isBookmarked ? 'fill-current' : ''} />
                {isBookmarked ? 'Bookmarked' : 'Bookmark'}
              </button>

              <button
                onClick={handleShare}
                className="px-4 py-2.5 rounded-full bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Share2 size={14} />
                Share
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <section className="mt-14 pt-10 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare size={18} className="text-brand-600" />
              <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                Responses ({blog.comments?.length || 0})
              </h3>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleSubmitComment} className="mb-10 bg-surfaceLight p-5 rounded-2xl border border-gray-200 space-y-3">
              <input
                type="text"
                value={commentAuthor}
                onChange={(e) => setCommentAuthor(e.target.value)}
                placeholder="Your Name (e.g. Maya Lin)"
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white text-gray-900 focus:border-brand-600 outline-none"
              />
              <textarea
                required
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="What are your thoughts on this article?"
                className="w-full p-3 text-sm rounded-xl border border-gray-200 bg-white text-gray-900 focus:border-brand-600 outline-none resize-none font-serif"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Send size={13} /> Post Response
                </button>
              </div>
            </form>

            {/* Existing Comments List */}
            <div className="space-y-4">
              {blog.comments && blog.comments.length > 0 ? (
                blog.comments.map((comment) => (
                  <div key={comment.id} className="p-4 rounded-2xl bg-white border border-gray-100 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="font-bold text-gray-900">{comment.author}</span>
                      <span>{comment.createdAt}</span>
                    </div>
                    <p className="text-sm text-gray-700 font-serif leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500 italic">No responses yet. Be the first to share your thoughts!</p>
              )}
            </div>
          </section>

          {/* Related Articles */}
          {relatedPosts.length > 0 && (
            <section className="mt-16 pt-10 border-t border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-6">
                Recommended Stories
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {relatedPosts.map((related) => (
                  <div
                    key={related.id}
                    onClick={() => onSelectBlog(related)}
                    className="p-5 rounded-2xl border border-gray-200 hover:border-brand-500/50 hover:shadow-md transition-all cursor-pointer group bg-surfaceLight"
                  >
                    <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider">
                      {related.category}
                    </span>
                    <h4 className="text-base font-bold text-gray-900 group-hover:text-brand-600 transition-colors mt-1 mb-2 font-sans line-clamp-2">
                      {related.title}
                    </h4>
                    <p className="text-xs text-gray-500 font-serif line-clamp-2">
                      {related.subtitle}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

        </article>

      </div>
    </div>
  );
};
