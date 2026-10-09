import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  Clock,
  Layers,
  FileText,
  Search,
  ExternalLink,
  Loader2,
  Calendar,
} from 'lucide-react';
import api from '../api/axios.js';
import { Post } from '../types.js';
import { PublisherNavbar } from '../components/PublisherNavbar.js';
import { useToast } from '../context/ToastContext.js';

export const PublisherDashboardPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get<{ posts: Post[] }>('/publisher/posts');
      setPosts(res.data.posts || []);
    } catch (err) {
      showToast((err as Error).message || 'Failed to fetch posts', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      return;
    }
    setDeletingId(id);
    try {
      await api.delete(`/posts/${id}`);
      setPosts((prev) => prev.filter((p) => p._id !== id));
      showToast(`Post "${title}" deleted successfully!`);
    } catch (err) {
      showToast((err as Error).message || 'Failed to delete post', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (post: Post) => {
    const nextStatus = post.status === 'published' ? 'draft' : 'published';
    try {
      const res = await api.put<{ post: Post }>(`/posts/${post._id}`, {
        ...post,
        status: nextStatus,
      });
      setPosts((prev) =>
        prev.map((p) => (p._id === post._id ? res.data.post : p))
      );
      showToast(`Post marked as ${nextStatus}!`);
    } catch (err) {
      showToast((err as Error).message || 'Failed to update status', 'error');
    }
  };

  const filteredPosts = posts.filter((p) => {
    const matchStatus = filterStatus === 'all' || p.status === filterStatus;
    const matchSearch =
      searchFilter === '' ||
      p.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.category.toLowerCase().includes(searchFilter.toLowerCase());
    return matchStatus && matchSearch;
  });

  const publishedCount = posts.filter((p) => p.status === 'published').length;
  const draftCount = posts.filter((p) => p.status === 'draft').length;

  return (
    <div className="min-h-screen flex flex-col bg-surfaceLight dark:bg-[#090d12] transition-colors">
      <PublisherNavbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-10 w-full">
        
        {/* Top Header & Quick Stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight font-sans">
              Editorial Articles
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage your draft and published stories, update categories, and monitor status.
            </p>
          </div>

          <Link
            to="/publisher/posts/new"
            className="self-start md:self-auto px-5 py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md hover:shadow-glow transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus size={16} /> Write New Article
          </Link>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/90 dark:border-gray-800 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Articles</span>
              <FileText size={18} className="text-gray-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mt-2 font-sans">
              {posts.length}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/90 dark:border-gray-800 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Published</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mt-2 font-sans">
              {publishedCount}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/90 dark:border-gray-800 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Drafts</span>
              <Clock size={18} className="text-amber-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mt-2 font-sans">
              {draftCount}
            </p>
          </div>
        </div>

        {/* Controls: Search and Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 p-3 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800">
          {/* Status Tabs */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                filterStatus === 'all'
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              All ({posts.length})
            </button>
            <button
              onClick={() => setFilterStatus('published')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                filterStatus === 'published'
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Published ({publishedCount})
            </button>
            <button
              onClick={() => setFilterStatus('draft')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                filterStatus === 'draft'
                  ? 'bg-amber-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Drafts ({draftCount})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter by title or category..."
              className="w-full pl-8 pr-4 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs text-gray-900 dark:text-white outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {/* Post List */}
        {loading ? (
          <div className="py-24 text-center">
            <Loader2 className="w-8 h-8 text-brand-600 animate-spin mx-auto mb-3" />
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Loading Dashboard...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="py-20 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
            <FileText size={40} className="mx-auto text-gray-300 dark:text-gray-700 mb-3" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white">No articles found</h3>
            <p className="text-xs text-gray-500 mt-1 mb-5">
              {searchFilter
                ? 'No posts match your current search query.'
                : 'You have not created any posts in this category yet.'}
            </p>
            <Link
              to="/publisher/posts/new"
              className="px-4 py-2 rounded-full bg-brand-600 text-white text-xs font-bold hover:bg-brand-700"
            >
              Write First Article
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPosts.map((post) => {
              const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div
                  key={post._id}
                  className="bg-white dark:bg-gray-900 p-4 sm:p-5 rounded-2xl border border-gray-200/90 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-gray-300 dark:hover:border-gray-700 transition-all shadow-2xs"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {post.coverImage && (
                      <img
                        src={post.coverImage}
                        alt=""
                        className="w-14 h-14 rounded-xl object-cover shrink-0 hidden sm:block border border-gray-100 dark:border-gray-800"
                      />
                    )}

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Status badge & toggle button */}
                        <button
                          onClick={() => handleToggleStatus(post)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                            post.status === 'published'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                          }`}
                          title="Click to toggle between draft and published"
                        >
                          {post.status}
                        </button>

                        <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Layers size={11} /> {post.category}
                        </span>

                        <span className="text-[11px] text-gray-400 flex items-center gap-1">
                          <Calendar size={11} /> {formattedDate}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-gray-900 dark:text-white truncate font-sans">
                        {post.title}
                      </h3>

                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        Slug: <code className="font-mono text-gray-600 dark:text-gray-300">/post/{post.slug}</code>
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-auto pt-2 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-gray-800">
                    {post.status === 'published' && (
                      <Link
                        to={`/post/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        title="View Published Article"
                      >
                        <ExternalLink size={16} />
                      </Link>
                    )}

                    <Link
                      to={`/publisher/posts/edit/${post._id}`}
                      className="p-2 rounded-xl text-gray-500 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/30 transition-colors"
                      title="Edit Article"
                    >
                      <Edit2 size={16} />
                    </Link>

                    <button
                      onClick={() => handleDelete(post._id, post.title)}
                      disabled={deletingId === post._id}
                      className="p-2 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                      title="Delete Article"
                    >
                      {deletingId === post._id ? (
                        <Loader2 size={16} className="animate-spin text-red-600" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
};
