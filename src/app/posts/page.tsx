"use client";

import { useState } from "react";
import CategoryContainer from "./[components]/CategoryContainer";
import CategoryPostContainer from "./[components]/CategoryPostContainer";

export default function PostsPage() {
     const [selectedCategory, setSelectedCategory] = useState<number>(0);

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
