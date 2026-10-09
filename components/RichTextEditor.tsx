import React, { useState, useRef } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Eye,
  Edit3,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write your story here...',
}) => {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertTag = (openTag: string, closeTag: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const replacement = `${openTag}${selectedText || 'text'}${closeTag}`;

    const newValue =
      textarea.value.substring(0, start) + replacement + textarea.value.substring(end);

    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + openTag.length,
        start + openTag.length + (selectedText ? selectedText.length : 4)
      );
    }, 0);
  };

  const handleLink = () => {
    const url = window.prompt('Enter link destination URL:', 'https://');
    if (url) {
      insertTag(`<a href="${url}" target="_blank" rel="noopener noreferrer">`, '</a>');
    }
  };

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-gray-900 focus-within:border-brand-500 transition-colors">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-1 p-2 bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300">
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => insertTag('<strong>', '</strong>')}
            className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            title="Bold"
          >
            <Bold size={15} />
          </button>
          <button
            type="button"
            onClick={() => insertTag('<em>', '</em>')}
            className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            title="Italic"
          >
            <Italic size={15} />
          </button>
          <button
            type="button"
            onClick={() => insertTag('<u>', '</u>')}
            className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            title="Underline"
          >
            <Underline size={15} />
          </button>

          <span className="w-px h-5 bg-gray-300 dark:bg-gray-700 mx-1" />

          <button
            type="button"
            onClick={() => insertTag('<h2>', '</h2>')}
            className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            title="Heading 2"
          >
            <Heading2 size={15} />
          </button>
          <button
            type="button"
            onClick={() => insertTag('<h3>', '</h3>')}
            className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            title="Heading 3"
          >
            <Heading3 size={15} />
          </button>

          <span className="w-px h-5 bg-gray-300 dark:bg-gray-700 mx-1" />

          <button
            type="button"
            onClick={() => insertTag('<ul>\n  <li>', '</li>\n</ul>')}
            className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            title="Bullet List"
          >
            <List size={15} />
          </button>
          <button
            type="button"
            onClick={() => insertTag('<ol>\n  <li>', '</li>\n</ol>')}
            className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            title="Numbered List"
          >
            <ListOrdered size={15} />
          </button>
          <button
            type="button"
            onClick={() => insertTag('<blockquote>', '</blockquote>')}
            className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            title="Blockquote"
          >
            <Quote size={15} />
          </button>
          <button
            type="button"
            onClick={() => insertTag('<pre><code>', '</code></pre>')}
            className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            title="Code Block"
          >
            <Code size={15} />
          </button>
          <button
            type="button"
            onClick={handleLink}
            className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            title="Insert Link"
          >
            <LinkIcon size={15} />
          </button>
        </div>

        {/* Tab Switcher: Write vs Preview */}
        <div className="flex items-center gap-1 bg-gray-200 dark:bg-gray-700 p-0.5 rounded-lg text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
              activeTab === 'write'
                ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Edit3 size={12} /> Write
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
              activeTab === 'preview'
                ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Eye size={12} /> Preview
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      {activeTab === 'write' ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={15}
          className="w-full p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-serif text-base sm:text-lg leading-relaxed outline-none resize-y min-h-[300px] placeholder:text-gray-400"
        />
      ) : (
        <div className="p-6 min-h-[300px] bg-white dark:bg-gray-900 prose dark:prose-invert max-w-none font-serif text-base sm:text-lg leading-relaxed overflow-auto">
          {value ? (
            <div
              dangerouslySetInnerHTML={{ __html: value }}
              className="space-y-4 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:font-sans [&>h2]:mt-6 [&>h3]:text-xl [&>h3]:font-bold [&>h3]:font-sans [&>h3]:mt-4 [&>blockquote]:border-l-4 [&>blockquote]:border-brand-500 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-gray-600 dark:[&>blockquote]:text-gray-300 [&>ul]:list-disc [&>ul]:pl-6 [&>ol]:list-decimal [&>ol]:pl-6 [&>pre]:bg-gray-100 dark:[&>pre]:bg-gray-800 [&>pre]:p-4 [&>pre]:rounded-xl [&>pre]:font-mono [&>a]:text-brand-600 [&>a]:underline"
            />
          ) : (
            <p className="text-gray-400 italic">Nothing to preview yet. Start writing in the editor tab.</p>
          )}
        </div>
      )}
    </div>
  );
};
