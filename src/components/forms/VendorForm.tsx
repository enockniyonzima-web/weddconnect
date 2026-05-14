"use client";

import { SVendorEdit } from "@/select-types/vendor";
import { createVendor, deleteVendor, fetchVendorById, updateVendor } from "@/server-actions/vendor.actions";
import { useQuery } from "@tanstack/react-query";
import { MainForm, MainFormLoader } from "./MainForm";
import { EmailInput, InputSize, TextInput } from "../ui/forms/text-input";
import { DeleteBtn } from "../ui/forms/delete-btn";
import { toast } from "sonner";
import queryClient from "@/lib/queryClient";
import { fetchContactTypes } from "@/server-actions/contact-type.actions";
import { SContactType, TContactType } from "@/select-types/contact-type";
import { useEffect, useState } from "react";
import { ContactTypeInput } from "./ContactTypeInput";
import { EditIcon, Trash, UserRound, X } from "lucide-react";
import { encryptPassword } from "@/util/bcryptFuncs";
import { Dialog, DialogPanel } from "@headlessui/react";
import { cn } from "@/lib/utils";
import { FaCropSimple } from "react-icons/fa6";

const DEFAULT_VENDOR_PASSWORD = "vendor@weddconnect";

export const VendorForm = ({vendorId, onComplete}:{vendorId?: number, onComplete: () => void}) => {
     const {data:vendor, isLoading:fetchingVendor} = useQuery({
          queryKey: ['vendor-form', vendorId],
          queryFn: () => vendorId ? fetchVendorById(vendorId, SVendorEdit) : null
     })
     const {data: contactTypes, isLoading: fetchingContactTypes} = useQuery({
          queryKey: ['vendor-form', 'contact-types'],
          queryFn: () => fetchContactTypes(SContactType, undefined, 20)
     })
     const [contacts, setContacts] = useState<{type: TContactType, value: string}[]>([]);

     const submitData = async(data: FormData): Promise<{message?:string}> => {
          const name = data.get("name") as string;
          const email = data.get("email") as string;
          const password = await encryptPassword(DEFAULT_VENDOR_PASSWORD);
          if(!vendor) {
               if(!name || !email) throw new Error("Name and email are required to create a vendor");
               const newVendor = await createVendor({
                    name, status: true,
                    user: {create: {email, password, type: "vendor", image: ""}},
                    contacts: {
                         createMany: {
                              data: contacts.filter(c => c.value !== "").map(c => ({contactTypeId: c.type.id, value: c.value}))
                         }
                    }
               });
               if(!newVendor) throw new Error("Failed to create vendor");
               onComplete();
               queryClient.invalidateQueries();
               return {message: "Vendor created successfully"};
          }
          const updatedVendor = await updateVendor(vendor.id, {
               ...(name && {name}),
               ...(contacts.length > 0 && {
                    contacts: {
                         deleteMany: {},
                         createMany: {data: contacts.filter(c => c.value !== "").map(c => ({contactTypeId: c.type.id, value: c.value})) }
                    }
               })
          })
          if(!updatedVendor) throw new Error("Failed to update vendor");
          onComplete();
          queryClient.invalidateQueries();
          return {message: "Vendor updated successfully"};
     }

     const handleDeleteVendor = async() => {
          toast.promise(
               (async() => {
                    if(!vendor) throw new Error("The vendor does not exist or has already been deleted!");
                    const res = await deleteVendor(vendor.id);
                    if(!res) throw new Error("Failed to delete vendor. Please try again.");
                    onComplete();
                    queryClient.invalidateQueries();
               })(),
               {
                    loading: "Deleting vendor...",
                    success: "Vendor deleted successfully",
                    error: error => error?.message || "Error deleting vendor"
               }
          )
          if(!vendorId) return;
          await deleteVendor(vendorId);
          onComplete();
     }

     useEffect(() => {
          if( contactTypes && contactTypes?.length > 0){
               const vendorContacts = vendor?.contacts || [];
               console.log(vendorContacts);
               const updateContacts = contactTypes.map(type => {
                    const contact = vendorContacts.find(c => c.contactType.id === type.id);
                    return {
                         type,
                         value: contact ? contact.value : ""
                    }
               })
               setContacts(updateContacts);
          }
     }, [contactTypes, vendor])

     const isLoading = fetchingVendor || fetchingContactTypes;
     if(isLoading) return <MainFormLoader />

     return (
          <div className="w-full flex flex-col gap-4">
               <MainForm submitData={submitData}>
                    <TextInput name="name" label="Vendor Name" defaultValue={vendor?.name} required={vendor ? false: true} />
                    <EmailInput name="email" label="Vendor Email" defaultValue={vendor?.user.email} required={vendor ? false: true} />
                    <div className="w-full flex flex-col gap-2">
                         <span className="text-lg font-bold text-gray-200">Vendor Contacts</span>
                         {
                              contacts.map(c =>
                                   <div key={c.type.id} className="w-full flex items-end gap-2">
                                        <ContactTypeInput
                                             type={c.type} 
                                             defaultValue={c.value}
                                             onChange={(_, value) => setContacts(prev => prev.map(contact => contact.type.id === c.type.id ? {...contact, value: value} : contact))}
                                        />
                                        <button type="button" className="text-red-500 border border-red-900 rounded-lg p-2 bg-red-900/50" onClick={() => setContacts(prev => prev.filter(contact => contact.type.id !== c.type.id))}><Trash size={18} className="text-red-500" /></button>
                                   </div> 
                         )
                         }
                    </div>
               </MainForm>
               {
                    vendor ? 
                         <DeleteBtn label="Delete Vendor" confirmTitle="Delete" confirmMessage="Are you sure you want to delete this vendor?" onClick={handleDeleteVendor} />
                    : null
               }
          </div>
     
     )
}

export const VendorFormBtn = ({vendorId, showBtnName, showBtnIcon, btnSize = "md"}:{vendorId?: number, showBtnName?: boolean; showBtnIcon?: boolean; btnSize?: InputSize}) => {
     const btnTitle = showBtnName ? vendorId ? "Edit" : "New Vendor" : undefined;
     const Icon = vendorId ? EditIcon : UserRound;
     const [open,setOpen] = useState(false);
     const sizeClasses: Record<InputSize, string> = { sm: "h-8 px-3 text-xs gap-1.5", md: "h-10 px-4 text-sm gap-2", lg: "h-12 px-5 text-base gap-2" };
     const iconSizes: Record<InputSize, number> = { sm: 14, md: 16, lg: 18 };

     return (
          <>
               <button type="button" onClick={() => setOpen(true)} className={cn("inline-flex items-center justify-center rounded-lg font-medium cursor-pointer transition-all duration-200 active:scale-[0.97]", sizeClasses[btnSize], vendorId ? "border border-white/10 bg-blue-700 text-gray-100 hover:border-blue-700/30 hover:text-white" : "bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500")}>
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
                                        <div className={cn("flex items-center justify-center h-9 w-9 rounded-lg", vendorId ? "bg-blue-600/10 border border-blue-600/20 text-blue-600" : "bg-blue-600 text-white shadow-md shadow-blue-600/25")}><UserRound size={18} strokeWidth={2} /></div>
                                        <div><h3 className="text-base font-semibold text-white">{vendorId ? "Edit Vendor" : "Create Vendor"}</h3><p className="text-xs text-gray-400">{vendorId ? "Update vendor details" : "Create a new vendor"}</p></div>
                                   </div>
                                   <button type="button" onClick={() => setOpen(false)} title="Close" className="flex items-center justify-center h-8 w-8 rounded-lg border border-white/10 bg-white/5 text-gray-400 cursor-pointer transition-all hover:bg-white/10 hover:text-white hover:border-white/20"><X size={16} strokeWidth={2} /></button>
                              </div>
                              <div className="relative px-6 py-5"><VendorForm vendorId={vendorId} onComplete={() => setOpen(false)} /></div>
                              <div className="absolute inset-x-0 bottom-0 h-px rounded-b-2xl bg-linear-to-r from-transparent via-blue-600/20 to-transparent" />
                         </DialogPanel>
                    </div>
               </Dialog>
          </>
     )
}