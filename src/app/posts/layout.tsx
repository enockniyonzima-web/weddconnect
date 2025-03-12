import ClientPage from "@/components/layout/ClientPage";

export default async function PostsPageLayout({children}:{children: React.ReactNode}) {
     // const {user} = await getSessionUser();
     // if(!user) {
     //      return redirect('/auth/login');
     // }
     // if(user.admin) return redirect('/dashboard/admin');
     // if(user.vendor) return redirect('/dashboard/vendor');

     // if(user && (!user.client?.subscription || !isDateLaterThanToday(user.client.subscription.expiryAt))) {
     //      return redirect('/subscribe');
     // }
     return (
          <ClientPage>
               {children}
          </ClientPage>
     )
}