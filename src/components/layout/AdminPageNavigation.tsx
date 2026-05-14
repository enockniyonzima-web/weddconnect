"use client";

import { cn } from "@/lib/utils";
import Link from "next/link"
import { usePathname } from "next/navigation";

export const AdminPageNavigation = ({links}:{links: {name:string, dest:string}[]}) => {
     return (
          <nav className="w-full flex items-center justify-start gap-3 flex-wrap hide-scroll">
               {
                    links.map((link, index) => <NavLink link={link} key={`admin-page-link-${index}`} />)
               }
          </nav>
     )   
}

const NavLink = ({link}:{link: {name:string, dest:string}}) =>{
     const pathname = usePathname();
     const isActive = pathname === link.dest;
     return (
          <Link className={cn("text-sm font-medium text-nowrap text-gray-400 hover:text-blue-400 border border-gray-700 rounded-xl py-2 px-3 transition-colors", isActive ? "bg-blue-600 text-white hover:text-white border-blue-600" :"")} href={link.dest}>{link.name}</Link>
     )
}