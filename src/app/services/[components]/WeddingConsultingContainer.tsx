"use client";

import { motion } from "motion/react";
import Image from "@/components/ui/Image";

const ConsultantImage = "/services/wedding-consultant.jpg";

export default function WeddingConsultingContainer() {
  return (
    <section
      className="w-full bg-black border-b border-gray-800/60 py-20 px-[5%]"
      id="wedding-consulting"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true, amount: 0 }}
          className="flex flex-col gap-5"
        >
          <span className="inline-flex w-fit items-center gap-2 bg-blue-600/15 border border-blue-500/30 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full tracking-widest uppercase">
            Service 01
          </span>
          <h2 className="text-white text-3xl md:text-4xl font-bold leading-tight">
            Wedding Consultation
          </h2>
          <p className="text-blue-400 font-medium">
            Turning Your Vision Into a Seamless Reality
          </p>
          <div className="flex flex-col gap-3 text-gray-400 text-sm leading-relaxed">
            <p>
              At WeddConnect, we understand that planning a wedding can be both
              exciting and overwhelming. Our Wedding Consulting service is
              designed to guide couples through every step of the planning
              process — from the initial brainstorming of ideas to the final
              &quot;I do.&quot;
            </p>
            <p>
              We offer personalized consultations tailored to the unique needs,
              preferences, and budget of each couple. Whether you&apos;re
              planning a grand celebration or an intimate gathering, our
              experienced consultants provide expert advice, timeline
              management, budgeting assistance, and vendor recommendations to
              bring your dream wedding to life.
            </p>
          </div>
          <p className="text-gray-300 text-sm italic border-l-2 border-blue-500 pl-4">
            Let WeddConnect be your trusted partner in turning your love story
            into a beautifully orchestrated celebration — start planning with
            confidence today.
          </p>
        </motion.div>

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
            src={ConsultantImage}
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