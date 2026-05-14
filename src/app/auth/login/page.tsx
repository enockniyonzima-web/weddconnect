"use client";

import { TSessionUser } from "@/common/Entities";
import { useAuthContext } from "@/components/context/AuthContext";
import { AuthPasswordInput, AuthSubmitBtn, AuthTextInput, GoogleSignBtn } from "@/components/forms/AuthForms";
import { CredentialsSignin } from "@/server-actions/auth";
import { getSessionUser } from "@/server-actions/user.actions";
import { isDateLaterThanToday } from "@/util/DateFunctions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function LoginPage() {
     const [credentials, setCredentials] = useState<{email:string, password: string}>({email:"", password: ""});
     const {setUser} = useAuthContext();
     const [loading,setLoading] = useState(false);

     const router = useRouter()

     const  redirectUserByType = (type:string, user: TSessionUser | undefined | null) =>{
          if(user && user.client && (!user.client.subscription || !user.client.subscription.expiryAt || !isDateLaterThanToday(user.client.subscription.expiryAt))) return router.push('/subscribe')
          switch(type){
               case "admin":
                    return router.push('/dashboard/admin');
               case "vendor":
                    return router.push('/dashboard/seller');
               case "client":
               default:
                    return router.push('/posts');
          
          }
     }

     const submitForm = async (e: React.FormEvent) => {
          e.preventDefault();
          setLoading(true);
          return toast.promise(
               (async() => {
                    try {
                         const data = new FormData();
                         data.append("email", credentials.email);
                         data.append("password", credentials.password);

                         const result= await CredentialsSignin(data);
                         if (result) {
                              if(result.error){
                                   throw new Error("Invalid email or password");
                              }

                              const {user} = await getSessionUser();
                              setUser(user);
                              redirectUserByType(user?.type || "",  user);

                         } else {
                              throw new Error("Error authenticating your credentials");
                         }
                    } catch (error) {
                         throw error instanceof Error ? error : new Error("Error authenticating your credentials");
                    }finally {
                         setLoading(false);
                    }
               })(),
               {
                    loading: "Authenticating your credentials...",
                    success: "Login successful! Redirecting...",
                    error: error => error.message || "Error authenticating your credentials",
                    
               }
          )
          
     }

     return (
          <div className="flex flex-col gap-6">
               {/* Header */}
               <div className="mb-2">
                    <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back</h1>
                    <p className="text-gray-500 text-sm mt-1.5">Sign in to continue to WeddConnect</p>
               </div>

               <div className="flex flex-col gap-5">
                    <GoogleSignBtn />

                    <div className="flex items-center gap-3">
                         <div className="flex-1 h-px bg-gray-800" />
                         <span className="text-xs text-gray-600 font-medium">or continue with email</span>
                         <div className="flex-1 h-px bg-gray-800" />
                    </div>

                    <form onSubmit={submitForm} className="flex flex-col gap-4">
                         <AuthTextInput
                              action={(res) => setCredentials(prev => ({...prev, email: res}))}
                              label="Email"
                              name="login-email"
                              placeholder="you@example.com"
                         />
                         <div className="flex flex-col gap-1.5">
                              <AuthPasswordInput
                                   action={(res) => setCredentials(prev => ({...prev, password: res}))}
                                   label="Password"
                                   name="login-password"
                                   placeholder="Enter your password"
                              />
                              <div className="flex justify-end">
                                   <Link
                                        href="/auth/reset-password"
                                        className="text-xs text-blue-500 hover:text-blue-400 transition-colors"
                                   >
                                        Forgot password?
                                   </Link>
                              </div>
                         </div>
                         <AuthSubmitBtn loading={loading} name={loading ? "Signing in..." : "Sign In"} />
                    </form>

                    <p className="text-center text-sm text-gray-500">
                         Don&apos;t have an account?{" "}
                         <Link href="/auth/sign-up" className="text-blue-500 hover:text-blue-400 font-medium transition-colors">
                              Create one
                         </Link>
                    </p>
               </div>
          </div>
     )
}