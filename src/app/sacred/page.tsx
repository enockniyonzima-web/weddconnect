"use client";

import { PasswordInputGroup } from "@/components/forms/DataFormsInputs";
import { useState } from "react";
import { AdminForm } from "../dashboard/admin/users/[components]/AdminForm";

const password = "Dushime@2026";

export default function SacredPage() {
     const [show,setShow] = useState(false);
     const [pass,setPass] = useState("");
     const [error,setError] = useState("");
     const checkPassword = () => {
          if(pass === password) setShow(true);
          else setError("Invalid")
     }

     if(!show) return (
          <div className="w-full flex items-center justify-center p-6">
               <div className="w-full max-w-xl flex p flex-col items-center gap-2 bg-gray-200 shadow-md rounded-xl p-6 ">
                    <PasswordInputGroup action={res => setPass(res as string)} name="password" label="Password" type="password" required  placeholder="*********"/>
                    {error ? <span className="text-red-600 text-sm font-medium">{error}</span> : null }
                    <button type="button" className="py-2 px-4 rounded-lg bg-gradient-to-br from-blue-800 to-gray-800 text-white font-medium " onClick={checkPassword}>Check</button>
               </div>
               
          </div>
     )
     return (
          <div className="w-full flex flex-col gap-4">
               <AdminForm className="py-2 px-4 bg-gray-100 text-blue-600 rounded-lg  " />
          </div>
     )
}