"use client";

import { X } from "lucide-react";
import { ReactNode, useState } from "react";

interface WordsInputProps {
     words: string[];
     onChange: (words: string[]) => void;
     type: "text" | "select";
     options?: string[]; // Only needed if type is "select"
     label: string;
     name: string;
     icon?: ReactNode;
}

export const WordsInput = ({ words, onChange, type, options, label, icon, name }: WordsInputProps) => {
     const [values,setValues] = useState<string[]>(words);
     const [inputValue, setInputValue] = useState("");

     const handleAddWord = () => {
          const trimmed = inputValue.trim();
          if (trimmed && !values.includes(trimmed)) {
               const newValues = [...values, trimmed];
               setValues(newValues);
               onChange(newValues);
               setInputValue("");
          }
     };

     const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === "Enter") {
               e.preventDefault();
               handleAddWord();
          }
     };

     const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
          const selected = e.target.value;
          if (selected && !values.includes(selected)) {
               const newValues = [...values, selected];
               setValues(newValues);
               onChange(newValues);
               e.target.value = "";
          }
     };

     const handleRemoveWord = (word: string) => {
          const newValues = values.filter(w => w !== word);
          setValues(newValues);
          onChange(newValues);
     }

     return (
          <div className="w-full flex flex-col gap-3 items-start">
               <span className="text-sm font-semibold text-slate-700">{label}</span>
               <div className="w-full flex flex-wrap gap-2">
                    {
                         values.length === 0 ? <p className="text-sm text-gray-500">No {name} added</p> :
                         values.map((word, index) => 
                              <div key={index} className="flex items-center gap-1 py-1 px-2 rounded-lg bg-gray-100">
                                   <span className="text-gray-600 font-medium text-xs">{word}</span>
                                   <button aria-label="remove" className="text-red-400 cursor-pointer" type="button" onClick={() => handleRemoveWord(word)}><X className="w-4 h-4" /></button>
                              </div>
                         )
                    }
               </div>
               {
                    type === "text" ? (
                         <div className="w-full flex gap-2">
                              <div className="relative flex-1">
                                   {icon && (
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                                             {icon}
                                        </div>
                                   )}
                                   <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder={`Add ${name}`}
                                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${icon ? 'pl-10' : ''}`}
                                   />
                              </div>
                              <button
                                   type="button"
                                   onClick={handleAddWord}
                                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                              >
                                   Add
                              </button>
                         </div>
                    ) : (
                         <select
                              onChange={handleSelectChange}
                              aria-label={label}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                         >
                              <option value="">Select {name}</option>
                              {options?.map((option, index) => (
                                   <option key={index} value={option}>
                                        {option}
                                   </option>
                              ))}
                         </select>
                    )
               }
          </div>
     )
};