/* eslint-disable @typescript-eslint/no-unused-vars */
import ClientCard from "./ClientCard";
import { Prisma } from "@prisma/client";
import { fetchClients } from "@/server-actions/client.actions";
import { AdminClientSelect } from "./select-types";
import { ClientsContainer } from "@/components/containers/ClientsContainer";


export type TAdminClientSelect = Prisma.ClientGetPayload<{select: typeof AdminClientSelect }>;


export default async function ApprovedClientsContainer ({search}:{search: Record<string, string | undefined>}) {
     const filters:Prisma.ClientWhereInput = {
          subscription: {expiryAt: {gt: new Date()}}
     }
     const {data:clients} = await fetchClients(AdminClientSelect, filters);

     if(clients.length === 0){
          return (
               <div className="w-full flex items-center justify-center p-[20px]">
                    <p>No clients found!</p>
               </div>
          )
     } 
     return (
          <ClientsContainer clients={clients} />
     );
}