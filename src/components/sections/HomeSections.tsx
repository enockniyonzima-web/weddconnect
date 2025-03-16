import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import HeroImage from "../../../public/home/home-page-pic.webp";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

import VenuesImage from '../../../public/professionals/venues.webp';
import weddingPlannerImage from '../../../public/professionals/wedding-planner.webp';
import PhotographyImage from '../../../public/professionals/photography.webp';
import { IconType } from "react-icons";
import { MdOutlineDateRange } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { GrFavorite } from "react-icons/gr";
import { GetStartedBtn } from "../buttons/common";
import { TCategory } from "@/common/Entities";
import { MainServer } from "@/services/Server";
import Endpoints from "@/services/Endpoints";
import { CategoryCard } from "../cards/Category";

const Professionals: {image:StaticImport, title:string, description:string, dest: string}[] = [
     {title: "Venues", description: "Welcome to our curated selection of wedding venues, where we connect couples with beautiful spaces to celebrate their special day.", image:VenuesImage, dest:'/' },
     {title: "Wedding Planner", description: "Our expert wedding planners will guide through every step of your wedding journey, from initial concept to flawless execution.", image:weddingPlannerImage, dest:'/' },
     {title: "Photography Company", description: "Discover our selection of talented photography companies who capture the magic of your wedding day in breathtaking detail.", image:PhotographyImage, dest:'/' }
]
export function HeroSection () {

     return (
          <section className="w-full aspect-[100/140] relative md:aspect-[100/50] lg:aspect-[100/40] bg-black">
               <Image src={HeroImage} alt="Wedding image" fill  placeholder="blur" className="absolute top-0 object-cover z-0 left-0"/>
               <div className="w-full h-full bg-black/50 flex flex-col items-center justify-center gap-[20px] px-[2%] relative z-10">
                    <h1 className="text-[1.6rem] md:text-[2rem] lgtext-[2.4rem] font-bold md:font-extrabold text-white text-center ">Plan Your Dream Wedding, <br /> Stress Free</h1>
                    <p className="text-center text-[0.9rem] text-gray-300 font-medium">Find then perfect Vendors and create unforgettable special day!</p>
                    <GetStartedBtn />
               </div>
          </section>
     );
}


export function ProfessionalsSection () {
     return (
          <section className="w-full flex flex-col items-center justify-start gap-[30px] py-[40px] px-[2%]">
               <div className="w-full flex flex-col items-center justify-start gap-[10px]">
                    <h1 className="text-[1.6rem] lg:text-[1.8rem] font-extrabold leading-4 text-black text-center">Our Professional Services</h1>
                    <p className="text-[1rem] md:text-[1.1rem] w-full md:w-[80%] lg:w-[60%] text-gray-700 text-center">Discover our carefully curated selection of wedding professionals who will make your special day truly unforgetable </p>
               </div>
               <div className="w-full grid grid-cols-1 md:grd-cols-2 lg:grid-cols-3 gap-[20px]">
                    {
                         Professionals.map((profession, index) => <ProfessionalCard profession={profession} key={`home-services-${index}`} /> )
                    }
               </div>
               <div className="w-full flex items-center justify-center">
                    <Link href={'/services'} className="w-auto py-[10px] px-[20px] rounded-[30px] text-blue-600 bg-white border-[1.5px] border-blue-400 text-[0.9rem] font-medium hover:bg-gray-100 flex items-center justify-center gap-[10px]">View More Services <i className="text-[22px]"><FaArrowRight /></i></Link>
               </div>
          </section>
     )
}

const ProfessionalCard = ({profession}:{profession:{image: StaticImport, title:string, description:string, dest:string}}) => {
     const {image, title, description, dest} = profession;
     return (
          <div className="w-full h-auto rounded-[5px] overflow-hidden shadow-sm shadow-gray-200">
               <div className="w-full aspect-video relative">
                    <Image src={image} placeholder="blur" fill alt={`${title} image`} className="object-cover" />
               </div>
               <div className="w-full flex flex-col items-start justify-between gap-[10px] p-[10px]">
                    <h3 className="text-[1.1rem] font-bold text-black " >{title}</h3>
                    <p className="text-[0.9rem] text-gray-600">{description}</p>
                    <Link className="text-[0.9rem] fonts-semibold text-white flex items-center bg-blue-600 px-[20px] py-[7.5px] rounded-[30px] justify-start gap-[10px] hover:bg-blue-700" href={dest}>View details <i className="text-[22px]"><FaArrowRight /></i></Link>
               </div> 
               
          </div>
     )
}


export function HowItWorksSection () {
     return (
          <section id="how-it-works-section" className="w-full flex flex-col bg-gray-100 items-center justify-start gap-[30px] py-[40px] px-[2%]">
               <div className="w-full flex flex-col items-center justify-start gap-[10px]">
                    <h1 className="text-[1.6rem] lg:text-[1.8rem] font-extrabold leading-4 text-black text-center">How It Works</h1>
               </div>
               <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]">
                    <HowItWorksCard content={{title: 'Plan', description: "Set your wedding date and create your personalized timeline", Icon: MdOutlineDateRange }} />
                    <HowItWorksCard content={{title: 'Find', description: "Browse and find the best wedding vendors for your wedding.", Icon: FiSearch }} />
                    <HowItWorksCard content={{title: 'Celebrate', description: "Enjoy your dream wedding while we handle the details ", Icon: GrFavorite }} />
               </div>
          </section>
     )
}

const HowItWorksCard = ({content}: {content: {Icon: IconType, title:string, description: string}}) => {
     const {Icon, title, description}  = content;
     return(
          <div className="w-full flex flex-col items-center justify-start gap-[20px] bg-white rounded-[5px] p-[10px]">
               <div className="w-[60px] aspect-square flex rounded-full bg-blue-100 items-center justify-center" >
                    <i className="text-[30px] text-blue-600"><Icon /></i>
               </div>
               <h3 className="text-[1.2rem] font-bold text-black">{title}</h3>
               <p className="w-[90%] text-center text-[0.9rem] text-gray-600">{description}</p>
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
