import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Image,
  Upload,
  Layers,
  Tag,
  Globe,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import api from '../api/axios.js';
import { Post } from '../types.js';
import { PublisherNavbar } from '../components/PublisherNavbar.js';
import { RichTextEditor } from '../components/RichTextEditor.js';
import { useToast } from '../context/ToastContext.js';

const SAMPLE_COVERS = [
  {
    label: 'Modern Tech',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Still Journal',
    url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Nature Dawn',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Minimal Abstract',
    url: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=1200&q=80',
  },
];

const PRESET_CATEGORIES = [
  'Philosophy',
  'Architecture',
  'Life & Habit',
  'Design',
  'Technology',
  'Engineering',
  'General',
];

export const PublisherPostEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [autoSlug, setAutoSlug] = useState(true);
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [category, setCategory] = useState('General');
  const [customCategory, setCustomCategory] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  // Helper to slugify
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Auto-generate slug when title changes
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (autoSlug) {
      setSlug(generateSlug(val));
    }
  };

  // Load existing post if in edit mode
  useEffect(() => {
    if (!isEditing || !id) return;

    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await api.get<{ posts: Post[] }>('/publisher/posts');
        const found = res.data.posts.find((p) => p._id === id);
        if (found) {
          setTitle(found.title);
          setSlug(found.slug);
          setAutoSlug(false);
          setContent(found.content);
          setExcerpt(found.excerpt || '');
          setCoverImage(found.coverImage || '');
          if (PRESET_CATEGORIES.includes(found.category)) {
            setCategory(found.category);
          } else {
            setCategory('Custom');
            setCustomCategory(found.category);
          }
          setTagsInput(found.tags?.join(', ') || '');
          setStatus(found.status);
        } else {
          showToast('Post not found in studio', 'error');
          navigate('/publisher/dashboard');
        }
      } catch (err) {
        showToast((err as Error).message || 'Failed to load post', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, isEditing, navigate, showToast]);

  // Handle local file upload to Base64/DataURL
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image file must be under 5MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setCoverImage(event.target.result);
        showToast('Cover image uploaded!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (submitStatus?: 'published' | 'draft') => {
    const finalStatus = submitStatus || status;

    if (!title.trim()) {
      showToast('Please provide a post title', 'error');
      return;
    }

    if (!content.trim()) {
      showToast('Please provide post content', 'error');
      return;
    }

    setSubmitting(true);

    const resolvedCategory =
      category === 'Custom' ? customCategory.trim() || 'General' : category;

    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const payload = {
      title: title.trim(),
      slug: slug.trim() || generateSlug(title),
      content,
      excerpt: excerpt.trim(),
      coverImage: coverImage.trim(),
      category: resolvedCategory,
      tags: parsedTags,
      status: finalStatus,
    };

    try {
      if (isEditing && id) {
        await api.put(`/posts/${id}`, payload);
        showToast('Article updated successfully!');
      } else {
        await api.post('/posts', payload);
        showToast('Article published successfully!');
      }
      navigate('/publisher/dashboard');
    } catch (err) {
      showToast((err as Error).message || 'Failed to save post', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-surfaceLight dark:bg-[#090d12]">
        <PublisherNavbar />
        <div className="flex-1 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Loading Post Editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-surfaceLight dark:bg-[#090d12] transition-colors pb-20">
      <PublisherNavbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <Link
            to="/publisher/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={submitting}
              onClick={() => handleSubmit('draft')}
              className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all cursor-pointer disabled:opacity-50"
            >
              Save as Draft
            </button>

            <button
              type="button"
              disabled={submitting}
              onClick={() => handleSubmit('published')}
              className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md hover:shadow-glow transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Save size={14} />
              )}
              <span>{isEditing ? 'Update & Publish' : 'Publish Story'}</span>
            </button>
          </div>
        </div>

        {/* Editor Form Container */}
        <div className="space-y-6">
          
          {/* Title & Slug Section */}
          <div className="p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/90 dark:border-gray-800 space-y-4 shadow-2xs">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                Article Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g., The Architecture of Minimalist Living"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-lg sm:text-xl font-bold font-sans text-gray-900 dark:text-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Slug */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-1">
                  <Globe size={13} /> URL Slug (Clean URL)
                </label>
                <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoSlug}
                    onChange={(e) => {
                      setAutoSlug(e.target.checked);
                      if (e.target.checked) setSlug(generateSlug(title));
                    }}
                    className="rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span>Auto-generate from title</span>
                </label>
              </div>
              <div className="flex items-center">
                <span className="px-3 py-2 rounded-l-xl bg-gray-100 dark:bg-gray-800 text-xs text-gray-500 border border-r-0 border-gray-200 dark:border-gray-700 font-mono">
                  /post/
                </span>
                <input
                  type="text"
                  value={slug}
                  disabled={autoSlug}
                  onChange={(e) => setSlug(generateSlug(e.target.value))}
                  placeholder="post-slug-url"
                  className="w-full px-3 py-2 rounded-r-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-mono text-gray-900 dark:text-white outline-none focus:border-brand-500 disabled:opacity-75 disabled:bg-gray-50 dark:disabled:bg-gray-900"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                Article Excerpt (Summary for Cards & SEO)
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A brief 1-2 sentence hook describing the core insight of this piece..."
                rows={2}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* Rich Content Editor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                Story Content *
              </label>
              <span className="text-[11px] text-gray-400">Supports Rich Text & Markdown formatting</span>
            </div>
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Begin typing your essay or article here..."
            />
          </div>

          {/* Cover Image Upload & Selection */}
          <div className="p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/90 dark:border-gray-800 space-y-4 shadow-2xs">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-1">
              <Image size={14} /> Cover Image
            </label>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Image Preview Box */}
              <div className="md:col-span-4 aspect-16/10 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 relative flex items-center justify-center">
                {coverImage ? (
                  <img
                    src={coverImage}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4 text-gray-400">
                    <Image size={28} className="mx-auto mb-1 opacity-50" />
                    <span className="text-[11px]">No cover image</span>
                  </div>
                )}
              </div>

              {/* URL or Upload Controls */}
              <div className="md:col-span-8 space-y-3">
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">
                    Image URL
                  </span>
                  <input
                    type="url"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white outline-none focus:border-brand-500"
                  />
                </div>

                {/* Local file upload input */}
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">
                    Or Upload File from Device
                  </span>
                  <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 hover:border-brand-500 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 cursor-pointer transition-colors">
                    <Upload size={14} />
                    <span>Choose image file...</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Preset sample covers */}
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">
                    Quick Sample Covers:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {SAMPLE_COVERS.map((sample) => (
                      <button
                        key={sample.label}
                        type="button"
                        onClick={() => setCoverImage(sample.url)}
                        className="px-2.5 py-1 rounded-lg text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                      >
                        {sample.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Classification: Category, Tags, Status */}
          <div className="p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/90 dark:border-gray-800 grid grid-cols-1 sm:grid-cols-3 gap-6 shadow-2xs">
            
            {/* Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1">
                <Layers size={13} /> Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white outline-none focus:border-brand-500"
              >
                {PRESET_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="Custom">+ Custom Category...</option>
              </select>

              {category === 'Custom' && (
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Enter custom category..."
                  className="w-full mt-2 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white outline-none"
                  autoFocus
                />
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1">
                <Tag size={13} /> Tags (Comma-separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Mindset, Design, Systems"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white outline-none focus:border-brand-500"
              />
            </div>

            {/* Status Toggle */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                Publication Status
              </label>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setStatus('published')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    status === 'published'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  Published
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('draft')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    status === 'draft'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  Draft
                </button>
              </div>
            </div>

          </div>

          {/* Bottom Submit Bar */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              disabled={submitting}
              onClick={() => handleSubmit('draft')}
              className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all cursor-pointer disabled:opacity-50"
            >
              Save as Draft
            </button>

            <button
              type="button"
              disabled={submitting}
              onClick={() => handleSubmit('published')}
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md hover:shadow-glow transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <CheckCircle size={16} />
              )}
              <span>{isEditing ? 'Update and Publish' : 'Publish Article Now'}</span>
            </button>
          </div>

        </div>

      </main>
    </div>
  );
};
