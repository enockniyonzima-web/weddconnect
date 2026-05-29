"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

export function BlogImageGallery({ images }: { images: string[] }) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  const prev = () => setLightbox((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  const next = () => setLightbox((i) => (i === null ? null : (i + 1) % images.length));

  return (
    <>
      {/* Grid */}
      <div className={`grid gap-3 ${images.length === 1 ? "grid-cols-1" : images.length === 2 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3"}`}>
        {images.map((url, i) => (
          <button
            key={i}
            onClick={() => setLightbox(i)}
            className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-gray-800 bg-gray-900 cursor-zoom-in"
          >
            <Image src={url} alt={`Image ${i + 1}`} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <ZoomIn size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          {/* Close */}
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full bg-gray-900/80 transition-colors"
          >
            <X size={20} />
          </button>

          {/* Counter */}
          <span className="absolute top-4 left-1/2 -translate-x-1/2 text-xs text-gray-400">
            {lightbox + 1} / {images.length}
          </span>

          {/* Prev */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 text-gray-400 hover:text-white p-3 rounded-full bg-gray-900/80 transition-colors"
            >
              <ChevronLeft size={22} />
            </button>
          )}

          {/* Image */}
          <div
            className="relative max-w-5xl max-h-[85vh] w-full h-full mx-16"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightbox]}
              alt={`Image ${lightbox + 1}`}
              fill
              className="object-contain"
            />
          </div>

          {/* Next */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 text-gray-400 hover:text-white p-3 rounded-full bg-gray-900/80 transition-colors"
            >
              <ChevronRight size={22} />
            </button>
          )}
        </div>
      )}
    </>
  );
}
