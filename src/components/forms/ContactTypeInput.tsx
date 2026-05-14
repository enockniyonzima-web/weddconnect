"use client";

import { SContactType, TContactType } from "@/select-types/contact-type";
import { InputSize, TextInput } from "../ui/forms/text-input";
import { useQuery } from "@tanstack/react-query";
import { createContactType, deleteContactType, fetchContactTypeById, updateContactType } from "@/server-actions/contact-type.actions";
import { MainForm, MainFormLoader } from "./MainForm";
import { toast } from "sonner";
import queryClient from "@/lib/queryClient";
import { DeleteBtn } from "../ui/forms/delete-btn";
import { SelectInput } from "../ui/forms/select-input";
import { TextAreaInput } from "../ui/forms/text-area";
import { Dialog, DialogPanel } from "@headlessui/react";
import { cn } from "@/lib/utils";
import { Contact, EditIcon, X } from "lucide-react";
import { useState } from "react";

export const ContactTypeInput = ({type, onChange,defaultValue}:{type: TContactType, defaultValue?:  string,onChange: (type: TContactType, value: string) => void}) => {
     return (
          <TextInput 
               name={type.name} 
               label={`${type.name} - ${type.type}`}
               action={(res) => onChange(type, res || "")}
               defaultValue={defaultValue}
          />
     )
}

const ContactTypes = [
     {label: 'Social Media Link', value: 'link'},
     {label: 'Email', value:'email'},
     {label: 'Phone', value:'phone'},
]

export const ContactTypeForm = ({typeId, onComplete}:{typeId?: number, onComplete: () => void}) => {
     const {data: type, isLoading} = useQuery({
          queryKey: ['contact-type', typeId],
          queryFn: () => typeId ? fetchContactTypeById(typeId, SContactType) : null
     });



     const submitData = async(data: FormData): Promise<{message?: string}> => {
          const name = data.get('name')?.toString() || "";
          const typeValue = data.get('type')?.toString() || "";
          const description = data.get('description')?.toString() || "";
          if(!type) {
               if(!name || !typeValue) throw new Error("Name and type are required");
               const newType = await createContactType({
                    name,
                    type: typeValue,
                    description
               });
               if(!newType) throw new Error("Failed to create contact type");
               onComplete();
               queryClient.invalidateQueries();
               return {message: "Contact type created successfully"};
          }
          const updatedType  = await updateContactType(type.id,{
               ...(name && {name}),
               ...(typeValue && {type: typeValue}),
               ...(description && {description})
          });
          if(!updatedType) throw new Error("Failed to update contact type");
          onComplete();
          queryClient.invalidateQueries();
          return {message: "Contact type updated successfully"}
     }
     const handleDelete = async () => {
          toast.promise(
               (async() =>{
                    if(!type) throw new Error("Contact type not found");
                    await deleteContactType(type.id);
                    onComplete();
                    queryClient.invalidateQueries();
               })(),
               {
                    loading: "Deleting contact type...",
                    success: "Contact type deleted successfully",
                    error: error => error.message ||"Failed to delete contact type"
               }
          )
     }

     if(isLoading) return <MainFormLoader />
     return (
          <div className="w-full flex flex-col gap-4">
               <MainForm submitData={submitData} btnTitle={type ? "Update Contact Type" : "Create Contact Type"}>
                    <TextInput name="name" label="Name" defaultValue={type?.name} required={type ? false :true} />
                    <SelectInput values={ContactTypes} name="type" label={`Type: ${type?.type ?? ""}`} required={type ? false : true}  />
                    <TextAreaInput name="description" defaultValue={type?.description} required={false} />
               </MainForm>
               {
                    type && <DeleteBtn label="Delete Type" onClick={handleDelete} confirmMessage="Are you sure you want to delete this contact type?" confirmTitle="Delete"  />
               }
               
          </div>
     )
}

export const ContactTypeFormBtn = ({typeId, showBtnName, showBtnIcon, btnSize = "md"}:{typeId?: number, showBtnName?: boolean; showBtnIcon?: boolean; btnSize?: InputSize}) => {
     const btnTitle = showBtnName ? typeId ? "Edit" : "New Type" : undefined;
     const Icon = typeId ? EditIcon : Contact;
     const [open,setOpen] = useState(false);
     const sizeClasses: Record<InputSize, string> = { sm: "h-8 px-3 text-xs gap-1.5", md: "h-10 px-4 text-sm gap-2", lg: "h-12 px-5 text-base gap-2" };
     const iconSizes: Record<InputSize, number> = { sm: 14, md: 16, lg: 18 };

     return (
          <>
               <button type="button" onClick={() => setOpen(true)} className={cn("inline-flex items-center justify-center rounded-lg font-medium cursor-pointer transition-all duration-200 active:scale-[0.97]", sizeClasses[btnSize], typeId ? "border border-white/10 bg-blue-700 text-gray-100 hover:border-blue-700/30 hover:text-white" : "bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500")}>
                    {showBtnIcon && <Icon size={iconSizes[btnSize]} strokeWidth={2} className="shrink-0" />}
                    {showBtnName && <span>{btnTitle}</span>}
               </button>
               <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                         <DialogPanel className="relative w-[92vw] max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-gray-900 shadow-2xl shadow-black/50">
                              <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl bg-linear-to-r from-blue-600 via-blue-500 to-blue-900" />
                              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl" aria-hidden="true"><div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-blue-600/5 blur-3xl" /><div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-blue-900/10 blur-3xl" /></div>
                              <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-white/5 bg-gray-900/95 backdrop-blur-md px-6 py-4 rounded-t-2xl">
                                   <div className="flex items-center gap-3">
                                        <div className={cn("flex items-center justify-center h-9 w-9 rounded-lg", typeId ? "bg-blue-600/10 border border-blue-600/20 text-blue-600" : "bg-blue-600 text-white shadow-md shadow-blue-600/25")}><Contact size={18} strokeWidth={2} /></div>
                                        <div><h3 className="text-base font-semibold text-white">{typeId ? "Edit Type" : "Create Type"}</h3><p className="text-xs text-gray-400">{typeId ? "Update type details" : "Create a new type"}</p></div>
                                   </div>
                                   <button type="button" onClick={() => setOpen(false)} title="Close" className="flex items-center justify-center h-8 w-8 rounded-lg border border-white/10 bg-white/5 text-gray-400 cursor-pointer transition-all hover:bg-white/10 hover:text-white hover:border-white/20"><X size={16} strokeWidth={2} /></button>
                              </div>
                              <div className="relative px-6 py-5"><ContactTypeForm typeId={typeId} onComplete={() => setOpen(false)} /></div>
                              <div className="absolute inset-x-0 bottom-0 h-px rounded-b-2xl bg-linear-to-r from-transparent via-blue-600/20 to-transparent" />
                         </DialogPanel>
                    </div>
               </Dialog>
          </>
     )
}