"use server";

import sharp from "sharp";
import { LRUCache } from "lru-cache";

const imageCache = new LRUCache<string, string>({
  max: 10000, // Store up to 100 images
  ttl: 1000 * 60 * 60 * 24 * 30, // Cache images for 1 hour
});

const fetchAndCacheImage = async (imageUrl: string) => {
  // ✅ 1. Check if the image is already cached
  if (imageCache.has(imageUrl)) {
    console.log("Serving from cache:", imageUrl);
    return imageCache.get(imageUrl);
  }

  try {
    console.log("Fetching image from S3:", imageUrl);
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error("Failed to fetch image");

    const buffer = await response.arrayBuffer();

    // ✅ 2. Optimize image with Sharp
    const optimizedBuffer = await sharp(Buffer.from(buffer))
      .resize({ width: 800 }) // Resize to 800px width
      .webp({ quality: 80 }) // Convert to WebP with 80% quality
      .toBuffer();

    // ✅ 3. Convert to base64
    const base64Image = `data:image/webp;base64,${optimizedBuffer.toString("base64")}`;

    // ✅ 4. Cache the optimized image
    imageCache.set(imageUrl, base64Image);

    return base64Image;
  } catch (error) {
    console.error("Image fetch error:", error);
    return null;
  }
};

export default fetchAndCacheImage;

