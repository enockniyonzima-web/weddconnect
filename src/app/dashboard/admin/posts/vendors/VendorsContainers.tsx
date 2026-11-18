"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { Mail, Phone, Globe, MessageCircle, Link2, Heart, Star, FileText, X, ChevronRight, AlertTriangle, MapPin, Loader2 } from "lucide-react";
import Image from "@/components/ui/Image";
import { VendorFormBtn } from "@/components/forms/VendorForm";
import { updateVendor } from "@/server-actions/vendor.actions";
import { formatDate } from "@/lib/admin/format";
import type { TVendorRow } from "@/lib/admin/vendors-report";

const contactIcon = (type: string) => {
     const t = type.toLowerCase();
     if (t.includes("mail")) return Mail;
     if (t.includes("whats")) return MessageCircle;
     if (t.includes("phone") || t.includes("tel")) return Phone;
     if (t.includes("web") || t.includes("url") || t.includes("site")) return Globe;
     return Link2;
};
const contactHref = (type: string, value: string) => {
     const t = type.toLowerCase();
     if (t.includes("mail")) return `mailto:${value}`;
     if (t.includes("whats")) return `https://wa.me/${value.replace(/\D/g, "")}`;
     if (t.includes("phone") || t.includes("tel")) return `tel:${value}`;
     if (/^https?:\/\//.test(value)) return value;
     return undefined;
};

const POST_STATUS: Record<string, { label: string; cls: string }> = {
     published: { label: "Live", cls: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20" },
     pending: { label: "To approve", cls: "bg-amber-500/10 text-amber-300 border-amber-500/20" },
};
const postStatus = (s: string) => POST_STATUS[s] ?? POST_STATUS[s.toLowerCase()] ?? { label: s || "Draft", cls: "bg-gray-700/30 text-gray-400 border-gray-700" };

const Avatar = ({ v, size = "size-12" }: { v: TVendorRow; size?: string }) =>
     v.user.image
          ? <Image src={v.user.image} alt={v.name} className={`${size} shrink-0 rounded-2xl object-cover border border-gray-700`} />
          : <span className={`${size} flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/30 to-blue-500/30 text-lg font-bold text-white`}>{v.name.charAt(0).toUpperCase()}</span>;

/** On/off switch for a vendor's active status. */
const StatusSwitch = ({ v }: { v: TVendorRow }) => {
     const router = useRouter();
     const [on, setOn] = useState(v.status);
     const [busy, setBusy] = useState(false);
     useEffect(() => setOn(v.status), [v.status]);
     const toggle = async () => {
          const next = !on;
          if (!next && !window.confirm(`Switch off ${v.name}? They will no longer be available when creating new posts. Their existing posts are not changed.`)) return;
          setBusy(true);
          setOn(next);
          const res = await updateVendor(v.id, { status: next });
          setBusy(false);
          if (!res) { setOn(!next); return void toast.error("Could not update the vendor. Please try again."); }
          toast.success(next ? `${v.name} is active` : `${v.name} is switched off`);
          router.refresh();
     };
     return (
          <button type="button" role="switch" aria-checked={on} onClick={toggle} disabled={busy} className="group inline-flex items-center gap-2 text-xs font-medium disabled:opacity-60" title={on ? "Active: click to switch off" : "Switched off: click to activate"}>
               <span className={`relative h-6 w-11 rounded-full transition-colors ${on ? "bg-emerald-500" : "bg-gray-700"}`}>
                    <motion.span layout transition={{ type: "spring", stiffness: 500, damping: 32 }} className={`absolute top-0.5 flex size-5 items-center justify-center rounded-full bg-white shadow ${on ? "right-0.5" : "left-0.5"}`}>
                         {busy && <Loader2 size={11} className="animate-spin text-gray-500" />}
                    </motion.span>
               </span>
               <span className={on ? "text-emerald-300" : "text-gray-500"}>{on ? "Active" : "Off"}</span>
          </button>
     );
};

const VendorDrawer = ({ v, onClose }: { v: TVendorRow; onClose: () => void }) => (
     <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="relative flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-gray-800 bg-gray-950 shadow-2xl">
               <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-gray-800 bg-gray-950/95 px-5 py-4 backdrop-blur">
                    <div className="flex min-w-0 items-center gap-3">
                         <Avatar v={v} size="size-11" />
                         <div className="min-w-0">
                              <h2 className="truncate text-base font-bold text-white">{v.name}</h2>
                              <p className="truncate text-xs text-gray-500">{v.user.email}</p>
                         </div>
                    </div>
                    <button onClick={onClose} aria-label="Close" className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-gray-800 bg-gray-900 text-gray-500 hover:text-white"><X size={15} /></button>
               </div>
               <div className="flex flex-col gap-5 p-5">
                    <div className="flex items-center justify-between rounded-2xl border border-gray-800 bg-gray-900 p-4">
                         <div>
                              <p className="text-sm font-medium text-white">Vendor status</p>
                              <p className="text-xs text-gray-500">Joined {formatDate(v.user.createdAt)}</p>
                         </div>
                         <StatusSwitch v={v} />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                         {[
                              { label: "Live posts", value: v.stats.live, cls: "text-emerald-300" },
                              { label: "To approve", value: v.stats.pending, cls: "text-amber-300" },
                              { label: "Likes", value: v.stats.likes, cls: "text-rose-300" },
                         ].map((s) => (
                              <div key={s.label} className="rounded-2xl border border-gray-800 bg-gray-900 p-3 text-center">
                                   <p className={`text-xl font-bold tabular-nums ${s.cls}`}>{s.value}</p>
                                   <p className="text-[11px] text-gray-500">{s.label}</p>
                              </div>
                         ))}
                    </div>

                    <section>
                         <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">How clients reach them</p>
                         {v.contacts.length === 0 ? (
                              <p className="flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-200"><AlertTriangle size={14} /> No contact details yet. Use Edit to add a phone or email.</p>
                         ) : (
                              <ul className="flex flex-col gap-1.5">
                                   {v.contacts.map((c) => {
                                        const Icon = contactIcon(c.contactType.type);
                                        const link = contactHref(c.contactType.type, c.value);
                                        const body = (
                                             <span className="flex items-center gap-3 rounded-xl bg-gray-900 p-3 transition-colors hover:bg-gray-800">
                                                  <span className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-300"><Icon size={15} /></span>
                                                  <span className="min-w-0">
                                                       <span className="block text-[11px] text-gray-500">{c.contactType.name}</span>
                                                       <span className="block truncate text-sm text-white">{c.value}</span>
                                                  </span>
                                             </span>
                                        );
                                        return <li key={c.id}>{link ? <a href={link} target={link.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">{body}</a> : body}</li>;
                                   })}
                              </ul>
                         )}
                    </section>

                    <section>
                         <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Posts ({v.stats.posts})</p>
                         {v.posts.length === 0 ? (
                              <p className="rounded-xl border border-dashed border-gray-800 p-4 text-center text-xs text-gray-500">No posts yet. Create one in the Posts tab and choose this vendor.</p>
                         ) : (
                              <ul className="flex flex-col divide-y divide-gray-800">
                                   {v.posts.map((p) => {
                                        const st = postStatus(p.status);
                                        return (
                                             <li key={p.id} className="flex items-center justify-between gap-3 py-2.5">
                                                  <div className="min-w-0">
                                                       <p className="truncate text-sm font-medium text-white">{p.title}</p>
                                                       <p className="flex items-center gap-1 truncate text-xs text-gray-500">{p.category.name}{p.location && <><span>·</span><MapPin size={10} />{p.location}</>}</p>
                                                  </div>
                                                  <div className="flex shrink-0 items-center gap-2">
                                                       <span className="inline-flex items-center gap-0.5 text-xs text-gray-500"><Heart size={11} />{p._count.likes}</span>
                                                       <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${st.cls}`}>{st.label}</span>
                                                  </div>
                                             </li>
                                        );
                                   })}
                              </ul>
                         )}
                    </section>

                    <div className="border-t border-gray-800 pt-3"><VendorFormBtn vendorId={v.id} showBtnName showBtnIcon /></div>
               </div>
          </motion.aside>
     </div>
);

export const VendorsList = ({ vendors }: { vendors: TVendorRow[] }) => {
     const [openId, setOpenId] = useState<number | null>(null);
     const open = vendors.find((v) => v.id === openId) ?? null;

     return (
          <>
               <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
                    {vendors.map((v, i) => {
                         const missing = [v.contacts.length === 0 && "contact details", v.stats.posts === 0 && "a post"].filter(Boolean);
                         return (
                              <motion.article
                                   key={v.id}
                                   initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.3) }}
                                   className={`group flex flex-col gap-4 rounded-2xl border bg-gray-900/80 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30 ${v.status ? "border-gray-800 hover:border-gray-700" : "border-gray-800/60 opacity-80"}`}
                              >
                                   <div className="flex items-start gap-3">
                                        <Avatar v={v} />
                                        <div className="min-w-0 flex-1">
                                             <button type="button" onClick={() => setOpenId(v.id)} className="block max-w-full truncate text-left text-base font-bold text-white hover:text-blue-200">{v.name}</button>
                                             <p className="truncate text-xs text-gray-500">{v.user.email}</p>
                                        </div>
                                        <StatusSwitch v={v} />
                                   </div>

                                   <div className="grid grid-cols-3 gap-2">
                                        <div className="rounded-xl bg-gray-950/60 px-3 py-2">
                                             <p className="text-[11px] text-gray-500">Live posts</p>
                                             <p className="text-sm font-semibold text-white tabular-nums">{v.stats.live}<span className="text-gray-500"> / {v.stats.posts}</span></p>
                                        </div>
                                        <div className="rounded-xl bg-gray-950/60 px-3 py-2">
                                             <p className="text-[11px] text-gray-500">Rating</p>
                                             <p className="flex items-center gap-1 text-sm font-semibold text-white tabular-nums">
                                                  {v.stats.rating ? <><Star size={12} className="fill-amber-300 text-amber-300" />{v.stats.rating.toFixed(1)}</> : <span className="text-gray-500">—</span>}
                                             </p>
                                        </div>
                                        <div className="rounded-xl bg-gray-950/60 px-3 py-2">
                                             <p className="text-[11px] text-gray-500">Likes</p>
                                             <p className="flex items-center gap-1 text-sm font-semibold text-white tabular-nums"><Heart size={12} className="text-rose-300" />{v.stats.likes}</p>
                                        </div>
                                   </div>

                                   <div className="flex flex-wrap gap-1.5">
                                        {v.contacts.slice(0, 3).map((c) => {
                                             const Icon = contactIcon(c.contactType.type);
                                             return <span key={c.id} className="inline-flex max-w-full items-center gap-1.5 truncate rounded-full bg-gray-800/70 px-2.5 py-1 text-xs text-gray-300"><Icon size={12} className="shrink-0 text-blue-300" /><span className="truncate">{c.value}</span></span>;
                                        })}
                                        {v.contacts.length > 3 && <span className="rounded-full bg-gray-800/70 px-2.5 py-1 text-xs text-gray-400">+{v.contacts.length - 3}</span>}
                                        {v.stats.pending > 0 && <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-300"><FileText size={12} />{v.stats.pending} to approve</span>}
                                   </div>

                                   {missing.length > 0 && (
                                        <p className="flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-200">
                                             <AlertTriangle size={13} className="shrink-0" /> Missing {missing.join(" and ")}. Clients can&apos;t {v.contacts.length === 0 ? "contact" : "find"} this vendor yet.
                                        </p>
                                   )}

                                   <div className="mt-auto flex items-center justify-between gap-2 border-t border-gray-800 pt-3">
                                        <button type="button" onClick={() => setOpenId(v.id)} className="inline-flex h-8 items-center gap-1 rounded-lg px-2 text-xs font-medium text-gray-300 hover:bg-gray-800 hover:text-white">
                                             View details <ChevronRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                                        </button>
                                        <VendorFormBtn vendorId={v.id} showBtnName showBtnIcon btnSize="sm" />
                                   </div>
                              </motion.article>
                         );
                    })}
               </div>
               <AnimatePresence>{open && <VendorDrawer v={open} onClose={() => setOpenId(null)} />}</AnimatePresence>
          </>
     );
};
