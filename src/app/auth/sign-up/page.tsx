"use client";

/* eslint-disable react-hooks/exhaustive-deps */
import { ENotificationType } from "@/common/CommonTypes";
import { AuthPasswordInput, AuthSubmitBtn, AuthTextInput, GoogleSignBtn } from "@/components/forms/AuthForms";
import ClientPage from "@/components/layout/ClientPage";
import { showMainNotification } from "@/util/NotificationFuncs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { registerUser } from "./actions";

export default function SignupPage() {
     const [formState, action] = useActionState(registerUser, {message: "", status: ""});
     const router = useRouter();
     
     const navigate = (path: string) => router.push(path);

     useEffect(() => {
          
          if(formState.status === "success") {
               showMainNotification(formState.message, ENotificationType.PASS);
               navigate("/auth/login");
          }else if(formState.status === "error") {
               showMainNotification(formState.message, ENotificationType.FAIL);
          }
     }, [formState]);
     return (
          <ClientPage>
               <div className="w-full flex px-[2%] flex-col items-center justify-center py-[40px] bg-gray-100">
                    <div className="w-full md:w-[70%] lg:w-[40%] rounded-[5px] px-[20px] py-[20px] bg-white flex flex-col items-center justify-start gap-[30px]">
                         <h1 className="text-[1.4rem] font-bold text-black text-center" >Register</h1>
                         <GoogleSignBtn />
                         <form action={action} className="w-full flex flex-col items-center justify-start gap-[10px]">
                              <AuthTextInput label="Full Name:" name="sign-up-name" placeholder="ex Dushime Brother" />
                              <AuthTextInput label="Phone:" name="sign-up-phone" placeholder="ex 07800..." />
                              <AuthTextInput label="Email:" name="sign-up-email" type="email" placeholder="ex dushime@xyz.com" />
                              <AuthPasswordInput label="Password:" name="sign-up-password" placeholder="password"  />
                              <AuthSubmitBtn loading={false} name="Register" />
                         </form>
                         <div className="w-full flex items-center justify-center gap-[5px] border-t-[1.5px] border-gray-100 pt-[20px]">
                              <p className="text-[0.8rem] text-gray-400">Already have an account? </p>
                              <Link prefetch={true} href={'/auth/login'} className="text-[0.8rem] text-blue-600 hover:text-blue-800 ">Login</Link>
                         </div>
                    </div>
               </div>
          </ClientPage>
     )
}