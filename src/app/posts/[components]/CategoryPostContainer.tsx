/* eslint-disable @typescript-eslint/no-unused-vars */
// import Pagination from "./Pagination";

import { TCategory, TPost } from "@/common/Entities";
import { fetchCategories } from "@/server-actions/category.actions";
import { fetchPosts } from "@/server-actions/post.actions";
import { getSearchParams } from "@/util/stringFuncs";
import Filter from "./Filter";
import PostsContainer from "./PostsContainer";

export default async function CategoryPostContainer ({search}:{search: Record<string, string | undefined>}) {
     let categories:TCategory[] = [];
     const categoriesRes  = await fetchCategories(getSearchParams(search));
     if(categoriesRes) categories = categoriesRes.data;
     // fetching posts

     const searchQuery = getSearchParams(search);
     searchQuery.set('status', 'published');
     let posts:TPost[] = [];
     let postsTotal = 0;
     // const postsRes  = await MainServer.fetch(`${Endpoints.posts}?${searchQuery.toString()}`);
     const postsRes = await fetchPosts(searchQuery);
     if(postsRes) {
          const {pagination, data} = postsRes;
          posts = data as unknown as TPost[];
          postsTotal = pagination?.total || 0;
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
               {/* <Pagination totalItems={postsTotal} itemsPerPage={20} /> */}
          </>
     )

}