/* eslint-disable @typescript-eslint/no-unused-vars */
import ClientCard from "./ClientCard";
import { Prisma } from "@prisma/client";
import { fetchClients } from "@/server-actions/client.actions";
import { AdminClientSelect } from "./select-types";


export type TAdminClientSelect = Prisma.ClientGetPayload<{select: typeof AdminClientSelect }>;


export default async function ClientsContainer ({search}:{search: Record<string, string | undefined>}) {
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
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[10px]">
               {
                    clients.map((client) => <ClientCard key={`admin-client-info-${client.id}`} client={client} />)
               }
          </div>
          
     );
}