import { LuAlignRight } from "react-icons/lu";
import { HeaderLogo } from "./header-components";

export default function MobileView () {
     return (
          <header className="w-full md:hidden flex items-center justify-between px-[2%] py-[5px] sticky top-0 bg-white z-30 ">
               <HeaderLogo/>
               <div className='w-auto relative items-center justify-end'>
                    <i className='text-[32px] text-black cursor-pointer'><LuAlignRight /></i>
               </div>
          </header>
     )
}
