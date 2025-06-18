import { AdminPageNavigation } from "@/components/layout/AdminPageNavigation";

export default function AdminCategoriesLayout ({children}:{children: React.ReactNode}) {

     return (
          <div className="w-full flex flex-col items-center gap-[20px] justify-start bg-gray-50 p-[20px]">
               <AdminPageNavigation links={[{name: 'Approved Clients', dest: '/dashboard/admin/clients'},{name: 'Pending Clients', dest: '/dashboard/admin/clients/pending'}, {name: 'Subscriptions', dest: '/dashboard/admin/clients/subscriptions'}, {name: "All Clients", dest: "/dashboard/admin/clients/all"}]} />
               {children}
          </div>
     )
}