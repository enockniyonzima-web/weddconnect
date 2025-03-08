import ClientPage from "@/components/layout/ClientPage";
import { getSessionUser } from "@/server-actions/user.actions";
// import { isDateLaterThanToday } from "@/util/DateFunctions";
import { redirect } from "next/navigation";
import Filter from "./Filter";
import PostsContainer from "./PostsContainer";
import { isDateLaterThanToday } from "@/util/DateFunctions";
import { TPost } from "@/common/Entities";
import { MainServer } from "@/services/Server";
import Endpoints from "@/services/Endpoints";
import Pagination from "./Pagination";

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

     // fetching categories
     let categories = [];
     const categoriesRes  = await MainServer.fetch(`${Endpoints.category.default}`);
     if(categoriesRes) categories = categoriesRes.data;
     // fetching posts
     const search = await searchParams;
     const searchArr = Object.entries(search).map(([key, value]) => (`${key}=${value}`) ).filter(Boolean);
     const searchStr = `?${searchArr.length > 0  ? `${searchArr.join('&')}&` : ''}`;
     const searchQuery = new URLSearchParams(searchStr);
     searchQuery.set('status', 'pending');
     let posts:TPost[] = [];
     let postsTotal = 0;
     const postsRes  = await MainServer.fetch(`${Endpoints.posts}?${searchQuery.toString()}`);
     if(postsRes) {
          const {pagination, data} = postsRes;
          posts = data;
          postsTotal = pagination.total;
     }


     return (
          <ClientPage>
               <div className="w-full flex flex-col items-center justify-center gap-[10px] px-[2%] py-[10px]">
                    <h1 className="text-[1.8rem] font-bold text-black">Explore Our Vendors</h1>
                    <p className="text-[0.9rem] text-gray-600">Discover our carefully curated selection of the finest wedding vendors.</p>
               </div>
               <Filter categories={categories}  />
               <div className="w-full px-[2%] flex-col items-center gap-[10px]">
                    <PostsContainer posts={posts}  />
               </div>
               <Pagination totalItems={postsTotal} itemsPerPage={20} />
          </ClientPage>
     )
}