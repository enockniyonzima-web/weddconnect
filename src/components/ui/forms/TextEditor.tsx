/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent, NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import { Node, mergeAttributes } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  Underline as UnderlineIconLucide,
  Strikethrough,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link2,
  Undo,
  Redo,
  Code,
  ImagePlus,
  Loader2,
  Trash2,
  Maximize2,
  Minimize2,
  LayoutGrid,
  Square,
  Columns2,
  Columns3,
  MoveHorizontal,
} from 'lucide-react';
import { uploadSingleImage } from '@/util/s3Helpers';

// ─── Image Size / Layout Types ────────────────────────────────────────────

type ImageSize   = 'sm' | 'md' | 'lg' | 'full';
type ImageLayout = 'single' | 'two-col' | 'three-col' | 'side-left' | 'side-right';

const SIZE_WIDTHS: Record<ImageSize, string> = {
  sm:   '35%',
  md:   '60%',
  lg:   '80%',
  full: '100%',
};

const SIZE_LABELS: Record<ImageSize, string> = {
  sm:   'Small',
  md:   'Medium',
  lg:   'Large',
  full: 'Full',
};

// ─── Image Node View ──────────────────────────────────────────────────────

interface ImageNodeViewProps {
  node: { attrs: { src: string; alt?: string; size: ImageSize; layout: ImageLayout } };
  updateAttributes: (attrs: Partial<{ size: ImageSize; layout: ImageLayout }>) => void;
  deleteNode: () => void;
  selected: boolean;
  editor: any;
  getPos: () => number;
}

const ImageNodeView = ({ node, updateAttributes, deleteNode, selected, editor, getPos }: ImageNodeViewProps) => {
  const { src, alt, size, layout } = node.attrs;
  const [showControls, setShowControls] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    deleteNode();
  };

  // After changing layout/size, move cursor to just after this node so it's
  // deselected — prevents the next image insert from replacing this node.
  const handleUpdateAttr = (e: React.MouseEvent, attrs: Partial<{ size: ImageSize; layout: ImageLayout }>) => {
    e.preventDefault();
    e.stopPropagation();
    updateAttributes(attrs);
    // Move cursor past this node
    try {
      const pos = getPos();
      editor.commands.setTextSelection(pos + 1);
    } catch (_) {}
  };

  const sizeIcons: { key: ImageSize; icon: React.ReactNode; label: string }[] = [
    { key: 'sm',   icon: <Minimize2   size={13} />, label: 'Small'  },
    { key: 'md',   icon: <Square      size={13} />, label: 'Medium' },
    { key: 'lg',   icon: <Maximize2   size={13} />, label: 'Large'  },
    { key: 'full', icon: <MoveHorizontal size={13} />, label: 'Full' },
  ];

  const layoutIcons: { key: ImageLayout; icon: React.ReactNode; label: string }[] = [
    { key: 'single',      icon: <Square    size={13} />, label: 'Single'     },
    { key: 'two-col',     icon: <Columns2  size={13} />, label: '2 columns'  },
    { key: 'three-col',   icon: <Columns3  size={13} />, label: '3 columns'  },
    { key: 'side-left',   icon: <AlignLeft  size={13} />, label: 'Float left'  },
    { key: 'side-right',  icon: <AlignRight size={13} />, label: 'Float right' },
  ];

  // Compute inner wrapper style — outer NodeViewWrapper div controls block/grid sizing via CSS.
  const getWrapperStyle = (): React.CSSProperties => {
    switch (layout) {
      case 'side-left':  return { float: 'left',  width: SIZE_WIDTHS[size], marginRight: '12px', marginBottom: '8px' };
      case 'side-right': return { float: 'right', width: SIZE_WIDTHS[size], marginLeft:  '12px', marginBottom: '8px' };
      default:           return { width: '100%' };
    }
  };

  const isGridLayout = layout === 'two-col' || layout === 'three-col';
  void isGridLayout;

  // The NodeViewWrapper must always be inline (span) because the node is inline: true.
  // We use a data-layout attribute and handle actual block/grid display in CSS.
  return (
    <NodeViewWrapper
      as="div"
      data-layout={layout}
      data-size={size}
      className="editor-image-node"
    >
      <div
        style={{ ...getWrapperStyle(), position: 'relative' }}
        className={`editor-image-wrapper${selected ? ' editor-image-selected' : ''}`}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* The actual image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt ?? ''}
          style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '0.625rem' }}
          draggable={false}
        />

        {/* Controls overlay — visible on hover or when selected */}
        {(showControls || selected) && (
          <span
            contentEditable={false}
            style={{
              position: 'absolute', inset: 0, borderRadius: '0.625rem',
              background: 'rgba(0,0,0,0.45)', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'space-between',
              padding: '8px', zIndex: 20, userSelect: 'none',
            }}
          >
            {/* Top row: layout controls */}
            <span style={{ display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              {layoutIcons.map(({ key, icon, label }) => (
                <button
                  key={key}
                  type="button"
                  title={label}
                  onMouseDown={(e) => handleUpdateAttr(e, { layout: key })}
                  style={{
                    padding: '4px 6px',
                    borderRadius: '5px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                    fontSize: '11px',
                    fontWeight: 600,
                    transition: 'background 0.15s',
                    background: layout === key ? '#3b82f6' : 'rgba(255,255,255,0.18)',
                    color: layout === key ? '#ffffff' : '#f9fafb',
                  }}
                >
                  {icon}
                  <span style={{ display: 'none' }}>{label}</span>
                </button>
              ))}
            </span>

            {/* Middle: size pills */}
            <span style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              {sizeIcons.map(({ key, icon, label }) => (
                <button
                  key={key}
                  type="button"
                  title={label}
                  onMouseDown={(e) => handleUpdateAttr(e, { size: key })}
                  style={{
                    padding: '3px 8px',
                    borderRadius: '20px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    fontWeight: 700,
                    transition: 'background 0.15s',
                    background: size === key ? '#3b82f6' : 'rgba(255,255,255,0.18)',
                    color: size === key ? '#ffffff' : '#f9fafb',
                  }}
                >
                  {icon}
                  {label}
                </button>
              ))}
            </span>

            {/* Bottom: delete */}
            <span>
              <button
                type="button"
                title="Remove image"
                onMouseDown={handleDelete}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '12px',
                  fontWeight: 700,
                  background: '#ef4444',
                  color: '#fff',
                }}
              >
                <Trash2 size={13} />
                Remove
              </button>
            </span>
          </span>
        )}
      </div>
    </NodeViewWrapper>
  );
};

// ─── Custom Image Extension ───────────────────────────────────────────────

const EditorImage = Node.create({
  name: 'editorImage',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src:    { default: null },
      alt:    { default: '' },
      title:  { default: null },
      size:   {
        default: 'full' as ImageSize,
        parseHTML: (el) => (el.getAttribute('data-size') as ImageSize) || 'full',
        renderHTML: (attrs) => ({ 'data-size': attrs.size }),
      },
      layout: {
        default: 'single' as ImageLayout,
        parseHTML: (el) => (el.getAttribute('data-layout') as ImageLayout) || 'single',
        renderHTML: (attrs) => ({ 'data-layout': attrs.layout }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'img[src]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView as any);
  },

  addCommands() {
    return {
      setEditorImage: (attrs: { src: string; alt?: string }) => ({ state, commands }: any) => {
        // If an editorImage atom node is currently selected, move cursor past it
        // so the new image inserts after it rather than replacing it.
        const { selection } = state;
        const selNode = (selection as any).node;
        if (selNode && selNode.type.name === 'editorImage') {
          const endPos = (selection as any).from + selNode.nodeSize;
          commands.setTextSelection(endPos);
        }
        return commands.insertContent({
          type: this.name,
          attrs: { ...attrs, size: 'full', layout: 'single' },
        });
      },
    } as any;
  },
});

// ─── Menu Button ─────────────────────────────────────────────────────────

interface MenuButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
}

const MenuButton = ({ onClick, isActive, disabled, children, title }: MenuButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    type="button"
    className={`p-2 rounded-md transition-all duration-150 ${
      isActive
        ? 'bg-blue-600 text-white shadow-sm'
        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
    } ${disabled ? 'opacity-30 cursor-not-allowed pointer-events-none' : ''}`}
  >
    {children}
  </button>
);

// ─── Divider ─────────────────────────────────────────────────────────────────

const ToolbarDivider = () => (
  <div className="w-px h-6 bg-gray-700 self-center mx-0.5" />
);

// ─── Props ───────────────────────────────────────────────────────────────────

interface RichTextEditorProps {
  defaultValue?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  editable?: boolean;
  minHeight?: string;
  maxHeight?: string;
  /** S3 folder to upload images into */
  imageFolder?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export const RichTextEditor = ({
  defaultValue = '',
  onChange,
  placeholder = 'Start typing...',
  editable = true,
  minHeight = '200px',
  maxHeight = '500px',
  imageFolder = 'editor-images',
}: RichTextEditorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  // Tracks whether the last content change came from inside the editor (typing/deleting)
  // vs from outside (parent loading saved data). Prevents the feedback loop:
  //   edit → onChange → parent setState → new defaultValue → setContent → edit → …
  const isInternalChange = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-blue-400 underline hover:text-blue-300' },
      }),
      Placeholder.configure({ placeholder }),
      EditorImage,
    ],
    content: defaultValue,
    editable,
    onUpdate: ({ editor }) => {
      isInternalChange.current = true;
      onChange?.(editor.getHTML());
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!editor) return;
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }
    const current = editor.getHTML();
    if (defaultValue !== current) {
      // Defer out of the React render cycle to avoid the flushSync-inside-lifecycle warning.
      // setContent internally calls flushSync on the ProseMirror view; scheduling it as a
      // microtask ensures React has finished its current render pass first.
      queueMicrotask(() => {
        editor.commands.setContent(defaultValue ?? '', { emitUpdate: false });
      });
    }
  }, [defaultValue, editor]);

  // ── Image Upload ──────────────────────────────────────────────────────────

  const insertImageFromFile = useCallback(
    async (file: File) => {
      if (!editor) return;
      if (!file.type.startsWith('image/')) return;

      setUploadingImage(true);
      try {
        const url = await uploadSingleImage(file, imageFolder);
        if (url) {
          // If an editorImage node is currently selected (atom node selection),
          // move the cursor to just after it so we insert a new image, not replace.
          const { selection } = editor.state;
          const selNode = (selection as any).node;
          if (selNode && selNode.type.name === 'editorImage') {
            const endPos = (selection as any).from + selNode.nodeSize;
            editor.commands.setTextSelection(endPos);
          }
          (editor.chain().focus() as any).setEditorImage({ src: url, alt: file.name }).run();
        }
      } finally {
        setUploadingImage(false);
      }
    },
    [editor, imageFolder],
  );

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await insertImageFromFile(file);
    // reset so same file can be picked again
    e.target.value = '';
  };

  // ── Drag & Drop into editor area ─────────────────────────────────────────

  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      const file = Array.from(e.dataTransfer.files).find((f) =>
        f.type.startsWith('image/'),
      );
      if (file) await insertImageFromFile(file);
    },
    [insertImageFromFile],
  );

  // ── Paste images ─────────────────────────────────────────────────────────

  useEffect(() => {
    if (!editor) return;
    const dom = editor.view.dom as HTMLElement;

    const handlePaste = async (e: ClipboardEvent) => {
      const items = Array.from(e.clipboardData?.items ?? []);
      const imageItem = items.find((i) => i.type.startsWith('image/'));
      if (!imageItem) return;
      e.preventDefault();
      const file = imageItem.getAsFile();
      if (file) await insertImageFromFile(file);
    };

    dom.addEventListener('paste', handlePaste);
    return () => dom.removeEventListener('paste', handlePaste);
  }, [editor, insertImageFromFile]);

  // ── Link ─────────────────────────────────────────────────────────────────

  const setLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) editor?.chain().focus().setLink({ href: url }).run();
  };

  if (!editor) return null;

  return (
    <div className="w-full rounded-xl overflow-hidden bg-gray-900 border-2 border-gray-800 shadow-sm focus-within:border-blue-600/50 transition-colors duration-200">

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* ── Toolbar ──────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b-2 border-gray-800 bg-gray-950">

        {/* Formatting */}
        <MenuButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold (Ctrl+B)">
          <Bold size={16} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic (Ctrl+I)">
          <Italic size={16} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Underline (Ctrl+U)">
          <UnderlineIconLucide size={16} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} title="Strikethrough">
          <Strikethrough size={16} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleCode().run()} isActive={editor.isActive('code')} title="Inline Code">
          <Code size={16} />
        </MenuButton>

        <ToolbarDivider />

        {/* Headings */}
        <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} title="Heading 1">
          <Heading1 size={16} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} title="Heading 2">
          <Heading2 size={16} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} title="Heading 3">
          <Heading3 size={16} />
        </MenuButton>

        <ToolbarDivider />

        {/* Lists */}
        <MenuButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet List">
          <List size={16} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Numbered List">
          <ListOrdered size={16} />
        </MenuButton>

        <ToolbarDivider />

        {/* Alignment */}
        <MenuButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} title="Align Left">
          <AlignLeft size={16} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} title="Align Center">
          <AlignCenter size={16} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} title="Align Right">
          <AlignRight size={16} />
        </MenuButton>

        <ToolbarDivider />

        {/* Link */}
        <MenuButton onClick={setLink} isActive={editor.isActive('link')} title="Insert Link">
          <Link2 size={16} />
        </MenuButton>

        {/* Image Upload */}
        <button
          type="button"
          title="Insert Image"
          onClick={handleImageButtonClick}
          disabled={uploadingImage}
          className={`p-2 rounded-md transition-all duration-150 flex items-center gap-1.5 text-sm font-semibold
            ${uploadingImage
              ? 'bg-blue-600/20 text-blue-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-500 shadow-sm'
            }`}
        >
          {uploadingImage ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span className="hidden sm:inline">Uploading…</span>
            </>
          ) : (
            <>
              <ImagePlus size={16} />
              <span className="hidden sm:inline">Image</span>
            </>
          )}
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Undo / Redo */}
        <MenuButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo (Ctrl+Z)">
          <Undo size={16} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo (Ctrl+Y)">
          <Redo size={16} />
        </MenuButton>
      </div>

      {/* ── Editor Content Area ───────────────────────────────────────────── */}
      <div
        className={`relative transition-colors duration-150 ${dragOver ? 'bg-blue-950/30' : 'bg-gray-900'}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {/* Drag overlay */}
        {dragOver && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center border-2 border-dashed border-blue-500 rounded-b-xl bg-blue-950/60 pointer-events-none">
            <ImagePlus size={36} className="text-blue-400 mb-2" />
            <p className="text-blue-300 font-bold text-sm">Drop image to insert</p>
          </div>
        )}

        {/* Uploading overlay */}
        {uploadingImage && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-900/80 pointer-events-none">
            <Loader2 size={32} className="text-blue-500 animate-spin mb-2" />
            <p className="text-gray-300 font-semibold text-sm">Uploading image…</p>
          </div>
        )}

        <EditorContent
          editor={editor}
          className="editor-content"
          style={{ minHeight, maxHeight, overflow: 'auto' }}
        />
      </div>

      {/* ── Hint bar ─────────────────────────────────────────────────────── */}
      {editable && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-950 border-t border-gray-800 text-[11px] text-gray-500 font-medium">
          <ImagePlus size={11} />
          <span>Drag & drop or paste an image anywhere in the editor</span>
        </div>
      )}

      {/* ── Styles ───────────────────────────────────────────────────────── */}
      <style jsx global>{`

        /* ── ProseMirror base ─────────────────────────────────────────────── */
        .editor-content .ProseMirror {
          padding: 1rem 1.25rem;
          outline: none;
          min-height: ${minHeight};
          font-family: inherit;
          font-size: 0.9375rem;
          line-height: 1.7;
          color: #e5e7eb;
        }

        .editor-content .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #6b7280;
          pointer-events: none;
          height: 0;
          font-style: italic;
        }

        /* Headings */
        .editor-content .ProseMirror h1 { font-size: 2em; font-weight: 800; margin: 0.75em 0 0.3em; color: #ffffff; line-height: 1.2; }
        .editor-content .ProseMirror h2 { font-size: 1.5em; font-weight: 700; margin: 0.75em 0 0.3em; color: #f9fafb; line-height: 1.3; }
        .editor-content .ProseMirror h3 { font-size: 1.2em; font-weight: 700; margin: 0.75em 0 0.3em; color: #f3f4f6; line-height: 1.4; }

        /* Paragraph */
        .editor-content .ProseMirror p { margin: 0.5em 0; line-height: 1.7; color: #d1d5db; }

        /* Lists */
        .editor-content .ProseMirror ul,
        .editor-content .ProseMirror ol { padding-left: 1.5rem; margin: 0.5rem 0; }
        .editor-content .ProseMirror li { margin: 0.25rem 0; color: #d1d5db; }
        .editor-content .ProseMirror ul li::marker { color: #3b82f6; }

        /* Code */
        .editor-content .ProseMirror code {
          background: #1e3a5f; padding: 0.15em 0.4em;
          border-radius: 4px; font-family: monospace;
          font-size: 0.88em; color: #93c5fd;
        }
        .editor-content .ProseMirror pre {
          background: #0f172a; color: #e2e8f0;
          padding: 1rem; border-radius: 0.625rem;
          overflow-x: auto; margin: 1rem 0;
          border: 1px solid #1e293b;
        }
        .editor-content .ProseMirror pre code { background: none; padding: 0; color: inherit; }

        /* Blockquote */
        .editor-content .ProseMirror blockquote {
          border-left: 4px solid #3b82f6; padding: 0.75rem 1rem;
          margin: 1rem 0; background: #1e3a5f1a;
          border-radius: 0 0.5rem 0.5rem 0; color: #93c5fd; font-style: italic;
        }

        /* Links */
        .editor-content .ProseMirror a { color: #60a5fa; text-decoration: underline; }
        .editor-content .ProseMirror a:hover { color: #93c5fd; }

        /* Horizontal rule */
        .editor-content .ProseMirror hr { border: none; border-top: 2px solid #374151; margin: 1.5rem 0; }

        /* ── Image node ───────────────────────────────────────────────────── */

        /*
         * The NodeViewWrapper div (.editor-image-node) is the block-level container.
         * Its width is controlled by the data-size attribute.
         * data-layout controls how it sits relative to siblings.
         */

        /* Default: single, centred */
        .editor-content .ProseMirror .editor-image-node {
          display: block;
          margin: 1rem auto;
          max-width: 100%;
          width: 100%;
        }

        /* Size variants — applied via inline style on the inner wrapper for
           'single' layout. For grid/float the outer node controls the width. */
        .editor-content .ProseMirror .editor-image-node[data-size="sm"]   { width: 35%;  }
        .editor-content .ProseMirror .editor-image-node[data-size="md"]   { width: 60%;  }
        .editor-content .ProseMirror .editor-image-node[data-size="lg"]   { width: 80%;  }
        .editor-content .ProseMirror .editor-image-node[data-size="full"] { width: 100%; }

        /* Grid layouts */
        .editor-content .ProseMirror .editor-image-node[data-layout="two-col"] {
          display: inline-block;
          width: calc(50% - 6px) !important;
          margin: 4px 3px;
          vertical-align: top;
        }
        .editor-content .ProseMirror .editor-image-node[data-layout="three-col"] {
          display: inline-block;
          width: calc(33.33% - 6px) !important;
          margin: 4px 3px;
          vertical-align: top;
        }

        /* Float layouts */
        .editor-content .ProseMirror .editor-image-node[data-layout="side-left"] {
          float: left;
          margin: 4px 14px 8px 0;
        }
        .editor-content .ProseMirror .editor-image-node[data-layout="side-right"] {
          float: right;
          margin: 4px 0 8px 14px;
        }

        /* Inner wrapper */
        .editor-content .ProseMirror .editor-image-wrapper {
          position: relative;
          display: block;
          width: 100%;
          border-radius: 0.75rem;
          border: 2px solid transparent;
          box-shadow: 0 4px 16px rgba(0,0,0,0.3);
          overflow: hidden;
          transition: border-color 0.2s, box-shadow 0.2s;
          cursor: default;
          line-height: 0;
          background: #1f2937;
        }
        .editor-content .ProseMirror .editor-image-wrapper:hover,
        .editor-content .ProseMirror .editor-image-wrapper.editor-image-selected {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.25), 0 4px 20px rgba(0,0,0,0.3);
        }

        /* Kill ProseMirror's default blue selection outline on our atom node */
        .editor-content .ProseMirror .editor-image-node.ProseMirror-selectednode > .editor-image-wrapper {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.25), 0 4px 20px rgba(0,0,0,0.3);
          outline: none;
        }
        .editor-content .ProseMirror .editor-image-node.ProseMirror-selectednode {
          outline: none !important;
        }

        /* Clearfix after float images */
        .editor-content .ProseMirror p:has(.editor-image-node[data-layout="side-left"]),
        .editor-content .ProseMirror p:has(.editor-image-node[data-layout="side-right"]) {
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

