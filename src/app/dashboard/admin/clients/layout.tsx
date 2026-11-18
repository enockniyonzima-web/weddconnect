import { AdminPageNavigation } from "@/components/layout/AdminPageNavigation";

const links = [
     { name: "Overview", dest: "/dashboard/admin/clients" },
     { name: "Client list", dest: "/dashboard/admin/clients/all" },
     { name: "Active", dest: "/dashboard/admin/clients/active" },
     { name: "Ending soon", dest: "/dashboard/admin/clients/expiring" },
     { name: "Awaiting payment", dest: "/dashboard/admin/clients/pending" },
     { name: "Expired", dest: "/dashboard/admin/clients/expired" },
     { name: "Plans", dest: "/dashboard/admin/clients/subscriptions" },
];

export default function AdminClientsLayout({ children }: { children: React.ReactNode }) {
     return (
          <div className="w-full h-full overflow-y-auto flex flex-col items-center gap-4 justify-start p-2">
               <AdminPageNavigation links={links} />
               {children}
          </div>
     );
}
