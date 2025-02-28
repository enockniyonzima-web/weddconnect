"use client";

import { ENotificationType } from '@/common/CommonTypes';
import { TUser } from '@/common/Entities'
import { logoutUser } from '@/server-actions/auth';
import { showMainNotification } from '@/util/NotificationFuncs';
import Image from 'next/image'
import React from 'react'

const ClientProfileLinks = ({user}:{user:TUser}) => {
     const logout = async () => {
          showMainNotification('Logging out...', ENotificationType.PASS);
          await logoutUser();
     }
     return (
          <div className='w-auto relative z-10 group p-[5px] cursor-pointer'>
               <Image src={user.image} alt={user.email} width={30} height={30} className='w-full rounded-full bg-white border border-green-600 p-[2px]' />
               <div className='w-[250px] bg-white shadow-sm shadow-gray-400 rounded-[10px] p-[10px] hidden group-hover:flex flex-col items-start gap-[10px] absolute top-[102%] right-0'>
                    <button className='w-full text-center border rounded-[10px] p-[7.5px] text-blue-600 border-blue-600 ' onClick={logout}>Logout</button>
               </div>
          </div>
     )
}

export default ClientProfileLinks