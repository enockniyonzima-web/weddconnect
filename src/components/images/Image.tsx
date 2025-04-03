"use client";
import Image from "next/image";

interface ServerImageProps {
  src: string;
  alt: string;
  className?: string;
  width?:number;
  height?:number;
}

// const ImageLoader = ({className}:{className?:string}) =>  <div className={`bg-gray-300 animate-pulse ${className}`}></div>
export default function DImage({ src, alt, width,height, className}: ServerImageProps) {
  

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      unoptimized // ⬅️ Disables Vercel optimization
    />
  );
}
