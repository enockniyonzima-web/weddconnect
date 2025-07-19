/* eslint-disable @typescript-eslint/no-unused-vars */
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";

import { IconType } from "react-icons";
import { MdCelebration, MdOutlineDateRange, MdVerified } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { GetStartedBtn } from "../buttons/common";
import { TCategory } from "@/common/Entities";
import { MainServer } from "@/services/Server";
import Endpoints from "@/services/Endpoints";
import { CategoryCard } from "../cards/Category";
import { TrendingImages } from "../images/StaticImages";
import { TrendingCardsSection } from "../cards/TrendingCardsSection";
import { IoImages } from "react-icons/io5";
import { ReasonToJoinCard } from "../cards/ReasonToJoinCard";
import { HiOutlineCurrencyDollar } from "react-icons/hi";

import Image from "../ui/Image";

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
export function HeroSection () {

     return (
          <section className="w-full aspect-[100/140] relative md:aspect-[100/50] lg:aspect-[100/40] bg-black overflow-hidden">
               {/* <img src={NewImage} alt="Wedding image" width={1200} height={800} className="absolute -top-[10px]  object-cover z-0 w-[110%] h-[110%] -left-[5%]"/> */}
               <Image src={"/home/new-cp-image.webp"} alt="Wedding image" placeholder="blur" loading="lazy" width={1200} height={800} className="absolute top-[50%] -translate-x-[50%] -translate-y-[50%] object-cover z-0 w-[100%] h-[100%] left-[50%]"/>
               <div className="w-full h-full bg-gradient-to-b from-black/80 via-black/70 to-black/90 flex flex-col items-center justify-center gap-[20px] px-[2%] relative z-10">
                    <h1 className="text-[1.6rem] md:text-[2rem] lgtext-[2.4rem] font-bold md:font-extrabold text-white text-center ">Rwanda&apos;s Largest Collection of <br className="hidden lg:flex" /> Wedding Venues & Verified Vendors.</h1>
                    <p className="text-center text-[1rem] text-gray-300 font-normal whitespace-pre-line max-w-[80%]">From Only $7, Access All Wedding Venues & Top Wedding Vendor Options!</p>
                    <GetStartedBtn />
               </div>
          </section>
     );
}

export function OurProfessionalSection () {
     return(
          <section className="w-full grid grid-cols-1 lg:grid-cols-2 gap-[20px] px-[5%] py-[40px] bg-black">
               <div className="w-full flex flex-col items-center justify-center gap-[20px]">
                    <h2 className="text-[1.8rem] lg:text-[2.2rem] font-extrabold text-white text-center">Our Professional Servie</h2>
                    <p className="text-gray-400 text-[1.4rem] text-center ">We provide expert wedding consultation, helping couples find the perfect venues and vendors that match their vision and budget. With WeddConnect, you get seamless connections to trusted wedding professionals, making your planning stress-free and enjoyable</p>
               </div>
               <div className="w-full flex items-center justify-center relative">
                    <Image loading="lazy" src={"/home/professional-image.jpg"} alt="WeddConnect" width={600} placeholder="blur" height={800}  className="w-full aspect-[100/80] rounded-[20px] object-cover" />
               </div>
          </section>
     )
}


export function ProfessionalsSection () {
     return (
          <section className="w-full flex flex-col items-center justify-start gap-[30px] py-[40px] px-[2%]">
               <div className="w-full flex flex-col items-center justify-start gap-[10px]">
                    <h1 className="text-[1.6rem] lg:text-[1.8rem] font-extrabold text-black text-center">Our Professional Services</h1>
                    <p className="text-[1rem] md:text-[1.1rem] w-full md:w-[80%] lg:w-[60%] text-gray-700 text-center">Discover our carefully curated selection of wedding professionals who will make your special day truly unforgetable </p>
               </div>
               <div className="w-full grid grid-cols-1 md:grd-cols-2 lg:grid-cols-3 gap-[20px]">
                    {
                         Professionals.map((profession, index) => <ProfessionalCard profession={profession} key={`home-services-${index}`} /> )
                    }
               </div>
               <div className="w-full flex items-center justify-center">
                    <Link href={'/services'} className="w-auto py-[10px] px-[20px] rounded-[30px] text-white bg-gradient-to-br from-blue-600 to-blue-800 text-[1.1rem]  font-medium flex items-center justify-center gap-[10px]">View More Services <i className="text-[22px]"><FaArrowRight /></i></Link>
               </div>
          </section>
     )
}

const ProfessionalCard = ({profession}:{profession:{image: string, title:string, description:string, dest:string}}) => {
     const {image, title, description, dest} = profession;
     return (
          <div className="w-full h-auto rounded-[5px] overflow-hidden shadow-sm shadow-gray-200">
               <div className="w-full aspect-video relative">
                    <Image src={image} placeholder="blur" loading="lazy" alt={`${title} image`} className="object-cover w-full h-full" />
               </div>
               <div className="w-full flex flex-col items-start justify-between gap-[10px] p-[10px] pb-[20px]">
                    <h3 className="text-[1.1rem] font-bold text-black " >{title}</h3>
                    <p className="text-[0.9rem] text-gray-600">{description}</p>
                    {/* <Link className="text-[0.9rem] fonts-semibold text-white flex items-center bg-blue-600 px-[20px] py-[7.5px] rounded-[30px] justify-start gap-[10px] hover:bg-blue-700" href={dest}>View details <i className="text-[22px]"><FaArrowRight /></i></Link> */}
               </div> 
               
          </div>
     )
}


export function HowItWorksSection () {
     return (
          <section id="how-it-works-section" className="w-full flex flex-col bg-black items-center justify-start gap-[40px] py-[80px] px-[5%]">
               <div className="w-full flex flex-col items-center justify-start gap-[10px]">
                    <h1 className="text-[1.6rem] lg:text-[1.8rem] font-extrabold leading-4 text-white text-center">How It Works</h1>
               </div>
               <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]">
                    <HowItWorksCard content={{title: 'Plan', description: "Set your wedding date and create your personalized timeline", Icon: MdOutlineDateRange }} />
                    <HowItWorksCard content={{title: 'Find', description: "Browse and find the best wedding vendors for your wedding.", Icon: FiSearch }} />
                    <HowItWorksCard content={{title: 'Celebrate', description: "Enjoy your dream wedding while we handle the details ", Icon: MdCelebration }} />
               </div>
          </section>
     )
}

const HowItWorksCard = ({content}: {content: {Icon: IconType, title:string, description: string}}) => {
     const {Icon, title, description}  = content;
     return(
          <div className="w-full flex flex-col items-center justify-start gap-[20px] bg-black shadow-blue-600 rounded-[20px] p-[20px] shadow-inner">
               <div className="w-[60px] aspect-square flex rounded-full items-center bg-gray-800/50 justify-center" >
                    <i className="text-[30px] text-blue-600"><Icon /></i>
               </div>
               <h3 className="text-[1.6rem] font-bold text-gray-200">{title}</h3>
               <p className="w-[90%] text-center text-[1rem] text-gray-400">{description}</p>
          </div>

     )
}

export async function HotCategoriesSection () {
     let categories:TCategory[] = [];
     const categoriesRes = await MainServer.fetch(`${Endpoints.category.default}?status=true`);
     if(categoriesRes) categories = categoriesRes.data;

     return (
          <section className="w-full flex flex-col bg-gray-100 items-center justify-start gap-[30px] py-[20px] px-[2%]">
               {/* <div className="w-full flex flex-col items-center justify-start gap-[10px]">
                    <h1 className="text-[1.6rem] lg:text-[1.8rem] font-extrabold leading-4 text-black text-start">Top Categories</h1>
                    <p className="text-[0.8rem] md:text-[0.9rem] w-full md:w-[80%] lg:w-[60%] text-gray-700 text-center">View vendors in top categories. </p>
               </div> */}
               <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[10px] ">
                    {
                         categories.map((c, index) => index < 4 ? <CategoryCard key={`home-category-${c.id}`} category={c} /> : null)
                    }
               </div>
               
          </section>
     )
}

export const TrendingSection = () => {
     return (
          <section className="w-full py-[40px] px-[2%] bg-gradient-to-b from-black via-gray-800 to-black flex flex-col gap-[20px] ">
               <h2 className="text-[1.6rem] w-full text-start font-bold text-white">Trending Wedding Venues</h2>
               <TrendingCardsSection images={TrendingImages} />
          </section>
     )
}

export const ReasonsToJoinSection = () => {
     return (
          <section className="w-full bg-black flex flex-col items-start justify-start px-[5%] lg:px-[5%] gap-[40px] py-[80px]">
               <h2 className="text-[1.6rem] w-full text-center font-bold text-white">Reasons to join</h2>
               <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[40px]">
                    {
                         ReasonsToJoin.map((reason, index) => <ReasonToJoinCard key={`home-reason-to-join-card-${index}`} reason={reason} />)
                    }
               </div>
          </section>
     )
}