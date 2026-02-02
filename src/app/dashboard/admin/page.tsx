import AdminStats from "@/components/containers/AdminStats";
import AdminRecentActivities from "@/components/containers/AdminRecentActivities";
import AdminPopularPosts from "@/components/containers/AdminPopularPosts";

export default async function AdminPage() {
     return (
          <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
               <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-8">
                    {/* Hero Section */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 shadow-lg text-white">
                         <div className="flex items-center justify-between flex-wrap gap-4">
                              <div>
                                   <h1 className="text-3xl md:text-4xl font-bold mb-2">
                                        Admin Dashboard
                                   </h1>
                                   <p className="text-blue-100 text-lg">
                                        Welcome back! Here&apos;s what&apos;s happening with your platform today.
                                   </p>
                              </div>
                              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/20">
                                   <p className="text-sm text-blue-100">Last updated</p>
                                   <p className="text-xl font-bold">
                                        {new Date().toLocaleDateString('en-US', { 
                                             month: 'short', 
                                             day: 'numeric', 
                                             year: 'numeric' 
                                        })}
                                   </p>
                              </div>
                         </div>
                    </div>

                    {/* Admin Statistics */}
                    <section>
                         <AdminStats />
                    </section>

                    {/* Recent Activities */}
                    <section>
                         <AdminRecentActivities />
                    </section>

                    {/* Popular Posts */}
                    <section>
                         <AdminPopularPosts />
                    </section>
               </div>
          </div>
     );
}