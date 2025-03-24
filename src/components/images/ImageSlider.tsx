'use client';

import React, { useRef, useState, useEffect } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import Image from 'next/image';
import Link from 'next/link';
import { PostImage } from '@prisma/client';
import DefaultImage from '../../../public/images/default-image.jpg';

interface IImageSlider {
  images: PostImage[];
  onClick?: () => void;
  link?: string;
  label?: string;
}

const ImageSlider: React.FC<IImageSlider> = ({ images, onClick, link, label }) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canSlideLeft, setCanSlideLeft] = useState(false);
  const [canSlideRight, setCanSlideRight] = useState(images.length > 1);

  useEffect(() => {
    updateNavigation();
  }, [images]);

  const updateNavigation = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanSlideLeft(scrollLeft > 0);
      setCanSlideRight(scrollLeft + clientWidth < scrollWidth);
    }
  };

  const viewNextImage = (direction: number) => {
    if (sliderRef.current) {
      const imageWidth = sliderRef.current.clientWidth; // Slide by one full image
      const newScrollLeft = sliderRef.current.scrollLeft + direction * imageWidth;
      
      sliderRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });

      setTimeout(updateNavigation, 300); // Update navigation after sliding
    }
  };

  return (
    <div className="relative w-full h-auto">
      {canSlideLeft && (
        <i
          className="inline-flex absolute top-1/2 -translate-y-1/2 left-5 z-10 text-2xl bg-black/50 hover:bg-black/70 text-gray-200 rounded-full p-2 cursor-pointer"
          onClick={() => viewNextImage(-1)}
        >
          <IoIosArrowBack />
        </i>
      )}
      {images.length > 0 ? (
        <div
          className="w-full overflow-hidden scroll-smooth scrollbar-hide"
          ref={sliderRef}
        >
          <div
            className="relative w-full aspect-[4/3] object-cover cursor-pointer flex"
            onClick={onClick}
          >
            {images.map((image, index) => (
              <Link
                className="w-full flex-shrink-0 aspect-[4/3] relative bg-gray-200"
                key={`listing-image-${index}`}
                href={link || ''}
                prefetch={true}
                aria-label={label}
              >
                <Image
                  src={image.url}
                  placeholder="empty"
                  fill
                  alt="listing image"
                  className="object-cover cursor-pointer"
                />
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <Image
          src={DefaultImage}
          alt="No image found"
          width={400}
          height={300}
          className="w-full aspect-video"
        />
      )}
      {canSlideRight && (
        <i
          className="inline-flex absolute top-1/2 -translate-y-1/2 right-5 z-10 text-2xl bg-black/50 hover:bg-black/70 text-gray-200 rounded-full p-2 cursor-pointer"
          onClick={() => viewNextImage(1)}
        >
          <IoIosArrowForward />
        </i>
      )}
    </div>
  );
};

export default ImageSlider;
