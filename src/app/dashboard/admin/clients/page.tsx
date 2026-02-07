import { ClientPageHeroSection } from "./sections";
import { fetchClientStats } from "@/server-actions/admin-dashboard";
import ClientStatsOverview from "@/components/containers/ClientStatsOverview";
import SubscriptionTrends from "@/components/containers/SubscriptionTrends";
import SubscriptionDistribution from "@/components/containers/SubscriptionDistribution";
import TopClients from "@/components/containers/TopClients";
import ClientGeography from "@/components/containers/ClientGeography";
import ClientEngagement from "@/components/containers/ClientEngagement";
import { Users } from "lucide-react";

export default async function AdminClientsPage() {
     const stats = await fetchClientStats();

     if (!stats) {
          return (
               <div className="w-full min-h-screen flex items-center justify-center">
                    <div className="text-center">
                         <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                         <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Client Statistics</h2>
                         <p className="text-gray-600">Please try again later or contact support.</p>
                    </div>
               </div>
          );
     }

     return (
          <div className="w-full space-y-6">
               <ClientPageHeroSection 
                    title="Client Analytics"
                    description="Comprehensive overview of client metrics, subscriptions, and engagement"
               />

               {/* Overview Stats */}
               <ClientStatsOverview stats={stats} />

               {/* Two Column Layout */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <SubscriptionTrends stats={stats} />
                    <SubscriptionDistribution stats={stats} />
               </div>

               {/* Three Column Layout */}
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                         <TopClients stats={stats} />
                    </div>
                    <div>
                         <ClientGeography stats={stats} />
                    </div>
               </div>

               {/* Full Width Engagement */}
               <ClientEngagement stats={stats} />
          </div>
     );
}