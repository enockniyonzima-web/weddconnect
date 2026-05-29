"use client";

import { useEffect, useState } from "react";
import CategoryContainer from "./[components]/CategoryContainer";
import CategoryPostContainer from "./[components]/CategoryPostContainer";
import { useSearchParams } from "next/navigation";

export default function PostsPage() {
     const searchParams = useSearchParams();
     const initialCategory = searchParams.get("category");
     const [selectedCategory, setSelectedCategory] = useState<number>(initialCategory ? parseInt(initialCategory) : 0);

     useEffect(() => {
          setSelectedCategory(initialCategory ? parseInt(initialCategory) : 0);
     }, [initialCategory, searchParams]);

     if (selectedCategory) {
          return (
               <CategoryPostContainer
                    categoryId={selectedCategory}
                    onBack={() => setSelectedCategory(0)}
               />
          );
     }
     return <CategoryContainer onCategorySelect={(id) => setSelectedCategory(id)} />;
}
