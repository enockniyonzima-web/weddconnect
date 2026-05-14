"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Dialog, DialogPanel } from "@headlessui/react";
import { EditIcon, FileText, Image as ImageIcon, LayoutList, PlusIcon, Settings, X } from "lucide-react";
import { cn } from "@/lib/utils";

import { SPostEdit } from "@/select-types/post";
import { SCategoryFeature, TCategoryFeature } from "@/select-types/category-feature";
import { fetchCategories } from "@/server-actions/category.actions";
import { fetchCategoryFeatures } from "@/server-actions/category-feature.actions";
import { createPost, deletePost, deletePostFeatures, fetchPostById, updatePost } from "@/server-actions/post.actions";
import { fetchVendors } from "@/server-actions/vendor.actions";
import { uploadImagesFromFormData, deleteMultipleImages } from "@/util/s3Helpers";
import queryClient from "@/lib/queryClient";

import { MainFormLoader } from "./MainForm";
import { TextInput, NumberInput, type InputSize } from "../ui/forms/text-input";
import { TextAreaInput } from "../ui/forms/text-area";
import { SelectInput } from "../ui/forms/select-input";
import { DeleteBtn } from "../ui/forms/delete-btn";
import { SubmitBtn } from "../ui/forms/submit-btn";
import { ImageUploader } from "../ui/upload/ImageUploader";
import { CheckInputGroup } from "../ui/forms/check-input";
import { CategoryFormBtn } from "./CategoryForm";
import { VendorFormBtn } from "./VendorForm";

// ─── Types ────────────────────────────────────────────────────────────────────
type FeatureValue = { featureId: number; value: string };

// ─── Category Feature Input ───────────────────────────────────────────────────
const FeatureInput = ({
     feature,
     value,
     onChange,
     onRemove,
}: {
     feature: TCategoryFeature;
     value: string;
     onChange: (v: string) => void;
     onRemove: () => void;
}) => {
     const options = feature.type === "select"
          ? (feature as unknown as { values: string }).values
               .split(",")
               .map((v: string) => v.trim())
               .filter(Boolean)
               .map((v: string) => ({ label: v, value: v }))
          : [];

     return (
          <div className="flex items-start gap-2 group">
               <div className="flex-1">
                    {feature.type === "select" ? (
                         <SelectInput
                              name={`feature-${feature.id}`}
                              label={feature.name}
                              values={options}
                              defaultValue={value}
                              action={onChange}
                         />
                    ) : feature.type === "boolean" ? (
                         <div className="flex flex-col gap-1.5">
                              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">{feature.name}</span>
                              <CheckInputGroup
                                   name={`feature-${feature.id}`}
                                   label={`Enable ${feature.name}`}
                                   checked={value === "true"}
                                   onChange={(c) => onChange(c ? "true" : "")}
                              />
                         </div>
                    ) : feature.type === "number" ? (
                         <NumberInput
                              name={`feature-${feature.id}`}
                              label={feature.name}
                              defaultValue={value}
                              required={feature.required}
                              action={(v) => onChange(String(v))}
                         />
                    ) : (
                         <TextInput
                              name={`feature-${feature.id}`}
                              label={feature.name}
                              defaultValue={value}
                              required={feature.required}
                              action={(v) => onChange(String(v))}
                         />
                    )}
               </div>
               {!feature.required && (
                    <button
                         type="button"
                         onClick={onRemove}
                         className="mt-6 flex items-center justify-center h-8 w-8 shrink-0 rounded-lg border border-gray-800 bg-gray-900 text-gray-600 hover:border-red-500/40 hover:text-red-400 transition-colors cursor-pointer"
                    >
                         <X size={13} strokeWidth={2} />
                    </button>
               )}
          </div>
     );
};

// ─── Step indicator ───────────────────────────────────────────────────────────
const steps = [
     { label: "Basic Info", icon: FileText },
     { label: "Features", icon: Settings },
     { label: "Media & Price", icon: ImageIcon },
];

const StepBar = ({ current }: { current: number }) => (
     <div className="flex items-center gap-1 mb-6">
          {steps.map((s, i) => {
               const Icon = s.icon;
               const done = i < current;
               const active = i === current;
               return (
                    <div key={i} className="flex items-center flex-1">
                         <div className={cn(
                              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex-1",
                              active ? "bg-blue-600/10 border border-blue-600/30 text-blue-400" :
                              done ? "text-gray-400 border border-gray-800 bg-gray-900" :
                              "text-gray-600 border border-gray-900"
                         )}>
                              <Icon size={12} strokeWidth={2} />
                              <span className="hidden sm:inline">{s.label}</span>
                              <span className="sm:hidden">{i + 1}</span>
                         </div>
                         {i < steps.length - 1 && (
                              <div className={cn("h-px w-3 shrink-0", done ? "bg-blue-600/30" : "bg-gray-800")} />
                         )}
                    </div>
               );
          })}
     </div>
);

// ─── Main Post Form ───────────────────────────────────────────────────────────
export const PostForm = ({
     postId,
     categoryId: propCategoryId,
     onComplete,
}: {
     postId?: number;
     categoryId?: number;
     onComplete: () => void;
}) => {
     const [step, setStep] = useState(0);
     const [submitting, setSubmitting] = useState(false);

     // form state — all fields kept in state so switching steps doesn't lose data
     const [title, setTitle] = useState("");
     const [description, setDescription] = useState("");
     const [location, setLocation] = useState("Kigali");
     const [sortOrder, setSortOrder] = useState("100");
     const [priceMin, setPriceMin] = useState("0");
     const [priceMax, setPriceMax] = useState("0");
     const [priceCurrency, setPriceCurrency] = useState("RWF");
     const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(propCategoryId ?? null);
     const [selectedVendorId, setSelectedVendorId] = useState<number | null>(null);
     const [featureValues, setFeatureValues] = useState<FeatureValue[]>([]);
     const [removedFeatureIds, setRemovedFeatureIds] = useState<Set<number>>(new Set());
     const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
     const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);

     // queries
     const { data: post, isLoading: fetchingPost } = useQuery({
          queryKey: ["post-form", postId],
          queryFn: () => (postId ? fetchPostById(postId, SPostEdit) : null),
     });

     const { data: categories, isLoading: fetchingCategories } = useQuery({
          queryKey: ["post-form-categories"],
          queryFn: () => fetchCategories({ id: true, name: true }, { status: true }, 50, 0, { name: "asc" }),
          enabled: !propCategoryId,
     });

     const { data: vendors, isLoading: fetchingVendors } = useQuery({
          queryKey: ["post-form-vendors"],
          queryFn: () => fetchVendors({ id: true, name: true }, { status: true }, 100, 0, { name: "asc" }),
     });

     const activeCategoryId = selectedCategoryId;
     const { data: categoryFeatures, isLoading: fetchingFeatures } = useQuery({
          queryKey: ["post-form-features", activeCategoryId],
          queryFn: () =>
               activeCategoryId
                    ? fetchCategoryFeatures(
                           { ...SCategoryFeature, values: true } as unknown as typeof SCategoryFeature,
                           { categories: { some: { id: activeCategoryId } } },
                           50
                      )
                    : [],
          enabled: !!activeCategoryId,
     });

     // sync existing post data into state
     useEffect(() => {
          if (!post) return;
          setTitle(post.title ?? "");
          setDescription(post.description ?? "");
          setLocation(post.location ?? "Kigali");
          setSortOrder(post.sortOrder?.toString() ?? "100");
          setPriceMin(post.price?.min?.toString() ?? "0");
          setPriceMax(post.price?.max?.toString() ?? "0");
          setPriceCurrency(post.price?.currency ?? "RWF");
          if (post.category) setSelectedCategoryId(post.category.id);
          if (post.vendor) setSelectedVendorId(post.vendor.id);
          setExistingImageUrls(post.images.map((i) => i.url));
     }, [post]);

     // sync features when features/post loaded
     useEffect(() => {
          if (!categoryFeatures) return;
          const existing = post?.features ?? [];
          setFeatureValues(
               categoryFeatures.map((f) => {
                    const match = existing.find((e) => e.categoryFeature.id === f.id);
                    return { featureId: f.id, value: match?.value ?? "" };
               })
          );
          setRemovedFeatureIds(new Set());
     }, [categoryFeatures, post]);

     const isLoading = fetchingPost || fetchingVendors || (!propCategoryId && fetchingCategories);
     if (isLoading) return <MainFormLoader />;

     const visibleFeatures = (categoryFeatures ?? []).filter(
          (f) => !removedFeatureIds.has(f.id)
     );

     const getFeatureVal = (id: number) =>
          featureValues.find((fv) => fv.featureId === id)?.value ?? "";

     const setFeatureVal = (id: number, value: string) => {
          setFeatureValues((prev) =>
               prev.some((fv) => fv.featureId === id)
                    ? prev.map((fv) => (fv.featureId === id ? { ...fv, value } : fv))
                    : [...prev, { featureId: id, value }]
          );
     };

     const removeFeature = (id: number) => {
          setRemovedFeatureIds((prev) => new Set([...prev, id]));
          setFeatureVal(id, "");
     };

     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();

          const vendorId = selectedVendorId;
          const categoryId = selectedCategoryId;
          const priceMinNum = Number(priceMin || 0);
          const priceMaxNum = Number(priceMax || 0);
          const sortOrderNum = Number(sortOrder || 100);

          if (!title || !categoryId || !vendorId) {
               toast.error("Title, category and vendor are required.");
               return;
          }

          const validFeatures = featureValues.filter(
               (fv) => fv.value.trim() !== "" && !removedFeatureIds.has(fv.featureId)
          );

          setSubmitting(true);
          toast.promise(
               (async () => {
                    // upload new images to S3 via FormData to preserve File prototype across server boundary
                    let uploadedUrls: string[] = [];
                    if (newImageFiles.length > 0) {
                         const fd = new FormData();
                         newImageFiles.forEach((f) => fd.append("images", f));
                         uploadedUrls = await uploadImagesFromFormData(fd, "posts");
                    }

                    const allImageUrls = [...existingImageUrls, ...uploadedUrls];

                    if (!post) {
                         // ── CREATE ──────────────────────────────────────────
                         const newPost = await createPost({
                              title, description, location, status: "pending",
                              sortOrder: sortOrderNum,
                              createdAt: new Date(),
                              category: { connect: { id: categoryId } },
                              vendor: { connect: { id: vendorId } },
                              price: { create: { min: priceMinNum, max: priceMaxNum, currency: priceCurrency } },
                              features: {
                                   createMany: {
                                        data: validFeatures.map((fv) => ({
                                             categoryFeatureId: fv.featureId,
                                             value: fv.value,
                                        })),
                                   },
                              },
                              images: {
                                   createMany: {
                                        data: allImageUrls.map((url, i) => ({
                                             url, name: `image-${i}`, sortOrder: i,
                                        })),
                                   },
                              },
                         });
                         if (!newPost) throw new Error("Failed to create post");
                    } else {
                         // ── UPDATE ──────────────────────────────────────────
                         // find removed existing image urls to delete from S3
                         const removedUrls = post.images
                              .map((i) => i.url)
                              .filter((u) => !existingImageUrls.includes(u));
                         if (removedUrls.length > 0) await deleteMultipleImages(removedUrls);

                         // replace features
                         await deletePostFeatures(post.id);

                         const updated = await updatePost(post.id, {
                              ...(title && { title }),
                              ...(description && { description }),
                              location, 
                              sortOrder: sortOrderNum,
                              ...(vendorId && { vendor: { connect: { id: vendorId } } }),
                              ...(categoryId && { category: { connect: { id: categoryId } } }),
                              price: post.price
                                   ? { update: { min: priceMinNum, max: priceMaxNum, currency: priceCurrency } }
                                   : { create: { min: priceMinNum, max: priceMaxNum, currency: priceCurrency } },
                              features: {
                                   createMany: {
                                        data: validFeatures.map((fv) => ({
                                             categoryFeatureId: fv.featureId,
                                             value: fv.value,
                                        })),
                                   },
                              },
                              images: {
                                   deleteMany: {},
                                   createMany: {
                                        data: allImageUrls.map((url, i) => ({
                                             url, name: `image-${i}`, sortOrder: i,
                                        })),
                                   },
                              },
                         });
                         if (!updated) throw new Error("Failed to update post");
                    }

                    onComplete();
                    await queryClient.invalidateQueries();
                    return { message: post ? "Post updated successfully" : "Post created successfully" };
               })(),
               {
                    loading: post ? "Updating post…" : "Creating post…",
                    success: (d: { message: string }) => d.message,
                    error: (e) => e?.message ?? "Something went wrong",
                    finally: () => setSubmitting(false),
               }
          );
     };

     const handleDelete = () => {
          toast.promise(
               (async () => {
                    if (!post) throw new Error("No post to delete");
                    const images = post.images.map((i) => i.url);
                    const res = await deletePost(post.id);
                    if (!res) throw new Error("Failed to delete post");
                    if (images.length) await deleteMultipleImages(images);
                    onComplete();
                    await queryClient.invalidateQueries();
               })(),
               {
                    loading: "Deleting post…",
                    success: "Post deleted",
                    error: (e) => e?.message ?? "Failed to delete post",
               }
          );
     };

     const canNext0 = !!selectedCategoryId && !!selectedVendorId;

     return (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
               <StepBar current={step} />

               {/* ── Step 0: Basic Info ────────────────────────────────── */}
               {step === 0 && (
                    <div className="flex flex-col gap-4">
                          {/* Category */}
                         {!propCategoryId && (
                              <div className="flex flex-col gap-1.5">
                                   <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                             Category{selectedCategoryId ? `: ${(categories ?? []).find((c) => c.id === selectedCategoryId)?.name ?? selectedCategoryId}` : ""} <span className="text-blue-600">*</span>
                                        </span>
                                        <CategoryFormBtn showBtnIcon showBtnName btnSize="sm" />
                                   </div>
                                   <SelectInput
                                        name="categoryId"
                                        required
                                        defaultValue={selectedCategoryId?.toString() ?? undefined}
                                        values={(categories ?? []).map((c) => ({ label: c.name, value: c.id.toString() }))}
                                        action={(v) => setSelectedCategoryId(Number(v))}
                                        placeholder="Select a category"
                                   />
                              </div>
                         )}

                         {/* Vendor */}
                         <div className="flex flex-col gap-1.5">
                              <div className="flex items-center justify-between">
                                   <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        Vendor{selectedVendorId ? `: ${(vendors ?? []).find((v) => v.id === selectedVendorId)?.name ?? selectedVendorId}` : ""} <span className="text-blue-600">*</span>
                                   </span>
                                   <VendorFormBtn showBtnIcon showBtnName btnSize="sm" />
                              </div>
                              <SelectInput
                                   name="vendorId"
                                   required
                                   defaultValue={selectedVendorId?.toString() ?? undefined}
                                   values={(vendors ?? []).map((v) => ({ label: v.name, value: v.id.toString() }))}
                                   action={(v) => setSelectedVendorId(Number(v))}
                                   placeholder="Select a vendor"
                              />
                         </div>
                         <TextInput name="title" label="Post Title" placeholder="e.g. Premium Wedding Photography" defaultValue={title} action={(v) => setTitle(String(v))} required />

                         <TextAreaInput name="description" label="Description" placeholder="Describe this listing…" defaultValue={description} action={(v) => setDescription(v)} rows={4} />

                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                              <TextInput name="location" label="Location" placeholder="Kigali" defaultValue={location} action={(v) => setLocation(String(v))} />
                              <NumberInput name="sortOrder" label="Sort Order" placeholder="100" defaultValue={sortOrder} action={(v) => setSortOrder(String(v))} />
                         </div>
                         <div className="flex justify-end pt-1">
                              <button
                                   type="button"
                                   disabled={!canNext0}
                                   onClick={() => setStep(1)}
                                   className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                   Next: Features →
                              </button>
                         </div>
                    </div>
               )}

               {/* ── Step 1: Category Features ─────────────────────────── */}
               {step === 1 && (
                    <div className="flex flex-col gap-4">
                         {fetchingFeatures ? (
                              <div className="flex items-center justify-center py-10 text-gray-500 text-sm">
                                   <svg className="h-4 w-4 animate-spin text-blue-500 mr-2" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                   </svg>
                                   Loading features…
                              </div>
                         ) : visibleFeatures.length === 0 ? (
                              <div className="flex flex-col items-center justify-center gap-2 py-10 rounded-xl border border-dashed border-gray-800 text-gray-500">
                                   <LayoutList size={20} strokeWidth={1.5} />
                                   <p className="text-sm">No features for this category</p>
                              </div>
                         ) : (
                              visibleFeatures.map((f) => (
                                   <FeatureInput
                                        key={f.id}
                                        feature={f}
                                        value={getFeatureVal(f.id)}
                                        onChange={(v) => setFeatureVal(f.id, v)}
                                        onRemove={() => removeFeature(f.id)}
                                   />
                              ))
                         )}

                         <div className="flex justify-between pt-1">
                              <button type="button" onClick={() => setStep(0)} className="px-5 py-2 rounded-lg border border-gray-800 bg-gray-900 text-sm text-gray-400 hover:text-white hover:border-gray-700 transition-colors">
                                   ← Back
                              </button>
                              <button type="button" onClick={() => setStep(2)} className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors">
                                   Next: Media & Price →
                              </button>
                         </div>
                    </div>
               )}

               {/* ── Step 2: Media & Price ─────────────────────────────── */}
               {step === 2 && (
                    <div className="flex flex-col gap-5">
                         {/* Images */}
                         <div className="flex flex-col gap-2">
                              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Images</span>
                              <ImageUploader
                                   selectMultiple
                                   uploadToServer={false}
                                   urls={existingImageUrls}
                                   maxFiles={10}
                                   onSelect={(f) => {
                                        const picked = f instanceof File ? [f] : Array.from(f as FileList | File[]);
                                        setNewImageFiles((p) => [...p, ...picked]);
                                   }}
                                   onFileDelete={(f) => setNewImageFiles((p) => p.filter((x) => x !== f))}
                                   onUrlDelete={(url) => setExistingImageUrls((p) => p.filter((u) => u !== url))}
                              />
                         </div>

                         {/* Price */}
                         <div className="flex flex-col gap-3 p-4 rounded-xl border border-gray-800 bg-gray-900/50">
                              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Pricing</span>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                   <NumberInput name="priceMin" label="Min Price" placeholder="0" defaultValue={priceMin} action={(v) => setPriceMin(String(v))} />
                                   <NumberInput name="priceMax" label="Max Price (0 = above)" placeholder="0" defaultValue={priceMax} action={(v) => setPriceMax(String(v))} />
                                   <SelectInput
                                        name="priceCurrency"
                                        label={`Currency: ${priceCurrency}`}
                                        defaultValue={priceCurrency}
                                        values={[
                                             { label: "RWF", value: "RWF" },
                                             { label: "USD", value: "USD" },
                                             { label: "EUR", value: "EUR" },
                                        ]}
                                        action={(v) => setPriceCurrency(v)}
                                   />
                              </div>
                         </div>

                         <div className="flex justify-between pt-1">
                              <button type="button" onClick={() => setStep(1)} className="px-5 py-2 flex items-center gap-1 flex-nowrap rounded-lg border border-gray-800 bg-gray-900 text-sm text-gray-400 hover:text-white hover:border-gray-700 transition-colors">
                                   ← Back
                              </button>
                              <SubmitBtn disabled={submitting} label={post ? "Update Post" : "Create Post"} />
                         </div>

                         {post && (
                              <DeleteBtn
                                   label="Delete Post"
                                   confirmTitle="Delete Post"
                                   confirmMessage="This will permanently delete the post and all its images. This cannot be undone."
                                   onClick={handleDelete}
                              />
                         )}
                    </div>
               )}
          </form>
     );
};

// ─── Post Form Button (dialog trigger) ───────────────────────────────────────
export const PostFormBtn = ({
     postId,
     categoryId,
     showBtnName,
     showBtnIcon,
     btnSize = "md",
}: {
     postId?: number;
     categoryId?: number;
     showBtnName?: boolean;
     showBtnIcon?: boolean;
     btnSize?: InputSize;
}) => {
     const btnTitle = showBtnName ? (postId ? "Edit Post" : "New Post") : undefined;
     const Icon = postId ? EditIcon : PlusIcon;
     const [open, setOpen] = useState(false);

     const sizeClasses: Record<InputSize, string> = {
          sm: "h-8 px-3 text-xs gap-1.5",
          md: "h-10 px-4 text-sm gap-2",
          lg: "h-12 px-5 text-base gap-2",
     };
     const iconSizes: Record<InputSize, number> = { sm: 14, md: 16, lg: 18 };

     return (
          <>
               <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className={cn(
                         "inline-flex items-center justify-center rounded-lg font-medium cursor-pointer transition-all duration-200 active:scale-[0.97]",
                         sizeClasses[btnSize],
                         postId
                              ? "border border-white/10 bg-blue-700 text-gray-100 hover:bg-blue-600 hover:text-white"
                              : "bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500"
                    )}
               >
                    {showBtnIcon && <Icon size={iconSizes[btnSize]} strokeWidth={2} className="shrink-0" />}
                    {showBtnName && <span>{btnTitle}</span>}
               </button>

               <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />
                    <div className="fixed inset-0 flex items-center justify-center p-3">
                         <DialogPanel className="relative w-[95%] lg:w-[75%] max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-gray-950 shadow-2xl shadow-black/60">
                              {/* top accent */}
                              <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl bg-linear-to-r from-blue-600 via-blue-500 to-blue-900" />
                              {/* glow orbs */}
                              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl" aria-hidden="true">
                                   <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-blue-600/5 blur-3xl" />
                                   <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-blue-900/10 blur-3xl" />
                              </div>

                              {/* Header */}
                              <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-white/5 bg-gray-950/95 backdrop-blur-md px-6 py-4 rounded-t-2xl">
                                   <div className="flex items-center gap-3">
                                        <div className={cn(
                                             "flex items-center justify-center h-9 w-9 rounded-lg",
                                             postId ? "bg-blue-600/10 border border-blue-600/20 text-blue-400" : "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                                        )}>
                                             {postId ? <EditIcon size={16} strokeWidth={2} /> : <PlusIcon size={16} strokeWidth={2} />}
                                        </div>
                                        <div>
                                             <h3 className="text-base font-semibold text-white">{postId ? "Edit Post" : "Create New Post"}</h3>
                                             <p className="text-xs text-gray-500">{postId ? "Update listing details" : "Add a new listing to the platform"}</p>
                                        </div>
                                   </div>
                                   <button
                                        type="button"
                                        onClick={() => setOpen(false)}
                                        className="flex items-center justify-center h-8 w-8 rounded-lg border border-white/10 bg-white/5 text-gray-400 cursor-pointer transition-all hover:bg-white/10 hover:text-white hover:border-white/20"
                                   >
                                        <X size={16} strokeWidth={2} />
                                   </button>
                              </div>

                              <div className="relative px-6 py-5">
                                   <PostForm postId={postId} categoryId={categoryId} onComplete={() => setOpen(false)} />
                              </div>

                              {/* bottom accent */}
                              <div className="absolute inset-x-0 bottom-0 h-px rounded-b-2xl bg-linear-to-r from-transparent via-blue-600/20 to-transparent" />
                         </DialogPanel>
                    </div>
               </Dialog>
          </>
     );
};
