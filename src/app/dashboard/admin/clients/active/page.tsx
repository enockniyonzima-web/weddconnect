import { ClientsContainer } from "@/components/containers/ClientsContainer";
import { ClientPageHeroSection } from "../sections";
import { fetchClients } from "@/server-actions/client.actions";
import { AdminClientSelect } from "../select-types";

export default async function AdminActiveClientsPage() {
     const today = new Date().setHours(0, 0, 0, 0);
     const { data: clients } = await fetchClients(AdminClientSelect, {
          AND: [
               {subscription: {isNot: null}},
               {subscription: {expiryAt: {gt: new Date(today)}}}
          ]
     });
     
     return (
          <>
               <ClientPageHeroSection 
                    title="Active Subscriptions"
                    description={`${clients?.length || 0} clients with active subscription plans`}
               />
               <ClientsContainer clients={clients || []} />
          </>
     );
}