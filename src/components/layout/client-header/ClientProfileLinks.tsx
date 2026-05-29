"use client";

import { TSessionUser } from '@/common/Entities';
import Image from '@/components/ui/Image';
import { LogoutButton } from '@/components/forms/LogoutForm';
import Link from 'next/link';
import { LayoutDashboard, User } from 'lucide-react';

const defaultIcon = "https://weddconnect-s3.s3.eu-north-1.amazonaws.com/production/account.png";

const ClientProfileLinks = ({user}:{user:TSessionUser}) => {
     const isAdmin = !!user.admin;
     const displayName = user.admin?.name || user.client?.name || user.email;

     return (
          <div className='w-auto relative z-10 group p-[5px] cursor-pointer'>
               <Image
                    src={user.image || defaultIcon}
                    alt={user.email}
                    width={30}
                    height={30}
                    className='w-[30px] h-[30px] rounded-full object-cover border border-blue-600 p-[1px]'
               />

               {/* Dropdown */}
               <div className='w-[220px] bg-gray-950 border border-gray-800 shadow-lg rounded-xl p-2 hidden group-hover:flex flex-col gap-1 absolute top-[110%] right-0'>
                    {/* User info */}
                    <div className='px-3 py-2 border-b border-gray-800 mb-1'>
                         <p className='text-xs font-semibold text-white truncate'>{displayName}</p>
                         <p className='text-[10px] text-gray-500 truncate'>{user.email}</p>
                         {isAdmin && (
                              <span className='mt-1 inline-block text-[10px] font-medium text-blue-400 bg-blue-600/10 border border-blue-600/20 rounded px-1.5 py-0.5'>
                                   {user.admin!.role?.name ?? 'Admin'}
                              </span>
                         )}
                    </div>

                    {/* Admin links */}
                    {isAdmin && (
                         <Link
                              href="/dashboard/admin"
                              className='flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-300 hover:bg-gray-900 hover:text-blue-400 transition-colors'
                         >
                              <LayoutDashboard size={14} />
                              Admin Dashboard
                         </Link>
                    )}

                    {/* Client/profile link */}
                    {user.client && (
                         <Link
                              href="/profile"
                              className='flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-300 hover:bg-gray-900 hover:text-blue-400 transition-colors'
                         >
                              <User size={14} />
                              My Profile
                         </Link>
                    )}

                    <div className='border-t border-gray-800 mt-1 pt-1'>
                         <LogoutButton
                              name='Logout'
                              className='w-full text-xs text-gray-400 hover:text-white hover:bg-gray-900 rounded-lg px-3 py-2 transition-colors text-left'
                         />
                    </div>
               </div>
          </div>
     )
}

export default ClientProfileLinks