import { TCategory, TPost } from "@/common/Entities"
import Endpoints from "@/services/Endpoints";
import { MainServer } from "@/services/Server";
import PostCard from "./PostCard";
import CategoryCard from "@/app/posts/[components]/CategoryCard";

export default async function PostsContainer({search}:{search: Record<string, string | undefined>}){
     const category = search.category;
     if(category){
          const searchArr = Object.entries(search).map(([key, value]) => (`${key}=${value}`) ).filter(Boolean);
          const searchStr = `?${searchArr.length > 0  ? `${searchArr.join('&')}&` : ''}`;
          const searchQuery = new URLSearchParams(searchStr);
          // searchQuery.set('status', 'published');
          let posts:TPost[] = [];
          // let postsTotal = 0;
          const postsRes  = await MainServer.fetch(`${Endpoints.posts}?${searchQuery.toString()}`);
          if(postsRes){
               posts = postsRes.data;
          }

          return (
               <div className="w-full flex-col items-center justify-start gap-[10px]">
                    {
                         posts.length === 0 ? <div className="w-full p-[20px] flex items-center justify-center">
                              <p>No posts found</p>
                         </div>:
                         <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[10px]">
                              {
                                   posts.map(post => <PostCard post={post} key={`admin-post-card-${post.id}`} />)
                              }
                         </div>
                    }
                    
               </div>
          )
     }else {
          // fetching categories
          let categories:TCategory[] = [];
          const categoriesRes  = await MainServer.fetch(`${Endpoints.category.default}`);
          if(categoriesRes) categories = categoriesRes.data;

          return (
               <>
                    <div className="w-full grid grid-cols-1 gap-[20px] bg-black px-[5%] lg:px-[10%] py-[20px]">
                         {
                              categories.map(category => <CategoryCard key={`prepage-category-${category.id}`} link={`?category=${category.id}`} category={category} />)
                         }
                    </div>
               </>
          )
     }
     
}