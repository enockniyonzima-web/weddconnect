"use client";

import { HeaderLink, HeaderLogo } from "./header-components"
import ClientProfileLinks from "./ClientProfileLinks"
import { useAuthContext } from "@/components/context/AuthContext";

export default function DesktopView (){
     const {user, setAuthOn} = useAuthContext();
     return (
          <header className="w-full sticky shadow-sm shadow-gray-100 top-0 z-30 ml-[50%] -translate-x-[50%] bg-white hidden md:flex items-center justify-between px-[2%] py-[5px] max-w-[1512px] ">
               <HeaderLogo />
               <div className='w-auto flex items-center justify-between gap-[40px]'>
                    <HeaderLink link={{name: "Home", dest: '/'}} />
                    <HeaderLink link={{name: "Services", dest: '/services'}} />
                    <HeaderLink link={{name: "About Us", dest: '/about'}} />
               </div>
               <div className='w-auto flex items-center justify-center gap-[20px]'>
                    {
                         user ?
                         <ClientProfileLinks user={user} /> :
                         <>
                              <button type="button" className='text-[0.8rem] px-[15px] rounded-[5px] py-[7.5px] border-[1.3px] bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300'  onClick={() => setAuthOn(true)}>Login</button>
                         </>
                    }
                    
               </div>
          </header>
     )
}