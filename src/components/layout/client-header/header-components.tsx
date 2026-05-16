"use client";

import Image from '@/components/ui/Image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { usePathname } from 'next/navigation';

export const HeaderLink = ({ link }: { link: { name: string; dest: string } }) => {
     const pathname = usePathname();
     const active = pathname === link.dest;
     return (
          <Link
               prefetch
               href={link.dest}
               className={`relative text-[0.85rem] font-medium transition-colors duration-200 whitespace-nowrap ${active ? 'text-blue-400' : 'text-white/80 hover:text-white'}`}
          >
               {link.name}
               <motion.span
                    className="absolute -bottom-0.5 left-0 h-[1.5px] bg-blue-500 rounded-full"
                    initial={{ width: active ? '100%' : '0%' }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
               />
          </Link>
     );
};

export const HeaderLogo = () => (
     <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
     >
          <Link href="/" prefetch className="w-auto gap-[10px] flex items-center justify-start py-[5px] h-full">
               <Image src="/logo/white-logo.png" alt="wedd connect" width={150} height={150} className="w-[70px] aspect-auto" />
               <h1 className="hidden lg:inline-block text-[1.4rem] font-bold text-white leading-5">WeddConnect</h1>
          </Link>
     </motion.div>
);