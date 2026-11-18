import AdminHeader from "@/components/layout/admin-header/AdminHeader"
import { getSessionUser } from "@/server-actions/user.actions"
import { Metadata } from "next"
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { clientStatusWhere } from "@/lib/admin/client-status";

export const metadata:Metadata = {
     title: 'Admin Dashboard',
     description: 'Admin Dashboard for weddconnect',
     keywords: 'Admin Layout',
}

export default async function AdminLayout({children}:{children:React.ReactNode}) {
     const {user} = await getSessionUser();

     if(!user || !user.admin) return redirect('/');

     // Live counts for the navigation badges: things waiting on an admin.
     const [pendingClients, pendingPosts] = await Promise.all([
          prisma.client.count({ where: clientStatusWhere("pending") }).catch(() => 0),
          prisma.post.count({ where: { status: { equals: "pending", mode: "insensitive" } } }).catch(() => 0),
     ]);
     return (
          <main className="w-screen h-screen bg-gray-950 flex flex-col-reverse lg:flex-row overflow-hidden ">
                    <AdminHeader badges={{ clients: pendingClients, posts: pendingPosts }} />
                    <div className="w-full min-w-0 flex-1 h-full overflow-auto">
                         {children}
                    </div>
               
          </main>
     )
}