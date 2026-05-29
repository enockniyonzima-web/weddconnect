"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  BookOpen, Tag, FolderOpen, Image as ImageIcon, Video, Settings,
  Save, Trash2, Plus, ChevronDown, Send, Archive, RotateCcw, MessageSquare,
} from "lucide-react";
import { RichTextEditor } from "@/components/ui/forms/TextEditor";
import { ImageUploader } from "@/components/ui/upload/ImageUploader";
import { VideoPreview } from "@/components/ui/upload/VideoPreview";
import { useAuthContext } from "@/components/context/AuthContext";
import queryClient from "@/lib/queryClient";
import { type Prisma } from "@prisma/client";
import {
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  fetchBlogPostById,
} from "@/server-actions/blog/blog-post";
import { fetchBlogCategorys } from "@/server-actions/blog/blog-category";
import { fetchBlogTags } from "@/server-actions/blog/blog-tag";

import { EBlogPostStatus } from "@prisma/client";
import { BlogCategoryFormBtn } from "@/components/forms/blog/BlogCategoryForm";
import { BlogTagFormBtn } from "@/components/forms/blog/BlogTagForm";
import { SBlogPostEdit, TBlogPostEdit } from "@/select-types/blog/blog-post";
import { SBlogCategoryOption } from "@/select-types/blog/blog-category";
import { SBlogTagOption } from "@/select-types/blog/blog-tag";

// ─── Slugify ──────────────────────────────────────────────────────────────────
const slugify = (str: string) =>
  str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// ─── Section wrapper ──────────────────────────────────────────────────────────
const Section = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-3">
    <div className="flex items-center gap-2 pb-2 border-b border-gray-800">
      <span className="text-blue-400">{icon}</span>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">{title}</h3>
    </div>
    {children}
  </div>
);

// ─── Field ────────────────────────────────────────────────────────────────────
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium text-gray-500">{label}</label>
    {children}
  </div>
);

// ─── Toggle Switch ────────────────────────────────────────────────────────────
const Switch = ({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl border border-gray-800 bg-gray-900/60 hover:border-gray-700 transition-colors"
  >
    <span className="flex items-center gap-2 text-xs text-gray-400">
      <MessageSquare size={13} className={checked ? "text-blue-400" : "text-gray-600"} />
      {label}
    </span>
    <span className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors duration-200 ${checked ? "bg-blue-600" : "bg-gray-700"}`}>
      <span className={`inline-block h-4 w-4 mt-0.5 rounded-full bg-white shadow transition-transform duration-200 ${checked ? "translate-x-4" : "translate-x-0.5"}`} />
    </span>
  </button>
);

const inputCls = "w-full bg-gray-900 border border-gray-800 text-white text-sm rounded-xl px-4 py-2.5 placeholder:text-gray-600 focus:outline-none focus:border-blue-600/60 transition-colors";

// ─── Main Form ────────────────────────────────────────────────────────────────
export const BlogPostForm = ({ postId }: { postId?: string }) => {
  const { user } = useAuthContext();
  const author = user?.admin ?? null;
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManual, setSlugManual] = useState(false);
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<EBlogPostStatus>(EBlogPostStatus.DRAFT);
  const [categoryId, setCategoryId] = useState<string>("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [featuredImageUrl, setFeaturedImageUrl] = useState<string>("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [videoInput, setVideoInput] = useState("");
  const [allowComments, setAllowComments] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { data: existing } = useQuery({
    queryKey: ["blog-post-edit", postId],
    queryFn: () => fetchBlogPostById(postId!, SBlogPostEdit),
    enabled: !!postId,
  });

  useEffect(() => {
    if (!existing) return;
    const p = existing as TBlogPostEdit;
    setTitle(p.title);
    setSlug(p.slug);
    setSlugManual(true);
    setSummary(p.summary);
    setContent(p.content);
    setStatus(p.status);
    setCategoryId(p.categoryId ?? "");
    setSelectedTagIds(p.tags.map((t) => t.id));
    setFeaturedImageUrl(p.featuredImageUrl ?? "");
    setImageUrls(p.images ?? []);
    setVideos(p.videos ?? []);
    setAllowComments(p.allowComments);
  }, [existing]);

  useEffect(() => {
    if (!slugManual) setSlug(slugify(title));
  }, [title, slugManual]);

  const { data: categories = [] } = useQuery({
    queryKey: ["blog-categories"],
    queryFn: () => fetchBlogCategorys(SBlogCategoryOption, undefined, 50),
  });
  const { data: tags = [] } = useQuery({
    queryKey: ["blog-tags"],
    queryFn: () => fetchBlogTags(SBlogTagOption, undefined, 100),
  });

  const toggleTag = (id: string) =>
    setSelectedTagIds((prev) => prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]);

  const addVideo = () => {
    const v = videoInput.trim();
    if (v && !videos.includes(v)) { setVideos((p) => [...p, v]); setVideoInput(""); }
  };

  const validate = () => {
    if (!title.trim()) { toast.error("Title is required"); return false; }
    if (!summary.trim()) { toast.error("Summary is required"); return false; }
    if (!content || content === "<p></p>") { toast.error("Content is required"); return false; }
    return true;
  };

  const buildData = (overrideStatus?: EBlogPostStatus): Prisma.BlogPostCreateInput => {
    const s = overrideStatus ?? status;
    return {
      title: title.trim(),
      slug: slug || slugify(title),
      summary: summary.trim(),
      content,
      status: s,
      featuredImageUrl: featuredImageUrl || null,
      images: imageUrls,
      videos,
      allowComments,
      publishedAt: s === EBlogPostStatus.PUBLISHED ? new Date() : null,
      category: categoryId ? { connect: { id: categoryId } } : undefined,
      tags: { connect: selectedTagIds.map((id) => ({ id })) },
      author: author ? { connect: { id: author.id } } : undefined,
    };
  };

  const save = async (overrideStatus?: EBlogPostStatus) => {
    if (!author) return toast.error("No permission");
    if (!validate()) return;
    setSaving(true);
    try {
      const data = buildData(overrideStatus);
      if (postId) {
        const updateRes =await updateBlogPost(postId, data);
        if(!updateRes) return toast.error("Failed to update the post");
        toast.success("Post updated");
        queryClient.invalidateQueries();
        if (overrideStatus) setStatus(overrideStatus);
      } else {
        const createRes = await createBlogPost(data as Prisma.BlogPostCreateInput);
        if(!createRes) return toast.error("Failed to create the post");
        toast.success("Post created");
        queryClient.invalidateQueries();
        router.push("/dashboard/admin/blog");
      }
    } catch (e) {
      toast.error("Failed to save");
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!postId || !confirm("Delete this post permanently?")) return;
    setDeleting(true);
    await deleteBlogPost(postId);
    queryClient.invalidateQueries();
    toast.success("Post deleted");
    router.push("/dashboard/admin/blog");
    setDeleting(false);
  };

  // ── Secondary action based on current status ─────────────────────────────
  const secondaryAction = () => {
    if (status === EBlogPostStatus.DRAFT) return { label: "Publish", icon: <Send size={14} />, fn: () => save(EBlogPostStatus.PUBLISHED), cls: "bg-green-600 hover:bg-green-500 text-white" };
    if (status === EBlogPostStatus.PUBLISHED) return { label: "Archive", icon: <Archive size={14} />, fn: () => save(EBlogPostStatus.ARCHIVED), cls: "border border-gray-700 bg-gray-800 hover:bg-gray-700 text-gray-300" };
    // ARCHIVED
    return { label: "Set to Draft", icon: <RotateCcw size={14} />, fn: () => save(EBlogPostStatus.DRAFT), cls: "border border-gray-700 bg-gray-800 hover:bg-gray-700 text-gray-300" };
  };
  const secondary = secondaryAction();

  return (
    <div className="w-full flex flex-col gap-6">
      {/* ── Two-column layout (stacks on mobile) ─────────────────────────── */}
      <div className="w-full grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">
        {/* ── Left: Main content ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-6 min-w-0">
          {/* Title + slug */}
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title…"
              className="w-full bg-transparent text-white text-2xl sm:text-3xl font-bold placeholder:text-gray-700 focus:outline-none border-b border-gray-800 pb-3"
            />
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600 shrink-0">slug:</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => { setSlug(e.target.value); setSlugManual(true); }}
                className="flex-1 min-w-0 bg-transparent text-xs text-gray-500 focus:outline-none focus:text-gray-300 transition-colors"
                placeholder="auto-generated-slug"
              />
            </div>
          </div>

          {/* Summary */}
          <Field label="Summary / Excerpt">
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={3}
              placeholder="A brief description for listings and SEO…"
              className={inputCls + " resize-none"}
            />
          </Field>

          {/* Content */}
          <Section icon={<BookOpen size={14} />} title="Content">
            <div className="rounded-xl overflow-hidden border border-gray-800">
              <RichTextEditor
                defaultValue={content}
                onChange={setContent}
                placeholder="Start writing your post…"
                minHeight="400px"
              />
            </div>
          </Section>

          {/* Images */}
          <Section icon={<ImageIcon size={14} />} title="Post Images">
            <ImageUploader
              urls={imageUrls}
              selectMultiple
              uploadToServer
              onUpload={(urls) => setImageUrls(Array.isArray(urls) ? urls : [urls])}
              onUrlDelete={(url) => {
                setImageUrls((p) => p.filter((u) => u !== url));
                if (featuredImageUrl === url) setFeaturedImageUrl("");
              }}
              label="Post Images"
            />
            {/* Featured image selector */}
            {imageUrls.length > 0 && (
              <div className="flex flex-col gap-2 pt-1">
                <span className="text-xs text-gray-500">Select featured image</span>
                <div className="flex flex-wrap gap-2">
                  {imageUrls.map((url, i) => (
                    <button
                      key={url}
                      type="button"
                      onClick={() => setFeaturedImageUrl(featuredImageUrl === url ? "" : url)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                        featuredImageUrl === url
                          ? "bg-blue-600/20 border-blue-500/50 text-blue-400"
                          : "border-gray-800 bg-gray-900 text-gray-500 hover:text-gray-300 hover:border-gray-700"
                      }`}
                    >
                      {featuredImageUrl === url && <span className="mr-1">✓</span>}
                      Image {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Section>

          {/* Videos */}
          <Section icon={<Video size={14} />} title="Videos">
            <div className="flex gap-2">
              <input
                type="url"
                value={videoInput}
                onChange={(e) => setVideoInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addVideo())}
                placeholder="Paste YouTube or Vimeo URL…"
                className={inputCls + " flex-1 min-w-0"}
              />
              <button type="button" onClick={addVideo} className="shrink-0 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors">
                <Plus size={14} />
              </button>
            </div>
            {videos.length > 0 && (
              <div className="flex flex-col gap-2">
                {videos.map((v) => (
                  <VideoPreview key={v} url={v} onDelete={(url) => setVideos((p) => p.filter((x) => x !== url))} />
                ))}
              </div>
            )}
          </Section>
        </div>

        {/* ── Right: Sidebar ─────────────────────────────────────────────── */}
        <div className="flex flex-col gap-5">
          {/* Status badge (read-only, shows current) */}
          <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-800 bg-gray-900/50">
            <span className="text-xs text-gray-500">Status</span>
            <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${
              status === EBlogPostStatus.PUBLISHED ? "bg-green-500/15 text-green-400 border-green-500/30"
              : status === EBlogPostStatus.DRAFT ? "bg-yellow-500/15 text-yellow-400 border-yellow-500/30"
              : "bg-gray-700/30 text-gray-500 border-gray-700"
            }`}>{status}</span>
          </div>

          {/* Category */}
          <Section icon={<FolderOpen size={14} />} title="Category">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className={inputCls + " appearance-none pr-8 cursor-pointer"}
                >
                  <option value="">No category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
              <BlogCategoryFormBtn showBtnIcon btnSize="sm" />
            </div>
          </Section>

          {/* Tags */}
          <Section icon={<Tag size={14} />} title="Tags">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[10px] text-gray-600">Select applicable tags</span>
              <BlogTagFormBtn showBtnIcon btnSize="sm" />
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => {
                const active = selectedTagIds.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                      active ? "bg-blue-600/20 border-blue-500/50 text-blue-400" : "border-gray-800 bg-gray-900 text-gray-500 hover:text-gray-300 hover:border-gray-700"
                    }`}
                  >
                    {active && <span className="mr-1">✓</span>}{tag.name}
                  </button>
                );
              })}
            </div>
          </Section>

          {/* Settings */}
          <Section icon={<Settings size={14} />} title="Settings">
            <Switch
              checked={allowComments}
              onChange={setAllowComments}
              label="Allow comments"
            />
          </Section>
        </div>
      </div>

      {/* ── Bottom action bar ─────────────────────────────────────────────── */}
      <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-gray-800">
        {/* Delete (edit mode only) */}
        {postId && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/30 bg-red-500/5 hover:bg-red-500/10 text-red-400 text-sm font-medium transition-colors disabled:opacity-50 sm:mr-auto"
          >
            <Trash2 size={13} />
            {deleting ? "Deleting…" : "Delete"}
          </button>
        )}

        <div className="flex items-center gap-3 sm:ml-auto flex-col sm:flex-row w-full sm:w-auto">
          {/* Save (keeps current status) */}
          <button
            type="button"
            onClick={() => save()}
            disabled={saving}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-gray-700 bg-gray-800 hover:bg-gray-700 text-white text-sm font-semibold transition-colors disabled:opacity-50"
          >
            <Save size={14} />
            {saving ? "Saving…" : "Save"}
          </button>

          {/* Dynamic primary action */}
          <button
            type="button"
            onClick={secondary.fn}
            disabled={saving}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 ${secondary.cls}`}
          >
            {secondary.icon}
            {secondary.label}
          </button>
        </div>
      </div>
    </div>
  );
};