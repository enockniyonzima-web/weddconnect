
import { createClient } from '@/server-actions/client.actions';

import { getSessionUser, updateUser } from '@/server-actions/user.actions';
import { RevalidatePages } from '@/services/Server';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
     title: "Login",
     description: "Login to your Tiracar account to enjoy the best of it that Tiracar provides.",
};

export default  async function DashboardLayout({
     children
     }: Readonly<{
     children: React.ReactNode;
     }>) {

          const {user}  = await getSessionUser();
          const  redirectUserByType = (type:string) =>{
               switch(type){
                    case "admin":
                         return redirect('/dashboard/admin');
                    case "vendor":
                         return redirect('/dashboard/seller');
                    case "client":
                         return redirect('/posts');
                    default:
                         return redirect('/auth/choose-account');
               
               }
          }

          if(user){
               const userType = user.vendor ? "vendor": user.client ? "client" : user.admin ? "admin" : "unkown"; 

               if(userType === "unkown") {
                    const userId  = user.id;
                    const newClient = await createClient({name: user.email, phone: "", user:{connect:{id:userId}}});
                    if(newClient) {
                         await updateUser(userId,{type:"client"});
                         RevalidatePages.user();
                         RevalidatePages.client();
                    }
               }
               if(user) {
                    return redirectUserByType(userType);
               }else {
                    return redirect('/auth/choose-account');
               }
          }
          
     return (
          <>
          {children}
          </>
     )
}