"use client";

import { HeaderLink, HeaderLogo } from "./header-components"
import ClientProfileLinks from "./ClientProfileLinks"
import { useAuthContext } from "@/components/context/AuthContext";
import { motion } from "motion/react";

const NAV_LINKS = [
     { name: "Home", dest: "/" },
     { name: "Wedding Venues", dest: "/posts/venues" },
     { name: "Wedding Vendors", dest: "/posts" },
     { name: "Wedding Planning", dest: "/posts/wedding-planning" },
     { name: "About Us", dest: "/about" },
];

export default function DesktopView({ scrolled }: { scrolled: boolean }) {
     const { user, setAuth } = useAuthContext();
     return (
          <motion.header
               initial={{ y: -20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ duration: 0.5, ease: "easeOut" }}
               className={`w-full top-0 z-30 hidden md:block  py-[5px]  ${scrolled ? "sticky bg-black/95 backdrop-blur-md shadow-sm shadow-gray-900" : "absolute bg-gradient-to-b from-black/60 to-transparent"}`}
          >
               <div className="w-full mx-auto md:flex items-center px-[2%] justify-between max-w-[1512px]">
                    <HeaderLogo />
                    <div className="w-auto flex items-center justify-between gap-[40px]">
                         {NAV_LINKS.map((link, i) => (
                              <motion.div
                                   key={link.name}
                                   initial={{ opacity: 0, y: -8 }}
                                   animate={{ opacity: 1, y: 0 }}
                                   transition={{ duration: 0.4, delay: 0.1 + i * 0.07, ease: "easeOut" }}
                              >
                                   <HeaderLink link={link} />
                              </motion.div>
                         ))}
                    </div>
                    <motion.div
                         className="w-auto flex items-center justify-center gap-[20px]"
                         initial={{ opacity: 0, x: 16 }}
                         animate={{ opacity: 1, x: 0 }}
                         transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                    >
                         {user ? (
                              <ClientProfileLinks user={user} />
                         ) : (
                              <button
                                   type="button"
                                   className="text-sm px-5 rounded-xl py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors duration-200"
                                   onClick={setAuth}
                              >
                                   Login
                              </button>
                         )}
                    </motion.div>
               </div>
               
          </motion.header>
     );
}