"use client";

import { Dialog, DialogPanel } from "@headlessui/react";
import { useAuthContext } from "../context/AuthContext";
import { GoogleSignBtn } from "../forms/AuthForms";
import { TermsViewer } from "../views/legal/TermsViewer";
import { PrivacyViewer } from "../views/legal/TermsViewer";
import Link from "next/link";

const QuickAuth  = () => {
     const {authOn, setAuth}  = useAuthContext();
     return(
          <Dialog open={authOn} onClose={setAuth} className="relative z-50">
               <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center px-4">
                    <DialogPanel className="bg-gray-950 border border-gray-800 rounded-2xl p-8 shadow-2xl w-full max-w-sm flex flex-col items-center gap-5">
                         <div className="flex flex-col items-center gap-2 text-center">
                              <h2 className="text-xl font-bold text-white">Sign In to WeddConnect</h2>
                              <p className="text-sm text-gray-400">Discover the top wedding vendors in Rwanda.</p>
                         </div>
                         <div className="w-full flex flex-col gap-3">
                              <GoogleSignBtn />
                              <div className="flex items-center gap-3">
                                   <div className="flex-1 h-px bg-gray-800" />
                                   <span className="text-xs text-gray-600">or</span>
                                   <div className="flex-1 h-px bg-gray-800" />
                              </div>
                              <Link
                                   href="/auth/login"
                                   onClick={setAuth}
                                   className="w-full flex items-center justify-center py-3 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                              >
                                   Continue with Email
                              </Link>
                         </div>
                         <p className="text-xs text-gray-600">
                              No account?{" "}
                              <Link href="/auth/sign-up" onClick={setAuth} className="text-blue-500 hover:text-blue-400 transition-colors font-medium">
                                   Register free
                              </Link>
                         </p>
                         <p className="text-xs text-gray-700 text-center">
                              <TermsViewer /> &middot; <PrivacyViewer />
                         </p>
                    </DialogPanel>
               </div>
          </Dialog>
     )
}

export default QuickAuth