import AdminHeader from "@/components/layout/admin-header/AdminHeader"
import { getSessionUser } from "@/server-actions/user.actions"
import { Metadata } from "next"
import { redirect } from "next/navigation";

export const metadata:Metadata = {
     title: 'Admin Dashboard',
     description: 'Admin Dashboard for weddconnect',
     keywords: 'Admin Layout',
}

export default async function AdminLayout({children}:{children:React.ReactNode}) {
     const {user} = await getSessionUser();

     if(!user || !user.admin) return redirect('/');
     return (
          <main className="w-screen h-screen bg-blue-100 flex flex-col-reverse lg:flex-row overflow-hidden ">
                    <AdminHeader/>
                    <div className="w-full h-full overflow-auto">
                         {children}
                    </div>
               
          </main>
     )
}