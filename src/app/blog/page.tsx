import { PubBlogPostsContainer } from "@/components/containers/blogs/PubBlogPostsContainer";
import ClientPage from "@/components/layout/ClientPage";

export const metadata = {
  title: "Blog | WeddConnect",
  description: "Wedding inspiration, tips, and real wedding stories from the WeddConnect team.",
};

export default function PubBlogPostsPage() {
  return (
     <ClientPage>
          <main className="min-h-screen w-full bg-black">
               <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
               <PubBlogPostsContainer />
               </div>
          </main>
     </ClientPage>
    
  );
}