import React, { useState, useRef, useEffect } from 'react';
import { BlogPost, Author } from '../types';
import { parseUploadedFile, estimateReadingTime } from '../utils/storage';
import { DEFAULT_PUBLISHER } from '../utils/auth';
import { MarkdownRenderer } from './MarkdownRenderer';
import { 
  X, UploadCloud, Image as ImageIcon, Bold, Italic, Heading1, Heading2, 
  Quote, Code, List, ListOrdered, Link, Minus, Eye, Edit3, Sparkles, Check, AlertCircle, ShieldCheck
} from 'lucide-react';

interface BlogEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (blog: BlogPost) => void;
  editingBlog?: BlogPost | null;
  categories?: string[];
  onAddCategory?: (category: string) => void;
}

const PRESET_COVERS = [
  { label: 'Warm Sunlight & Journal', url: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1400&q=80' },
  { label: 'Serene Nature & Hills', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1400&q=80' },
  { label: 'Golden Hour Sunset', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80' },
  { label: 'Quiet Library & Books', url: 'https://images.unsplash.com/photo-1507842229451-79b1be886a27?auto=format&fit=crop&w=1400&q=80' },
  { label: 'Minimal Horizon & Calm', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80' },
];

export const BlogEditorModal: React.FC<BlogEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingBlog,
  categories = ['Stories', 'Essays', 'Life & Reflections', 'Thoughts & Perspectives', 'Culture & Art', 'General'],
  onAddCategory,
}) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [parseNotice, setParseNotice] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<string>(categories[0] || 'Stories');
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [isCustomCategoryMode, setIsCustomCategoryMode] = useState(false);
  const [tagsInput, setTagsInput] = useState('');
  const [coverImage, setCoverImage] = useState(PRESET_COVERS[0].url);
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState(DEFAULT_PUBLISHER.name);
  const [authorRole, setAuthorRole] = useState(DEFAULT_PUBLISHER.role);
  const [authorAvatar, setAuthorAvatar] = useState(DEFAULT_PUBLISHER.avatar);
  const [errorMessage, setErrorMessage] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);

  // Initialize or reset when editingBlog changes
  useEffect(() => {
    if (editingBlog) {
      setTitle(editingBlog.title);
      setSubtitle(editingBlog.subtitle);
      setCategory(editingBlog.category);
      setIsCustomCategoryMode(false);
      setCustomCategoryInput('');
      setTagsInput(editingBlog.tags.join(', '));
      setCoverImage(editingBlog.coverImage);
      setContent(editingBlog.content);
      setAuthorName(editingBlog.author.name);
      setAuthorRole(editingBlog.author.role);
      setAuthorAvatar(editingBlog.author.avatar);
    } else {
      setTitle('');
      setSubtitle('');
      setCategory(categories[0] || 'Stories');
      setIsCustomCategoryMode(false);
      setCustomCategoryInput('');
      setTagsInput('Life, Reflections, Thoughts, Memories');
      setCoverImage(PRESET_COVERS[0].url);
      setContent(`## The Quiet Beginning\n\nEvery meaningful journey starts not with a grand announcement, but with a quiet observation. When we take a step back from the rush of our daily routines, subtle details begin to surface.\n\n### A Fresh Perspective\n\nWhat makes experiences memorable is often the feelings, conversations, and small insights we gather along the way.\n\n> "To write is to discover what we truly think, feel, and cherish."\n\n### Looking Ahead\n\nReflecting on where we stand and where we wish to go gives us the clarity to move forward with purpose.`);
      setAuthorName(DEFAULT_PUBLISHER.name);
      setAuthorRole(DEFAULT_PUBLISHER.role);
      setAuthorAvatar(DEFAULT_PUBLISHER.avatar);
    }
    setErrorMessage('');
    setParseNotice(null);
    setActiveTab('edit');
  }, [editingBlog, isOpen, categories]);

  if (!isOpen) return null;

  // Insert markdown helper at cursor
  const insertFormatting = (prefix: string, suffix = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    const replacement = `${prefix}${selected || 'text'}${suffix}`;

    const updated = content.substring(0, start) + replacement + content.substring(end);
    setContent(updated);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected.length || 4));
    }, 0);
  };

  // Handle uploaded .md or .txt file
  const handleProcessFile = async (file: File) => {
    try {
      setParseNotice(`Reading "${file.name}"...`);
      const parsed = await parseUploadedFile(file);
      setTitle(parsed.title);
      if (parsed.subtitle) setSubtitle(parsed.subtitle);
      if (parsed.category) {
        setCategory(parsed.category);
        setIsCustomCategoryMode(false);
        if (onAddCategory) onAddCategory(parsed.category);
      }
      if (parsed.tags.length > 0) setTagsInput(parsed.tags.join(', '));
      if (parsed.content) setContent(parsed.content);
      setParseNotice(`Successfully loaded "${file.name}"!`);
      setTimeout(() => setParseNotice(null), 4000);
    } catch (err) {
      setErrorMessage('Failed to read file. Please ensure it is a valid markdown or text file.');
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  // Handle custom cover image upload from device
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        if (loadEvt.target?.result) {
          setCoverImage(loadEvt.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit / Publish
  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Please provide a title for your blog post.');
      return;
    }
    if (!content.trim()) {
      setErrorMessage('Blog content cannot be empty.');
      return;
    }

    const finalCategory = isCustomCategoryMode 
      ? (customCategoryInput.trim() || 'Stories')
      : (category.trim() || 'Stories');

    if (isCustomCategoryMode && customCategoryInput.trim() && onAddCategory) {
      onAddCategory(customCategoryInput.trim());
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const readTime = estimateReadingTime(content);

    const postToSave: BlogPost = {
      id: editingBlog?.id || `post-${Date.now()}`,
      title: title.trim(),
      slug: title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, ''),
      subtitle: subtitle.trim() || title.slice(0, 100),
      content: content.trim(),
      category: finalCategory,
      coverImage: coverImage.trim() || PRESET_COVERS[0].url,
      tags: tags.length > 0 ? tags : [finalCategory],
      publishedAt: editingBlog?.publishedAt || 'Today',
      readTimeMinutes: readTime,
      likes: editingBlog?.likes || 0,
      views: editingBlog?.views || 1,
      comments: editingBlog?.comments || [],
      featured: editingBlog?.featured || false,
      author: {
        name: authorName.trim() || DEFAULT_PUBLISHER.name,
        role: authorRole.trim() || DEFAULT_PUBLISHER.role,
        avatar: authorAvatar.trim() || DEFAULT_PUBLISHER.avatar,
      },
    };

    onSave(postToSave);
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readEstimate = estimateReadingTime(content);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-5xl my-auto border border-gray-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-surfaceLight shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-100 font-bold">
              <Edit3 size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">
                  {editingBlog ? 'Edit Blog Article' : 'Upload & Publish Blog'}
                </h2>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  <ShieldCheck size={11} /> Publisher Mode
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Publishing as <span className="font-semibold text-gray-800">{DEFAULT_PUBLISHER.name}</span> • Drop any Markdown (<code className="text-xs font-mono">.md</code>) file or write directly.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switch */}
            <div className="bg-gray-100 p-1 rounded-full flex items-center text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('edit')}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  activeTab === 'edit'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Editor
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1 ${
                  activeTab === 'preview'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Eye size={13} /> Preview
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          
          {/* File Upload Drop Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDraggingFile(true);
            }}
            onDragLeave={() => setIsDraggingFile(false)}
            onDrop={handleFileDrop}
            className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all ${
              isDraggingFile
                ? 'border-brand-500 bg-brand-50/50 scale-[0.99]'
                : 'border-gray-200 hover:border-gray-300 bg-gray-50/60'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".md,.markdown,.txt"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleProcessFile(e.target.files[0]);
                }
              }}
            />
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white shadow-xs border border-gray-200 flex items-center justify-center text-brand-600">
                <UploadCloud size={20} />
              </div>
              <div className="text-xs text-gray-600">
                <span className="font-bold text-gray-900">Drag and drop a .md or .txt file here</span>, or{' '}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-brand-600 hover:text-brand-700 font-bold underline cursor-pointer"
                >
                  browse from computer
                </button>
              </div>
            </div>
            {parseNotice && (
              <div className="mt-2 text-xs font-semibold text-emerald-600 flex items-center justify-center gap-1">
                <Check size={14} /> {parseNotice}
              </div>
            )}
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
              <AlertCircle size={15} />
              <span>{errorMessage}</span>
            </div>
          )}

          {activeTab === 'edit' ? (
            <form onSubmit={handlePublish} className="space-y-6">
              
              {/* Title & Subtitle */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. The Quiet Mornings: Finding Meaning in Stillness and Perspective"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 text-base sm:text-lg font-bold text-gray-900 outline-none transition-all placeholder:font-normal placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Subtitle / Summary Excerpt
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="A brief reflection or opening thought introducing this piece."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 text-sm text-gray-700 outline-none transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Category, Tags, and Author Info Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Category Selector with Inline Add Option */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                      Category
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsCustomCategoryMode(!isCustomCategoryMode)}
                      className="text-[11px] font-bold text-brand-600 hover:text-brand-700 cursor-pointer"
                    >
                      {isCustomCategoryMode ? 'Choose existing' : '+ Add new'}
                    </button>
                  </div>

                  {isCustomCategoryMode ? (
                    <input
                      type="text"
                      value={customCategoryInput}
                      onChange={(e) => setCustomCategoryInput(e.target.value)}
                      placeholder="Type new category..."
                      autoFocus
                      className="w-full px-3 py-2.5 rounded-xl border border-brand-300 bg-brand-50/40 text-xs font-semibold text-gray-800 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 outline-none"
                    />
                  ) : (
                    <select
                      value={category}
                      onChange={(e) => {
                        if (e.target.value === '__new__') {
                          setIsCustomCategoryMode(true);
                        } else {
                          setCategory(e.target.value);
                        }
                      }}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-800 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 outline-none cursor-pointer"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                      <option value="__new__">+ Create New Category...</option>
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Life, Reflections, Thoughts, Memories"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Madhurya Gowda SR"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 outline-none"
                  />
                </div>
              </div>

              {/* Cover Image Selector */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Cover Image
                  </label>
                  <button
                    type="button"
                    onClick={() => coverFileInputRef.current?.click()}
                    className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 cursor-pointer"
                  >
                    <ImageIcon size={13} /> Upload image from device
                  </button>
                  <input
                    type="file"
                    ref={coverFileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleCoverUpload}
                  />
                </div>

                <div className="flex gap-2 items-center">
                  <input
                    type="url"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="Paste image URL (https://...)"
                    className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-800 focus:border-brand-600 outline-none"
                  />
                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200 shrink-0 bg-gray-100">
                    <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                  </div>
                </div>

                {/* Cover Presets */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  <span className="text-[11px] text-gray-400 font-medium shrink-0">Presets:</span>
                  {PRESET_COVERS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setCoverImage(preset.url)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-all shrink-0 cursor-pointer ${
                        coverImage === preset.url
                          ? 'border-brand-600 bg-brand-50 text-brand-700 font-bold'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Markdown Content Editor */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-gray-200">
                  {/* Markdown Toolbar */}
                  <div className="flex items-center gap-1 flex-wrap">
                    <button
                      type="button"
                      onClick={() => insertFormatting('**', '**')}
                      className="p-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
                      title="Bold"
                    >
                      <Bold size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('*', '*')}
                      className="p-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
                      title="Italic"
                    >
                      <Italic size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('# ', '')}
                      className="p-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
                      title="Heading 1"
                    >
                      <Heading1 size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('## ', '')}
                      className="p-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
                      title="Heading 2"
                    >
                      <Heading2 size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('> ', '')}
                      className="p-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
                      title="Quote"
                    >
                      <Quote size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('```\n', '\n```')}
                      className="p-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
                      title="Code block"
                    >
                      <Code size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('- ', '')}
                      className="p-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
                      title="Bullet list"
                    >
                      <List size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('1. ', '')}
                      className="p-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
                      title="Numbered list"
                    >
                      <ListOrdered size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('[Link title](', ')')}
                      className="p-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
                      title="Add link"
                    >
                      <Link size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('\n---\n')}
                      className="p-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
                      title="Horizontal rule"
                    >
                      <Minus size={15} />
                    </button>
                  </div>

                  {/* Character, word, and reading metrics */}
                  <div className="flex items-center gap-3 text-xs text-gray-400 font-mono">
                    <span>{wordCount} words</span>
                    <span>•</span>
                    <span>~{readEstimate} min read</span>
                  </div>
                </div>

                <textarea
                  ref={textareaRef}
                  required
                  rows={14}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write in Markdown (# Heading, **bold**, `code`, etc.)..."
                  className="w-full p-4 rounded-xl border border-gray-200 font-mono text-sm leading-relaxed text-gray-900 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 outline-none resize-y"
                />
              </div>

            </form>
          ) : (
            /* Live Preview Mode */
            <div className="space-y-6">
              <div className="aspect-[21/9] w-full rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                <img src={coverImage} alt={title || 'Cover'} className="w-full h-full object-cover" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-50 text-brand-700">
                  {category}
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3 font-sans">
                  {title || 'Untitled Blog Post'}
                </h1>
                {subtitle && (
                  <p className="text-lg text-gray-600 mt-2 font-serif leading-relaxed">
                    {subtitle}
                  </p>
                )}

                <div className="flex items-center gap-3 pt-4 border-b border-gray-100 pb-4 text-xs text-gray-500 mt-4">
                  <span className="font-semibold text-gray-900">{authorName}</span>
                  <span>•</span>
                  <span>Today</span>
                  <span>•</span>
                  <span>~{readEstimate} min read</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-gray-100">
                <MarkdownRenderer content={content || '*No content entered yet.*'} />
              </div>
            </div>
          )}

        </div>

        {/* Modal Actions Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-surfaceLight flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-xs font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handlePublish}
            className="px-6 py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md hover:shadow-glow transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles size={14} />
            {editingBlog ? 'Update Blog Post' : 'Publish Article'}
          </button>
        </div>

      </div>
    </div>
  );
};
