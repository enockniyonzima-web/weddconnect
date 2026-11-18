"use client";

import { AdminContactTypeCard } from "@/components/cards/admin/AdminContactTypeCard";
import { ContactTypeFormBtn } from "@/components/forms/ContactTypeInput";
import { SContactType } from "@/select-types/contact-type";
import { fetchContactTypes } from "@/server-actions/contact-type.actions";
import { useQuery } from "@tanstack/react-query";
import { Contact } from "lucide-react";

export const AdminContactTypeContainer = () => {
     const {data: types, isLoading} = useQuery({
          queryKey: ['contact-types'],
          queryFn: () => fetchContactTypes(SContactType)
     });

     return (
          <section className="w-full rounded-2xl border border-gray-800 bg-gray-900/80 p-5 md:p-6">
               <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                         <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300"><Contact size={18} /></span>
                         <div>
                              <h2 className="text-base font-semibold text-white">Contact types</h2>
                              <p className="mt-0.5 max-w-xl text-xs text-gray-500">The kinds of contact details a vendor can have (for example phone, email, WhatsApp). Each type you add here appears as a field in the vendor form.</p>
                         </div>
                    </div>
                    <ContactTypeFormBtn showBtnName showBtnIcon />
               </header>
               {isLoading ? (
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">{[0, 1, 2].map((i) => <div key={i} className="h-28 animate-pulse rounded-xl border border-gray-800 bg-gray-900" />)}</div>
               ) : !types || types.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-gray-800 p-6 text-center text-sm text-gray-500">No contact types yet. Add one so vendors can be given contact details.</p>
               ) : (
                    <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                         {types.map((type, index) => <AdminContactTypeCard type={type} key={`contact-type-${index}`} />)}
                    </div>
               )}
          </section>
     )
}
