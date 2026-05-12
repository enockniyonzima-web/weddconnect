/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { ENotificationType } from "@/common/CommonTypes";
import { GoogleSignIn } from "@/server-actions/auth";
import { showMainNotification } from "@/util/NotificationFuncs";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";

export const AuthTextInput = ({label, type, name, placeholder,action}:{label: string,type?:string, name:string, placeholder: string, action?:(res:string)=> unknown }) => {
     return (
          <div className="w-full flex flex-col items-start gap-1.5">
               <label className="text-sm font-semibold text-gray-300" htmlFor={name}>{label}</label>
               <input
                    className="outline-none py-3 px-4 text-sm text-white placeholder:text-gray-600 bg-gray-900 border border-gray-800 rounded-lg w-full focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all duration-200"
                    type={type || "text"} name={name} id={name} placeholder={placeholder}
                    onChange={e => action ? action(e.target.value) : null}
               />
          </div>
     )
}

export const AuthPasswordInput = ({label, name, placeholder,action}:{label: string, name:string, placeholder: string, action?:(res:string)=> unknown }) => {
     const [showPassword, setShowPassword] = useState<boolean>(false);
     return (
          <div className="w-full flex flex-col items-start gap-1.5">
               <label className="text-sm font-semibold text-gray-300" htmlFor={name}>{label}</label>
               <div className="w-full relative">
                    <input
                         className="outline-none py-3 px-4 pr-10 text-sm text-white placeholder:text-gray-600 bg-gray-900 border border-gray-800 rounded-lg w-full focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all duration-200"
                         type={showPassword ? "text" : "password"} name={name} id={name} placeholder={placeholder}
                         onChange={e => action ? action(e.target.value) : null}
                    />
                    <i
                         className="text-gray-500 text-base absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer hover:text-blue-400 transition-colors"
                         onClick={() => setShowPassword(p => !p)}
                    >
                         {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </i>
               </div>
          </div>
     )
}

export const AuthSubmitBtn = ({name, loading, disabled}:{name:string, loading: boolean, disabled?: boolean}) => {
     return (
          <button type="submit" disabled={loading || disabled} className="w-full py-3 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 mt-1">
               {loading ? (
                    <span className="flex items-center justify-center gap-2">
                         <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                         </svg>
                         {name}
                    </span>
               ) : name}
          </button>
     )
} 

export const GoogleSignBtn = () => {
     const [loading, setLoading] = useState(false);
     const signIn = async() => {
          try {
               setLoading(true);
               return await GoogleSignIn();
          } catch (error) {
               showMainNotification("Error logging with Google!",ENotificationType.FAIL)
          }finally{
               setLoading(false);
          }
     }
     return (
          <button disabled={loading} type="button" onClick={signIn} className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg bg-gray-900 border border-gray-800 hover:border-blue-600 hover:bg-gray-800 transition-all duration-200 disabled:cursor-progress disabled:opacity-60">
               <i className="text-2xl flex-shrink-0"><FcGoogle /></i>
               {!loading && <span className="text-sm font-medium text-white">Continue with Google</span>}
               {loading && (
                    <svg className="w-4 h-4 animate-spin text-blue-400" fill="none" viewBox="0 0 24 24">
                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
               )}
          </button>
     )
}