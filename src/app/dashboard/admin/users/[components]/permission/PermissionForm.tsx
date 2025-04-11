/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { ENotificationType } from "@/common/CommonTypes";
import { SelectInputGroup, TextAreaInputGroup, TextInputGroup } from "@/components/forms/DataFormsInputs";
import { createPermission, fetchPermissionById, updatePermission } from "@/server-actions/permission.actions";
import { showMainNotification } from "@/util/NotificationFuncs";
import { DataInputs } from "@/util/util-classes";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Prisma } from "@prisma/client";
import { ChangeEvent, ReactNode, useEffect, useState } from "react";

const PermissionData = {
     name:true, id:true, description:true
} satisfies Prisma.PermissionSelect;

type TPermissionData = Prisma.PermissionGetPayload<{select: typeof PermissionData}>

export const PermissionForm = ({id, name, icon, className}:{id?:number, icon?: ReactNode, name?:string, className:string}) => {
     const [formOn, setFormOn] = useState(false);

     const [fetchingData, setFetchingData] = useState(false);
     const [submitting,setSubmitting] = useState(false);
     const [searchedPermission,setSearchedPermission] = useState<TPermissionData | null>(null);

     const inputs = new DataInputs();

     const submitForm = async(e:ChangeEvent<HTMLFormElement>) => {
          e.preventDefault();
          try {
               setSubmitting(true);
               const check = id && searchedPermission ? {status:true, message:""} : inputs.checkFieldsIn(['name', "description"]);
               if(!check.status) return showMainNotification(check.message, ENotificationType.WARNING);
               const res = !id 
                    ?  await createPermission({name: inputs.get("name",""), description: inputs.get("description", "") }) 
                    : await updatePermission(id, {name: inputs.get("name", searchedPermission?.name), description: inputs.get("description", searchedPermission?.description)});

               if(res) {
                    showMainNotification("Success", ENotificationType.PASS);
                    return setFormOn(false);
               }else {
                    return showMainNotification("Operation failed", ENotificationType.FAIL);
               }
          } catch (error) {
               showMainNotification("Application Error.", ENotificationType.FAIL);
          }finally{
               setSubmitting(false);
          }
     } 

     useEffect(() => {
          if(formOn){
               (async() => {
                    setFetchingData(true);
                    if(id) {
                         const permissionData = await fetchPermissionById(id,PermissionData);
                         if(PermissionData) 
                              setSearchedPermission(permissionData);
                    }
                    setFetchingData(false); 
               })()
          }
     }, [formOn])

     if(!formOn) return <button className={className} type="button" onClick={() => setFormOn(true)}>{icon ?icon: null} {name ? name : !name && !icon ? "Permission Form" : ""}</button>
     return(
          <Dialog open={formOn} onClose={() => setFormOn(false)} className="relative z-50">
               <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
                    <DialogPanel className="bg-white p-6 rounded-lg shadow-lg w-full lg:w-[50%] max-w-[80%] max-h-[90%] overflow-y-auto flex flex-col items-center justify-start gap-[10px]">
                         <h2 className="p-4 text-[1.2rem] font-bold text-gray-800">{id ? "Edit Permission" : "Add new Permission"}</h2>
                         {
                              fetchingData ? 
                              <p className="text-[1.2rem] font-medium text-gray-800">Loading data...</p>:
                              <>
                                   <form onSubmit={submitForm} className="w-full flex flex-col items-start justify-start gap-[10px]" id="Permission-form">
                                        <TextInputGroup name="Permission-name" label={`Permission Name: ${searchedPermission?.name || ""}`} placeholder="ex: Admin" required={false} type="text" action={res => inputs.set("name", res, "string")} />
                                        <TextAreaInputGroup name="Permission-description" label="Permission Description: " placeholder="simple description" maxWords={50} required={false} action={res => inputs.set("description", res, "string")} />
                                        <button type="submit" disabled={submitting} className="w-full flex items-center justify-center py-[10px] text-[1rem] text-white rounded-[5px] bg-blue-600 hover:bg-blue-800 disabled:bg-gray-800">{submitting ? "Loading...": id ? "Update Permission" :"Save Permission"}</button>
                                   </form>
                              </>
                              
                         }
                    </DialogPanel>
               </div>
          </Dialog>
     )
}