'use client';

import { ENotificationType } from "@/common/CommonTypes";
import { useEffect, useState } from "react";

interface INotification {
     message:string,
     type: ENotificationType
}
export const NotificationCard:React.FC<INotification> = ({message, type}) => {

     const [fadeOut, setFadeOut] = useState(false);
     useEffect(() => {
          
          const timer = setTimeout(() => {
               setFadeOut(true);
          }, 2500);
          return () => clearTimeout(timer);
     }, []);
     if(type === ENotificationType.PASS){
          return (
               <div className={`w-full text-white bg-green-600 text-center rounded-[5px] py-[10px] px-[20px] text-[0.85rem] animate-fadeIn ${fadeOut ? "animate-fadeOut" : ''}`}>{message}</div>
          )
     }else if(type === ENotificationType.FAIL){
          return (
               <div className={`w-full text-white bg-red-600 text-center rounded-[5px] py-[10px] px-[20px] text-[0.85rem] animate-fadeIn ${fadeOut ? "animate-fadeOut" : ''}`}>{message}</div>
          )
     }else {
          return (
               <div className={`w-full text-white bg-orange-600 text-center rounded-[5px] py-[10px] px-[20px] text-[0.85rem] animate-fadeIn ${fadeOut ? "animate-fadeOut" : ''}`}>{message}</div>
          )
     }
     
}

const MainNotificationContainer = () => {

     return (
          <div className="fixed top-2 right-2 flex flex-col gap-[5px] items-end justify-start z-40 " id="main-notification-container">
          </div>
     )
}

export default MainNotificationContainer;