"use client";

import { ChangeEvent, ReactNode, useState } from "react";
import { toast } from "sonner";
import { SubmitBtn } from "../ui/forms/submit-btn";

interface IMainFormProps {
     children: ReactNode
     submitData: (data: FormData) => Promise<{message?: string}>
     btnTitle?: string 
     btnIcon?: ReactNode
     showSubmitBtn?: boolean
}

export const MainForm = ({children, submitData, btnTitle, btnIcon, showSubmitBtn}: IMainFormProps) => {
     const [loading,setLoading] = useState(false);
     const submitForm = async(event:ChangeEvent<HTMLFormElement>) => {
          event.preventDefault();
          return toast.promise(
            (async(): Promise<{message: string}> => {
              try {
                setLoading(true);
                const data = new FormData(event.currentTarget);

                const res = await submitData(data);
                return {message: res.message || "Submitted successfully"};
              } catch (error) {
                console.error("Error submitting form:", error);
                throw new Error("Application Error");
              }
            })(),
            {
              loading: "Submitting...",
              success: (data: {message?: string}) => data.message || "Submitted successfully",
            }
          ) 
     }
     return (
          <form onSubmit={submitForm} className="w-full flex flex-col gap-4">
               {children}
               {typeof showSubmitBtn === "boolean" && !showSubmitBtn ? null :
                <SubmitBtn disabled={loading} label={btnTitle ?? "Submit"} icon={btnIcon}  />
               }
               
          </form>
     )
}

export const MainFormLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-100 bg-white">
      <div className="text-center space-y-4">
        {/* Animated spinner */}
        <div className="relative w-16 h-16 mx-auto">
          <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        
        {/* Loading text */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-blue-900">
            Loading Data
          </h3>
          <p className="text-sm text-blue-600">
            Please wait while we fetch your information...
          </p>
        </div>
        
        {/* Animated dots */}
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};