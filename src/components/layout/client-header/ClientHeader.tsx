"use client";

import MobileView from "./MobileView";
import DesktopView from "./DesktopView";
import { useEffect, useState } from "react";

export default function ClientHeader() {
  const [scrolled, setScrolled] = useState(false);

     useEffect(() => {
          const handleScroll = () => {
               if (window.scrollY > 50) {
                    setScrolled(true);
               } else {
                    setScrolled(false);
               }
          };

          window.addEventListener('scroll', handleScroll);
          
          // Clean up the event listener
          return () => {
               window.removeEventListener('scroll', handleScroll);
          };
     }, []);
  return (
    <>
      <MobileView scrolled={scrolled} />
      <DesktopView scrolled={scrolled} />
    </>
  );
}