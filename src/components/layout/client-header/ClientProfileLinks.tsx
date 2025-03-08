"use client";

import { ENotificationType } from '@/common/CommonTypes';
import { TUser } from '@/common/Entities'
import { logoutUser } from '@/server-actions/auth';
import { showMainNotification } from '@/util/NotificationFuncs';
import Image from 'next/image'
import React from 'react'
const defaultIcon = "https://weddconnect-s3.s3.eu-north-1.amazonaws.com/production/account.png";
const ClientProfileLinks = ({user}:{user:TUser}) => {
     const logout = async () => {
          showMainNotification('Logging out...', ENotificationType.PASS);
          await logoutUser();
     }
     return (
          <div className='w-auto relative z-10 group p-[5px] cursor-pointer'>
               <Image src={user.image || defaultIcon} alt={user.email} width={30} height={30} className='w-[30px] rounded-full bg-white border border-green-600 p-[2px]' />
               <div className='w-[250px] bg-white shadow-sm shadow-gray-400 rounded-[5px] p-[10px] hidden group-hover:flex flex-col items-start gap-[10px] absolute top-[102%] right-0'>
                    <button type='button' className='w-full text-center border rounded-[5px] p-[5px] text-gray-600 border-gray-300 hover:bg-gray-100 ' onClick={logout}>Logout</button>
               </div>
          </div>
     )
}

export default ClientProfileLinks