import { fetchClients } from "@/server-actions/client.actions";
import { AdminClientSelect } from "../select-types";
import { HeroSection } from "./sections"
import { ClientsContainer } from "@/components/containers/ClientsContainer";


export default async function AdminClientsPage () {
     const {data:clients} = await fetchClients(AdminClientSelect);
     return (
          <>
               <HeroSection />
               {/* <DataTable clients={clients}/> */}
               <ClientsContainer clients={clients} />
          </>
     )
}