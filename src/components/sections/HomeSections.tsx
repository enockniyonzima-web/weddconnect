/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import { IconType } from "react-icons";
import { MdCelebration, MdOutlineDateRange, MdVerified } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { GetStartedBtn } from "../buttons/common";
import { TrendingImages } from "../images/StaticImages";
import { TrendingCardsSection } from "../cards/TrendingCardsSection";
import { IoImages } from "react-icons/io5";
import { ReasonToJoinCard } from "../cards/ReasonToJoinCard";
import { HiOutlineCurrencyDollar } from "react-icons/hi";
import Image from "../ui/Image";
import { motion } from "motion/react";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { SocialLinks } from "@/lib/data/social-links";

// ─── Fade-up utility ──────────────────────────────────────────────────────────
const fadeUp = {
     hidden: { opacity: 0, y: 40 },
     show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.12, ease: "easeOut" as const } }),
};

const Professionals: {image:string, title:string, description:string, dest: string}[] = [
     {title: "Venues", description: "Welcome to our curated selection of wedding venues, where we connect couples with beautiful spaces to celebrate their special day.", image:"/professionals/venues.webp", dest:'/' },
     {title: "Wedding Planner", description: "Our expert wedding planners will guide through every step of your wedding journey, from initial concept to flawless execution.", image:"/professionals/wedding-planner.webp", dest:'/' },
     {title: "Photography Company", description: "Discover our selection of talented photography companies who capture the magic of your wedding day in breathtaking detail.", image:"/professionals/photography.webp", dest:'/' }
]

const ReasonsToJoin:{name:string, icon:IconType, description:string}[] = [
     {name:"High-Quality Images of Wedding Venues Across Rwanda", icon:IoImages, description:"Discover stunning images of every venue to help you make the perfect choice for your big day."},
     {name:"Detailed Contact Information & Pricing Packages", icon:HiOutlineCurrencyDollar, description:"Easily access contact details and transparent pricing packages for all venues and vendors."},
     {name:"Only Trusted Wedding Vendors on Our Platform", icon:MdVerified, description:"Rest assured knowing that only verified and trusted vendors are listed, ensuring quality and reliability."},
]

// ─── Hero ─────────────────────────────────────────────────────────────────────
export function HeroSection () {
     return (
          <section className="w-full min-h-screen relative flex items-center justify-center overflow-hidden bg-black">
               {/* Background image with subtle parallax feel */}
               <motion.div
                    className="absolute inset-0 z-0"
                    initial={{ scale: 1.08 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 2.2, ease: "easeOut" }}
               >
                    <Image
                         src="/home/new-cp-image.webp"
                         alt="Wedding"
                         placeholder="blur"
                         width={1920}
                         height={1080}
                         className="w-full h-full object-cover"
                    />
               </motion.div>

               {/* Layered gradient overlay */}
               <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-black/50 to-black/90" />
               <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/40 via-transparent to-black/40" />

               {/* Content */}
               <div className="relative z-20 flex flex-col items-center justify-center gap-6 px-[5%] text-center max-w-4xl mx-auto">
                    <motion.span
                         variants={fadeUp} initial="hidden" animate="show" custom={0}
                         className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-white/80 text-xs font-medium tracking-wide"
                    >
                         Rwanda&apos;s Premier Wedding Platform
                    </motion.span>

                    <motion.h1
                         variants={fadeUp} initial="hidden" animate="show" custom={1}
                         className="text-2xl md:text-6xl lg:text-4xl font-extrabold text-white leading-[1.6] tracking-tight"
                    >    

                         <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-100 to-gray-200">
                              Rwanda&apos;s Largest Collection of <br />
                              Wedding Venues & Verified Vendors.
                         </span>
                    </motion.h1>

                    <motion.p
                         variants={fadeUp} initial="hidden" animate="show" custom={2}
                         className="text-gray-300 text-base md:text-lg max-w-xl leading-relaxed"
                    >
                         From Only <span className="text-white font-semibold">$7</span> — Access all wedding venues &amp; top verified vendors across Rwanda.
                    </motion.p>

                    <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}>
                         <GetStartedBtn />
                    </motion.div>

                    {/* Stats row */}
                    <motion.div
                         variants={fadeUp} initial="hidden" animate="show" custom={4}
                         className="flex items-center gap-6 mt-2"
                    >
                         {[["500+", "Vendors"], ["50+", "Venues"], ["1,000+", "Couples"]].map(([num, label]) => (
                              <div key={label} className="flex flex-col items-center gap-0.5">
                                   <span className="text-white font-bold text-lg">{num}</span>
                                   <span className="text-gray-400 text-xs">{label}</span>
                              </div>
                         ))}
                    </motion.div>
               </div>

               {/* Bottom fade to black */}
               <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent z-20" />
          </section>
     );
}

// ─── Trending ─────────────────────────────────────────────────────────────────
export const TrendingSection = () => {
     return (
          <section className="w-full py-20 bg-black flex flex-col gap-8 overflow-hidden">
               <motion.div
                    className="px-[5%] flex flex-col gap-2"
                    initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.6, ease: "easeOut" }}
               >
                    <span className="text-blue-500 text-xs font-semibold uppercase tracking-widest">Inspiration</span>
                    <h2 className="text-white text-3xl md:text-4xl font-bold">Trending Wedding Venues</h2>
                    <p className="text-gray-400 text-sm max-w-md">Hand-picked venues loved by couples across Rwanda. Hover to pause.</p>
               </motion.div>
               <TrendingCardsSection images={TrendingImages} />
          </section>
     )
}

// ─── Professional Service ─────────────────────────────────────────────────────
export function OurProfessionalSection () {
     return (
          <section className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10 px-[5%] py-20 bg-gray-950 items-center">
               <motion.div
                    className="flex flex-col gap-6"
                    initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.7, ease: "easeOut" }}
               >
                    <span className="text-blue-500 text-xs font-semibold uppercase tracking-widest">What We Offer</span>
                    <h2 className="text-white text-3xl md:text-4xl font-bold leading-snug">
                         Our Professional, <span className="text-blue-400">Service</span>
                    </h2>
                    <p className="text-gray-400 text-base leading-relaxed">
                         We provide expert wedding consultation, helping couples find the perfect venues and vendors that match their vision and budget. With WeddConnect, you get seamless connections to trusted wedding professionals making your planning stress-free and enjoyable.
                    </p>
                    <div className="flex flex-col gap-3">
                         {["Curated list of verified vendors", "Transparent pricing packages", "Direct contact with professionals"].map((item, i) => (
                              <div key={i} className="flex items-center gap-3 text-sm text-gray-300">
                                   <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                                   {item}
                              </div>
                         ))}
                    </div>
                    <Link href="/posts" className="w-fit inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors duration-200">
                         Browse Vendors <FaArrowRight />
                    </Link>
               </motion.div>

               <motion.div
                    className="relative rounded-2xl overflow-hidden border border-gray-800 aspect-[4/3]"
                    initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.7, ease: "easeOut" }}
               >
                    <Image
                         src="/home/prof-lindah.png"
                         alt="WeddConnect professionals"
                         width={800}
                         height={600}
                         className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
               </motion.div>
          </section>
     )
}

// ─── Professionals cards ──────────────────────────────────────────────────────
export function ProfessionalsSection () {
     return (
          <section className="w-full flex flex-col items-center justify-start gap-[30px] py-[40px] px-[2%]">
               <div className="w-full flex flex-col items-center justify-start gap-[10px]">
                    <h1 className="text-[1.6rem] lg:text-[1.8rem] font-extrabold text-black text-center">Our Professional Services</h1>
                    <p className="text-[1rem] md:text-[1.1rem] w-full md:w-[80%] lg:w-[60%] text-gray-700 text-center">Discover our carefully curated selection of wedding professionals who will make your special day truly unforgetable</p>
               </div>
               <div className="w-full grid grid-cols-1 md:grd-cols-2 lg:grid-cols-3 gap-[20px]">
                    {Professionals.map((profession, index) => <ProfessionalCard profession={profession} key={`home-services-${index}`} />)}
               </div>
               <div className="w-full flex items-center justify-center">
                    <Link href="/services" className="w-auto py-[10px] px-[20px] rounded-[30px] text-white bg-gradient-to-br from-blue-600 to-blue-800 text-[1.1rem] font-medium flex items-center justify-center gap-[10px]">View More Services <i className="text-[22px]"><FaArrowRight /></i></Link>
               </div>
          </section>
     )
}

const ProfessionalCard = ({profession}:{profession:{image: string, title:string, description:string, dest:string}}) => {
     const {image, title, description} = profession;
     return (
          <div className="w-full h-auto rounded-[5px] overflow-hidden shadow-sm shadow-gray-200">
               <div className="w-full aspect-video relative">
                    <Image src={image} placeholder="blur" loading="lazy" alt={`${title} image`} className="object-cover w-full h-full" />
               </div>
               <div className="w-full flex flex-col items-start justify-between gap-[10px] p-[10px] pb-[20px]">
                    <h3 className="text-[1.1rem] font-bold text-black">{title}</h3>
                    <p className="text-[0.9rem] text-gray-600">{description}</p>
               </div>
          </div>
     )
}

// ─── How It Works ─────────────────────────────────────────────────────────────
export function HowItWorksSection () {
     return (
          <section id="how-it-works-section" className="w-full flex flex-col bg-black items-center justify-start gap-[40px] py-[80px] px-[5%]">
               <motion.div
                    className="w-full flex flex-col items-center gap-3"
                    initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.6 }}
               >
                    <span className="text-blue-500 text-xs font-semibold uppercase tracking-widest">Simple Steps</span>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-white text-center">How It Works</h2>
               </motion.div>
               <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]">
                    {[
                         {title: 'Plan', description: "Set your wedding date and create your personalized timeline", Icon: MdOutlineDateRange, step: "01"},
                         {title: 'Find', description: "Browse and find the best wedding vendors for your wedding.", Icon: FiSearch, step: "02"},
                         {title: 'Celebrate', description: "Enjoy your dream wedding while we handle the details.", Icon: MdCelebration, step: "03"},
                    ].map((item, i) => (
                         <motion.div
                              key={item.title}
                              className="w-full flex flex-col items-center gap-5 bg-gray-950 border border-gray-800 rounded-2xl p-6 hover:border-blue-600/40 transition-colors duration-200"
                              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                         >
                              <div className="w-full flex items-center justify-between">
                                   <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-600/20 text-blue-400">
                                        <i className="text-[24px]"><item.Icon /></i>
                                   </div>
                                   <span className="text-4xl font-black text-gray-800">{item.step}</span>
                              </div>
                              <div className="w-full flex flex-col gap-2">
                                   <h3 className="text-lg font-bold text-white">{item.title}</h3>
                                   <p className="text-sm text-gray-400 leading-relaxed">{item.description}</p>
                              </div>
                         </motion.div>
                    ))}
               </div>
          </section>
     )
}

// ─── Reasons To Join ─────────────────────────────────────────────────────────
export const ReasonsToJoinSection = () => {
     return (
          <section className="w-full bg-gray-950 flex flex-col items-start justify-start px-[5%] gap-10 py-20">
               <motion.div
                    className="w-full flex flex-col items-center gap-3"
                    initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.6 }}
               >
                    <span className="text-blue-500 text-xs font-semibold uppercase tracking-widest">Why Us</span>
                    <h2 className="text-2xl md:text-3xl font-bold text-white text-center">Reasons to join WeddConnect</h2>
               </motion.div>
               <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ReasonsToJoin.map((reason, index) => (
                         <motion.div
                              key={`reason-${index}`}
                              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}
                         >
                              <ReasonToJoinCard reason={reason} />
                         </motion.div>
                    ))}
               </div>
          </section>
     )
}



export const SocialPlatformsSection = () => {
     return (
          <section className="w-full bg-gray-950 border-y border-gray-800/60 py-20 px-[5%] overflow-hidden">
               <div className="max-w-6xl mx-auto flex flex-col items-center gap-12">
                    {/* Heading */}
                    <motion.div
                         className="flex flex-col items-center gap-3 text-center"
                         initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                         viewport={{ once: true, amount: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                         <span className="text-blue-500 text-xs font-semibold uppercase tracking-widest">Stay Connected</span>
                         <h2 className="text-2xl md:text-3xl font-bold text-white">Follow Us on Social Media</h2>
                         <p className="text-gray-400 text-sm max-w-md">
                              Get daily wedding inspiration, venue spotlights and exclusive tips — wherever you scroll.
                         </p>
                    </motion.div>

                    {/* Cards */}
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                         {SocialLinks.map((social, i) => {
                              const Icon = social.icon;
                              return (
                                   <motion.a
                                        key={social.name}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, amount: 0 }}
                                        transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
                                        whileHover={{ y: -4 }}
                                        className={`group flex flex-col gap-4 p-6 rounded-2xl border border-gray-800 bg-black/40 backdrop-blur-sm transition-all duration-300 cursor-pointer ${social.color}`}
                                   >
                                        {/* Icon */}
                                        <div className={`w-12 h-12 flex items-center justify-center rounded-xl bg-gray-900 border border-gray-800 group-hover:scale-110 transition-transform duration-200 ${social.iconColor}`}>
                                             <Icon size={22} />
                                        </div>
                                        {/* Text */}
                                        <div className="flex flex-col gap-1">
                                             <span className="text-white font-semibold text-sm">{social.name}</span>
                                             <span className={`text-xs font-medium ${social.iconColor}`}>{social.handle}</span>
                                        </div>
                                        <p className="text-gray-400 text-xs leading-relaxed">{social.description}</p>
                                        {/* Follow label */}
                                        <span className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 group-hover:text-white transition-colors duration-200">
                                             Follow <ArrowUpRight size={12} />
                                        </span>
                                   </motion.a>
                              );
                         })}
                    </div>
               </div>
          </section>
     )
}