"use client";

import { FcGoogle } from "react-icons/fc";

export const AuthTextInput = ({label, type, name, placeholder,action}:{label: string,type?:string, name:string, placeholder: string, action?:(res:string)=> unknown }) => {
     return (
          <div className="w-full flex flex-col items-start justify-normal gap-[5px]">
               <label className="text-[0.9rem] font-bold text-gray-700" htmlFor={name}>{label}</label>
               <input className="outline-none py-[5px] placeholder:text-[0.8rem] placeholder:text-gray-600 px-[10px] text-[0.9rem] text-gray-800 bg-gray-50 border-[1.3px] border-gray-300 rounded-[5px] w-full  " type={type || "text"} name={name} id={name} placeholder={placeholder} onChange={e => action ?  action(e.target.value) : null}  />
          </div>
     )
}

export const AuthPasswordInput = ({label, name, placeholder,action}:{label: string, name:string, placeholder: string, action?:(res:string)=> unknown }) => {
     return (
          <div className="w-full flex flex-col items-start justify-normal gap-[5px]">
               <label className="text-[0.9rem] font-bold text-gray-700" htmlFor={name}>{label}</label>
               <input className="outline-none py-[5px] placeholder:text-[0.8rem] placeholder:text-gray-600 px-[10px] text-[0.9rem] text-gray-800 bg-gray-50 border-[1.3px] border-gray-300 rounded-[5px] w-full  " type="password" name={name} id={name} placeholder={placeholder} onChange={e => action ?  action(e.target.value) : null}  />
          </div>
     )
}

export const AuthSubmitBtn = ({name}:{name:string}) => {
     return (
          <button className="w-full p-[5px] rounded-[5px] text-[0.9rem] font-medium text-white outline-none bg-blue-600 hover:bg-blue-800 transition-all duration-200 ">{name}</button>
     )
} 

export const GoogleSignBtn = () => {
     return (
          <button className="w-full flex items-center justify-center gap-[10px] rounded-[20px] p-[10px] bg-gray-200 hover:bg-gray-300 transition-all duration-200">
               <i className="text-[22px]"><FcGoogle /></i>
               <span className="text-[0.9rem] text-gray-600">Continue with Google</span>
          </button>
     )
}