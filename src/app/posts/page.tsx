import ClientPage from "@/components/layout/ClientPage";
import { getSessionUser } from "@/server-actions/user.actions";
// import { isDateLaterThanToday } from "@/util/DateFunctions";
import { redirect } from "next/navigation";
import Filter from "./Filter";
import PostsContainer from "./PostsContainer";
import { isDateLaterThanToday } from "@/util/DateFunctions";

export default async function PostsPage ({searchParams}:{searchParams: Promise<Record<string, string | undefined>>}) {
     const {user} = await getSessionUser();
     if(!user) {
          return redirect('/auth/login');
     }
     if(user.admin) return redirect('/dashboard/admin');
     if(user.vendor) return redirect('/dashboard/vendor');

     if(user && (!user.client?.subscription || !isDateLaterThanToday(user.client.subscription.expiryAt))) {
          return redirect('/subscribe');
     }

     const search = await searchParams;


     return (
          <ClientPage>
               <div className="w-full flex flex-col items-center justify-center gap-[10px] px-[2%] py-[20px]">
                    <h1 className="text-[1.8rem] font-bold text-black">Explore Our Vendors</h1>
                    <p className="text-[0.9rem] text-gray-600">Discover our carefully curated selection of the finest wedding vendors.</p>
               </div>
               <Filter search={search} />
               <div className="w-full px-[2%] flex-col items-center gap-[10px]">
                    <PostsContainer posts={[]} />
               </div>
          </ClientPage>
     )
}