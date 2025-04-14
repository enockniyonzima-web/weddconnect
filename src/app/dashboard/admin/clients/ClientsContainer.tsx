/* eslint-disable @typescript-eslint/no-unused-vars */
import ClientCard from "./ClientCard";
import { Prisma } from "@prisma/client";
import { fetchClients } from "@/server-actions/client.actions";

export const AdminClientSelect= {
     id:true, name:true, phone:true,
     user: {select:{email:true, image:true}},
     subscription:{
          select:{
               transactions: {select: {proof:true, amount:true, createdAt:true, id:true, payNumber:true, transactionMethod:true}, take:1, orderBy:{createdAt:"desc"}},
               expiryAt:true,
               updatedAt:true,
               subscription :{select:{name:true}}
          },
     }

} satisfies Prisma.ClientSelect;

export type TAdminClientSelect = Prisma.ClientGetPayload<{select: typeof AdminClientSelect }>;


export default async function ClientsContainer ({search}:{search: Record<string, string | undefined>}) {
     let total = 0;
     let clients:TAdminClientSelect[] = [];
     const filters:Prisma.ClientWhereInput = {
          subscription: {expiryAt: {gt: new Date()}}
     }
     const currentPage = search.page ? parseInt(search.page) : 1;
     const searchStr = Object.entries(search).map(([key, value]) => `${key}=${value}`).join('&');
     const searchQuery = new URLSearchParams(searchStr).toString();
     const clientsRes = await fetchClients(AdminClientSelect, filters);

     if(clientsRes) {
          const {data, pagination} = clientsRes;
          total = pagination.total;
          clients = data;
     }

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