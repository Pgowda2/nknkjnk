import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  Calendar,
  Share2,
  Twitter,
  Linkedin,
  Copy,
  Check,
  Tag,
  BookOpen,
  Loader2,
} from 'lucide-react';
import api from '../api/axios.js';
import { Post } from '../types.js';
import { Navbar } from '../components/Navbar.js';
import { Footer } from '../components/Footer.js';
import { PostCard } from '../components/PostCard.js';
import { useToast } from '../context/ToastContext.js';

export const PostDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get<{ post: Post }>(`/posts/${slug}`);
        setPost(res.data.post);

        // Update document title for SEO
        if (res.data.post?.title) {
          document.title = `${res.data.post.title} — Inkwell`;
        }

        // Fetch related posts in same category
        if (res.data.post?.category) {
          const relRes = await api.get<{ posts: Post[] }>('/posts', {
            params: { category: res.data.post.category, limit: 3 },
          });
          setRelatedPosts(
            relRes.data.posts.filter((p) => p._id !== res.data.post._id).slice(0, 3)
          );
        }
      } catch (err) {
        setError((err as Error).message || 'Post not found');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    showToast('Post link copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleShareTwitter = () => {
    if (!post) return;
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`"${post.title}" via Inkwell:`);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
  };

  const handleShareLinkedIn = () => {
    if (!post) return;
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-[#0d1117]">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-32 space-y-3">
          <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Loading Article...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-[#0d1117]">
        <Navbar />
        <div className="flex-1 max-w-md mx-auto px-4 py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-400 flex items-center justify-center mx-auto mb-4">
            <BookOpen size={28} />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Article Not Found</h2>
          <p className="text-xs text-gray-500 mt-2 mb-6">
            The article you are looking for may have been moved, unpublished, or does not exist.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-600 text-white text-xs font-bold hover:bg-brand-700"
          >
            <ArrowLeft size={14} /> Return to Stories
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0d1117] transition-colors">
      <Navbar />

      <main className="flex-1 w-full pb-20">
        
        {/* Top Breadcrumb / Return */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-4">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} /> Back to all stories
          </button>
        </div>

        {/* Article Header */}
        <header className="max-w-4xl mx-auto px-4 sm:px-6 space-y-4 text-left">
          <div className="flex items-center gap-3 text-xs flex-wrap">
            <span className="px-3 py-1 rounded-full font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950 border border-brand-200 dark:border-brand-800">
              {post.category}
            </span>
            <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
              <Clock size={13} /> {post.readingTime} min read
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
              <Calendar size={13} /> {formattedDate}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-[1.15] font-sans">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 font-sans leading-relaxed pt-2">
              {post.excerpt}
            </p>
          )}

          {/* Author info row */}
          <div className="pt-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                {post.author.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{post.author.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Published in {post.category}</p>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopyLink}
                className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Copy Link"
              >
                {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
              </button>
              <button
                onClick={handleShareTwitter}
                className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Share on Twitter / X"
              >
                <Twitter size={16} />
              </button>
              <button
                onClick={handleShareLinkedIn}
                className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Share on LinkedIn"
              >
                <Linkedin size={16} />
              </button>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 my-8">
            <div className="rounded-3xl overflow-hidden aspect-16/9 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-800">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Main Formatted Content */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-10">
          <div
            dangerouslySetInnerHTML={{ __html: post.content }}
            className="font-serif text-lg sm:text-xl text-gray-800 dark:text-gray-200 leading-[1.8] space-y-6 [&>h2]:text-2xl [&>h2]:sm:text-3xl [&>h2]:font-extrabold [&>h2]:font-sans [&>h2]:text-gray-900 dark:[&>h2]:text-white [&>h2]:mt-10 [&>h2]:mb-4 [&>h3]:text-xl [&>h3]:sm:text-2xl [&>h3]:font-bold [&>h3]:font-sans [&>h3]:text-gray-900 dark:[&>h3]:text-white [&>h3]:mt-8 [&>h3]:mb-3 [&>blockquote]:border-l-4 [&>blockquote]:border-brand-500 [&>blockquote]:pl-6 [&>blockquote]:italic [&>blockquote]:text-gray-700 dark:[&>blockquote]:text-gray-300 [&>blockquote]:my-6 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:space-y-2 [&>pre]:bg-gray-100 dark:[&>pre]:bg-gray-800 [&>pre]:p-5 [&>pre]:rounded-2xl [&>pre]:font-mono [&>pre]:text-sm [&>pre]:overflow-x-auto [&>a]:text-brand-600 dark:[&>a]:text-brand-400 [&>a]:underline [&>img]:rounded-2xl [&>img]:my-6"
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800 flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <Tag size={13} /> Tags:
              </span>
              {post.tags.map((t) => (
                <Link
                  key={t}
                  to={`/?tag=${encodeURIComponent(t)}`}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium transition-colors"
                >
                  #{t}
                </Link>
              ))}
            </div>
          )}

          {/* Share Box at bottom */}
          <div className="mt-10 p-6 rounded-2xl bg-surfaceLight dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">Enjoyed this article?</h4>
              <p className="text-xs text-gray-500 mt-0.5">Share with fellow thinkers and readers.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-semibold flex items-center gap-1.5 hover:bg-white dark:hover:bg-gray-800"
              >
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy Link'}</span>
              </button>
              <button
                onClick={handleShareTwitter}
                className="px-3 py-1.5 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-semibold flex items-center gap-1.5 hover:opacity-90"
              >
                <Twitter size={14} />
                <span>Tweet</span>
              </button>
            </div>
          </div>
        </div>

        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-20 pt-12 border-t border-gray-200 dark:border-gray-800">
            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-6 font-sans">
              More from {post.category}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rel) => (
                <PostCard key={rel._id} post={rel} />
              ))}
            </div>
          </section>
        )}

      </main>

      <Footer />
    </div>
  );
};
