import ClientPage from "@/components/layout/ClientPage";
import AboutImage1 from "../../../public/about/about-image-1.png"
import AboutImage2 from "../../../public/about/about-image-2.png";
import Image from "next/image";
import { OurProfessionSection, StartPlanningSection } from "@/components/sections/AboutSections";
import { Target, Eye } from "lucide-react";

export default function AboutPage () {
     return (
          <ClientPage>
               {/* Hero */}
               <section className="relative w-full flex flex-col items-center justify-center gap-5 py-24 px-[5%] bg-black overflow-hidden text-center">
                    <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-blue-800/10 rounded-full blur-3xl pointer-events-none" />
                    <span className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-600/30 bg-blue-600/10 text-blue-400 text-xs font-medium tracking-wide">
                         Our Story
                    </span>
                    <h1 className="relative text-4xl md:text-6xl font-bold text-white leading-tight max-w-3xl">
                         Connecting Couples with Rwanda&apos;s <span className="text-blue-500">Best Wedding Vendors</span>
                    </h1>
                    <p className="relative text-gray-400 text-base md:text-lg max-w-2xl leading-relaxed">
                         WeddConnect was built to make wedding planning stress-free and delightful — bringing couples and vendors together on one seamless platform.
                    </p>
               </section>

               {/* Journey */}
               <section className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10 py-20 px-[5%] bg-gray-950 items-center">
                    <div className="flex flex-col gap-5">
                         <span className="text-blue-500 text-xs font-semibold uppercase tracking-widest">Our Journey</span>
                         <h2 className="text-white text-3xl md:text-4xl font-bold leading-snug">Discover how we got here</h2>
                         <p className="text-gray-400 text-base leading-relaxed">
                              At WeddConnect, we&apos;re excited to begin our adventure in bringing couples and vendors together. Our focus is on creating smooth and meaningful connections, ensuring your wedding planning experience is stress-free and delightful. As we grow, we remain committed to delivering exceptional service and building lasting relationships along the way.
                         </p>
                    </div>
                    <div className="relative rounded-2xl overflow-hidden border border-gray-800 aspect-[4/3]">
                         <Image src={AboutImage1} placeholder="blur" alt="WeddConnect journey" fill className="object-cover object-bottom" />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
               </section>

               {/* Mission & Vision */}
               <section className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 py-20 px-[5%] bg-black items-center">
                    <div className="relative rounded-2xl overflow-hidden border border-gray-800 aspect-[4/3]">
                         <Image src={AboutImage2} placeholder="blur" alt="WeddConnect mission" fill className="object-cover" />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                    <div className="flex flex-col gap-8">
                         <div className="flex flex-col gap-3">
                              <div className="flex items-center gap-2 text-blue-400">
                                   <Target size={18} />
                                   <span className="text-sm font-semibold uppercase tracking-widest">Our Mission</span>
                              </div>
                              <h3 className="text-white text-2xl font-bold">Simplifying wedding planning</h3>
                              <p className="text-gray-400 text-base leading-relaxed">
                                   Our mission is to simplify the process of bringing couples and vendors together through an efficient, user-friendly platform empowering couples to find the perfect vendors while helping businesses grow.
                              </p>
                         </div>
                         <div className="w-full h-px bg-gray-800" />
                         <div className="flex flex-col gap-3">
                              <div className="flex items-center gap-2 text-blue-400">
                                   <Eye size={18} />
                                   <span className="text-sm font-semibold uppercase tracking-widest">Our Vision</span>
                              </div>
                              <h3 className="text-white text-2xl font-bold">Premier wedding platform in Rwanda</h3>
                              <p className="text-gray-400 text-base leading-relaxed">
                                   We envision being Rwanda&apos;s most trusted platform for wedding planning, connecting couples with quality vendors, making every big day smooth, memorable, and stress-free.
                              </p>
                         </div>
                    </div>
               </section>

               <OurProfessionSection />
               <StartPlanningSection />
          </ClientPage>
     )
}