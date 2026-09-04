"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface PaginationProps {
     totalItems: number;
     itemsPerPage: number;
}

const Pagination: React.FC<PaginationProps> = ({ totalItems, itemsPerPage }) => {
     const searchParams = useSearchParams();
     const currentPage = Number(searchParams.get("page")) || 1;

     const totalPages = Math.ceil(totalItems / itemsPerPage);
     const maxVisiblePages = 5; // Show up to 5 pages at a time

     const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
     const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

     const createPageLink = (page: number) => {
          const searchQuery = new URLSearchParams(searchParams)
          searchQuery.set('page', String(page));
          return `?${searchQuery.toString()}`;
     }

     return (
     <div className="flex items-center justify-center gap-2 py-[5px]">
      {/* Previous Button */}
          <Link
               href={createPageLink(Math.max(1, currentPage - 1))}
               className={`px-3 py-1 border rounded ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"}`}
               aria-disabled={currentPage === 1}
          >
          Prev
          </Link>

      {/* Page Numbers */}
          {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
               <Link
                    key={page}
                    href={createPageLink(page)}
                    className={`px-3 py-1 border rounded ${
                    currentPage === page ? "bg-blue-500 text-white" : "hover:bg-gray-200"
                    }`}
               >
               {page}
          </Link>
          ))}

          {/* Next Button */}
          <Link
          href={createPageLink(Math.min(totalPages, currentPage + 1))}
          className={`px-3 py-1 border rounded ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"}`}
          aria-disabled={currentPage === totalPages}
          >
          Next
          </Link>
     </div>
     );
};

export default Pagination;
