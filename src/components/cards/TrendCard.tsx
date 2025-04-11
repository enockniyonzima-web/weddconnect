'use client';

import { StaticImport } from "next/dist/shared/lib/get-img-props"
import Image from "next/image"
import { useAuthContext } from "../context/AuthContext";
import Link from "next/link";

export const TrendCard = ({image}:{image: StaticImport}) => {
     const {user, setAuth} = useAuthContext();

     if(user) return   <Link href={'/posts'} className="w-full relative rounded-[10px] overflow-hidden aspect-[4/3]">
                              <Image placeholder="blur" loading="lazy" src={image} alt="weddconnect-trends" width={800} height={600} className="w-full h-full object-cover rounded-[10px]" />
                         </Link>
     return (
          <div onClick={setAuth} className="w-full relative rounded-[10px] overflow-hidden aspect-square lg:aspect-[4/3]">
               <Image placeholder="blur" src={image} alt="weddconnect-trends" width={800} height={600} className="w-full h-full object-cover rounded-[10px]" />
          </div>
     )
}