"use client";

/* eslint-disable react-hooks/exhaustive-deps */
import { ENotificationType } from "@/common/CommonTypes";
import { AuthPasswordInput, AuthSubmitBtn, AuthTextInput, GoogleSignBtn } from "@/components/forms/AuthForms";
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
               return navigate("/auth/login");
          }else if(formState.status === "error") {
               showMainNotification(formState.message, ENotificationType.FAIL);
          }
     }, [formState]);
     return (
          <div className="flex flex-col gap-6">
               {/* Header */}
               <div className="mb-2">
                    <h1 className="text-2xl font-bold text-white tracking-tight">Create your account</h1>
                    <p className="text-gray-500 text-sm mt-1.5">Join thousands of couples planning their perfect wedding</p>
               </div>

               <div className="flex flex-col gap-5">
                    <GoogleSignBtn />

                    <div className="flex items-center gap-3">
                         <div className="flex-1 h-px bg-gray-800" />
                         <span className="text-xs text-gray-600 font-medium">or continue with email</span>
                         <div className="flex-1 h-px bg-gray-800" />
                    </div>

                    <form action={action} className="flex flex-col gap-4">
                         <AuthTextInput label="Full Name" name="sign-up-name" placeholder="John Doe" />
                         <AuthTextInput label="Phone" name="sign-up-phone" placeholder="07800..." />
                         <AuthTextInput label="Email" name="sign-up-email" type="email" placeholder="you@example.com" />
                         <AuthPasswordInput label="Password" name="sign-up-password" placeholder="Create a strong password" />
                         <AuthSubmitBtn loading={false} name="Create Account" />
                    </form>

                    <p className="text-center text-sm text-gray-500">
                         Already have an account?{" "}
                         <Link href="/auth/login" className="text-blue-500 hover:text-blue-400 font-medium transition-colors">
                              Sign in
                         </Link>
                    </p>
               </div>
          </div>
     )
}