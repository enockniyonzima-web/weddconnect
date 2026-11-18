"use client";

import { AnimatePresence, motion } from "motion/react";
import { Info } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/** Small "i" button that explains a number in plain words. Opens on hover or tap. */
export const InfoTip = ({ title, children, align = "right" }: { title?: string; children: React.ReactNode; align?: "left" | "right" }) => {
     const [open, setOpen] = useState(false);
     const ref = useRef<HTMLSpanElement>(null);

     useEffect(() => {
          if (!open) return;
          const close = (e: MouseEvent | KeyboardEvent) => {
               if (e instanceof KeyboardEvent ? e.key === "Escape" : !ref.current?.contains(e.target as Node)) setOpen(false);
          };
          document.addEventListener("mousedown", close);
          document.addEventListener("keydown", close);
          return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", close); };
     }, [open]);

     return (
          <span ref={ref} className="relative inline-flex" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
               <button
                    type="button"
                    aria-label={title ? `What is ${title}?` : "More information"}
                    aria-expanded={open}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen((o) => !o); }}
                    className="size-5 rounded-full flex items-center justify-center text-gray-500 hover:text-blue-300 hover:bg-blue-500/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 transition-colors"
               >
                    <Info size={13} />
               </button>
               <AnimatePresence>
                    {open && (
                         <motion.span
                              role="tooltip"
                              initial={{ opacity: 0, y: 4, scale: 0.97 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 4, scale: 0.97 }}
                              transition={{ duration: 0.15 }}
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                              className={`absolute z-40 top-7 ${align === "right" ? "right-0" : "left-0"} w-64 max-w-[80vw] rounded-xl border border-gray-700 bg-gray-950/95 backdrop-blur p-3 shadow-2xl text-left cursor-default`}
                         >
                              {title && <span className="block text-xs font-semibold text-white mb-1">{title}</span>}
                              <span className="block text-xs leading-relaxed text-gray-300 font-normal normal-case tracking-normal">{children}</span>
                         </motion.span>
                    )}
               </AnimatePresence>
          </span>
     );
};
