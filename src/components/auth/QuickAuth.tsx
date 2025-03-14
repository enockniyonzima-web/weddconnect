"use client";

import { Dialog, DialogPanel } from "@headlessui/react";
import { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { useSearchParams } from "next/navigation";
import { GoogleSignBtn } from "../forms/AuthForms";

const QuickAuthContainer  = () => {
     const [isOpen,setIsOpen] = useState(false);
     const {user}  = useAuthContext();
     const searchParams = useSearchParams();

     useEffect(() => {
          if(searchParams.get('q') === 'auth' && !user) {
               return setIsOpen(true);
          }else {
               return setIsOpen(false);
          }
     }, [searchParams, user])
     return(
          <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
               <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
                    <DialogPanel className="bg-white p-6 rounded-lg shadow-lg lg:w-[40%] max-w-[80%] flex flex-col items-center justify-start gap-[10px]">
                         <div className="w-full flex flex-col items-center justify-start gap-[5px]">
                              <h2 className="text-[1.6rem] text-black font-bold">Sign In</h2>
                              <p>Sign in to discover the top wedding vendors in Rwanda.</p>
                         </div>
                         <GoogleSignBtn />
                    </DialogPanel>
               </div>
          </Dialog>
     )
}

export default QuickAuthContainer