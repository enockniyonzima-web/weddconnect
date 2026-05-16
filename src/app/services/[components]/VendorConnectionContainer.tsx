"use client";

import { motion } from "motion/react";
import Image from "@/components/ui/Image";

const ProfessionalImage = "/home/professional-image.jpg";

export default function VendorConnectionContainer() {
  return (
    <section
      className="w-full bg-gray-950 border-b border-gray-800/60 py-20 px-[5%]"
      id="vendor-connection"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Image first on desktop */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true, amount: 0 }}
          className="relative rounded-2xl overflow-hidden border border-gray-800"
        >
          <Image
            width={800}
            height={600}
            src={ProfessionalImage}
            alt="wedding consultant image"
            placeholder="blur"
            className="w-full aspect-[4/3] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          viewport={{ once: true, amount: 0 }}
          className="flex flex-col gap-5"
        >
          <span className="inline-flex w-fit items-center gap-2 bg-blue-600/15 border border-blue-500/30 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full tracking-widest uppercase">
            Service 02
          </span>
          <h2 className="text-white text-3xl md:text-4xl font-bold leading-tight">
            Vendor connection
          </h2>
          <p className="text-blue-400 font-medium">
            Bridging the Gap Between Couples and Trusted Wedding Professionals
          </p>
          <div className="flex flex-col gap-3 text-gray-400 text-sm leading-relaxed">
            <p>
              Finding the right wedding vendors can be a time-consuming and
              frustrating task, especially when quality, trust, and reliability
              are at stake.
            </p>
            <p>
              WeddConnect solves this challenge by providing couples with access
              to a curated network of top-rated vendors — including venues,
              photographers, caterers, florists, stylists, decorators, and
              more. Our platform simplifies the search process by offering
              detailed vendor profiles, real reviews, transparent pricing, and
              instant communication channels to help you connect effortlessly.
            </p>
          </div>
          <p className="text-gray-300 text-sm italic border-l-2 border-blue-500 pl-4">
            Don&apos;t leave your big day to chance — use WeddConnect to connect
            with vendors you can trust, all in one convenient place.
          </p>
        </motion.div>
      </div>
    </section>
  );
}