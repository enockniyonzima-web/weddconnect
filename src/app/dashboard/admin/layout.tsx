import AdminHeader from "@/components/layout/admin-header/AdminHeader"
import { Metadata } from "next"

export const metadata:Metadata = {
     title: 'Admin Dashboard',
     description: 'Admin Dashboard for weddconnect',
     keywords: 'Admin Layout',
}

export default async function AdminLayout({children}:{children:React.ReactNode}) {
     return (
          <main className="w-screen h-screen bg-blue-100 flex flex-col-reverse lg:flex-row overflow-hidden ">
                    <AdminHeader/>
                    <div className="w-full h-full overflow-auto p-2 ">
                         {children}
                    </div>
               
          </main>
     )
}