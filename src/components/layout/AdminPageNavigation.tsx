"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef } from "react";
import { motion } from "motion/react";
import {
     LayoutGrid, Users, UserCheck, AlarmClock, Hourglass, CalendarX, Layers, Receipt, PieChart,
     FileText, Store, Newspaper, FolderTree, Tags, ListChecks, Circle, type LucideIcon,
} from "lucide-react";

// Icon per destination, so section layouts only pass names and links.
const ICONS: Record<string, LucideIcon> = {
     "/dashboard/admin/finance": PieChart,
     "/dashboard/admin/finance/transactions": Receipt,
     "/dashboard/admin/clients": LayoutGrid,
     "/dashboard/admin/clients/all": Users,
     "/dashboard/admin/clients/active": UserCheck,
     "/dashboard/admin/clients/expiring": AlarmClock,
     "/dashboard/admin/clients/pending": Hourglass,
     "/dashboard/admin/clients/expired": CalendarX,
     "/dashboard/admin/clients/subscriptions": Layers,
     "/dashboard/admin/posts": FileText,
     "/dashboard/admin/posts/vendors": Store,
     "/dashboard/admin/blog": Newspaper,
     "/dashboard/admin/blog/categories": FolderTree,
     "/dashboard/admin/blog/tags": Tags,
     "/dashboard/admin/categories": FolderTree,
     "/dashboard/admin/categories/features": ListChecks,
};

export const AdminPageNavigation = ({ links }: { links: { name: string; dest: string }[] }) => {
     const pathname = usePathname();
     const id = useId();
     const activeRef = useRef<HTMLAnchorElement>(null);

     // Exact match wins; otherwise the longest link that prefixes the current path (e.g. a detail page).
     const active = links.find((l) => l.dest === pathname)?.dest
          ?? links.filter((l) => pathname.startsWith(`${l.dest}/`)).sort((a, b) => b.dest.length - a.dest.length)[0]?.dest;

     useEffect(() => { activeRef.current?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" }); }, [active]);

     return (
          <nav aria-label="Section navigation" className="sticky top-0 z-40 w-full">
               <div className="relative rounded-2xl border border-gray-800 bg-gray-900/80 p-1.5 shadow-lg shadow-black/20 backdrop-blur-xl">
                    <ul className="hide-scroll flex items-center gap-1 overflow-x-auto [scrollbar-width:none]">
                         {links.map((link) => {
                              const isActive = link.dest === active;
                              const Icon = ICONS[link.dest] ?? Circle;
                              return (
                                   <li key={link.dest} className="shrink-0">
                                        <Link
                                             ref={isActive ? activeRef : undefined}
                                             href={link.dest}
                                             aria-current={isActive ? "page" : undefined}
                                             className={`group relative flex items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 ${isActive ? "text-white" : "text-gray-400 hover:bg-gray-800/70 hover:text-gray-100"}`}
                                        >
                                             {isActive && (
                                                  <motion.span
                                                       layoutId={`admin-nav-${id}`}
                                                       className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md shadow-blue-900/40"
                                                       transition={{ type: "spring", stiffness: 420, damping: 34 }}
                                                  />
                                             )}
                                             <span className={`relative flex size-6 items-center justify-center rounded-lg transition-colors ${isActive ? "bg-white/15" : "bg-gray-800 text-gray-400 group-hover:bg-gray-700 group-hover:text-blue-300"}`}>
                                                  <Icon size={14} />
                                             </span>
                                             <span className="relative">{link.name}</span>
                                        </Link>
                                   </li>
                              );
                         })}
                    </ul>
               </div>
          </nav>
     );
};
