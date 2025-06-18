import { fetchClients } from "@/server-actions/client.actions";
import { AdminClientSelect } from "../select-types";
import DataTable from "./DataTable";
import { HeroSection } from "./sections"


export default async function AdminClientsPage () {
     const {data:clients} = await fetchClients(AdminClientSelect);
     return (
          <>
               <HeroSection />
               <DataTable clients={clients}/>
          </>
     )
}