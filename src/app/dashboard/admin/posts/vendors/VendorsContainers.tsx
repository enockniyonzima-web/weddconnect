import { TVendor } from "@/common/Entities";
import Endpoints from "@/services/Endpoints"
import { MainServer } from "@/services/Server"
import { AdminVendorCard } from "./VendorCard";
import { FaPlus } from "react-icons/fa6";
import Link from "next/link";
import { ContactType } from "@prisma/client";
import { Column, GenTable } from "@/components/layout/Table";
import Pagination from "@/app/posts/[components]/Pagination";
import { AddContactTypeForm } from "./ContactTypeForm";

export async function VendorsContainer ({search}:{search: Record<string, string | undefined>}) {
     let vendors: TVendor[] = [];
     let total = 0;
     const searchStr = Object.entries(search).map(([key, value]) => `${key}=${value}`).join('&');
     const searchQuery = new URLSearchParams(searchStr).toString();
     const vendorsRes = await MainServer.fetch(`${Endpoints.vendors}?${searchQuery}`);
     if(vendorsRes){
          const {data, pagination} = vendorsRes;
          vendors = data;
          total = pagination.total;
     }

     if(vendors.length === 0) return <div className="w-full flex items-center justify-center p-[20px]">
               <p className="text-sm text-gray-500">No vendors found!</p>
          </div>
     return (
          <div className="w-full border border-gray-800 rounded-xl p-4 flex flex-col items-center gap-5">
               <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[10px]">
                    {
                         vendors.map((vendor, index) => <AdminVendorCard vendor={vendor} index={index + 1} key={`admin-vendor-${index}`} />)
                    }
               </div>
               <Pagination totalItems={total} itemsPerPage={10} />
          </div>
          
     )
}

export async function VendorContactTypesContainer ({typeId}:{typeId: string | undefined}) {
     let contactTypes: ContactType[] = [];
     let contactType: ContactType | undefined = undefined;
     const itemsPerPage = 10;
     const currentPage = 1;
     let total = 0;
     const contactTypeRes = await MainServer.fetch(`${Endpoints.contactType}`);
     if(contactTypeRes) {
          const {data, pagination} = contactTypeRes;
          contactTypes = data;
          total = pagination.total;
          if(contactTypes.length > 0 && typeId) {
               contactType  = contactTypes.find(c => c.id === Number(typeId));
          }
     }

     const contactTypeColumns:Column<{ id:number, name: string, type:string,description:string}>[] = [
               // { key: "id", label: "ID" },
               {key: "id", label: "Index", type:'number' },
               {key: "name", label: "Name", type:'text' },
               {key: "type", label: "Type", type:'text' },
               { key: "description", label: "Description", type:"longText" },
     
     ];
     return (
          <div className="w-full flex flex-col items-start justify-start gap-[10px]">
               <h2 className="text-lg font-bold text-gray-100">Vendor Contact Types</h2>
               <div className=" w-full flex-wrap flex items-center justify-between">
                    <p className="text-sm text-gray-400">These the contact types that a vendor can be contacted by the client. Click to add more types.</p>
                    <Link className="bg-blue-600 text-sm rounded-lg whitespace-nowrap hover:bg-blue-500 py-2 px-4 text-white flex items-center gap-2 transition-colors" prefetch={true} href={'/dashboard/admin/posts/vendors?form=add'} ><i className="text-base"><FaPlus /></i>Add Type</Link>
               </div>
               <GenTable baseUpdateLink="/dashboard/admin/posts/vendors?form=add&typeId=" pagination={{itemsPerPage, currentPage, total, visiblePages:5}} columns={contactTypeColumns} data={contactTypes} idColumn={"id"} />
               <AddContactTypeForm contactType={contactType} />
          </div>
     )
}