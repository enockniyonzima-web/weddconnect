import { AdminPageNavigation } from "@/components/layout/AdminPageNavigation"
import { Metadata } from "next"

export const metadata: Metadata  = {
     title: 'Posts',
     description: 'Manage posts and vendors'
}

export default function AdminPostsLayout ({children}:{children: React.ReactNode}) {

     return (
          <div className="w-full flex flex-col items-center gap-5 justify-start bg-gray-950 p-4 lg:p-5 min-h-screen">
               <AdminPageNavigation links={[{name: 'Posts', dest: '/dashboard/admin/posts'}, {name: 'Vendors', dest: '/dashboard/admin/posts/vendors'}]} />
               {children}
          </div>
     )
}