import { Column, GenTable } from "@/components/layout/Table"
import Endpoints from "@/services/Endpoints";
import { MainServer } from "@/services/Server";
import { CategoryFeature } from "@prisma/client";

export default async function FeaturesContainer ({search}:{search: Record<string, string | undefined>}) {
     const itemsPerPage = 50;
     let total = 0;
     let features:CategoryFeature[] = [];
     const currentPage = search.page ? parseInt(search.page) : 1;
     const searchStr = Object.entries(search).map(([key, value]) => `${key}=${value}`).join('&');
     const searchQuery = new URLSearchParams(searchStr).toString();
     const featuresRes = await MainServer.fetch(`${Endpoints.category.categoryFeature}?${searchQuery}`);
     
     if(featuresRes) {
               const {data, pagination} = featuresRes;
               total = pagination.total;
               features = data as CategoryFeature[];
          }
     const columns:Column<{name:string, type:string, required:boolean,values:string, icon:string}>[] = [
          {key:"icon", label:"Icon", type: "icon"},
          {key:'name', label: "Feature Name", type:"string"},
          {key:'type', label: "Type", type:"string"},
          {key:'values', label: "Values", type:""},
          {key:'required', label: "Feature Required", type:"boolean"},
     ]

     return (
          <div className="w-full">
               <GenTable baseUpdateLink="/dashboard/admin/categories/features?form=update&id=" pagination={{itemsPerPage, currentPage, total, visiblePages:5}} columns={columns} data={features} idColumn={"id"} />
          </div>
     )
}