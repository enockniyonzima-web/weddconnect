"use client";

import { motion } from "motion/react";
import Image from "@/components/ui/Image";

const MarketingImage = "/services/marketing.jpg";

export default function MarketingContainer() {
  return (
    <section
      className="w-full bg-black py-20 px-[5%]"
      id="marketing"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true, amount: 0 }}
          className="flex flex-col gap-5"
        >
          <span className="inline-flex w-fit items-center gap-2 bg-blue-600/15 border border-blue-500/30 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full tracking-widest uppercase">
            Service 03
          </span>
          <h2 className="text-white text-3xl md:text-4xl font-bold leading-tight">
            Marketing
          </h2>
          <p className="text-blue-400 font-medium">
            Helping Wedding Vendors Shine and Grow Their Businesses
          </p>
          <div className="flex flex-col gap-3 text-gray-400 text-sm leading-relaxed">
            <p>
              WeddConnect isn&apos;t just for couples — we&apos;re a powerful
              marketing platform for wedding vendors too. In a competitive and
              ever-evolving industry, it&apos;s essential for vendors to stand
              out and reach the right clients.
            </p>
            <p>
              Our Wedding Marketing services help vendors increase their
              visibility, build their brand, and generate high-quality leads.
              From strategic placement on our platform to social media promotion
              and content creation, we offer tailored solutions that showcase
              what makes each vendor unique.
            </p>
          </div>
          <p className="text-gray-300 text-sm italic border-l-2 border-blue-500 pl-4">
            Grow your wedding business with us — partner with WeddConnect and
            let your services be discovered by the people who need them most.
          </p>
        </motion.div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          viewport={{ once: true, amount: 0 }}
          className="relative rounded-2xl overflow-hidden border border-gray-800"
        >
          <Image
            width={800}
            height={600}
            src={MarketingImage}
            alt="wedding consultant image"
            placeholder="blur"
            className="w-full aspect-[4/3] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}