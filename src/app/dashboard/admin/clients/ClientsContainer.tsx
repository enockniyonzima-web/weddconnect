/* eslint-disable @typescript-eslint/no-unused-vars */

import { TClient, TSubscription } from "@/common/Entities";
import { Column, GenTable } from "@/components/layout/Table";
import Endpoints from "@/services/Endpoints"
import { MainServer } from "@/services/Server"
import ClientCard from "./ClientCard";

export default async function ClientsContainer ({search}:{search: Record<string, string | undefined>}) {
     let total = 0;
     let clients:TClient[] = [];
     const currentPage = search.page ? parseInt(search.page) : 1;
     const searchStr = Object.entries(search).map(([key, value]) => `${key}=${value}`).join('&');
     const searchQuery = new URLSearchParams(searchStr).toString();
     const clientsRes = await MainServer.fetch(`${Endpoints.clients}?${searchQuery}`);

     if(clientsRes) {
          const {data, pagination} = clientsRes;
          total = pagination.total;
          clients = data as TClient[];
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