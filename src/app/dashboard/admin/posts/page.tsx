import { AdminPostsContainer } from "@/components/containers/admin/AdminPostsContainer";


import { HeroSection } from "./sections";

export default async function AdminPostsPage () {

     return (
          <div className="w-full flex flex-col items-center gap-5 justify-start bg-gray-950 p-2 lg:p-4">
               <HeroSection />
               <AdminPostsContainer />
          </div>
     )
} 