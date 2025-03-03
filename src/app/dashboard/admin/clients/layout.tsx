import { AdminPageNavigation } from "@/components/layout/AdminPageNavigation";

export default function AdminCategoriesLayout ({children}:{children: React.ReactNode}) {

     return (
          <div className="w-full flex flex-col items-center gap-[20px] justify-start bg-gray-50 p-[20px]">
               <AdminPageNavigation links={[{name: 'Clients', dest: '/dashboard/admin/clients'}, {name: 'Subscriptions', dest: '/dashboard/admin/clients/subscriptions'}]} />
               {children}
          </div>
     )
}