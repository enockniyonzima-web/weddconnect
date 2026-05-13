"use client";

import { useCallback, useRef, useState } from "react";
import { deleteSingleImage, uploadMultipleImages, uploadSingleImage } from "@/util/s3Helpers";
import { toast } from "sonner";
import Image from "../Image";
import { Camera, ImagePlus, Trash2, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface IImageUploaderProps {
     files?: FileList | File[] | undefined;
     urls?: string[] | string;
     selectMultiple?: boolean;
     allowedTypes?: string[];
     uploadToServer?: boolean;
     onUpload?: (result: string[] | string) => void;
     onSelect?: (selected: FileList | File) => void;
     onFileDelete?: (deleted: File) => void;
     onUrlDelete?: (deleted: string) => void;
     maxFiles?: number;
     folder?: string;
     label?: string;
}

// ─── Image Preview ────────────────────────────────────────────────────────────

interface IImagePreviewProps {
     src: string | File;
     alt?: string;
     onDelete?: (file: string | File) => void;
}

export const ImagePreview: React.FC<IImagePreviewProps> = ({ src, alt, onDelete }) => {
     const handleDelete = () => {
          if (typeof src === "string") {
               toast.promise(
                    (async () => {
                         await deleteSingleImage(src);
                         onDelete?.(src);
                    })(),
                    {
                         loading: "Deleting image...",
                         success: "Image deleted",
                         error: (e) => e?.message ?? "Failed to delete image",
                    }
               );
          } else {
               onDelete?.(src);
          }
     };

     return (
          <div className="group relative aspect-square w-full overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
               <Image
                    src={typeof src === "string" ? src : URL.createObjectURL(src)}
                    alt={alt ?? "preview"}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
               />
               <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 rounded-xl" />
               <button
                    type="button"
                    onClick={handleDelete}
                    className="absolute top-2 right-2 flex items-center justify-center h-7 w-7 rounded-lg bg-black/70 border border-red-500/30 text-red-400 opacity-80 group-hover:opacity-100 transition-all duration-200 hover:bg-red-500/20 cursor-pointer"
               >
                    <Trash2 size={13} strokeWidth={2} />
               </button>
          </div>
     );
};

// ─── Image Uploader ───────────────────────────────────────────────────────────

export const ImageUploader: React.FC<IImageUploaderProps> = ({
     urls,
     selectMultiple = false,
     allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"],
     uploadToServer = false,
     onUpload,
     onSelect,
     onFileDelete,
     onUrlDelete,
     maxFiles = 10,
     folder = "production",
     label,
}) => {
     const [localFiles, setLocalFiles] = useState<File[]>([]);
     const [isDragging, setIsDragging] = useState(false);
     const [uploading, setUploading] = useState(false);

     const fileInputRef = useRef<HTMLInputElement>(null);
     const cameraInputRef = useRef<HTMLInputElement>(null);

     const existingUrls: string[] = urls
          ? Array.isArray(urls) ? urls : [urls]
          : [];

     const totalCount = existingUrls.length + localFiles.length;
     const canAddMore = selectMultiple ? totalCount < maxFiles : totalCount === 0;

     const processFiles = useCallback(
          async (picked: File[]) => {
               const valid = picked
                    .filter((f) => allowedTypes.includes(f.type))
                    .slice(0, selectMultiple ? maxFiles - totalCount : 1);

               if (!valid.length) {
                    toast.error("Invalid file type. Please select an image.");
                    return;
               }

               if (uploadToServer) {
                    setUploading(true);
                    toast.promise(
                         (async () => {
                              if (selectMultiple) {
                                   const uploaded = await uploadMultipleImages(valid, folder);
                                   onUpload?.(uploaded);
                              } else {
                                   const uploaded = await uploadSingleImage(valid[0], folder);
                                   onUpload?.(uploaded);
                              }
                         })(),
                         {
                              loading: "Uploading image(s)...",
                              success: "Uploaded successfully",
                              error: (e) => e?.message ?? "Upload failed",
                              finally: () => setUploading(false),
                         }
                    );
               } else {
                    const newFiles = selectMultiple ? [...localFiles, ...valid] : valid;
                    setLocalFiles(newFiles);
                    if (selectMultiple) {
                         onSelect?.(valid as unknown as FileList);
                    } else {
                         onSelect?.(valid[0]);
                    }
               }
          },
          // eslint-disable-next-line react-hooks/exhaustive-deps
          [localFiles, totalCount, selectMultiple, maxFiles, uploadToServer, folder]
     );

     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length) processFiles(files);
          e.target.value = "";
     };

     const handleDrop = (e: React.DragEvent) => {
          e.preventDefault();
          setIsDragging(false);
          processFiles(Array.from(e.dataTransfer.files));
     };

     const handleFileDelete = (file: File) => {
          setLocalFiles((prev) => prev.filter((f) => f !== file));
          onFileDelete?.(file);
     };

     const handleUrlDelete = (url: string) => {
          onUrlDelete?.(url);
     };

     return (
          <div className="flex flex-col gap-3 w-full">
               {label && (
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</p>
               )}

               {/* hidden inputs */}
               <input ref={fileInputRef} type="file" accept={allowedTypes.join(",")} multiple={selectMultiple} className="hidden" onChange={handleInputChange} />
               <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleInputChange} />

               {/* Drop zone — shown when user can add more */}
               {canAddMore && (
                    <div
                         role="button"
                         tabIndex={0}
                         onClick={() => fileInputRef.current?.click()}
                         onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
                         onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                         onDragLeave={() => setIsDragging(false)}
                         onDrop={handleDrop}
                         className={cn(
                              "relative flex flex-col items-center justify-center gap-3 w-full rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer select-none py-10 px-6",
                              isDragging
                                   ? "border-blue-600 bg-blue-600/5 scale-[1.01]"
                                   : "border-gray-800 bg-gray-900/50 hover:border-gray-700 hover:bg-gray-900"
                         )}
                    >
                         <div className={cn(
                              "flex items-center justify-center h-12 w-12 rounded-xl border transition-colors duration-200",
                              isDragging
                                   ? "border-blue-600/40 bg-blue-600/10 text-blue-400"
                                   : "border-gray-800 bg-gray-900 text-gray-500"
                         )}>
                              {isDragging ? <UploadCloud size={22} strokeWidth={1.5} /> : <ImagePlus size={22} strokeWidth={1.5} />}
                         </div>

                         <div className="text-center">
                              <p className="text-sm font-medium text-white">
                                   {isDragging ? "Drop to upload" : "Drag & drop or click to browse"}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                   {allowedTypes.map((t) => t.replace("image/", "").toUpperCase()).join(", ")}
                                   {selectMultiple && ` · up to ${maxFiles} files`}
                              </p>
                         </div>

                         <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); cameraInputRef.current?.click(); }}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-800 bg-gray-950 text-xs text-gray-400 hover:border-blue-600/50 hover:text-blue-400 transition-colors"
                         >
                              <Camera size={13} strokeWidth={2} />
                              Use camera
                         </button>

                         {uploading && (
                              <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/60 backdrop-blur-sm">
                                   <div className="flex items-center gap-2 text-sm text-white">
                                        <svg className="h-4 w-4 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
                                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Uploading…
                                   </div>
                              </div>
                         )}
                    </div>
               )}

               {/* Add more strip — multi-select only, after first upload */}
               {selectMultiple && totalCount > 0 && canAddMore && (
                    <div className="flex items-center gap-2">
                         <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-800 bg-gray-900 text-xs text-gray-400 hover:border-blue-600/50 hover:text-blue-400 transition-colors"
                         >
                              <ImagePlus size={13} strokeWidth={2} /> Add more
                         </button>
                         <button
                              type="button"
                              onClick={() => cameraInputRef.current?.click()}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-800 bg-gray-900 text-xs text-gray-400 hover:border-blue-600/50 hover:text-blue-400 transition-colors"
                         >
                              <Camera size={13} strokeWidth={2} /> Camera
                         </button>
                         <span className="ml-auto text-xs text-gray-600">{totalCount} / {maxFiles}</span>
                    </div>
               )}

               {/* Previews */}
               {(existingUrls.length > 0 || localFiles.length > 0) && (
                    <div className={cn(
                         "grid gap-2",
                         selectMultiple ? "grid-cols-3 sm:grid-cols-4" : "grid-cols-2"
                    )}>
                         {existingUrls.map((url) => (
                              <ImagePreview key={url} src={url} onDelete={() => handleUrlDelete(url)} />
                         ))}
                         {localFiles.map((file, i) => (
                              <ImagePreview key={i} src={file} onDelete={() => handleFileDelete(file)} />
                         ))}
                    </div>
               )}
          </div>
     );
};
