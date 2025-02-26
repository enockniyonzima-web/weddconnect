import { AdminPageNavigation } from "@/components/layout/AdminPageNavigation"
import { Metadata } from "next"

export const metadata: Metadata  = {
     title: 'Categories',
     description: 'Manage categories'
}

export default function AdminCategoriesLayout ({children}:{children: React.ReactNode}) {

     return (
          <div className="w-full flex flex-col items-center gap-[20px] justify-start bg-gray-50 p-[20px]">
               <AdminPageNavigation links={[{name: 'Categories', dest: '/dashboard/admin/categories'}, {name: 'Features', dest: '/dashboard/admin/categories/features'}]} />
               {children}
          </div>
     )
}