"use client";

import { ContactTypeFormBtn } from "@/components/forms/ContactTypeInput";
import { TContactType } from "@/select-types/contact-type";
import { Contact } from "lucide-react";

export const AdminContactTypeCard = ({type}:{type: TContactType}) => {
     return (
          <div className="w-full flex flex-col gap-3 border border-gray-700 rounded-lg p-4">
               <div className="w-full flex items-center gap-2 justify-start">
                    <span className="border rounded-lg p-2 border-blue-700/60">
                         <Contact size={16} className="text-blue-200" />
                    </span>
                    <h3 className="text-gray-100 text-lg font-bold">{type.name} - {type.type}</h3>
               </div>
               <p className="text-gray-300 text-sm line-clamp-3">{type.description}</p>
               <div className="w-full flex items-center justify-start">
                    <ContactTypeFormBtn showBtnIcon showBtnName typeId={type.id} />
               </div>
          </div>
     )
}