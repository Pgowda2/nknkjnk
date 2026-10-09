import React from 'react';
import { BlogPost } from '../types';
import { Bookmark, X, ArrowRight, Trash2, Clock } from 'lucide-react';

interface BookmarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarkedBlogs: BlogPost[];
  onSelectBlog: (blog: BlogPost) => void;
  onRemoveBookmark: (id: string) => void;
}

export const BookmarksModal: React.FC<BookmarksModalProps> = ({
  isOpen,
  onClose,
  bookmarkedBlogs,
  onSelectBlog,
  onRemoveBookmark,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-2xl border border-gray-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-surfaceLight">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center">
              <Bookmark size={16} className="fill-current" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Your Saved Reading List</h2>
              <p className="text-xs text-gray-500">
                {bookmarkedBlogs.length} {bookmarkedBlogs.length === 1 ? 'article' : 'articles'} bookmarked
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {bookmarkedBlogs.length > 0 ? (
            bookmarkedBlogs.map((blog) => (
              <div
                key={blog.id}
                className="p-4 rounded-2xl border border-gray-200 hover:border-gray-300 hover:bg-surfaceLight transition-all flex items-center justify-between gap-4 group"
              >
                <div
                  onClick={() => {
                    onSelectBlog(blog);
                    onClose();
                  }}
                  className="flex-1 cursor-pointer"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600">
                    {blog.category}
                  </span>
                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-1 mt-0.5">
                    {blog.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-1">
                    <span>{blog.author.name}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> {blog.readTimeMinutes} min read
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onRemoveBookmark(blog.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Remove from reading list"
                  >
                    <Trash2 size={14} />
                  </button>

                  <button
                    onClick={() => {
                      onSelectBlog(blog);
                      onClose();
                    }}
                    className="p-2 text-gray-700 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors cursor-pointer"
                    title="Read now"
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Bookmark size={32} className="mx-auto text-gray-300 mb-3" />
              <p className="text-sm font-bold text-gray-700">No saved articles yet</p>
              <p className="text-xs text-gray-500 mt-1">
                Click the bookmark icon on any article in your feed to save it for reading later.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
