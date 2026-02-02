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
          <Link className={cn("text-base font-medium text-nowrap text-gray-600 hover:text-blue-600 border border-gray-200 rounded-xl py-2 px-3 ", isActive ? "bg-gradient-to-br from-blue-600 to-blue-800 text-white hover:text-white" :"")} href={link.dest}>{link.name}</Link>
     )
}