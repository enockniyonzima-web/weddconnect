import { AdminPageNavigation } from "@/components/layout/AdminPageNavigation";

const links = [
     { name: "Overview", dest: "/dashboard/admin/finance" },
     { name: "Transactions", dest: "/dashboard/admin/finance/transactions" },
];

export default function AdminFinanceLayout({ children }: { children: React.ReactNode }) {
     return (
          <div className="w-full h-full overflow-y-auto flex flex-col items-center gap-4 justify-start p-2">
               <AdminPageNavigation links={links} />
               {children}
          </div>
     );
}
