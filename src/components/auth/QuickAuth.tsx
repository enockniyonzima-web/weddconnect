"use client";

import { Dialog, DialogPanel } from "@headlessui/react";
import { useAuthContext } from "../context/AuthContext";
import { GoogleSignBtn } from "../forms/AuthForms";

const QuickAuth  = () => {
     const {authOn, setAuthOn}  = useAuthContext();
     return(
          <Dialog open={authOn} onClose={() => setAuthOn(false)} className="relative z-50">
               <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
                    <DialogPanel className="bg-white p-6 rounded-lg shadow-lg lg:w-[40%] max-w-[80%] flex flex-col items-center justify-start gap-[10px]">
                         <div className="w-full flex flex-col items-center justify-start gap-[5px]">
                              <h2 className="text-[1.6rem] text-black font-bold">Sign In</h2>
                              <p className="text-[0.9rem] text-center text-gray-600">Sign in to discover the top wedding vendors in Rwanda.</p>
                         </div>
                         <GoogleSignBtn />
                    </DialogPanel>
               </div>
          </Dialog>
     )
}

export default QuickAuth