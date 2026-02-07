import { AdminPageNavigation } from "@/components/layout/AdminPageNavigation";
const links = [
     {name: 'Overview', dest: '/dashboard/admin/clients'},
     {name: 'Active Subscriptions', dest: '/dashboard/admin/clients/active'},
     {name: 'Expired Subscriptions', dest: '/dashboard/admin/clients/expired'},
     {name: "Pending Subscriptions", dest: "/dashboard/admin/clients/pending"},
     {name: "No Subscriptions", dest: "/dashboard/admin/clients/no-subscriptions"},
     {name: 'Manage Subscriptions', dest: '/dashboard/admin/clients/subscriptions'},
]

export default function AdminCategoriesLayout ({children}:{children: React.ReactNode}) {

     return (
          <div className="w-full h-full overflow-y-auto flex flex-col items-center gap-4 justify-start  p-2">
               <AdminPageNavigation links={links} />
               {children}
          </div>
     )
}