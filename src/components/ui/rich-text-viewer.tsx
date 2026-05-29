"use client";
import React from 'react';

interface RichTextViewProps {
  /** HTML content to display */
  content: string;
  /** Additional CSS classes for the container */
  className?: string;
  /** Minimum height of the view container */
  minHeight?: string;
  /** Maximum height of the view container (adds scroll if exceeded) */
  maxHeight?: string;
  /** Whether to show a border around the content */
  showBorder?: boolean;
}

const RichTextView: React.FC<RichTextViewProps> = ({
  content,
  className = '',
  minHeight,
  maxHeight,
  showBorder = false,
}) => {
  return (
    <div
      className={`rich-text-view ${showBorder ? 'border border-gray-800 rounded-2xl' : ''} bg-transparent overflow-hidden ${className}`}
      style={{ minHeight, maxHeight, overflow: maxHeight ? 'auto' : 'visible' }}
    >
      <div
        className="rtv-content prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      <style jsx>{`
        /* ── Headings ─────────────────────────────────────────────────── */
        .rtv-content :global(h1) {
          font-size: 2em;
          font-weight: 800;
          margin: 0.7em 0 0.3em;
          color: #f9fafb;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }
        .rtv-content :global(h2) {
          font-size: 1.5em;
          font-weight: 700;
          margin: 0.6em 0 0.3em;
          color: #f3f4f6;
          line-height: 1.3;
        }
        .rtv-content :global(h3) {
          font-size: 1.2em;
          font-weight: 700;
          margin: 0.5em 0 0.25em;
          color: #e5e7eb;
          line-height: 1.4;
        }

        /* ── Paragraphs ───────────────────────────────────────────────── */
        .rtv-content :global(p) {
          margin: 0.6rem 0;
          line-height: 1.8;
          color: #9ca3af;
        }

        /* ── Inline formatting ────────────────────────────────────────── */
        .rtv-content :global(strong) { font-weight: 700; color: #f9fafb; }
        .rtv-content :global(em)     { font-style: italic; color: #d1d5db; }
        .rtv-content :global(u)      { text-decoration: underline; text-underline-offset: 3px; }
        .rtv-content :global(s)      { text-decoration: line-through; color: #6b7280; }

        /* ── Lists ────────────────────────────────────────────────────── */
        .rtv-content :global(ul),
        .rtv-content :global(ol) {
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
        .rtv-content :global(li) {
          margin: 0.3rem 0;
          color: #9ca3af;
          line-height: 1.7;
        }
        .rtv-content :global(ul li::marker) { color: #3b82f6; }
        .rtv-content :global(ol li::marker) { color: #60a5fa; font-weight: 700; }

        /* ── Code ─────────────────────────────────────────────────────── */
        .rtv-content :global(code) {
          background: #1e3a5f;
          padding: 0.15em 0.45em;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
          font-size: 0.88em;
          color: #93c5fd;
          border: 1px solid #1d4ed8;
        }
        .rtv-content :global(pre) {
          background: #0f172a;
          color: #e2e8f0;
          padding: 1.25rem;
          border-radius: 0.75rem;
          overflow-x: auto;
          margin: 1rem 0;
          border: 1px solid #1e293b;
        }
        .rtv-content :global(pre code) {
          background: none;
          padding: 0;
          color: inherit;
          border: none;
        }

        /* ── Blockquote ───────────────────────────────────────────────── */
        .rtv-content :global(blockquote) {
          border-left: 3px solid #3b82f6;
          padding: 0.875rem 1.25rem;
          margin: 1.25rem 0;
          background: #1e3a5f22;
          border-radius: 0 0.625rem 0.625rem 0;
          color: #93c5fd;
          font-style: italic;
        }

        /* ── Links ────────────────────────────────────────────────────── */
        .rtv-content :global(a) {
          color: #60a5fa;
          text-decoration: underline;
          text-underline-offset: 3px;
          transition: color 0.15s;
        }
        .rtv-content :global(a:hover) { color: #93c5fd; }

        /* ── Images ───────────────────────────────────────────────────── */
        .rtv-content :global(img) {
          display: block;
          max-width: 100%;
          height: auto;
          border-radius: 0.75rem;
          margin: 1.5rem auto;
          border: 1px solid #1f2937;
        }
        .rtv-content :global(hr) { border-color: #1f2937; margin: 1.5rem 0; }

        /* ── Text alignment ───────────────────────────────────────────── */
        .rtv-content :global([style*="text-align: center"]) { text-align: center; }
        .rtv-content :global([style*="text-align: right"])  { text-align: right;  }
        .rtv-content :global([style*="text-align: left"])   { text-align: left;   }
      `}</style>
    </div>
  );
};

export default RichTextView;