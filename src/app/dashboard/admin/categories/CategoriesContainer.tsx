
import { TCategory } from "@/common/Entities";
import { Column, GenTable } from "@/components/layout/Table";
import Endpoints from "@/services/Endpoints"
import { MainServer } from "@/services/Server"

export default async function CategoriesContainer ({search}:{search: Record<string, string | undefined>}) {
     const itemsPerPage = 10;
     let total = 0;
     let categories:TCategory[] = [];
     const currentPage = search.page ? parseInt(search.page) : 1;
     const searchStr = Object.entries(search).map(([key, value]) => `${key}=${value}`).join('&');
     const searchQuery = new URLSearchParams(searchStr).toString();
     const categoriesRes = await MainServer.fetch(`${Endpoints.category.default}?${searchQuery}`);

     if(categoriesRes) {
          const {data, pagination} = categoriesRes;
          total = pagination.total;
          categories = data as TCategory[];
     }

     const categoryColumns:Column<{ name: string, description:string, status: boolean}>[] = [
          // { key: "id", label: "ID" },
          {key: "name", label: "Category Name", type:'text' },
          {key:"status", label: "Status", type:'boolean'},
          { key: "description", label: "Description", type:"longText" },

     ];   
     return (
          <div className="w-full">
               <GenTable baseUpdateLink="/dashboard/admin/categories?form=update&id=" pagination={{itemsPerPage, currentPage, total, visiblePages:5}} columns={categoryColumns} data={categories} idColumn={"id"} />
          </div>
     );
}