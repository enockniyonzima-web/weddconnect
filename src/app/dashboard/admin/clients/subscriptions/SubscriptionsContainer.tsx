
import { TSubscription } from "@/common/Entities";
import { Column, GenTable } from "@/components/layout/Table";
import Endpoints from "@/services/Endpoints"
import { MainServer } from "@/services/Server"

export default async function SubscriptionsContainer ({search}:{search: Record<string, string | undefined>}) {
     const itemsPerPage = 5;
     let total = 0;
     let subscriptions:TSubscription[] = [];
     const currentPage = search.page ? parseInt(search.page) : 1;
     const searchStr = Object.entries(search).map(([key, value]) => `${key}=${value}`).join('&');
     const searchQuery = new URLSearchParams(searchStr).toString();
     const subscriptionRes = await MainServer.fetch(`${Endpoints.subscription}?${searchQuery}`);

     if(subscriptionRes) {
          const {data, pagination} = subscriptionRes;
          total = pagination.total;
          subscriptions = data as TSubscription[];
     }

     const categoryColumns:Column<{ name: string, price: number,description:string}>[] = [
          // { key: "id", label: "ID" },
          {key: "name", label: "Subscription Name", type:'text' },
          {key:"price", label: "Price - RWF", type:'number'},
          { key: "description", label: "Description", type:"longText" },

     ];   
     return (
          <div className="w-full">
               <GenTable baseUpdateLink="/dashboard/admin/clients/subscriptions?form=update&id=" pagination={{itemsPerPage, currentPage, total, visiblePages:5}} columns={categoryColumns} data={subscriptions} idColumn={"id"} />
          </div>
     );
}