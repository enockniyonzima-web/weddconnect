import ClientPage from "@/components/layout/ClientPage";
import { ProfileNav } from "@/components/layout/ProfileNav";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
     return (
          <ClientPage>
               <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-24 flex flex-col gap-8">
                    <div className="w-full flex items-center justify-between gap-4 flex-wrap">
                         <div>
                              <h1 className="text-xl font-bold text-white">My Profile</h1>
                              <p className="text-xs text-gray-500 mt-0.5">Manage your account & subscription</p>
                         </div>
                         <ProfileNav />
                    </div>
                    {children}
               </div>
          </ClientPage>
     );
}