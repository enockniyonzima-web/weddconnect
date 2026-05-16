"use client";

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import { usePathname } from "next/navigation";

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
     const pathname = usePathname();
     const isDashboard = pathname?.startsWith("/dashboard");

     useEffect(() => {
          if (isDashboard) return;

          const lenis = new Lenis({
               duration: 1.2,
               easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
               touchMultiplier: 1.5,
          });

          const raf = (time: number) => {
               lenis.raf(time);
               requestAnimationFrame(raf);
          };
          requestAnimationFrame(raf);

          return () => lenis.destroy();
     }, [isDashboard]);

     return <>{children}</>;
}
