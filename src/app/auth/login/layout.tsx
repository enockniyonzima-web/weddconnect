
import { createClient } from '@/server-actions/client.actions';

import { getSessionUser, updateUser } from '@/server-actions/user.actions';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
     title: "Login",
     description: "Login to your Weddconnect account to enjoy the best of it.",
};

export default  async function LoginLayout({
     children
     }: Readonly<{
     children: React.ReactNode;
     }>) {

          const {user, session}  = await getSessionUser();
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
                    // Google sign-ins carry the real display name through the session (see
                    // authOptions.ts jwt/session callbacks) — prefer that over the email so the
                    // Client record (used everywhere: admin tables, contact buttons, etc.) shows
                    // an actual name instead of the raw email address.
                    const displayName = session?.user?.name || user.email;
                    const newClient = await createClient({name: displayName, phone: "", user:{connect:{id:userId}}});
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