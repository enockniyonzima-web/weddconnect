import { ClientsContainer } from "@/components/containers/ClientsContainer";
import { ClientPageHeroSection } from "../sections";
import { fetchClients } from "@/server-actions/client.actions";
import { AdminClientSelect } from "../select-types";

export default async function AdminExpiredClientsPage() {
     const today = new Date().setHours(0, 0, 0, 0); 
     const { data: clients } = await fetchClients(AdminClientSelect, {
          subscription: {
               expiryAt: {
                    lt: new Date(today)
               }
          }
     });
     
     
     return (
          <>
               <ClientPageHeroSection 
                    title="Expired Subscriptions"
                    description={`${clients.length} clients with expired subscription plans`}
               />
               <ClientsContainer clients={clients} />
          </>
     );
}
