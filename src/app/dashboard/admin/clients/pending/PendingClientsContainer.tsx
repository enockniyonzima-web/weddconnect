/* eslint-disable @typescript-eslint/no-unused-vars */

import { Prisma } from "@prisma/client";
import { fetchClients } from "@/server-actions/client.actions";
import { AdminClientSelect } from "../select-types";
import { ClientsContainer } from "@/components/containers/ClientsContainer";


export default async function PendingClientsContainer ({search}:{search: Record<string, string | undefined>}) {
     const filters:Prisma.ClientWhereInput = {
          subscription: {expiryAt: {lt: new Date()}}
     }
     const {data:clients} = await fetchClients(AdminClientSelect, filters);

     if(clients.length === 0){
          return (
               <div className="w-full flex items-center justify-center p-[20px]">
                    <p>No pending clients found!</p>
               </div>
          )
     }
     return (
          <div className="w-full">
               <ClientsContainer clients={clients} />
          </div>
          
     );
}