/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";

import { StaticImageData } from "next/image";
// components/CustomImage.tsx
import React from "react";

type ImageProps = {
     src: string;
     alt: string;
     width?: number;
     height?: number;
     className?: string;
     style?: React.CSSProperties;
     placeholder?:string,
     loading?:"lazy" | "eager" | undefined
};

const Image: React.FC<ImageProps> = ({
     src,
     alt,
     width,
     height,
     className = "",
     placeholder,
     loading="lazy",
     style = {},
}) => {
     return (
          <img
               src={src}
               alt={alt}
               width={width}
               height={height}
               loading={loading}
               decoding="async"
               className={`object-cover ${className}`}
               style={style}
          />
     );
};

export default Image;

