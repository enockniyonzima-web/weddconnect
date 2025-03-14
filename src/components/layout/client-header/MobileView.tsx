"use client";

import { LuAlignRight } from "react-icons/lu";
import { HeaderLogo } from "./header-components";
import { useAuthContext } from "@/components/context/AuthContext";
import ClientProfileLinks from "./ClientProfileLinks";
import Link from "next/link";

export default function MobileView () {
     const {user, setAuthOn} = useAuthContext();

     return (
          <header className="w-full md:hidden flex items-center justify-between px-[2%] py-[5px] sticky top-0 bg-white z-30 shadow-sm shadow-gray-200 ">
               <HeaderLogo/>
               
                    <div className="w-auto flex items-center justify-end gap-[10px]">
                    {
                         user ?
                         <ClientProfileLinks user={user} />:
                         <button type="button" className='text-[0.8rem] px-[15px] rounded-[5px] py-[7.5px] border-[1.3px] bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300' onClick={() => setAuthOn(true)}>Login</button> 
                    }
                         <div className='w-auto relative items-center justify-end group'>
                              <i className='text-[32px] text-black cursor-pointer'><LuAlignRight /></i>
                              <div className="min-w-[250px] absolute top-[101%] right-0 z-30 bg-white rounded-[5px] p-[5px] shadow-sm shadow-gray-600 hidden group-hover:flex flex-col items-center justify-start gap-[5px]">
                                   <HeaderLink link={{name: "Home", dest: '/'}} />
                                   <HeaderLink link={{name: "Services", dest: '/services'}} />
                                   <HeaderLink link={{name: "About Us", dest: '/about'}} />
                              </div>
                         </div>
                    </div>
               
          </header>
     )
}

const HeaderLink = ({link}:{link:{name:string, dest: string}})=> (
     <Link href={link.dest} prefetch={true} className="w-full p-[5px] text-gray-600 text-[0.9rem] text-start hover:bg-gray-100 rounded-[5px]">{link.name}</Link>
)
