import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";

export const HeroSection = () => {

     return (
          <section className="w-full aspect-[100/140] md:aspect-[100/50] lg:aspect-[100/40] bg-black">
               <div className="w-full h-full flex flex-col items-center justify-center gap-[20px] px-[2%]">
                    <h1 className="text-[1.6rem] md:text-[2rem] lgtext-[2.4rem] font-bold md:font-extrabold text-white text-center ">Plan Your Dream Wedding, <br /> Stress Free</h1>
                    <p className="text-center text-[0.9rem] text-gray-300 font-medium">Find then perfect Vendors and create unforgettable special day!</p>
                    <Link className=" flex items-center gap-[5px] text-[0.9rem] px-[20px] rounded-[5px] py-[10px] bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300" href="/">Get Started <i className="text-[18px]"><FaArrowRight /></i> </Link>
               </div>
          </section>
     );
}