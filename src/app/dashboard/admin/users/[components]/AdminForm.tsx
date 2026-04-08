/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { ENotificationType } from "@/common/CommonTypes";
import { SelectInputGroup, TextInputGroup } from "@/components/forms/DataFormsInputs";
import { createAdmin, fetchAdminById, updateAdmin } from "@/server-actions/admin.actions";
import { fetchRoles } from "@/server-actions/role.actions";
import { encryptPassword } from "@/util/bcryptFuncs";
import { showMainNotification } from "@/util/NotificationFuncs";
import { DataInputs } from "@/util/util-classes";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Prisma } from "@prisma/client";
import { ChangeEvent, ReactNode, useEffect, useState } from "react";

const defaultIcon = "https://weddconnect-s3.s3.eu-north-1.amazonaws.com/production/account.png";

const RoleSelect = {
     name:true, id:true
} satisfies Prisma.RoleSelect;

type TRoleSelect = Prisma.RoleGetPayload<{select: typeof RoleSelect}>

const AdminData = {
     name:true, id:true, 
     user:{select:{email:true,password:true}},
     role:{select: {name:true, id:true}}
} satisfies Prisma.AdminSelect;

type TAdminData = Prisma.AdminGetPayload<{select: typeof AdminData}>

export const AdminForm = ({id, name, icon, className}:{id?:number, icon?: ReactNode, name?:string, className:string}) => {
     const [formOn, setFormOn] = useState(false);

     const [fetchingData, setFetchingData] = useState(false);
     const [submitting,setSubmitting] = useState(false);
     const [searchedAdmin,setSearchedAdmin] = useState<TAdminData | null>(null);


     const inputs = new DataInputs();

     const submitForm = async (e:ChangeEvent<HTMLFormElement>) => {
          e.preventDefault();
          try {
               setSubmitting(true);
               const check = id && searchedAdmin ? {status:true, message:""} : inputs.checkFieldsIn(['name', "email", "password"]);
               if(!check.status) return showMainNotification(check.message, ENotificationType.WARNING);
               const hashedPassword = await encryptPassword(inputs.get("password", ""));
               const res = !id ?
                    await createAdmin({
                         name:inputs.get("name", ""), createdAt: new Date(), 
                         user:{create:{email: inputs.get("email",""),password: hashedPassword, image:defaultIcon, createdAt: new Date(), type: "admin" }},
                         // role: {connect:{id:inputs.get("roleId",0)}}
                    }) :
                    await updateAdmin(id, {
                         name: inputs.get("name", searchedAdmin?.name),
                         user: {update: {email: inputs.get("email", searchedAdmin?.user.email), password: hashedPassword || searchedAdmin?.user.password}},
                         // role: {connect:{id:inputs.get("roleId", searchedAdmin?.role.id)}}
                    });
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
                         const adminData = await fetchAdminById(id,AdminData);
                         if(adminData) 
                              setSearchedAdmin(adminData);
                    } 
                    setFetchingData(false);
               })()
          }
     }, [formOn])

     if(!formOn) return <button className={className} type="button" onClick={() => setFormOn(true)}>{icon ?icon: null} {name ? name : !name && !icon ? "Admin Form" :""}</button>
     return(
          <Dialog open={formOn} onClose={() => setFormOn(false)} className="relative z-50">
               <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center">
                    <DialogPanel className="bg-gray-900 border border-gray-800 p-6 rounded-xl shadow-lg w-full lg:w-[50%] max-w-[80%] max-h-[90%] overflow-y-auto flex flex-col items-center justify-start gap-4">
                         <h2 className="p-4 text-xl font-bold text-gray-100">{id ? "Edit User" : "Add new User"}</h2>
                         {
                              fetchingData ? 
                              <p className="text-lg font-medium text-gray-400">Loading data...</p>:
                              <form onSubmit={submitForm} className="w-full flex flex-col items-start justify-start gap-[10px]" id="admin-form">
                                   <TextInputGroup name="user-name" label={`User Name: ${searchedAdmin?.name || ""}`} placeholder="ex: Dushime Brother" required={false} type="text" action={res => inputs.set("name", res, "string")} />
                                   <TextInputGroup name="user-name" label={`User Email: ${searchedAdmin?.user.email || ""}`} placeholder="ex: dushime@gmail.com" required={false} type="email" action={res => inputs.set("email", res, "string")} />
                                   <TextInputGroup name="user-name" label={`Password: `} placeholder="enter a strong password" required={false} type="text" action={res => inputs.set("password", res, "string")} />
                                   {/* <SelectInputGroup required={false} label={`Role: ${searchedAdmin?.role.name}`} name="Role" values={roles.map(r => ({label: r.name, value: r.id}))} action={res => inputs.set('roleId', res, "number")} /> */}
                                   <button type="submit" disabled={submitting} className="w-full flex items-center justify-center py-2.5 text-base text-white rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 transition-colors">{submitting ? "Loading...": id ? "Update User" :"Save User"}</button>
                              </form>
                         }
                    </DialogPanel>
               </div>
          </Dialog>
     )
}