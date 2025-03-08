
"use client";

import { TCategory } from "@/common/Entities";
import { formatPrice } from "@/util/stringFuncs";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react"
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";

const Filter = ({ categories}:{ categories: TCategory[]}) => {
     const search = useSearchParams();
     const categorySearchBase = '?category=';
     const searchedCategory = search.get('category') ? Number(search.get('category')) : 0;
     const categoryLinks:{name:string, dest:string, checked:boolean}[] = categories.map(c => ({name: `${c.name} (${formatPrice(c._count.posts)} posts) `, dest: `${c.id}`, checked:searchedCategory === c.id }));
     return (
          <div className="w-full grid grid-cols-2 lg:grid-cols-3 px-[2%] py-[5px] gap-[10px]">
               <input type="search" name="search-vendor" id="search-vendor-name" title="Search vendor" className="w-full p-[5px] bg-gray-100 border border-gay-200 rounded-[5px] outline-none focus:bg-gray-200 focus:border-blue-600 placeholder:text-[0.8rem] placeholder:text-gray-600" placeholder="Search any Vendor " />
               <LinksDropDown baseLink={categorySearchBase} links={categoryLinks} label="Choose category" />
          </div>
     )
}



const LinksDropDown = ({label,links, baseLink}:{label:string, links:{name:string, dest:string, checked:boolean}[],baseLink:string}) => {
     const [showLinks,setShowLinks] = useState<boolean>(false)

     useEffect(() => {
          const handleClickOutside = (event: MouseEvent) => {
               const target = event.target as HTMLElement; // Type assertion to HTMLElement

               // Check if the clicked element is outside the dropdown
               if (!target.closest("#links-dropdown-container")) {
                    setShowLinks(false);
               }
          };
        
          document.addEventListener("mousedown", handleClickOutside);
          return () => document.removeEventListener("mousedown", handleClickOutside);
     }, []);
     return (
          <div className="w-full relative" >
               <div onClick={() => setShowLinks(prev => !prev)} className={`flex w-full border ${showLinks ? "bg-gray-200 border-blue-600" :"bg-gray-100  border-gray-200"} rounded-[5px] cursor-pointer  items-center justify-between px-[5px] py-[10px]  `}><span className="text-[0.8rem] text-black">{label}</span> <i className="text-[16px] text-gray-600">{showLinks ? <FaAngleUp /> :<FaAngleDown />}</i></div>
               {showLinks ? 
                    <div id="links-dropdown-container" className="w-full bg-white shadow-sm shadow-gray-300 p-[5px] gap-[10px] absolute top-[105%] left-0 rounded-[5px] flex z-30 flex-col items-center justify-start ">
                         {links.map((link, index) => <Link onClick={()=> setShowLinks(false)} className={`text-[0.9rem] text-gray-600 w-full text-start p-[5px] rounded-[5px] ${link.checked ? 'border border-gray-200' : ''} bg-white hover:bg-gray-100 hover:text-blue-600 `} prefetch={true} href={`${baseLink}${link.dest}`} key={`${label}-${index}-filter-links`} >{link.name}</Link>)}
                    </div> 
               : null}
          </div>
     )
}

export default Filter