"use client";

import { useAuthContext } from "@/components/context/AuthContext";
import Link from "next/link";
import { IconType } from "react-icons";
import { FaArrowRight, FaDollarSign, } from "react-icons/fa6";
import { HiUsers } from "react-icons/hi";
import { IoCalendarClear } from "react-icons/io5";
import { MdStarRate } from "react-icons/md";

export const HeroSection = () => {
     const {user} = useAuthContext();

     return (
          <div className="w-full flex flex-col items-center justify-start gap-[10px]">
               <h1 className="text-[1.6rem] text-black font-bold w-full text-start leading-3">Welcome back, {user?.admin?.name || "Admin"}</h1>
               <div className="w-full flex items-end justify-between">
                    <p className="text-[0.9rem] text-gray-600">Here is what is happening with our platform today</p>
                    <Link className="bg-blue-600 text-[0.9rem] rounded-[5px] whitespace-nowrap hover:bg-blue-800 py-[5px] px-[20px] text-white" prefetch={true} href={'/dashboard/admin/posts?form=add'} >New Post</Link>
               </div>
          </div>
     )
}

export const AdminStatistics = () => {
     return (
          <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[20px]">
               <StatisticsCard icon={{icon:HiUsers, iconColor:'text-blue-600', bgColor:'bg-blue-100'}} name="Total Clients" total={`2,420`} change="+5.25%" />
               <StatisticsCard icon={{icon:IoCalendarClear, iconColor:'text-purple-600', bgColor:'bg-purple-100'}} name="Events This Month" total={`145`} change="+10.2%"  />
               <StatisticsCard icon={{icon: FaDollarSign, iconColor:'text-green-600', bgColor:'bg-green-100'}} name="Revenue" total={'Rwf 24,500'} change="+2.5%"  />
               <StatisticsCard icon={{icon:MdStarRate, iconColor:'text-yellow-600', bgColor:'bg-yellow-100'}} name="Vendor Rating" total={'4.8'} change="+0.3%"  />
          </div>
     )
} 

const StatisticsCard  = ({icon, name, change, total}:{icon:{icon:IconType, iconColor:string, bgColor:string},name:string, change: string, total:string}) => {
     const CardIcon = icon.icon;
     return (
          <div className="w-full relative p-4 bg-white shadow-md rounded-2xl border border-transparent 
               before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-300 before:to-purple-300 
               before:rounded-2xl before:-z-10">
               <div className="flex flex-col space-y-2">
               {/* Icon */}
               <div className={`p-2 ${icon.bgColor} rounded-[5px] w-fit`}>
                    <i className={`${icon.iconColor}`}><CardIcon /></i>
               </div>

               {/* Title */}
               <p className="text-gray-600 text-sm">{name}</p>

               {/* Stats */}
               <h2 className="text-xl md:text-2xl font-bold">{total}</h2>

               {/* Growth Indicator */}
               <p className="text-sm text-green-500 font-medium">
                    {change} <span className="text-gray-500">from last month</span>
               </p>
               </div>
          </div>
     )
}

export const QuickOveriew = () => {
     return (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
               <div className="w-full flex lg:col-span-2 flex-col items-center justify-start gap-[20px] rounded-[10px] p-[10px] bg-white" >
                    <div className="w-full flex items-center justify-between ">
                         <h3 className="text-black text-[1rem] font-bold">Recent Activity</h3>
                         <Link href="/dashboard/admin" className="flex items-center justify-start gap-[5px] text-blue-600 text-[0.8rem]" prefetch={true}>View All <i><FaArrowRight /></i></Link>
                    </div>
                    <div className="w-full flex flex-col items-start justify-start gap-[5px]">
                         <p className="text-[0.8rem] text-gray-600">Nothing Found</p>
                    </div>
               </div>
               <div className="w-full flex flex-col items-center justify-start gap-[20px] rounded-[10px] p-[10px] bg-white">
                    <div className="w-full flex items-center justify-between ">
                         <h3 className="text-black text-[1rem] font-bold">Popular Services</h3>
                    </div>
                    <div className="w-full flex flex-col items-start justify-start gap-[5px]">
                         <p className="text-[0.8rem] text-gray-600">Nothing Found</p>
                    </div>
               </div>
          </div>
     )
}