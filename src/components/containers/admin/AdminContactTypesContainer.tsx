"use client";

import { AdminContactTypeCard } from "@/components/cards/admin/AdminContactTypeCard";
import { ContactTypeFormBtn } from "@/components/forms/ContactTypeInput";
import { SContactType } from "@/select-types/contact-type";
import { fetchContactTypes } from "@/server-actions/contact-type.actions";
import { useQuery } from "@tanstack/react-query";

export const AdminContactTypeContainer = () => {
     const {data: types, isLoading} = useQuery({
          queryKey: ['contact-types'],
          queryFn: () => fetchContactTypes(SContactType)
     });

     if(isLoading) return <div className="w-full flex items-center justify-center p-[20px]">
          <p className="text-sm text-gray-500">Loading contact types...</p>
     </div>
     return (
          <div className="w-full flex flex-col gap-4">
               <h2 className="text-lg font-bold text-gray-100">Vendor Contact Types</h2>
               <div className=" w-full flex-wrap flex items-center justify-between">
                    <p className="text-sm text-gray-400">These the contact types that a vendor can be contacted by the client. Click to add more types.</p>
                    <ContactTypeFormBtn showBtnName showBtnIcon />
               </div>
               {
                    !types || types.length === 0  ?  (
                         <div className="w-full flex items-center justify-center p-[20px]">
                              <p className="text-sm text-gray-500">No contact types found!</p>
                         </div>
                    ) : (
                         <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {
                                   types.map((type, index) => <AdminContactTypeCard type={type} key={`contact-type-${index}`} />)
                              }
                         </div>
                    )
               }
               
          </div>
          
     )
}