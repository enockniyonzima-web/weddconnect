import { TSubscription } from "@/common/Entities";
import ClientPage from "@/components/layout/ClientPage";
import PaymentOptions from "@/components/sections/PaymentOptions";
import { getSessionUser } from "@/server-actions/user.actions";
import Endpoints from "@/services/Endpoints";
import { MainServer } from "@/services/Server";
import { redirect } from "next/navigation";

export default async function SubscribePage() {
     const {user} = await getSessionUser();
     let subscriptions:TSubscription[] = [];
     const subsRes  = await MainServer.fetch(`${Endpoints.subscription}`);
     if(subsRes) subscriptions = subsRes.data;
     if(!user) {
          return redirect('/auth/login');
     }
     if(user.admin) return redirect('/dashboard/admin');
     if(user.vendor) return redirect('/dashboard/vendor');

     return (
          <ClientPage>
               <div className="bg-gray-100 w-full py-[50px] px-[2%]">
                    <PaymentOptions subscriptions={subscriptions} user={user} />
               </div>
          </ClientPage>
     )
}