"use client";

import { HeaderLink, HeaderLogo } from "./header-components"
import ClientProfileLinks from "./ClientProfileLinks"
import { useAuthContext } from "@/components/context/AuthContext";

export default function DesktopView ({scrolled} :{scrolled:boolean}){
     const {user, setAuth} = useAuthContext();
     return (
          <header className={`w-full  top-0 z-30 ml-[50%] -translate-x-[50%]  hidden md:flex items-center justify-between px-[2%] py-[5px] max-w-[1512px] ${scrolled ? "sticky bg-white shadow-sm shadow-gray-400" : "absolute bg-gradient-to-b from-black/50 to-transparent"} `}>
               <HeaderLogo scrolled={scrolled} />
               <div className='w-auto flex items-center justify-between gap-[40px]'>
                    <HeaderLink scrolled={scrolled} link={{name: "Home", dest: '/'}} />
                    <HeaderLink scrolled={scrolled}  link={{name: "Wedding Venues", dest: '/posts?category=1'}} />
                    <HeaderLink scrolled={scrolled}  link={{name: "Wedding Vendors", dest: '/posts'}} />
                    <HeaderLink scrolled={scrolled}  link={{name: "Services", dest: '/services'}} />
                    <HeaderLink scrolled={scrolled}  link={{name: "About Us", dest: '/about'}} />
               </div>
               <div className='w-auto flex items-center justify-center gap-[20px]'>
                    {
                         user ?
                         <ClientProfileLinks user={user} /> :
                         <>
                              <button type="button" className='text-[1rem] px-[15px] rounded-[10px] py-[7.5px] bg-gradient-to-br from-blue-600 to-blue-800 text-white hover:text-red-100 transition-all duration-300'  onClick={setAuth}>Login</button>
                         </>
                    }
                    
               </div>
          </header>
     )
}