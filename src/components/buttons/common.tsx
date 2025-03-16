"use client";

import { FaArrowRight } from "react-icons/fa6";
import { useAuthContext } from "../context/AuthContext";
import Link from "next/link";

export const GetStartedBtn = () => {
     const {setAuth, user} = useAuthContext();

     if(user) {
          return <Link className=" flex items-center gap-[5px] text-[0.9rem] px-[20px] rounded-[5px] py-[10px] bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300" href="/posts" prefetch={true}>View top Vendors <i className="text-[18px]"><FaArrowRight /></i> </Link>
     }
     
     return <button type="button" className=" flex items-center gap-[5px] text-[0.9rem] px-[20px] rounded-[5px] py-[10px] bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300" onClick={setAuth}>Get Started <i className="text-[18px]"><FaArrowRight /></i> </button>
}