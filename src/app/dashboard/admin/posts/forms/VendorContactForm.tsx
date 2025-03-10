/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { ENotificationType } from "@/common/CommonTypes";
import { TVendor } from "@/common/Entities";
import { SelectInputGroup, SubmitButton, TextInputGroup } from "@/components/forms/DataFormsInputs";
import { updateVendor } from "@/server-actions/vendor.actions";
import { showMainNotification } from "@/util/NotificationFuncs";
import { DataInputs } from "@/util/util-classes";
import { ContactType } from "@prisma/client";
import { ChangeEvent, useState } from "react";
// import { useSearchParams } from "next/navigation";

export const VendorContactForm = ({vendor, contactTypes}:{vendor: TVendor | null, contactTypes: ContactType[] }) => {
     const typeInputs = new DataInputs();
     const [loading, setLoading] = useState(false)

     const addContact = async (event:ChangeEvent<HTMLFormElement>) => {
          event.preventDefault();
          try {
               setLoading(true);
               if(!vendor) return showMainNotification("First add or select a vendor", ENotificationType.WARNING);
               const checkInputs =  typeInputs.checkFieldsIn(['typeId', 'value']);
               if(checkInputs.status) {
                    const contactUpdate = await updateVendor(vendor?.id || 0, {
                         contacts: {create: {contactTypeId: typeInputs.get('typeId',0), value: typeInputs.get('value', '')}}
                    });
                    if(contactUpdate) {
                         return showMainNotification('Successfully saved vendor contact', ENotificationType.PASS);
                    }else{
                         return showMainNotification("Error saving vendor contact", ENotificationType.FAIL);
                    }
               }else {
                    return showMainNotification(checkInputs.message, ENotificationType.WARNING);
               }
          } catch (error) {
               return showMainNotification('Application error', ENotificationType.FAIL)
          }finally{
               setLoading(false);
          }

     }
     return (
          <div className="w-full flex flex-col items-center justify-start gap-[10px]">
               <h2 className="w-full text-[0.9rem] font-bold text-black">Vendor Contact:</h2>
               <form onSubmit={addContact} className="w-full grid grid-cols-2 gap-[10px]">
                    <SelectInputGroup name="contact-type" label="Select contact type: " values={contactTypes.map(type => ({label:`${type.name} (${type.type})`, value: type.id}))} action={res => typeInputs.set('typeId', res, "number")} />
                    <TextInputGroup name="contact-value" label="Enter contact Value: " placeholder="ex: instagram link, phone number, email" type="text" action={res => typeInputs.set('value', res, 'string')}  />
                    <SubmitButton label="Add Contact" loading={loading} loadText={'Adding...'}/>
               </form>
               <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-[5px]">
                    {
                         vendor  && vendor.contacts.length > 0 ? 
                              vendor.contacts.map(contact => <p className="w-full p-[5px] rounded-[5px] text-gray-500 border border-gray-200 line-clamp-1 text-[0.8rem]" key={`vendor-contact-${contact.id}`}>{contact.contactType.name}: {contact.value}</p>)
                         : <p className="text-[0.9rem] text-gray-600">Vendor has no contacts added</p>
                    }
               </div>
          </div>
     )
}