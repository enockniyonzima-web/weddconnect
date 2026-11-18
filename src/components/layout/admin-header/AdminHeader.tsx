"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
     LayoutDashboard, Users, Wallet, FileText, FolderTree, Newspaper, ShieldCheck, LogOut,
     PanelLeftClose, PanelLeftOpen, Grid2x2, X, ExternalLink, type LucideIcon,
} from "lucide-react";
import Logo from "../../../../public/logo/logo.png";
import UserImage from "../../../../public/images/user-icon.png";
import { useAuthContext } from "@/components/context/AuthContext";
import { LogoutButton } from "@/components/forms/LogoutForm";
import { TSessionUser } from "@/common/Entities";

export type AdminNavBadges = { clients?: number; posts?: number };

type NavItem = { name: string; dest: string; icon: LucideIcon; badge?: keyof AdminNavBadges; badgeHint?: string };

const GROUPS: { title: string; items: NavItem[] }[] = [
     { title: "General", items: [{ name: "Overview", dest: "", icon: LayoutDashboard }] },
     {
          title: "Business",
          items: [
               { name: "Clients", dest: "clients", icon: Users, badge: "clients", badgeHint: "payment requests waiting" },
               { name: "Finance", dest: "finance", icon: Wallet },
          ],
     },
     {
          title: "Marketplace",
          items: [
               { name: "Posts & vendors", dest: "posts", icon: FileText, badge: "posts", badgeHint: "posts waiting for approval" },
               { name: "Categories", dest: "categories", icon: FolderTree },
          ],
     },
     { title: "Content", items: [{ name: "Blog", dest: "blog", icon: Newspaper }] },
     { title: "Settings", items: [{ name: "Team & access", dest: "users", icon: ShieldCheck }] },
];
const ALL_ITEMS = GROUPS.flatMap((g) => g.items);
// Bottom bar on phones: the four most-used sections, everything else goes in "More".
const MOBILE_MAIN = ["", "clients", "finance", "posts"];

const useActiveSection = () => (usePathname().split("/")[3] || "").split("?")[0];
const href = (dest: string) => `/dashboard/admin${dest ? `/${dest}` : ""}`;
const displayName = (u?: TSessionUser | null) => u?.admin?.name || u?.email || "Admin";
const roleName = (u?: TSessionUser | null) => (u?.admin?.role as { name?: string } | null | undefined)?.name ?? "Administrator";

const Badge = ({ count, compact }: { count?: number; compact?: boolean }) => {
     if (!count) return null;
     return compact
          ? <span className="absolute -right-0.5 -top-0.5 flex min-w-[18px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold leading-[18px] text-white ring-2 ring-gray-900">{count > 99 ? "99+" : count}</span>
          : <span className="ml-auto rounded-full bg-rose-500/15 px-2 py-0.5 text-[11px] font-bold text-rose-300 tabular-nums">{count > 99 ? "99+" : count}</span>;
};

const AdminHeader = ({ badges = {} }: { badges?: AdminNavBadges }) => {
     const { user } = useAuthContext();
     return (
          <>
               <DesktopSidebar user={user} badges={badges} />
               <MobileBar user={user} badges={badges} />
          </>
     );
};

/* ------------------------------ Desktop ------------------------------ */

const DesktopSidebar = ({ user, badges }: { user: TSessionUser | null | undefined; badges: AdminNavBadges }) => {
     const active = useActiveSection();
     const [collapsed, setCollapsed] = useState(false);

     useEffect(() => {
          try { setCollapsed(localStorage.getItem("admin-sidebar-collapsed") === "1"); } catch { /* storage unavailable */ }
     }, []);
     const toggle = () => setCollapsed((c) => {
          try { localStorage.setItem("admin-sidebar-collapsed", c ? "0" : "1"); } catch { /* storage unavailable */ }
          return !c;
     });

     return (
          <motion.aside
               animate={{ width: collapsed ? 84 : 272 }}
               transition={{ type: "spring", stiffness: 300, damping: 32 }}
               className="relative hidden h-full shrink-0 flex-col border-r border-gray-800/80 bg-gradient-to-b from-gray-900 to-gray-950 lg:flex"
          >
               {/* Brand */}
               <div className={`flex h-16 items-center border-b border-gray-800/80 ${collapsed ? "justify-center px-2" : "justify-between px-4"}`}>
                    <Link href={href("")} className="flex items-center gap-2.5 overflow-hidden">
                         <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
                              <Image src={Logo} placeholder="blur" alt="WeddConnect logo" className="w-6 h-auto" />
                         </span>
                         {!collapsed && (
                              <span className="leading-tight">
                                   <span className="block bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-base font-bold text-transparent">WeddConnect</span>
                                   <span className="block text-[11px] text-gray-500">Admin console</span>
                              </span>
                         )}
                    </Link>
                    {!collapsed && (
                         <button type="button" onClick={toggle} aria-label="Collapse sidebar" title="Collapse sidebar" className="flex size-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-800 hover:text-white">
                              <PanelLeftClose size={17} />
                         </button>
                    )}
               </div>

               {/* Links */}
               <nav aria-label="Admin sections" className="hide-scroll flex-1 overflow-y-auto px-3 py-4 [scrollbar-width:none]">
                    {collapsed && (
                         <button type="button" onClick={toggle} aria-label="Expand sidebar" title="Expand sidebar" className="mx-auto mb-3 flex size-10 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-800 hover:text-white">
                              <PanelLeftOpen size={18} />
                         </button>
                    )}
                    {GROUPS.map((group) => (
                         <div key={group.title} className="mb-4 last:mb-0">
                              {collapsed
                                   ? <div className="mx-auto mb-2 h-px w-8 bg-gray-800" />
                                   : <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-600">{group.title}</p>}
                              <ul className="flex flex-col gap-1">
                                   {group.items.map((item) => {
                                        const isActive = item.dest === active;
                                        const count = item.badge ? badges[item.badge] : undefined;
                                        return (
                                             <li key={item.dest} className="group/item relative">
                                                  <Link
                                                       prefetch
                                                       href={href(item.dest)}
                                                       aria-current={isActive ? "page" : undefined}
                                                       className={`relative flex h-11 items-center gap-3 rounded-xl text-sm font-medium transition-colors ${collapsed ? "justify-center" : "px-3"} ${isActive ? "text-white" : "text-gray-400 hover:bg-gray-800/60 hover:text-gray-100"}`}
                                                  >
                                                       {isActive && (
                                                            <motion.span layoutId="admin-sidebar-active" transition={{ type: "spring", stiffness: 420, damping: 34 }} className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/90 to-indigo-600/80 shadow-lg shadow-blue-900/30">
                                                                 <span className="absolute -left-3 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-blue-400" />
                                                            </motion.span>
                                                       )}
                                                       <span className="relative">
                                                            <item.icon size={19} className={isActive ? "text-white" : "text-gray-500 transition-colors group-hover/item:text-blue-300"} />
                                                            {collapsed && <Badge count={count} compact />}
                                                       </span>
                                                       {!collapsed && <span className="relative truncate">{item.name}</span>}
                                                       {!collapsed && <span className="relative ml-auto"><Badge count={count} /></span>}
                                                  </Link>
                                                  {/* Label tooltip when collapsed */}
                                                  {collapsed && (
                                                       <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded-lg border border-gray-700 bg-gray-950 px-2.5 py-1.5 text-xs text-white opacity-0 shadow-xl transition-opacity group-hover/item:opacity-100">
                                                            {item.name}{count ? ` · ${count} ${item.badgeHint}` : ""}
                                                       </span>
                                                  )}
                                             </li>
                                        );
                                   })}
                              </ul>
                         </div>
                    ))}
               </nav>

               {/* Account */}
               <div className="border-t border-gray-800/80 p-3">
                    <div className={`flex items-center gap-3 rounded-xl ${collapsed ? "flex-col" : "bg-gray-800/40 p-2.5"}`}>
                         <Image src={user?.image || UserImage} alt="" width={40} height={40} className="size-9 shrink-0 rounded-full object-cover ring-2 ring-gray-700" />
                         {!collapsed && (
                              <div className="min-w-0 flex-1">
                                   <p className="truncate text-sm font-semibold text-white">{displayName(user)}</p>
                                   <p className="truncate text-[11px] text-gray-500">{roleName(user)}</p>
                              </div>
                         )}
                         <LogoutButton
                              aria-label="Log out"
                              className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-transparent p-0 text-gray-400 shadow-none hover:bg-rose-500/10 hover:text-rose-300"
                              icon={<LogOut className="size-4" />}
                         />
                    </div>
                    {!collapsed && (
                         <Link href="/" target="_blank" className="mt-2 flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs text-gray-500 hover:text-gray-300">
                              View public site <ExternalLink size={11} />
                         </Link>
                    )}
               </div>
          </motion.aside>
     );
};

/* ------------------------------ Mobile ------------------------------ */

const MobileBar = ({ user, badges }: { user: TSessionUser | null | undefined; badges: AdminNavBadges }) => {
     const active = useActiveSection();
     const [moreOpen, setMoreOpen] = useState(false);
     const main = MOBILE_MAIN.map((d) => ALL_ITEMS.find((i) => i.dest === d)!);
     const extra = ALL_ITEMS.filter((i) => !MOBILE_MAIN.includes(i.dest));
     const moreActive = extra.some((i) => i.dest === active);
     const pathname = usePathname();

     useEffect(() => setMoreOpen(false), [pathname]);

     return (
          <div className="relative z-50 w-full shrink-0 lg:hidden">
               <AnimatePresence>
                    {moreOpen && (
                         <>
                              <motion.div className="fixed inset-0 bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMoreOpen(false)} />
                              <motion.div
                                   initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", stiffness: 320, damping: 34 }}
                                   className="fixed inset-x-0 bottom-0 rounded-t-3xl border-t border-gray-800 bg-gray-950 px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-3"
                                   role="dialog" aria-label="More sections"
                              >
                                   <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-700" />
                                   <div className="mb-4 flex items-center gap-3 rounded-2xl bg-gray-900 p-3">
                                        <Image src={user?.image || UserImage} alt="" width={40} height={40} className="size-10 rounded-full object-cover" />
                                        <div className="min-w-0 flex-1">
                                             <p className="truncate text-sm font-semibold text-white">{displayName(user)}</p>
                                             <p className="truncate text-xs text-gray-500">{roleName(user)}</p>
                                        </div>
                                        <button type="button" onClick={() => setMoreOpen(false)} aria-label="Close" className="flex size-9 items-center justify-center rounded-xl bg-gray-800 text-gray-400"><X size={16} /></button>
                                   </div>
                                   <div className="grid grid-cols-3 gap-2">
                                        {extra.map((item) => {
                                             const isActive = item.dest === active;
                                             return (
                                                  <Link key={item.dest} href={href(item.dest)} className={`flex flex-col items-center gap-2 rounded-2xl border p-3 text-center text-xs font-medium transition-colors ${isActive ? "border-blue-500/50 bg-blue-500/10 text-white" : "border-gray-800 bg-gray-900 text-gray-300 active:bg-gray-800"}`}>
                                                       <span className={`flex size-10 items-center justify-center rounded-xl ${isActive ? "bg-blue-600 text-white" : "bg-gray-800 text-blue-300"}`}><item.icon size={19} /></span>
                                                       {item.name}
                                                  </Link>
                                             );
                                        })}
                                        <Link href="/" target="_blank" className="flex flex-col items-center gap-2 rounded-2xl border border-gray-800 bg-gray-900 p-3 text-center text-xs font-medium text-gray-300">
                                             <span className="flex size-10 items-center justify-center rounded-xl bg-gray-800 text-gray-300"><ExternalLink size={18} /></span>
                                             Public site
                                        </Link>
                                   </div>
                                   <LogoutButton name="Log out" icon={<LogOut className="size-4" />} className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-rose-500/10 text-sm font-semibold text-rose-300 shadow-none hover:bg-rose-500/20" />
                              </motion.div>
                         </>
                    )}
               </AnimatePresence>

               <nav aria-label="Admin sections" className="border-t border-gray-800 bg-gray-900/95 px-2 pb-[env(safe-area-inset-bottom)] pt-1.5 backdrop-blur-xl">
                    <ul className="mx-auto grid max-w-xl grid-cols-5">
                         {main.map((item) => (
                              <MobileTab key={item.dest} item={item} active={item.dest === active} count={item.badge ? badges[item.badge] : undefined} />
                         ))}
                         <li>
                              <button type="button" onClick={() => setMoreOpen(true)} aria-expanded={moreOpen} className="relative flex w-full flex-col items-center gap-1 py-1.5">
                                   {moreActive && <motion.span layoutId="admin-mobile-active" className="absolute top-0 h-1 w-8 rounded-b-full bg-blue-400" />}
                                   <span className={`flex h-8 w-12 items-center justify-center rounded-full transition-colors ${moreActive ? "bg-blue-600/20 text-blue-300" : "text-gray-400"}`}><Grid2x2 size={20} /></span>
                                   <span className={`text-[11px] font-medium ${moreActive ? "text-white" : "text-gray-500"}`}>More</span>
                              </button>
                         </li>
                    </ul>
               </nav>
          </div>
     );
};

const MobileTab = ({ item, active, count }: { item: NavItem; active: boolean; count?: number }) => (
     <li>
          <Link prefetch href={href(item.dest)} aria-current={active ? "page" : undefined} className="relative flex flex-col items-center gap-1 py-1.5">
               {active && <motion.span layoutId="admin-mobile-active" transition={{ type: "spring", stiffness: 420, damping: 34 }} className="absolute top-0 h-1 w-8 rounded-b-full bg-blue-400" />}
               <span className={`relative flex h-8 w-12 items-center justify-center rounded-full transition-colors ${active ? "bg-blue-600/20 text-blue-300" : "text-gray-400"}`}>
                    <item.icon size={20} />
                    <Badge count={count} compact />
               </span>
               <span className={`max-w-full truncate px-1 text-[11px] font-medium ${active ? "text-white" : "text-gray-500"}`}>{item.name === "Posts & vendors" ? "Posts" : item.name}</span>
          </Link>
     </li>
);

export default AdminHeader;
