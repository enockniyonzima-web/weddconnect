/* eslint-disable @typescript-eslint/no-unused-vars */

import { Prisma } from "@prisma/client";
import { fetchClients } from "@/server-actions/client.actions";
import ClientCard from "../ClientCard";
import ClientsTable from "./ClientsTable";

export const AdminClientSelect= {
     id:true, name:true, phone:true,
     user: {select:{email:true, image:true}},
     subscription:{
          select:{
               id:true,
               transactions: {select: {proof:true,amount:true, createdAt:true, id:true, payNumber:true, transactionMethod:true}, where: {status: "pending"},take:1, orderBy:{createdAt:"desc"}},
               expiryAt:true,
               updatedAt:true,
               subscription :{select:{name:true}}
          },
     }

} satisfies Prisma.ClientSelect;

export type TAdminClientSelect = Prisma.ClientGetPayload<{select: typeof AdminClientSelect }>;

export default async function PendingClientsContainer ({search}:{search: Record<string, string | undefined>}) {
     let total = 0;
     let clients:TAdminClientSelect[] = [];
     const filters:Prisma.ClientWhereInput = {
          subscription: {expiryAt: {lt: new Date()}}
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
                    <p>No pending clients found!</p>
               </div>
          )
     } 
     return (
          <div className="w-full">
               <ClientsTable clients={clients} />
          </div>
          
     );
}