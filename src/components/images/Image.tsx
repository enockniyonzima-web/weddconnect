"use client";

import fetchAndCacheImage from "@/server-actions/image";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ServerImageProps {
  src: string;
  alt: string;
  className?: string;
  width?:number;
  height?:number;
}

// const ImageLoader = ({className}:{className?:string}) =>  <div className={`bg-gray-300 animate-pulse ${className}`}></div>
export default function DImage({ src, alt, width,height, className}: ServerImageProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      const optimizedSrc = await fetchAndCacheImage(src);
      if(optimizedSrc) setImageSrc(optimizedSrc);
    };
    fetchImage();
  }, [src]);

  if (!imageSrc) {
    return <div className={`bg-gray-300 animate-pulse ${className}`} style={{ width, height }} ></div>;
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      unoptimized // ⬅️ Disables Vercel optimization
    />
  );
}
