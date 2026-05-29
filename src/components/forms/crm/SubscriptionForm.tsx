"use client";

import queryClient from "@/lib/queryClient";
import { SSubscriptionEdit } from "@/select-types/subscription";
import { createSubscription, deleteSubscription, fetchSubscriptionById, updateSubscription } from "@/server-actions/subscription.actions";
import { DurationUnits, TDurationUnit } from "@/types/common";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MainForm, MainFormLoader } from "../MainForm";
import { InputSize, NumberInput, TextInput } from "@/components/ui/forms/text-input";
import { DeleteBtn } from "@/components/ui/forms/delete-btn";
import { SelectInput } from "@/components/ui/forms/select-input";
import { WordsInput } from "@/components/ui/forms/WordsInput";
import { TextAreaInput } from "@/components/ui/forms/text-area";
import { CheckInputGroup } from "@/components/ui/forms/check-input";
import { EditIcon, PlusIcon, Wallet, X } from "lucide-react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { cn } from "@/lib/utils";

export const SubscriptionForm = ({id, onComplete}:{id?:number, onComplete: () => void}) => {

     const {data: subscription, isLoading} = useQuery({
          queryKey: ["subscription-form", id],
          queryFn: () => fetchSubscriptionById(id!,SSubscriptionEdit),
          enabled: !!id
     });
     const [benefits, setBenefits] = useState<string[]>(subscription?.benefits || []);
     const [isActive, setIsActive] = useState<boolean>(subscription?.isActive ?? false);

     const submitData = async(data:FormData): Promise<{message?:string}> => {
          const name = data.get("name")?.toString().trim() || "";
          const price = parseInt(data.get("price")?.toString() || "0");
          const currency = data.get("currency")?.toString().trim() || "USD";
          const description = data.get("description")?.toString().trim() || "";
          const duration = parseInt(data.get("duration")?.toString() || "0");
          const durationUnit = data.get("durationUnit")?.toString().trim() as TDurationUnit;

          if(name && name.length < 2) return {message: "Name must be at least 2 characters"};
          if(price && price <= 0) return {message: "Price must be greater than 0"};
          if(description && description.length < 10) return {message: "Description must be at least 10 characters"};
          if(duration && duration <= 0) return {message: "Duration must be greater than 0"};
          if(!subscription) {
               const newSub  = await createSubscription({
                    name, price, currency, description, benefits, duration, durationUnit, isActive
               })
               if(!newSub) throw new Error("Failed to create subscription");
               onComplete();
               queryClient.invalidateQueries();
               return {message: "Subscription created successfully"};
          }
          const updates = await updateSubscription(subscription.id, {
               ...(name && {name}),
               ...(price && {price}),
               ...(currency && {currency}),
               ...(description && {description}),
               benefits,
               ...(duration && {duration}),
               ...(durationUnit && {durationUnit}),
               isActive
          })
          if(!updates) throw new Error("Failed to update subscription");
          onComplete();
          queryClient.invalidateQueries();
          return {message: "Subscription updated successfully"};
     }
     const handleDelete = async() => {
          toast.promise(
               (async() => {
                    if(!subscription) throw new Error("Subscription not found");
                    const res = await deleteSubscription(subscription.id);
                    if(!res) throw new Error("Failed to delete subscription");
                    onComplete();
                    queryClient.invalidateQueries();
               })(),
               {
                    loading: "Deleting subscription...",
                    success: "Subscription deleted successfully",
                    error: error => error.message || "Failed to delete subscription"
               }
          );
     }

     useEffect(() => {
          if(subscription){
               setBenefits(subscription.benefits || []);
               setIsActive(subscription.isActive);
          }
     }, [subscription])

     if(isLoading) return <MainFormLoader />;
     return (
          <div className="w-full flex flex-col gap-4">
               <MainForm submitData={submitData} btnTitle={subscription ? "Update Subscription" : "Create Subscription"} >
                    <TextInput name="name" label="Subscription Name" defaultValue={subscription?.name} placeholder="Enter subscription name" required={subscription ? false : true}  />
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-3">
                         <NumberInput name="price" label="Price" inputMode="numeric" defaultValue={subscription?.price} placeholder="Enter subscription price" required={subscription ? false : true}  />
                         <SelectInput name="currency" label="Currency" defaultValue={subscription?.currency} placeholder="Select currency" required={subscription ? false : true} values={["USD", "RWF"].map(v => ({ label: v, value: v }))}  />
                    </div>
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-3">
                         <NumberInput name="duration" label="Duration" inputMode="numeric" defaultValue={subscription?.duration} placeholder="Enter subscription duration" required={subscription ? false : true}  />
                         <SelectInput name="durationUnit" label="Duration Unit" defaultValue={subscription?.durationUnit} placeholder="Select duration unit" required={subscription ? false : true} values={DurationUnits.map(v => ({ label: v, value: v }))}  />
                    </div>
                    <TextAreaInput name="description" label="Description" defaultValue={subscription?.description} placeholder="Enter subscription description" required={subscription ? false : true}  />
                    <WordsInput name="benefits" label="Benefits" words={benefits} onChange={setBenefits} type="text" />
                    <CheckInputGroup name="isActive" label="Is Active" checked={isActive} onChange={setIsActive} required={false}/>
               </MainForm>
               <DeleteBtn onClick={handleDelete} confirmMessage="Are you sure you want to delete this subscription?" confirmTitle="Delete" title="Delete Subscription" />
          </div>
     )
}

export const SubscriptionFormBtn = ({categoryId, showBtnName, showBtnIcon, btnSize = "md"}:{categoryId?: number, showBtnName?: boolean; showBtnIcon?: boolean; btnSize?: InputSize}) => {
     const btnTitle = showBtnName ? categoryId ? "Edit" : "Create" : undefined;
     const Icon = categoryId ? EditIcon : PlusIcon;
     const [open,setOpen] = useState(false);
     const sizeClasses: Record<InputSize, string> = { sm: "h-8 px-3 text-xs gap-1.5", md: "h-10 px-4 text-sm gap-2", lg: "h-12 px-5 text-base gap-2" };
     const iconSizes: Record<InputSize, number> = { sm: 14, md: 16, lg: 18 };

     return (
          <>
               <button type="button" onClick={() => setOpen(true)} className={cn("inline-flex items-center justify-center rounded-lg font-medium cursor-pointer transition-all duration-200 active:scale-[0.97]", sizeClasses[btnSize], categoryId ? "border border-white/10 bg-blue-700 text-gray-100 hover:border-blue-700/30 hover:text-white" : "bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500")}>
                    {showBtnIcon && <Icon size={iconSizes[btnSize]} strokeWidth={2} className="shrink-0" />}
                    {showBtnName && <span>{btnTitle}</span>}
               </button>
               <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                         <DialogPanel className="relative w-[92vw] max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-gray-900 shadow-2xl shadow-black/50">
                              <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl bg-linear-to-r from-blue-600 via-blue-500 to-blue-900" />
                              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl" aria-hidden="true"><div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-blue-600/5 blur-3xl" /><div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-blue-900/10 blur-3xl" /></div>
                              <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-white/5 bg-gray-900/95 backdrop-blur-md px-6 py-4 rounded-t-2xl">
                                   <div className="flex items-center gap-3">
                                        <div className={cn("flex items-center justify-center h-9 w-9 rounded-lg", categoryId ? "bg-blue-600/10 border border-blue-600/20 text-blue-600" : "bg-blue-600 text-white shadow-md shadow-blue-600/25")}><Wallet size={18} strokeWidth={2} /></div>
                                        <div><h3 className="text-base font-semibold text-white">{categoryId ? "Edit Subscription" : "Create Subscription"}</h3><p className="text-xs text-gray-400">{categoryId ? "Update Subscription details" : "Create a new Subscription"}</p></div>
                                   </div>
                                   <button type="button" onClick={() => setOpen(false)} title="Close" className="flex items-center justify-center h-8 w-8 rounded-lg border border-white/10 bg-white/5 text-gray-400 cursor-pointer transition-all hover:bg-white/10 hover:text-white hover:border-white/20"><X size={16} strokeWidth={2} /></button>
                              </div>
                              <div className="relative px-6 py-5"><SubscriptionForm id={categoryId} onComplete={() => setOpen(false)} /></div>
                              <div className="absolute inset-x-0 bottom-0 h-px rounded-b-2xl bg-linear-to-r from-transparent via-blue-600/20 to-transparent" />
                         </DialogPanel>
                    </div>
               </Dialog>
          </>
     )
}