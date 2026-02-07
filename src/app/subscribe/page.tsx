
import { SSubscription} from "@/common/Entities";
import ClientPage from "@/components/layout/ClientPage";
import PaymentOptions from "@/components/sections/PaymentOptions";
import { fetchSubscriptions } from "@/server-actions/subscription.actions";
import { getSessionUser } from "@/server-actions/user.actions";
import { isDateLaterThanToday } from "@/util/DateFunctions";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SubscribePage() {
     const {user} = await getSessionUser();
     const subscriptions  = await fetchSubscriptions(SSubscription);
     
     if(!user) {
          return redirect('/auth/login');
     }
     if(user.admin) return redirect('/dashboard/admin');
     
     if(user.client) {
          const clientSubData = user.client.subscription;
          if(clientSubData) {
               if(clientSubData) {
                    if(clientSubData.expiryAt && isDateLaterThanToday(clientSubData.expiryAt)){
                         return redirect('/posts');
                    }else{
                         if(clientSubData.transactions && clientSubData.transactions[0] && clientSubData.transactions[0].createdAt.getDate() === clientSubData.updatedAt.getDate()){
                              return (
                                   <ClientPage>
                                        <div className="bg-black w-full py-[80px] px-[2%]">
                                        <div className="w-full lg:w-[70%] bg-white rounded-[10px] p-[20px] flex flex-col items-center justify-start gap-[20px] mx-auto">
                                        <div className="w-full flex flex-col items-center justify-normal gap-[10px]">
                                        <h1 className="text-[1.6rem] font-extrabold text-black text-center">Your payment has been recorded successfully.</h1>
                                        <p className="text-[0.9rem] text-gray-600 text-center max-w-[70%]">It usually takes five (5) minutes to 30 minutes to verify your payment. After verification, you gain full access to all wedding vendors.</p>
                                        
                                        <div className="w-full flex flex-col items-center justify-start gap-[10px] border border-gray-200 rounded-[10px] p-[20px]">
                                                  <p className="text-[1rem] font-bold text-gray-800">Contact us to complete verification process if it is taking long.</p>
                                                  <div className="w-full grid grid-cols-2 gap-[20px]">
                                                       <Link href={`tel:0788399021`} className="w-full text-center p-[10px] bg-blue-600 text-[0.9rem] text-white hover:bg-blue-800 rounded-[10px] disabled:bg-gray-600" target="_blank">Call Us</Link>
                                                       <Link href={`https://wa.me/+250788399021`}  className="w-full text-center p-[10px] bg-green-600 text-[0.9rem] text-white hover:bg-green-800 rounded-[10px] disabled:bg-gray-600" >Send us Message</Link>
                                                  </div>
                                                  
                                        </div>
                                        </div>
                                   </div>
                                        </div>
                                   </ClientPage>
                              )
                         }
                    }
               }
          }
     }

     return (
          <ClientPage>
               <div className="bg-black w-full py-[80px] px-[2%]">
                    <PaymentOptions subscriptions={subscriptions} user={user} />
               </div>
          </ClientPage>
     )
}