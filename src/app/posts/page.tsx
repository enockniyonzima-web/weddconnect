
import Filter from "./[components]/Filter";
import PostsContainer from "./[components]/PostsContainer";
import { TPost } from "@/common/Entities";
import { MainServer } from "@/services/Server";
import Endpoints from "@/services/Endpoints";
import Pagination from "./[components]/Pagination";

export default async function PostsPage ({searchParams}:{searchParams: Promise<Record<string, string | undefined>>}) {
     

     // fetching categories
     let categories = [];
     const categoriesRes  = await MainServer.fetch(`${Endpoints.category.default}`);
     if(categoriesRes) categories = categoriesRes.data;
     // fetching posts
     const search = await searchParams;
     const searchArr = Object.entries(search).map(([key, value]) => (`${key}=${value}`) ).filter(Boolean);
     const searchStr = `?${searchArr.length > 0  ? `${searchArr.join('&')}&` : ''}`;
     const searchQuery = new URLSearchParams(searchStr);
     searchQuery.set('status', 'published');
     let posts:TPost[] = [];
     let postsTotal = 0;
     const postsRes  = await MainServer.fetch(`${Endpoints.posts}?${searchQuery.toString()}`);
     if(postsRes) {
          const {pagination, data} = postsRes;
          posts = data;
          postsTotal = pagination.total;
     }


     return (
          <>
               <div className="w-full flex flex-col items-center justify-center gap-[10px] px-[2%] py-[80px] bg-black ">
                    <h1 className="text-[1.8rem] font-bold text-white">Explore Our Vendors</h1>
                    <p className="text-[0.9rem] text-gray-400">Discover our carefully curated selection of the finest wedding vendors.</p>
               </div>
               <Filter categories={categories}  />
               <div className="w-full px-[2%] flex-col items-center gap-[10px] p-[20px]">
                    <PostsContainer posts={posts}  />
               </div>
               <Pagination totalItems={postsTotal} itemsPerPage={20} />
          </>
     )
}