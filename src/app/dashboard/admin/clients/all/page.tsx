import { ClientsContainer } from "@/components/containers/ClientsContainer";
import { ClientPageHeroSection } from "../sections";
import { fetchClients } from "@/server-actions/client.actions";
import { AdminClientSelect } from "../select-types";

export default async function AdminAllClientsPage() {
     const { data: clients } = await fetchClients(AdminClientSelect, {});
     
     return (
          <>
               <ClientPageHeroSection 
                    title="All Clients"
                    description={`${clients?.length || 0} total clients registered on the platform`}
               />
               <ClientsContainer clients={clients || []} />
          </>
     );
}
