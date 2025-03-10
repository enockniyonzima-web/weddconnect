/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { ENotificationType } from "@/common/CommonTypes";
import { SelectInputGroup, SubmitButton, TextAreaInputGroup, TextInputGroup } from "@/components/forms/DataFormsInputs";
import { createContactType, updateContactType } from "@/server-actions/contact-type.actions";
import { showMainNotification } from "@/util/NotificationFuncs";
import { DataInputs } from "@/util/util-classes";
import { ContactType } from "@prisma/client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { IoClose } from "react-icons/io5";

const ContactTypes = [
     {label: 'Social Media Link', value: 'link'},
     {label: 'Email', value:'email'},
     {label: 'Phone', value:'Phone'},
]

export const AddContactTypeForm = ({contactType}:{contactType: ContactType | undefined}) => {
     const search  = useSearchParams();
     const router = useRouter();
     const [saving, setSaving] = useState(false);
     const form = search.get('form');
     if(!form || (form !== 'add' && form !== 'update')) return null;

     const title = form === 'add' ? 'Add New Type' : "Update Contact Type";

     const typeInputs = new DataInputs();
     const saveContactType = async (event: ChangeEvent<HTMLFormElement>) => {
          event.preventDefault();
          try {
               setSaving(true)
               const checkInputs = contactType ? {status: true, message: ''} : typeInputs.checkFieldsIn(['name', 'type', 'description']);
               if(checkInputs.status) {
                    const typeUpdate = contactType ? await updateContactType(contactType.id, {
                         name: typeInputs.get('name', contactType.name),
                         type: typeInputs.get('type', contactType.type),
                         description: typeInputs.get('description', contactType.description)
                    }) : await createContactType({
                         name: typeInputs.get('name', ''),
                         type: typeInputs.get('type', ''),
                         description: typeInputs.get('description', '')
                    });
                    if(typeUpdate) {
                         showMainNotification('Saved contact type successfully', ENotificationType.PASS);
                         return router.push('/dashboard/admin/posts/vendors')
                    }else {
                         showMainNotification('Error saving contact type.', ENotificationType.FAIL);
                    }
               }else {
                    return showMainNotification(checkInputs.message, ENotificationType.WARNING);
               }
          } catch (error) {
               return showMainNotification('Error adding new contact type',ENotificationType.FAIL)
          }finally{
               setSaving(false);
          }
     }
     return (
          <div className="w-screen h-screen bg-black/50 fixed top-0 left-0 flex items-center justify-center overflow-hidden z-30">
               <div className="w-full md:w-[70%] mx-[2%] lg:w-[50%] flex flex-col items-center justify-start gap-[20px] rounded-[10px] bg-white p-[10px] max-h-[80vh] overflow-y-auto">
                    <div className="w-full flex items-center justify-between bg-gray-100 py-[5px] px-[10px] rounded-[10px]">
                         <h1 className="text-gray-600 text-[1.4rem] font-bold">{title}</h1>
                         <Link href="/dashboard/admin/posts/vendors" className="flex items-center w-auto aspect-square rounded-full border-[1.3px] border-red-600 hover:bg-red-100 p-[5px]">
                              <i className="text-[24px] text-red-600 "><IoClose /></i>
                         </Link>
                    </div>
                    <form  onSubmit={saveContactType} className="w-full flex flex-col items-center justify-start gap-[10px]">
                         <TextInputGroup required={false} type="text" name="type-name" label={`Contact Type Name:  ${contactType?.name}`} placeholder="ex: Instagram, Fecebook, Whatsapp" action={res => typeInputs.set('name', res, 'string')} />
                         <SelectInputGroup required={false} label={`Type Name: ${contactType?.type}`} name="contact-type-name" values={ContactTypes} action={res => typeInputs.set('type', res, 'string')}  />
                         <TextAreaInputGroup required={false} name="type-description" label="Contact Type Description" maxWords={50} placeholder="enter conact type description..." defaultValue={contactType?.description} action={res => typeInputs.set('description', res, 'string')} />
                         <SubmitButton label="Save Type" loading={saving} loadText="Saving type..."  />
                    </form> 
               </div>
          </div>
     )
}