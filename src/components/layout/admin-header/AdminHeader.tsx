/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { TUser } from '@/common/Entities'
import React from 'react'
import Logo from '../../../../public/logo/logo.png';
import Image from 'next/image';
import { IconType } from 'react-icons';
import Link from 'next/link';
import { LuLayoutDashboard } from 'react-icons/lu';
import { TbCategoryPlus } from 'react-icons/tb';
import { MdOutlineLibraryBooks } from 'react-icons/md';
import { BsPeople } from 'react-icons/bs';
import { FaGear, FaRegCreditCard } from 'react-icons/fa6';
import { FaUsersCog } from 'react-icons/fa';
import  UserImage from '../../../../public/images/user-icon.png';
import { usePathname } from 'next/navigation';
import { useAdminContext } from '@/components/context/AdminContext';

const DesktopViewLinks:{name:string, dest: string, icon: IconType}[]  = [
     {name: "Overview", dest: '', icon: LuLayoutDashboard},
     {name: "Categories", dest:'categories', icon: TbCategoryPlus},
     {name: "Posts", dest: "posts", icon: MdOutlineLibraryBooks},
     {name: "Clients", dest:"clients", icon: BsPeople},
     {name: "Services", dest: "services", icon: FaGear},
     {name: "User Management", dest: "users", icon: FaUsersCog},
     {name: "Transactions", dest: 'transactions', icon: FaRegCreditCard}
]

const AdminHeader = () => {
     const {user} = useAdminContext();
     return (
          <>
               <DesktopView user={user} />
               <MobileView user={user} />
          </>
     )
}

const DesktopView  = ({user}: {user: TUser | null | undefined}) => {
     const pathname = usePathname();
     const activeLink = pathname.split('/')[3] || '';
     return (
          <div className='w-[20%] h-full overflow-hidden bg-white rounded-[0px] shadow-md hidden  lg:flex flex-col items-center justify-between p-4'>
               <div className='w-full flex flex-col items-center justify-start gap-[30px] '>
                    <div className='w-full flex items-center flex-wrap justify-center gap-[10px]'>
                         <Image src={Logo} placeholder='blur' width={80} height={40} alt="wedd connect logo" className='w-[40px] aspect-auto' />
                         <h1 className='text-[1.2rem] font-bold text-blue-600'>WeddConnect</h1>
                    </div>
                    <nav className='w-full flex flex-col items-center justify-start gap-[10px] transition-all duration-300'>
                         {
                              DesktopViewLinks.map((link, index) => (
                                   <DesktopViewLink key={index} link={link} active={link.dest === activeLink || (activeLink.split('?')[0])=== link.dest} />
                              ))
                         }
                    </nav>
               </div>
               <div className='w-full flex items-center flex-wrap justify-start gap-[10px]'>
                    <Image src={user?.image || UserImage} alt='User image' width={60} height={60} className='rounded-full w-[30px] aspect-square object-cover' />
                    <h2 className='text-black text-[0.9rem] font-semibold'>{user?.email || "Admin User"}</h2>
               </div>
          </div>
     )
}

const DesktopViewLink = ({link, active}:{link:{name:string, dest: string, icon: IconType}, active:boolean}) => {
     const LinkIcon = link.icon;
     return (
          <Link prefetch={true} href={`/dashboard/admin/${link.dest}`} className={`p-2 transition-all duration-300 w-full flex items-center justify-start gap-[10px] flex-wrap rounded-[5px] ${active ? 'bg-blue-600 text-white hover:bg-blue-800' : 'text-gray-800 hover:bg-blue-100'}`}>
               <i className='text-[22px]'><LinkIcon /></i>
               <span className='text-[0.9rem]'>{link.name}</span>
          </Link>
     )
}

const MobileView = ({user}: {user: TUser | null | undefined}) => {
     const pathname = usePathname();
     const activeLink = pathname.split('/')[3] || '';
     return (
          <div className='w-full lg:hidden  p-2 box-border'>
               <nav className='w-full bg-white shadow-md rounded-[10px] justify-between flex items-center p-2 gap-[10px]'>
                    {
                         DesktopViewLinks.map((link, index) => (
                              <MobileViewLink key={index} link={link} active={link.dest === activeLink || (activeLink.split('?')[0])=== link.dest} />
                         ))
                    }
               </nav>
          </div>
     )
}

const MobileViewLink = ({link, active}:{link:{name:string, dest: string, icon: IconType}, active:boolean}) => {
     return (
          <Link prefetch={true} href={`/dashboard/admin/${link.dest}`} className={`p-2 transition-all duration-300 w-full flex flex-col items-center justify-start gap-[5px] flex-wrap rounded-[5px] ${active ? 'bg-blue-600 text-white hover:bg-blue-800' : 'text-gray-800 hover:bg-blue-100'}`}>
               <i className='text-[22px]'><link.icon /></i>
               <span className='hidden md:block text-[0.9rem] whitespace-nowrap text-center'>{link.name}</span>
          </Link>
     )
}

export default AdminHeader