"use client";

import { ENotificationType } from "@/common/CommonTypes";
import { TUser } from "@/common/Entities";
import { useAuthContext } from "@/components/context/AuthContext";
import { AuthPasswordInput, AuthSubmitBtn, AuthTextInput, GoogleSignBtn } from "@/components/forms/AuthForms";
import ClientPage from "@/components/layout/ClientPage";
import { CredentialsSignin } from "@/server-actions/auth";
import { getSessionUser } from "@/server-actions/user.actions";
import { isDateLaterThanToday } from "@/util/DateFunctions";
import { showMainNotification } from "@/util/NotificationFuncs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
     const [credentials, setCredentials] = useState<{email:string, password: string}>({email:"", password: ""});
     const {setUser} = useAuthContext();
     const [loading,setLoading] = useState(false);

     const router = useRouter()

     const  redirectUserByType = (type:string, user: TUser | undefined | null) =>{
          if(user && user.client && (!user.client.subscription || !isDateLaterThanToday(user.client.subscription.expiryAt))) return router.push('/subscribe')
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
          try {
               showMainNotification("Authenticating...", ENotificationType.WARNING);
               setLoading(true);
               const data = new FormData();
               data.append("email", credentials.email);
               data.append("password", credentials.password);

               const result= await CredentialsSignin(data);
               if (result) {
                    if(result.error){
                         return showMainNotification("Invalid email or password", ENotificationType.FAIL);
                    }

                    const {user} = await getSessionUser();
                    showMainNotification("Login successfull", ENotificationType.PASS);
                    setUser(user);
                    return redirectUserByType(user?.type || "",  user);
               } else {
                    return showMainNotification("Error logging in", ENotificationType.FAIL)
               }
          } catch (error) {
               console.error(error);
               showMainNotification(`Error authenticating your credentials`, ENotificationType.FAIL);
          }finally{
               setLoading(false);
          }
     }

     return (
          <ClientPage>
               <div className="w-full flex px-[2%] flex-col items-center justify-center py-[40px] bg-gray-100">
                    <div className="w-full md:w-[70%] lg:w-[40%] rounded-[5px] px-[20px] py-[20px] bg-white flex flex-col items-center justify-start gap-[30px]">
                         <h1 className="text-[1.4rem] font-bold text-black text-center" >Sign In</h1>
                         <GoogleSignBtn />
                         <form onSubmit={submitForm} className="w-full flex flex-col items-center justify-start gap-[20px]">
                              <AuthTextInput action={(res) => setCredentials(prev => ({...prev, email:res}))} label="Email:" name="login-email" placeholder="ex dushime@xyz.com" />
                              <AuthPasswordInput action={(res) => setCredentials(prev => ({...prev, password:res}))}  label="Password:" name="login-password" placeholder="password"  />
                              <AuthSubmitBtn loading={loading} name={loading ? "Authenticating..." :"Sign In"} />
                         </form>
                         <div className="w-full flex items-center justify-center gap-[5px] border-t-[1.5px] border-gray-100 pt-[20px]">
                              <p className="text-[0.8rem] text-gray-400">Your first time? </p>
                              <Link prefetch={true} href={'/auth/sign-up'} className="text-[0.8rem] text-blue-600 hover:text-blue-800 ">Register</Link>
                         </div>
                    </div>
               </div>
          </ClientPage>
     )
}