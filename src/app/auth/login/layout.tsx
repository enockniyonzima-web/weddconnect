
import { createClient } from '@/server-actions/client.actions';

import { getSessionUser, updateUser } from '@/server-actions/user.actions';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
     title: "Login",
     description: "Login to your Tiracar account to enjoy the best of it that Tiracar provides.",
};

export default  async function LoginLayout({
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
                         return redirect('/dashboard/vendor');
                    default:
                         return redirect('/posts');
               
               }
          }

          if(user){
               const userType =  user.client ? "client" : user.admin ? "admin" : "unknown"; 

               if(userType === "unknown") {
                    const userId  = user.id;
                    const newClient = await createClient({name: user.email, phone: "", user:{connect:{id:userId}}});
                    if(newClient) {
                         await updateUser(userId,{type:"client"});
                    }
               }
               
               if(user) {
                    return redirectUserByType(userType);
               }
          }
          
     return (
          <>
               {children}
          </>
     )
}