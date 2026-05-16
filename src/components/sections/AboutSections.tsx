import Link from "next/link";
import { IconType } from "react-icons";
import { FaArrowRightLong, FaRegStar } from "react-icons/fa6";
import { MdFavoriteBorder, MdOutlineWorkspacePremium } from "react-icons/md";

export const OurProfessionSection = () => {
     return (
          <section className="w-full px-[5%] py-20 bg-gray-950">
               <div className="text-center mb-12">
                    <span className="text-blue-500 text-xs font-semibold uppercase tracking-widest">Why Choose Us</span>
                    <h2 className="text-white text-3xl md:text-4xl font-bold mt-2">What drives us forward</h2>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <OurProfessionCard content={{title: 'Passion', description: "We pour our hearts into every wedding we help create, ensuring every couple feels supported throughout their journey.", Icon: MdFavoriteBorder }} />
                    <OurProfessionCard content={{title: 'Excellence', description: "Committed to delivering exceptional service quality at every step — from discovery to your big day.", Icon: FaRegStar }} />
                    <OurProfessionCard content={{title: 'Experience', description: "Deep expertise in the wedding industry allows us to connect couples with vendors they can truly trust.", Icon: MdOutlineWorkspacePremium }} />
               </div>
          </section>
     )
}

const OurProfessionCard = ({content}: {content: {Icon: IconType, title:string, description: string}}) => {
     const {Icon, title, description} = content;
     return (
          <div className="flex flex-col items-center text-center gap-4 p-6 rounded-2xl border border-gray-800 bg-gray-900 hover:border-blue-600/40 transition-colors duration-200">
               <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-blue-600/10 border border-blue-600/20 text-blue-400">
                    <i className="text-[26px]"><Icon /></i>
               </div>
               <h3 className="text-white text-lg font-bold">{title}</h3>
               <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
          </div>
     )
}

export const StartPlanningSection = () => {
     return (
          <section className="relative w-full py-20 px-[5%] flex flex-col items-center justify-center gap-6 bg-black overflow-hidden text-center">
               <div className="absolute inset-0 bg-blue-600/5 pointer-events-none" />
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
               <span className="relative text-blue-500 text-xs font-semibold uppercase tracking-widest">Get Started</span>
               <h2 className="relative text-white text-3xl md:text-4xl font-bold">Ready to start planning?</h2>
               <p className="relative text-gray-400 text-base max-w-md leading-relaxed">Let us help you create the wedding of your dreams. Join thousands of couples already using WeddConnect.</p>
               <Link prefetch={true} href="/auth/sign-up" className="relative inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors duration-200">
                    Get Started <FaArrowRightLong />
               </Link>
          </section>
     )
}