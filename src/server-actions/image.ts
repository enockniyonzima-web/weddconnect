"use server";

import { cache } from "react"; // Next.js in-memory cache
import sharp from "sharp";

const fetchAndCacheImage = cache(async (imageUrl: string) => {
     try {
     const response = await fetch(imageUrl);
     if (!response.ok) throw new Error("Failed to fetch image");

     const buffer = await response.arrayBuffer();
     
     // Optimize with sharp (resize, compress)
     const optimizedBuffer = await sharp(Buffer.from(buffer))
          .resize({ width: 800 }) // Resize to 800px width
          .webp({ quality: 80 }) // Convert to JPEG, reduce quality
          .toBuffer();

          return `data:image/jpeg;base64,${optimizedBuffer.toString("base64")}`;
     } catch (error) {
     console.error("Image fetch error:", error);
          return null;
     }
});

export default fetchAndCacheImage;
