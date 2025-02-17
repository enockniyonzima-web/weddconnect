import { AuthPasswordInput, AuthSubmitBtn, AuthTextInput, GoogleSignBtn } from "@/components/forms/AuthForms";
import ClientPage from "@/components/layout/ClientPage";

export default function LoginPage() {
     return (
          <ClientPage>
               <div className="w-full flex px-[2%] flex-col items-center justify-center py-[40px] bg-gray-100">
                    <div className="w-full md:w-[70%] lg:w-[40%] rounded-[5px] px-[20px] py-[20px] bg-white flex flex-col items-center justify-start gap-[30px]">
                         <h1 className="text-[1.4rem] font-bold text-black text-center" >Sign In</h1>
                         <GoogleSignBtn />
                         <form className="w-full flex flex-col items-center justify-start gap-[20px]">
                              <AuthTextInput label="Email:" name="login-email" placeholder="ex dushime@xyz.com" />
                              <AuthPasswordInput label="Password:" name="login-password" placeholder="password"  />
                              <AuthSubmitBtn name="Sign In" />
                         </form>
                    </div>
               </div>
          </ClientPage>
     )
}