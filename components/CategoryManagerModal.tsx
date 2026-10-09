import React, { useState } from 'react';
import { X, Plus, Trash2, Tag, Sparkles, HelpCircle, Check, BookOpen, Layers } from 'lucide-react';
import { DEFAULT_CATEGORIES } from '../utils/storage';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  onAddCategory: (newCategory: string) => void;
  onRemoveCategory: (category: string) => void;
  onSelectCategory?: (category: string) => void;
  isPublisher: boolean;
  onOpenPublisherLogin: () => void;
}

const SUGGESTED_CATEGORIES = [
  'Poetry',
  'Philosophy',
  'Memoirs',
  'Mindfulness',
  'Books & Literature',
  'Culture & Society',
  'Daily Musings',
  'Art & Photography',
  'Personal Growth',
  'Interviews',
];

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  isOpen,
  onClose,
  categories,
  onAddCategory,
  onRemoveCategory,
  onSelectCategory,
  isPublisher,
  onOpenPublisherLogin,
}) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [showHowGuide, setShowHowGuide] = useState(true);

  if (!isOpen) return null;

  const handleAdd = (nameToAdd?: string) => {
    const target = (nameToAdd !== undefined ? nameToAdd : newCategoryName).trim();
    if (!target) {
      setError('Please enter a category name.');
      return;
    }

    if (!isPublisher) {
      onOpenPublisherLogin();
      return;
    }

    const exists = categories.some((c) => c.toLowerCase() === target.toLowerCase());
    if (exists) {
      setError(`Category "${target}" already exists.`);
      return;
    }

    onAddCategory(target);
    setNewCategoryName('');
    setError(null);
    setSuccessNotice(`Category "${target}" added successfully!`);
    setTimeout(() => setSuccessNotice(null), 3000);
  };

  const handleRemove = (cat: string) => {
    if (!isPublisher) {
      onOpenPublisherLogin();
      return;
    }
    onRemoveCategory(cat);
    setSuccessNotice(`Category "${cat}" removed.`);
    setTimeout(() => setSuccessNotice(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 border border-brand-100 text-brand-600 flex items-center justify-center">
              <Layers size={20} />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-gray-900 tracking-tight font-sans">
                Categories & Topics
              </h3>
              <p className="text-xs text-gray-500 font-sans">
                Add, manage, and organize your publication topics
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto py-5 space-y-6 flex-1 pr-1">

          {/* How Option / Category Guide Card */}
          <div className="bg-surfaceLight rounded-2xl p-4 border border-gray-200/90 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                <HelpCircle size={15} className="text-brand-600" />
                <span>How to Add Categories</span>
              </div>
              <button
                onClick={() => setShowHowGuide(!showHowGuide)}
                className="text-[11px] font-semibold text-brand-600 hover:underline cursor-pointer"
              >
                {showHowGuide ? 'Hide options' : 'Show options'}
              </button>
            </div>

            {showHowGuide && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                <div className="bg-white p-3 rounded-xl border border-gray-200/70 text-xs">
                  <div className="font-bold text-gray-900 flex items-center gap-1.5 mb-1">
                    <span className="w-4 h-4 rounded-full bg-brand-100 text-brand-700 font-bold text-[10px] flex items-center justify-center">1</span>
                    Direct Input
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Type a new topic name below and click <strong>Add Category</strong>.
                  </p>
                </div>

                <div className="bg-white p-3 rounded-xl border border-gray-200/70 text-xs">
                  <div className="font-bold text-gray-900 flex items-center gap-1.5 mb-1">
                    <span className="w-4 h-4 rounded-full bg-brand-100 text-brand-700 font-bold text-[10px] flex items-center justify-center">2</span>
                    Inside Editor
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Select <strong>+ New Category...</strong> when drafting or uploading an article.
                  </p>
                </div>

                <div className="bg-white p-3 rounded-xl border border-gray-200/70 text-xs">
                  <div className="font-bold text-gray-900 flex items-center gap-1.5 mb-1">
                    <span className="w-4 h-4 rounded-full bg-brand-100 text-brand-700 font-bold text-[10px] flex items-center justify-center">3</span>
                    Markdown .md
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Include <code className="bg-gray-100 px-1 py-0.5 rounded text-[10px]">category: "Poetry"</code> in frontmatter.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Add Category Input Form */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
              Add New Category
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => {
                    setNewCategoryName(e.target.value);
                    if (error) setError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAdd();
                    }
                  }}
                  placeholder="e.g. Life Reflections, Poetry, Personal Growth..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all placeholder:font-normal placeholder:text-gray-400"
                />
              </div>
              <button
                onClick={() => handleAdd()}
                className="px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-brand-600 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Plus size={14} /> Add Category
              </button>
            </div>

            {error && (
              <p className="text-xs text-red-600 font-medium">{error}</p>
            )}

            {successNotice && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <Check size={14} className="text-emerald-600" />
                <span>{successNotice}</span>
              </div>
            )}
          </div>

          {/* Suggested Quick Add Categories */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              Quick Suggestions (Click to Add)
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_CATEGORIES.map((sugg) => {
                const alreadyAdded = categories.some((c) => c.toLowerCase() === sugg.toLowerCase());
                return (
                  <button
                    key={sugg}
                    disabled={alreadyAdded}
                    onClick={() => handleAdd(sugg)}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                      alreadyAdded
                        ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                        : 'bg-white hover:bg-brand-50 hover:text-brand-700 text-gray-700 border border-gray-200 shadow-2xs'
                    }`}
                  >
                    {alreadyAdded ? <Check size={11} /> : <Plus size={11} />}
                    {sugg}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Categories List */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Current Categories ({categories.length})
              </span>
              <span className="text-[11px] text-gray-400">
                Click any topic to filter stories
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const isDefault = DEFAULT_CATEGORIES.includes(cat);
                return (
                  <div
                    key={cat}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200 shadow-2xs text-xs font-semibold text-gray-800 group hover:border-brand-300 transition-colors"
                  >
                    <button
                      onClick={() => {
                        if (onSelectCategory) {
                          onSelectCategory(cat);
                          onClose();
                        }
                      }}
                      className="cursor-pointer hover:text-brand-600"
                      title={`Filter by ${cat}`}
                    >
                      {cat}
                    </button>
                    
                    {/* Delete option for custom categories */}
                    {!isDefault && isPublisher && (
                      <button
                        onClick={() => handleRemove(cat)}
                        className="text-gray-400 hover:text-red-600 p-0.5 rounded transition-colors cursor-pointer"
                        title={`Remove "${cat}" category`}
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between shrink-0">
          <p className="text-[11px] text-gray-400">
            Categories are synchronized across your feed and editor.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
