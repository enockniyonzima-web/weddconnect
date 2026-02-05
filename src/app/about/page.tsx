import ClientPage from "@/components/layout/ClientPage";
import AboutImage1 from "../../../public/about/about-image-1.png"
import AboutImage2 from "../../../public/about/about-image-2.png";
import Image from "next/image";
import { OurProfessionSection, StartPlanningSection } from "@/components/sections/AboutSections";

export default function AboutPage () {
     return (
          <ClientPage>
               <div className="w-full flex flex-col items-center justify-start gap-2 py-16 px-[2%] bg-black">
                    <h1 className="text-[2.2rem] font-bold text-white">WeddConnect</h1>
                    <p className="text-gray-200">Creating unforgetable wedding experiences with passion and dedication.</p>
               </div>
               <div className="w-full grid grid-cols-1 gap-4 lg:grid-cols-2 py-[40px] px-[2%]">
                    <div className="w-full flex flex-col items-center justify-center gap-[20px]">
                         <h2 className="text-black text-3xl md:text-5xl font-bold">Disover our journey so far</h2>
                         <p className="md:text-lg text-gray-600">At WeddConnect, we’re excited to begin our adventure in bringing couples and vendors together. Our focus is on creating smooth and meaningful connections, ensuring your wedding planning experience is stress-free and delightful. As we start this journey, we’re committed to delivering exceptional service and building lasting relationships along the way.</p>
                    </div>
                    <Image src={AboutImage1} placeholder="blur" alt="Wedd Connect image" width={800} height={600} className="w-full lg:w-[80%] mx-auto rounded-[5px] aspect-[100/80] object-cover object-bottom " />
               </div>
               <div className="w-full gap-6 grid grid-cols-1 lg:grid-cols-2 py-[40px] px-[2%] bg-gradient-to-br from-gray-300 to-blue-200">
                    <Image src={AboutImage2} placeholder="blur" alt="Wedd Connect image" width={800} height={600} className="w-full lg:w-[80%] mx-auto rounded-[5px] aspect-auto" />
                    <div className="w-full flex flex-col items-center justify-center gap-[20px]">
                         <h2 className="text-black text-3xl md:text-5xl font-bold">Our Mission</h2>
                         <p className="md:text-lg text-gray-600">our mission is to simplify the process of bringing couples and vendors together by providing an efficient, user-friendly platform. We strive to empower couples to easily find and connect with the perfect vendors for their dream weddings. At the same time, we aim to support vendors by offering opportunities to grow their business</p>
                    </div>
                    <div className="w-full flex flex-col items-center justify-center gap-[20px]">
                         <h2 className="text-black text-3xl md:text-5xl font-bold">Our Vision</h2>
                         <p className="md:text-lg text-gray-600">our vision is to be the premier platform for connecting couples with trusted vendors in rwanda, making the wedding planning process smooth and efficient. We aim to provide an easy-to-use, reliable service that helps couples find the perfect partners for their big day, while also supporting vendors in growing their businesses. Through our commitment to quality and innovation, we strive to create seamless connections and memorable experiences for everyone involved.</p>
                    </div>
               </div>
               <OurProfessionSection />
               <StartPlanningSection />
          </ClientPage>
     )
}