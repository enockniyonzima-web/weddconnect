"use client";

import { motion } from "motion/react";
import Image from "@/components/ui/Image";

const HeroImage = "/home/new-cp-image.webp";

const hidden = { opacity: 0, y: 32 };
const visible = { opacity: 1, y: 0 };

export default function ServicesHero() {
  return (
    <section className="relative w-full min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <Image
        src={HeroImage}
        alt="wedding vendors"
        width={1400}
        height={800}
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      {/* Overlays */}
      <div className="absolute inset-0 bg-black/70 z-10" />
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute top-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute bottom-[-60px] right-[-60px] w-[350px] h-[350px] rounded-full bg-blue-500/15 blur-[100px]" />
      </div>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center text-center px-4 py-24 max-w-3xl mx-auto">
        <motion.span
          initial={hidden}
          animate={visible}
          transition={{ duration: 0.7, delay: 0, ease: "easeOut" }}
          className="inline-flex items-center gap-2 bg-blue-600/15 border border-blue-500/30 text-blue-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6 tracking-wide"
        >
          What We Offer
        </motion.span>

        <motion.h1
          initial={hidden}
          animate={visible}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4"
        >
          Our Professional{" "}
          <span className="text-blue-400">Services</span>
        </motion.h1>

        <motion.p
          initial={hidden}
          animate={visible}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="text-gray-300 text-lg max-w-xl"
        >
          Everything you need to plan, connect, and celebrate — all in one place.
        </motion.p>
      </div>
    </section>
  );
}
