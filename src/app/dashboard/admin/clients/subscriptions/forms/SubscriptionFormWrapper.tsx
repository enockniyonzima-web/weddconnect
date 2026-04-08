import Link from "next/link";
import { IoClose } from "react-icons/io5";
import { TSubscription } from "@/common/Entities";
import { MainServer } from "@/services/Server";
import Endpoints from "@/services/Endpoints";
import AddSubscriptionForm from "./AddSubscriptionForm";
import UpdateSubscriptionForm from "./UpdateSubscriptionForm";


export default async function SubscriptionFormWrapper ({search}:{search: Record<string, string | undefined>}){
     const formType = search.form;
     let searchSubscription: TSubscription | null = null;

     if(!formType) return null;

     const title = formType === 'add' ? 'Add Category' : 'Edit Category';
     if(formType === "update") {
          const categoryId = search.id ? +search.id : 0;
          const  subscriptionRes = await MainServer.fetch(`${Endpoints.subscription}/${categoryId}`);

          if(subscriptionRes && subscriptionRes.data) {
               searchSubscription = subscriptionRes.data;
          }
     }

     return (
          <div className="w-screen h-screen bg-black/60 backdrop-blur-sm fixed top-0 left-0 flex items-center justify-center overflow-hidden z-30">
               <div className="w-full md:w-[70%] mx-[2%] lg:w-[50%] flex flex-col items-center justify-start gap-5 rounded-xl bg-gray-900 border border-gray-800 p-4 max-h-[80vh] overflow-y-auto">
                    <div className="w-full flex items-center justify-between bg-gray-800/50 py-2 px-4 rounded-lg">
                         <h1 className="text-gray-100 text-xl font-bold">{title}</h1>
                         <Link href="/dashboard/admin/clients/subscriptions" className="flex items-center w-auto aspect-square rounded-full border border-red-500/50 hover:bg-red-500/10 p-1.5 transition-colors">
                              <i className="text-xl text-red-500"><IoClose /></i>
                         </Link>
                    </div>
                    {
                         formType === "add" ? <AddSubscriptionForm /> : 
                         formType === "update" && searchSubscription ? <UpdateSubscriptionForm subscription={searchSubscription} /> : null
                    }
               </div>
               
          </div>
     )
}