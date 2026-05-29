import { AdminPageNavigation } from "@/components/layout/AdminPageNavigation"

export default function BlogLayout({
     children,
}: {
     children: React.ReactNode
}) {
     return (
          <div className="w-full flex flex-col items-center gap-5 justify-start bg-gray-950 p-4 lg:p-5 min-h-screen">
               <AdminPageNavigation links={[{name: 'Blog Posts', dest: '/dashboard/admin/blog'},{name: "Categories", dest: '/dashboard/admin/blog/categories'}, {name: 'Tags', dest: '/dashboard/admin/blog/tags'}]} />
               {children}
          </div>
     )
}