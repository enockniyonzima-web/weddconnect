import PostFormsWrapper from "./forms/PostFormsWrapper";
import PostsContainer from "./posts-container/PostsContainer";
import { HeroSection } from "./sections";

export default async function AdminPostsPage ({searchParams}:{searchParams: Promise<Record<string, string | undefined>>}) {
     const search = await searchParams;
     return (
          <div className="w-full flex flex-col items-center gap-[20px] justify-start bg-gray-50 p-2 lg:p-4">
               <HeroSection />
               <PostsContainer search={search} />
               <PostFormsWrapper search={search} />
          </div>
     )
} 