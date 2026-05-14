"use client";

import Link from "next/link";
import { FaPlus } from "react-icons/fa6";
import { Pencil } from "lucide-react";

interface CategoryFormButtonProps {
     showText?: boolean;
     showIcon?: boolean;
     size?: "sm" | "md" | "lg";
     categoryId?: number;
}

export default function CategoryFormButton({
     showText = true,
     showIcon = true,
     size = "md",
     categoryId,
}: CategoryFormButtonProps) {
     const isEdit = !!categoryId;
     const href = isEdit
          ? `/dashboard/admin/categories?form=update&id=${categoryId}`
          : `/dashboard/admin/categories?form=add`;

     const sizeClasses = {
          sm: "py-1 px-2.5 text-xs gap-1",
          md: "py-2 px-4 text-sm gap-2",
          lg: "py-2.5 px-5 text-base gap-2",
     };

     const iconSizes = {
          sm: 12,
          md: 14,
          lg: 16,
     };

     return (
          <Link
               href={href}
               prefetch
               className={`inline-flex items-center font-medium rounded-lg transition-colors whitespace-nowrap ${sizeClasses[size]} ${
                    isEdit
                         ? "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700"
                         : "bg-blue-600 text-white hover:bg-blue-500"
               }`}
          >
               {showIcon && (
                    isEdit
                         ? <Pencil size={iconSizes[size]} />
                         : <FaPlus size={iconSizes[size]} />
               )}
               {showText && (isEdit ? "Edit" : "New Category")}
          </Link>
     );
}
