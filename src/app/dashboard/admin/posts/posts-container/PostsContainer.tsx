/* eslint-disable @typescript-eslint/no-unused-vars */
import { TPost } from "@/common/Entities"
import Endpoints from "@/services/Endpoints";
import { MainServer } from "@/services/Server";
import PostCard from "./PostCard";

export default async function PostsContainer({search}:{search: Record<string, string | undefined>}){
     let posts: TPost[] = [];

     const postsRes = await MainServer.fetch(`${Endpoints.posts}`);
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
}