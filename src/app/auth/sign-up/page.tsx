import { AuthPasswordInput, AuthSubmitBtn, AuthTextInput, GoogleSignBtn } from "@/components/forms/AuthForms";
import ClientPage from "@/components/layout/ClientPage";

export default function SignupPage() {
     return (
          <ClientPage>
               <div className="w-full flex px-[2%] flex-col items-center justify-center py-[40px] bg-gray-100">
                    <div className="w-full md:w-[70%] lg:w-[40%] rounded-[5px] px-[20px] py-[20px] bg-white flex flex-col items-center justify-start gap-[30px]">
                         <h1 className="text-[1.4rem] font-bold text-black text-center" >Sign In</h1>
                         <GoogleSignBtn />
                         <form className="w-full flex flex-col items-center justify-start gap-[10px]">
                              <AuthTextInput label="Full Name:" name="sign-up-name" placeholder="ex Dushime Brother" />
                              <AuthTextInput label="Phone:" name="sign-up-phone" placeholder="ex 07800..." />
                              <AuthTextInput label="Email:" name="sign-up-email" type="email" placeholder="ex dushime@xyz.com" />
                              <AuthPasswordInput label="Password:" name="sign-up-password" placeholder="password"  />
                              <AuthSubmitBtn name="Register" />
                         </form>
                    </div>
               </div>
          </ClientPage>
     )
}