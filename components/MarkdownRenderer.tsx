import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  // Helper to parse basic markdown elements safely without heavy external libraries
  const renderFormattedText = (text: string) => {
    // Process inline bold, italic, code, links
    const parts: React.ReactNode[] = [];
    let current = text;
    let keyIdx = 0;

    // Replace inline formatting
    const tokens = current.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g);

    return tokens.map((token, i) => {
      if (token.startsWith('`') && token.endsWith('`') && token.length >= 2) {
        return (
          <code key={i} className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 font-mono text-sm border border-gray-200">
            {token.slice(1, -1)}
          </code>
        );
      }
      if (token.startsWith('**') && token.endsWith('**') && token.length >= 4) {
        return <strong key={i} className="font-bold text-gray-900">{token.slice(2, -2)}</strong>;
      }
      if (token.startsWith('*') && token.endsWith('*') && token.length >= 2) {
        return <em key={i} className="italic text-gray-800">{token.slice(1, -1)}</em>;
      }
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        return (
          <a
            key={i}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-600 hover:text-brand-700 underline underline-offset-4 decoration-brand-200 hover:decoration-brand-500 font-medium transition-colors"
          >
            {linkMatch[1]}
          </a>
        );
      }
      return token;
    });
  };

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  let i = 0;
  let codeBlockCount = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block ```
    if (line.trim().startsWith('```')) {
      const lang = line.trim().slice(3).trim() || 'plaintext';
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      const codeString = codeLines.join('\n');
      const currentIndex = codeBlockCount++;

      elements.push(
        <div key={`code-${i}`} className="my-6 rounded-2xl overflow-hidden border border-gray-800 bg-[#111625] shadow-lg group">
          <div className="flex items-center justify-between px-4 py-2 bg-[#0B0F19] border-b border-gray-800/80 text-xs font-mono text-gray-400">
            <span className="uppercase tracking-wider">{lang}</span>
            <button
              onClick={() => handleCopyCode(codeString, currentIndex)}
              className="flex items-center gap-1.5 text-gray-400 hover:text-white px-2 py-1 rounded transition-colors text-xs cursor-pointer"
            >
              {copiedCodeIndex === currentIndex ? (
                <>
                  <Check size={13} className="text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-4 sm:p-5 text-sm font-mono text-gray-200 overflow-x-auto leading-relaxed">
            <code>{codeString}</code>
          </pre>
        </div>
      );
      i++;
      continue;
    }

    // Headings
    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={i} className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mt-10 mb-4 first:mt-0 font-sans">
          {line.replace(/^#\s+/, '')}
        </h1>
      );
      i++;
      continue;
    }
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mt-10 mb-4 font-sans border-b border-gray-100 pb-2">
          {line.replace(/^##\s+/, '')}
        </h2>
      );
      i++;
      continue;
    }
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight mt-8 mb-3 font-sans">
          {line.replace(/^###\s+/, '')}
        </h3>
      );
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      const quoteLines: string[] = [line.replace(/^>\s+/, '')];
      while (i + 1 < lines.length && lines[i + 1].startsWith('> ')) {
        i++;
        quoteLines.push(lines[i].replace(/^>\s+/, ''));
      }
      elements.push(
        <blockquote
          key={i}
          className="my-6 pl-5 border-l-4 border-brand-500 py-2 bg-brand-50/40 rounded-r-xl italic text-gray-800 text-lg font-serif"
        >
          {quoteLines.map((ql, qIdx) => (
            <p key={qIdx} className="leading-relaxed">{renderFormattedText(ql)}</p>
          ))}
        </blockquote>
      );
      i++;
      continue;
    }

    // Unordered List (- or *)
    if (line.match(/^[-*]\s+/)) {
      const listItems: string[] = [line.replace(/^[-*]\s+/, '')];
      while (i + 1 < lines.length && lines[i + 1].match(/^[-*]\s+/)) {
        i++;
        listItems.push(lines[i].replace(/^[-*]\s+/, ''));
      }
      elements.push(
        <ul key={i} className="my-4 space-y-2 list-disc list-outside pl-6 text-gray-700 leading-relaxed font-sans text-base sm:text-lg">
          {listItems.map((item, lIdx) => (
            <li key={lIdx} className="pl-1">
              {renderFormattedText(item)}
            </li>
          ))}
        </ul>
      );
      i++;
      continue;
    }

    // Ordered List (1. ...)
    if (line.match(/^\d+\.\s+/)) {
      const listItems: string[] = [line.replace(/^\d+\.\s+/, '')];
      while (i + 1 < lines.length && lines[i + 1].match(/^\d+\.\s+/)) {
        i++;
        listItems.push(lines[i].replace(/^\d+\.\s+/, ''));
      }
      elements.push(
        <ol key={i} className="my-4 space-y-2 list-decimal list-outside pl-6 text-gray-700 leading-relaxed font-sans text-base sm:text-lg">
          {listItems.map((item, lIdx) => (
            <li key={lIdx} className="pl-1">
              {renderFormattedText(item)}
            </li>
          ))}
        </ol>
      );
      i++;
      continue;
    }

    // Image ![alt](url)
    const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      elements.push(
        <figure key={i} className="my-8">
          <img
            src={imgMatch[2]}
            alt={imgMatch[1] || 'Blog illustration'}
            className="w-full rounded-2xl border border-gray-200 shadow-sm object-cover max-h-[500px]"
            loading="lazy"
          />
          {imgMatch[1] && (
            <figcaption className="text-center text-xs text-gray-500 mt-2 font-sans italic">
              {imgMatch[1]}
            </figcaption>
          )}
        </figure>
      );
      i++;
      continue;
    }

    // Horizontal Rule
    if (line.trim() === '---' || line.trim() === '***') {
      elements.push(<hr key={i} className="my-10 border-gray-200" />);
      i++;
      continue;
    }

    // Normal Paragraph
    if (line.trim() !== '') {
      elements.push(
        <p key={i} className="my-5 text-gray-700 text-lg leading-relaxed font-serif tracking-normal">
          {renderFormattedText(line)}
        </p>
      );
    }

    i++;
  }

  return (
    <div className="prose prose-neutral max-w-none">
      {elements}
    </div>
  );
};
