import { fetchClients } from "@/server-actions/client.actions";
import { AdminClientSelect } from "../select-types";
import { ClientPageHeroSection } from "../sections";
import { ClientsContainer } from "@/components/containers/ClientsContainer";

export default async function AdminNoSubscriptionsPage() {
     const {data:clients} = await fetchClients(AdminClientSelect, {
          subscription: null
     });
     return (
          <>
               <ClientPageHeroSection 
                    title="No Subscriptions"
                    description={`${clients?.length || 0} clients without any subscription plan`}
               />
               <ClientsContainer clients={clients || []} />
          </>
     );
}