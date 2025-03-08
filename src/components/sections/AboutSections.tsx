import Link from "next/link";
import { IconType } from "react-icons";
import { FaArrowRightLong, FaRegStar } from "react-icons/fa6";
import { MdFavoriteBorder, MdOutlineWorkspacePremium } from "react-icons/md";

export const OurProfessionSection = () => {
     return (
     <section className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px] px-[2%] py-[40px]">
          <OurProfessionCard content={{title: 'Passion', description: "We pour our hearts into every wedding we help create", Icon: MdFavoriteBorder }} />
          <OurProfessionCard content={{title: 'Excellence', description: "Committed to delivering exceptional service quality", Icon: FaRegStar }} />
          <OurProfessionCard content={{title: 'Experience', description: "Years of expertise in the wedding industry ", Icon: MdOutlineWorkspacePremium }} />
     </section>
     )
}


const OurProfessionCard = ({content}: {content: {Icon: IconType, title:string, description: string}}) => {
     const {Icon, title, description}  = content;
     return(
          <div className="w-full flex flex-col items-center justify-start gap-[20px] bg-white rounded-[5px] p-[10px] shadow-sm shadow-gray-100">
               <div className="w-[60px] aspect-square flex rounded-full bg-blue-100 items-center justify-center" >
                    <i className="text-[30px] text-blue-600"><Icon /></i>
               </div>
               <h3 className="text-[1.2rem] font-bold text-black">{title}</h3>
               <p className="w-[90%] text-center text-[0.9rem] text-gray-600">{description}</p>
          </div>

     )
}

export const StartPlanningSection = () => {
     return (
          <section className="w-full py-[40px] px-[2%] flex flex-col items-center justify-center gap-[20px] bg-gray-100">
               <h2 className="text-[1.8rem] font-bold text-black ">Ready to start Planning</h2>
               <p className="text-gray-600 text-[0.9rem]">Let us help you create the wedding of your dreams</p>
               <Link prefetch={true} href={'/auth/sign-up'} className="text-[0.8rem] px-[15px] rounded-[5px] py-[7.5px] border-[1.3px] bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300 flex items-center justify-center gap-[5px]">Get Started <i><FaArrowRightLong /></i></Link>
          </section>
     )
}