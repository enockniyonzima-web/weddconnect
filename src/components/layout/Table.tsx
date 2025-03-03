/* eslint-disable @typescript-eslint/no-unused-vars */

import Image from "next/image";
import Link from "next/link";
import { VscCheck, VscChromeClose } from "react-icons/vsc";

export interface Column<T> {
     key: keyof T;
     label: string;
     type: string;
}   

export function GenTable<T>({data, columns, idColumn, pagination, baseUpdateLink}:{data: T[], columns: Column<T>[], idColumn: keyof T, pagination:{itemsPerPage:number, currentPage:number, total:number, visiblePages:number}, baseUpdateLink:string}) {
     const {total, itemsPerPage, currentPage, visiblePages: maxVisiblePages} = pagination;
     const totalPages = Math.ceil(total / itemsPerPage);
     const startIndex = (currentPage - 1) * itemsPerPage;

     // pagination logic
  const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  const showNext = currentPage < totalPages;
  const showPrev = currentPage > 1;

     return (
          <div className="overflow-x-auto bg-white shadow-md rounded-lg w-full ">
          <table className="min-w-full border-collapse">
               <thead>
               <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                    {columns.map((column) => (
                    <th key={String(column.key)} className="py-3 px-6 whitespace-nowrap text-left border-b">
                    {column.label}
                    </th>
                    ))}
                    <th  className="py-3 px-6 text-left border-b">
                    Actions
                    </th>
               </tr>
               </thead>
               <tbody>
               {data.length > 0 ? (
                    data.map((row, rowIndex) => (
                    <tr className="border-b hover:bg-gray-50 cursor-pointer group transition-all duration-300" key={`${row[idColumn]}-${rowIndex}`}>
                         {columns.map((column) => (
                              <td key={String(column.key)} className={`py-2 px-6 text-[0.8rem] ${column.type === 'boolean' ? "flex items-center justify-center" :''}`}>
                              {column.type === "image" ? 
                                   <Image src={String(row[column.key])} alt={`${row[idColumn]} image`} />
                              : column.type === 'longText'? 
                              <p className="whitespace-pre-line line-clamp-1 group-hover:line-clamp-none transition-all duration-300 min-w-[250px] md:min-w-[200px] lg:min-w-auto ">{String(row[column.key])}</p> :
                              column.type === 'boolean' ? 
                              <span className={`text-[18px] inline-block ${row[column.key] ? 'text-green-600' : 'text-red-600'}`}>{row[column.key] ? <VscCheck /> : <VscChromeClose /> }</span> :
                              String(row[column.key])}
                              </td>
                         ))}
                         <td className="py-2 px-6">
                              <Link className="text-blue-50 bg-blue-600 hover:bg-blue-800 rounded-[5px] py-2 px-4  text-[0.8rem]" href={`${baseUpdateLink}${row[idColumn]}`}>Edit</Link>
                         </td>
                    </tr>
                    ))
               ) : (
                    <tr>
                    <td colSpan={columns.length} className="py-4 px-6 text-center text-gray-500">
                         No data available
                    </td>
                    </tr>
               )}
               </tbody>
          </table>
          <div className="flex justify-center items-center p-4 space-x-2">
        {/* Previous Button */}
        {showPrev && (
          <Link
            href={`?page=${currentPage - 1}`}
            className="px-4 py-2 text-[0.8rem] rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Prev
          </Link>
        )}

        {/* Page Numbers */}
        {Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index).map((page) => (
          <Link
            key={page}
            href={`?page=${page}`}
            className={`px-4 py-2 rounded-md text-[0.8rem] ${
              currentPage === page ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {page}
          </Link>
        ))}

        {/* Next Button */}
        {showNext && (
          <Link
            href={`?page=${currentPage + 1}`}
            className="px-4 py-2 text-[0.8rem] rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Next
          </Link>
        )}
      </div>
     </div>
     )

}