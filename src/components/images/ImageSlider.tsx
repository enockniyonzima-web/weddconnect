'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { PostImage } from '@prisma/client';
import Image from '../ui/Image';

interface IImageSlider {
  images: PostImage[];
  onClick?: () => void;
  link?: string;
  label?: string;
  sortOrder?: number;
}

const DefaultImage = '/images/default-image.jpg';

const ImageSlider: React.FC<IImageSlider> = ({ images, onClick, link, label }) => {
  const [current, setCurrent] = useState(0);

  const count = images.length;

  const go = useCallback((dir: 'left' | 'right') => {
    if (count <= 1) return;
    setCurrent(prev => dir === 'right' ? (prev + 1) % count : (prev - 1 + count) % count);
  }, [count]);

  // reset index when images change
  useEffect(() => { setCurrent(0); }, [images]);

  const img = images[current];

  return (
    <div className="relative w-full aspect-[4/3] bg-gray-900 overflow-hidden select-none">
      {/* Main image */}
      {count > 0 ? (
        <Link
          href={link ?? ''}
          prefetch
          aria-label={label}
          className="block w-full h-full"
          onClick={onClick}
        >
          <div className="w-full h-full">
            <Image
              src={img.url}
              alt="listing image"
              width={800}
              height={600}
              className="w-full h-full object-cover"
            />
          </div>
        </Link>
      ) : (
        <Image
          src={DefaultImage}
          alt="No image"
          width={800}
          height={600}
          className="w-full h-full object-cover opacity-40"
        />
      )}

      {/* Gradient overlays */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

      {/* Nav buttons */}
      {count > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); go('left'); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center h-8 w-8 rounded-full bg-black/60 border border-white/10 text-white backdrop-blur-sm hover:bg-blue-600/80 hover:border-blue-500/40 transition-all duration-200 cursor-pointer"
            aria-label="Previous image"
          >
            <ChevronLeft size={16} strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); go('right'); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center h-8 w-8 rounded-full bg-black/60 border border-white/10 text-white backdrop-blur-sm hover:bg-blue-600/80 hover:border-blue-500/40 transition-all duration-200 cursor-pointer"
            aria-label="Next image"
          >
            <ChevronRight size={16} strokeWidth={2.5} />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {count > 1 && (
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => { e.preventDefault(); setCurrent(i); }}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                i === current
                  ? 'w-4 h-1.5 bg-blue-500'
                  : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageSlider;

