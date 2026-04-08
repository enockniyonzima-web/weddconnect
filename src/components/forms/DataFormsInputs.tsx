/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { ChangeEvent, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

const inputBase = "w-full text-sm rounded-lg text-gray-100 border border-gray-700 bg-gray-800/80 outline-none py-2.5 px-3 placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-colors";
const labelBase = "text-sm font-medium text-gray-300";

export const TextInputGroup = ({type="text",label, placeholder,name, required=true, action, defaultValue}:{label: string, placeholder:string, name:string, required?: boolean, type:string, action?:(e:string | number) => unknown, defaultValue?:string}) => {
     return (
          <div className="w-full flex flex-col items-start gap-1.5">
               <label className={labelBase} htmlFor={name}>{label}</label>
               <input type={type} defaultValue={defaultValue} className={inputBase} name={name} id={name} placeholder={placeholder} required={required} onChange={(e:ChangeEvent<HTMLInputElement>) => action ? action(e.target.value) : () =>{}} />
          </div>
     )
}

export const TextAreaInputGroup = ({label, placeholder,name, required=true, action, maxWords,defaultValue}:{label: string, placeholder:string, name:string, required?: boolean, action?:(e:string | number) => unknown, maxWords:number,defaultValue?:string}) => {
     
     const [wordCount, setWordCount] = useState(0);
     const [text, setText] = useState("");

     const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
          const inputText = e.target.value;
          const words = inputText.trim().split(/\s+/).filter(Boolean);
          
          if (words.length <= maxWords) {
            setText(inputText);
            setWordCount(words.length);
            if (action) action(inputText);
          }
        };
     return (
          <div className="w-full flex flex-col items-start gap-1.5">
               <div className="w-full flex items-center justify-between">
                    <label className={labelBase} htmlFor={name}>{label}</label>
                    <span className="text-gray-500 text-xs">{wordCount}/{maxWords}</span>
               </div>
               <textarea name={name} id={name} required={required} defaultValue={defaultValue} onChange={handleChange} className={`${inputBase} resize-none min-h-[80px]`} placeholder={placeholder} ></textarea>
          </div>
     )
}
export const PasswordInputGroup = ({label, placeholder,name, required=true, action}:{label: string, placeholder:string, name:string, required?: boolean, type:string, action?:(e:string | number) => unknown}) => {
     const [showPassword, setShowPassword] = useState<boolean>(false);
     return (
          <div className="w-full flex flex-col items-start gap-1.5">
               <label className={labelBase} htmlFor={name}>{label}</label>
               <div className="w-full relative">
                    <input type={showPassword ? 'text' :"password"} className={`${inputBase} pr-10`} name={name} id={name} placeholder={placeholder} required={required} onChange={(e:ChangeEvent<HTMLInputElement>) => action ? action(e.target.value) : () =>{}} />
                    <i onClick={()=> setShowPassword(prev => !prev)} className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 hover:text-gray-200 cursor-pointer transition-colors" >{showPassword ? <FaEye /> : <FaEyeSlash />}</i>
               </div>
          </div>
     )
}

export const SelectInputGroup = ({label, name, required=true,values, action, defaultValue}:{label: string, name:string, required?: boolean, values: Array<{label:string, value:string | number}>, action?: (res:string) => unknown, defaultValue?:string}) => {
     return (
          <div className="w-full flex flex-col items-start gap-1.5">
               <label className={labelBase} htmlFor={name}>{label}</label>
               <select defaultValue={defaultValue} onChange={(e:ChangeEvent<HTMLSelectElement>) => action ? action(e.target.value) : () => {}} className={inputBase} name={name} id={name} required={required}>
                    <option value="" className="bg-gray-800">Select {name}</option>
                    {
                         values.map((item, index) => <option className="bg-gray-800" key={`${name}-${index}`} value={item.value} >{item.label}</option>)
                    }
               </select>
          </div>
     )
}

export const CheckInputGroup = ({label, placeholder,name, required=true, action, defaultChecked}:{label: string, placeholder:string, name:string, required?: boolean, action?: (res:boolean) => void, defaultChecked?:boolean}) => {
     return (
          <div className="flex items-center gap-2.5 cursor-pointer">
               <input type="checkbox" defaultChecked={defaultChecked} className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500/30 focus:ring-offset-0 cursor-pointer" name={name} id={name} placeholder={placeholder} required={required} onChange={e =>action ? action(e.target.checked) : () => {}} />
               <label className="text-sm text-gray-300 cursor-pointer" htmlFor={name}>{label}</label>
          </div>
     )
}

export const RadioInputGroup = ({label, name, required=true}:{label: string,  name:string, required?: boolean}) => {
     return (
          <div className="flex items-center gap-2.5 cursor-pointer">
               <input type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500/30 focus:ring-offset-0 cursor-pointer" name={name} id={name} required={required} />
               <label className="text-sm text-gray-300 cursor-pointer" htmlFor={name}>{label}</label>
          </div>
     )
}

export const SubmitButton = ({label, loading, loadText}:{label:string,loading: boolean, loadText:string}) => {
     return (
          <button type="submit" disabled={loading} className="w-full text-sm font-medium rounded-lg bg-blue-600 text-white py-2.5 px-4 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-400 transition-colors" >{loading? loadText :label}</button>
     )
}