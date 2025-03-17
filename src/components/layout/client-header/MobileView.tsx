"use client";

import { LuAlignRight } from "react-icons/lu";
import { HeaderLogo } from "./header-components";
import { useAuthContext } from "@/components/context/AuthContext";
import ClientProfileLinks from "./ClientProfileLinks";
import Link from "next/link";
import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";

export default function MobileView () {
     const {user, setAuth} = useAuthContext();
     const [navOn, setNavOn] = useState(false);

     return (
          <header className="w-full md:hidden flex items-center justify-between px-[2%] py-[5px] sticky top-0 bg-white z-30 shadow-sm shadow-gray-200 ">
               <HeaderLogo/>
               
                    <div className="w-auto flex items-center justify-end gap-[10px]">
                    {
                         user ?
                         <ClientProfileLinks user={user} />:
                         <button type="button" className='text-[0.8rem] px-[15px] rounded-[5px] py-[7.5px] border-[1.3px] bg-blue-800 text-white hover:bg-blue-900 transition-all duration-300' onClick={setAuth}>Login</button> 
                    }
                         <div className='w-auto items-center justify-end group'>
                              <i className='text-[32px] text-black cursor-pointer' onClick={() => setNavOn(prev => !prev)}><LuAlignRight /></i>
                              {
                                   <Dialog open={navOn} onClose={() => setNavOn(false)} className="relative z-50">
                                        <div className="w-full fixed inset-0 bg-black bg-opacity-10 flex justify-center items-center">
                                             <DialogPanel className="w-full px-[5%]">
                                                  <div className="w-full bg-black/90 rounded-[10px] p-[10px] shadow-sm shadow-gray-600 flex flex-col items-center justify-start gap-[10px] ease-in-out">
                                                       <HeaderLink link={{name: "Home", dest: '/'}} />
                                                       <HeaderLink link={{name: "Wedding Venues", dest: '/posts?category=1'}} />
                                                       <HeaderLink link={{name: "Wedding Vendors", dest: '/posts'}} />
                                                       <HeaderLink link={{name: "Services", dest: '/services'}} />
                                                       <HeaderLink link={{name: "About Us", dest: '/about'}} />
                                                  </div>
                                             </DialogPanel>
                                        </div> 
                                   </Dialog> 
                              }
                              
                         </div>
                    </div>
               
          </header>
     )
}

const HeaderLink = ({link}:{link:{name:string, dest: string}})=> (
     <Link href={link.dest} prefetch={true} className="w-full p-[10px] px-[20px] text-gray-200 text-start text-[1rem]  hover:bg-gradient-to-br hover:text-black from-white to-black/50 transition-all duration-300 rounded-[30px]">{link.name}</Link>
)
