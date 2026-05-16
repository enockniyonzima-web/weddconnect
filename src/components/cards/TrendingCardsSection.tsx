"use client";

import { useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue } from "motion/react";
import { useAuthContext } from "../context/AuthContext";
import Link from "next/link";
import Image from "../ui/Image";

export const TrendingCardsSection = ({ images }: { images: string[] }) => {
     const paused = useRef(false);
     const x = useMotionValue(0);
     // Each card: 280px wide + 16px gap = 296px
     const CARD_W = 296;
     const TOTAL = images.length * CARD_W;
     const SPEED = 0.6; // px per frame

     useAnimationFrame(() => {
          if (paused.current) return;
          const current = x.get();
          // Reset seamlessly at half the duplicated list
          x.set(current <= -TOTAL ? 0 : current - SPEED);
     });

     const doubled = [...images, ...images];

     return (
          <div
               className="relative w-full overflow-hidden"
               onMouseEnter={() => (paused.current = true)}
               onMouseLeave={() => (paused.current = false)}
               onTouchStart={() => (paused.current = true)}
               onTouchEnd={() => (paused.current = false)}
          >
               {/* Edge fades */}
               <div className="pointer-events-none absolute left-0 top-0 h-full w-20 z-10 bg-gradient-to-r from-black to-transparent" />
               <div className="pointer-events-none absolute right-0 top-0 h-full w-20 z-10 bg-gradient-to-l from-black to-transparent" />

               <motion.div
                    style={{ x }}
                    className="flex gap-4 w-max"
               >
                    {doubled.map((image, i) => (
                         <TrendCard key={i} image={image} />
                    ))}
               </motion.div>
          </div>
     );
};

// ─── Individual Card ──────────────────────────────────────────────────────────

const TrendCard = ({ image }: { image: string }) => {
     const { user, setAuth } = useAuthContext();
     const [hovered, setHovered] = useState(false);

     const content = (
          <motion.div
               className="relative w-[280px] shrink-0 rounded-2xl overflow-hidden aspect-[3/4] border border-gray-800 cursor-pointer"
               animate={{ scale: hovered ? 1.03 : 1 }}
               transition={{ duration: 0.3, ease: "easeOut" }}
               onHoverStart={() => setHovered(true)}
               onHoverEnd={() => setHovered(false)}
          >
               <Image
                    placeholder="blur"
                    src={image}
                    alt="wedding trend"
                    width={560}
                    height={740}
                    className="w-full h-full object-cover"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
               {hovered && (
                    <motion.div
                         initial={{ opacity: 0, y: 8 }}
                         animate={{ opacity: 1, y: 0 }}
                         className="absolute bottom-4 left-0 right-0 flex justify-center"
                    >
                         <span className="text-xs text-white bg-blue-600/80 backdrop-blur-sm px-3 py-1.5 rounded-full font-medium">
                              View Vendors
                         </span>
                    </motion.div>
               )}
          </motion.div>
     );

     if (user) return <Link href="/posts">{content}</Link>;
     return <div onClick={setAuth}>{content}</div>;
};